// models/JobApplicationModel.ts
import { supabase } from '../config/supabase.js'
import type { ApplicationStatus } from './types/Types.js'

export interface JobApplication {
  id: string
  job_id: string
  user_id: string
  resume_id: string
  cover_letter?: string | undefined
  status: ApplicationStatus
  applied_at: Date
  user_name?: string | undefined
  user_email?: string | undefined
  job_name?: string | undefined
  file_url?: string | undefined
}

// “raw” từ Supabase (snake_case + embedded)
type DBJobApplication = {
  id: string
  job_id: string
  user_id: string
  resume_id: string
  cover_letter?: string | null
  status: ApplicationStatus
  applied_at: string
  users?: { full_name?: string | null; email?: string | null } | null
  jobs?: { title?: string | null; companies?: { name?: string | null } | null } | null
  resumes?: { file_url?: string | null } | null
}

function mapDBToApp(row: DBJobApplication): JobApplication {
  const application: JobApplication = {
    id: row.id,
    job_id: row.job_id,
    user_id: row.user_id,
    resume_id: row.resume_id,
    status: row.status,
    applied_at: new Date(row.applied_at),
  }
  if (row.cover_letter != null) application.cover_letter = row.cover_letter
  if (row.users?.full_name != null) application.user_name = row.users.full_name
  if (row.users?.email != null) application.user_email = row.users.email
  if (row.jobs?.title != null) application.job_name = row.jobs.title
  if (row.resumes?.file_url != null) application.file_url = row.resumes.file_url
  return application
}

export class JobApplicationModel {
  static async findAll(): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select(
        [
          'id',
          'job_id',
          'user_id',
          'resume_id',
          'cover_letter',
          'status',
          'applied_at',
          'users(full_name,email)',  // embed theo FK ja.user_id -> users.id
          'jobs(title)',             // embed theo FK ja.job_id -> jobs.id
          'resumes(file_url)',       // embed theo FK ja.resume_id -> resumes.id
        ].join(',')
      )
      .returns<DBJobApplication[]>()
      .order('applied_at', { ascending: false })

    if (error) {
      console.error('Error finding all job applications:', error)
      throw error
    }

    return (data ?? []).map(mapDBToApp)
  }

  static async findByJobId(jobId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select(
        [
          'id',
          'job_id',
          'user_id',
          'resume_id',
          'cover_letter',
          'status',
          'applied_at',
          'users(full_name,email)', // applicant info
        ].join(',')
      )
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false })
      .returns<DBJobApplication[]>()

    if (error) {
      console.error('Error finding applications by job id:', error)
      throw error
    }

    return (data ?? []).map((r) => {
      const base = mapDBToApp(r)
      return {
        ...base,
        user_name: r.users?.full_name ?? base.user_name,
        user_email: r.users?.email ?? base.user_email,
      }
    })
  }

  static async findByUserId(userId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select(
        [
          'id',
          'job_id',
          'user_id',
          'resume_id',
          'cover_letter',
          'status',
          'applied_at',
          'jobs(title,companies(name))', // job_title (+ company nếu cần)
        ].join(',')
      )
      .eq('user_id', userId)
      .order('applied_at', { ascending: false })
      .returns<DBJobApplication[]>()

    if (error) {
      console.error('Error finding applications by user id:', error)
      throw error
    }

    return (data ?? []).map((r) => {
      const base = mapDBToApp(r)
      return {
        ...base,
        job_name: r.jobs?.title ?? base.job_name,
        // Nếu muốn trả thêm company_name:
        // company_name: r.jobs?.companies?.name ?? undefined,
      }
    })
  }

  static async create(
    applicationData: Omit<JobApplication, 'id' | 'applied_at' | 'status'>
  ): Promise<JobApplication> {
    const payload = {
      job_id: applicationData.job_id,
      user_id: applicationData.user_id,
      resume_id: applicationData.resume_id,
      cover_letter: applicationData.cover_letter ?? null,
    }

    const { data, error } = await supabase
      .from('job_applications')
      .insert([payload])
      .select(
        [
          'id',
          'job_id',
          'user_id',
          'resume_id',
          'cover_letter',
          'status',
          'applied_at',
          'users(full_name,email)',
          'jobs(title)',
          'resumes(file_url)',
        ].join(',')
      )
      .single<DBJobApplication>()

    if (error) {
      console.error('Error creating job application:', error)
      throw error
    }
    if (!data) throw new Error('No data returned when creating job application')

    return mapDBToApp(data)
  }

  static async updateStatus(id: string, status: ApplicationStatus): Promise<JobApplication | null> {
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', id)
      .select(
        [
          'id',
          'job_id',
          'user_id',
          'resume_id',
          'cover_letter',
          'status',
          'applied_at',
          'users(full_name,email)',
          'jobs(title)',
          'resumes(file_url)',
        ].join(',')
      )
      .maybeSingle<DBJobApplication>()

    if (error) {
      console.error('Error updating application status:', error)
      throw error
    }

    return data ? mapDBToApp(data) : null
  }
}
