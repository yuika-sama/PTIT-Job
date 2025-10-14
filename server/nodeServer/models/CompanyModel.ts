
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
  createdAt: Date
  updatedAt: Date
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
  jobs?: { count: number }[]
}

// helper: map DB -> App
function mapDBToCompany(row: DBCompany): Company {
  const jobsCount =
    Array.isArray(row.jobs) && row.jobs.length > 0 && typeof row.jobs[0]?.count === 'number'
      ? row.jobs[0].count
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
    return rows.map(mapDBToCompany)
  }

  static async findById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('id,name,description,website,company_size,address,logo_url,created_at,updated_at,jobs(count)')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      console.error(`Error fetching company with id ${id}:`, error)
      throw error
    }

    return data ? mapDBToCompany(data as DBCompany) : null
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

    return mapDBToCompany(data as DBCompany)
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

    return data ? mapDBToCompany(data as DBCompany) : null
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
}
