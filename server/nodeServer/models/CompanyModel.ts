
import { supabase } from '../config/supabase.js'

export interface Company {
  id: string
  name: string
  description?: string
  website?: string
  company_size?: string
  address?: string
  logo_url?: string
  jobs_count?: number | null | undefined
  job_count?: number | null | undefined
  jobs?: Job[] // Add jobs array
  createdAt: Date
  updatedAt: Date
}

export interface Job {
  id: string
  title: string
  description?: string | undefined
  requirements?: string | undefined
  benefits?: string | undefined
  salary_min?: number | undefined
  salary_max?: number | undefined
  currency?: string | undefined
  job_type?: string | undefined
  status?: string | undefined
  expiry_date?: string | undefined
  company_id: string
  category_id?: string | undefined
  location_id?: string | undefined
  created_at: string
  updated_at: string
}

type DBCompany = {
  id: string
  name: string
  description?: string | null
  website?: string | null
  company_size?: string | null
  address?: string | null
  logo_url?: string | null
  created_at: string
  updated_at: string
  jobs?: Array<{
    count?: number
    id?: string
    title?: string
    description?: string
    requirements?: string
    benefits?: string
    salary_min?: number
    salary_max?: number
    currency?: string
    job_type?: string
    status?: string
    expiry_date?: string
    company_id?: string
    category_id?: string
    location_id?: string
    created_at?: string
    updated_at?: string
  }>
}

// helper: map DB -> App
function mapDBToCompany(row: DBCompany, includeJobs = false): Company {
  const jobsCount =
    Array.isArray(row.jobs) && row.jobs.length > 0 && typeof row.jobs[0]?.count === 'number'
      ? row.jobs[0].count
      : Array.isArray(row.jobs) && includeJobs
      ? row.jobs.filter(job => job.id).length
      : 0

  const company: Company = {
    id: row.id,
    name: row.name,
    jobs_count: jobsCount,
    job_count: jobsCount,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }

  if (row.description !== null && row.description !== undefined) company.description = row.description
  if (row.website !== null && row.website !== undefined) company.website = row.website
  if (row.company_size !== null && row.company_size !== undefined) company.company_size = row.company_size
  if (row.address !== null && row.address !== undefined) company.address = row.address
  if (row.logo_url !== null && row.logo_url !== undefined) company.logo_url = row.logo_url

  // Include jobs if requested and available
  if (includeJobs && Array.isArray(row.jobs)) {
    company.jobs = row.jobs
      .filter(job => job.id) // Only include jobs with ID (actual job records)
      .map(job => ({
        id: job.id!,
        title: job.title || '',
        description: job.description || undefined,
        requirements: job.requirements || undefined,
        benefits: job.benefits || undefined,
        salary_min: job.salary_min || undefined,
        salary_max: job.salary_max || undefined,
        currency: job.currency || 'VND',
        job_type: job.job_type || undefined,
        status: job.status || 'published',
        expiry_date: job.expiry_date || undefined,
        company_id: job.company_id || row.id,
        category_id: job.category_id || undefined,
        location_id: job.location_id || undefined,
        created_at: job.created_at || new Date().toISOString(),
        updated_at: job.updated_at || new Date().toISOString()
      }))
  }

  return company
}

export class CompanyModel {
  static async findAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('id,name,description,website,company_size,address,logo_url,created_at,updated_at,jobs(count)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching companies:', error)
      throw error
    }

    const rows = (data ?? []) as DBCompany[]
    return rows.map(row => mapDBToCompany(row))
  }

  static async findById(id: string, includeJobs = true): Promise<Company | null> {
    const selectQuery = includeJobs 
      ? 'id,name,description,website,company_size,address,logo_url,created_at,updated_at,jobs(id,title,description,requirements,benefits,salary_min,salary_max,currency,job_type,status,expiry_date,company_id,category_id,location_id,created_at,updated_at)'
      : 'id,name,description,website,company_size,address,logo_url,created_at,updated_at,jobs(count)'

    const { data, error } = await supabase
      .from('companies')
      .select(selectQuery)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      console.error(`Error fetching company with id ${id}:`, error)
      throw error
    }

    return data ? mapDBToCompany(data as DBCompany, includeJobs) : null
  }

  static async create(
    company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Company> {
    const payload = {
      name: company.name,
      description: company.description ?? null,
      website: company.website ?? null,
      company_size: company.company_size ?? null,
      address: company.address ?? null,
      logo_url: company.logo_url ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('companies')
      .insert([payload])
      .select('id,name,description,website,company_size,address,logo_url,created_at,updated_at,jobs(count)')
      .single()

    if (error) {
      console.error('Error creating company:', error)
      throw error
    }

    return mapDBToCompany(data as DBCompany, false)
  }

  static async update(id: string, companyData: Partial<Company>): Promise<Company | null> {
    const payload: Record<string, unknown> = {
      ...(companyData.name !== undefined && { name: companyData.name }),
      ...(companyData.description !== undefined && { description: companyData.description }),
      ...(companyData.website !== undefined && { website: companyData.website }),
      ...(companyData.company_size !== undefined && { company_size: companyData.company_size }),
      ...(companyData.address !== undefined && { address: companyData.address }),
      ...(companyData.logo_url !== undefined && { logo_url: companyData.logo_url }),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('companies')
      .update(payload)
      .eq('id', id)
      .select('id,name,description,website,company_size,address,logo_url,created_at,updated_at,jobs(count)')
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      console.error('Error updating company:', error)
      throw error
    }

    return data ? mapDBToCompany(data as DBCompany, false) : null
  }

  static async delete(id: string): Promise<boolean> {
    const { error, count } = await supabase
      .from('companies')
      .delete({ count: 'exact' })
      .eq('id', id)

    if (error) {
      console.error(`Error deleting company with id ${id}:`, error)
      throw error
    }

    return (count ?? 0) > 0
  }

  // Get jobs for a specific company
  static async getCompanyJobs(companyId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('id,title,description,requirements,benefits,salary_min,salary_max,currency,job_type,status,expiry_date,company_id,category_id,location_id,created_at,updated_at')
      .eq('company_id', companyId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`Error fetching jobs for company ${companyId}:`, error)
      throw error
    }

    return (data ?? []).map(job => ({
      id: job.id,
      title: job.title,
      description: job.description || undefined,
      requirements: job.requirements || undefined,
      benefits: job.benefits || undefined,
      salary_min: job.salary_min || undefined,
      salary_max: job.salary_max || undefined,
      currency: job.currency || 'VND',
      job_type: job.job_type || undefined,
      status: job.status || 'published',
      expiry_date: job.expiry_date || undefined,
      company_id: job.company_id,
      category_id: job.category_id || undefined,
      location_id: job.location_id || undefined,
      created_at: job.created_at,
      updated_at: job.updated_at
    }))
  }
}
