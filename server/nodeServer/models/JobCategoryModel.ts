// models/JobCategoryModel.ts
import { supabase } from '../config/supabase.js'

interface JobCategory {
  id: string
  name: string
  slug: string
  job_count?: number
  icon_url?: string | undefined
}

type DBJobCategory = {
  id: string
  name: string
  slug: string
  icon_url?: string | null
  jobs?: { count: number }[] | null
}

function mapDBToCategory(row: DBJobCategory): JobCategory {
  const jobCount =
    Array.isArray(row.jobs) && row.jobs.length > 0 && typeof row.jobs[0]?.count === 'number'
      ? row.jobs[0].count
      : 0

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon_url: row.icon_url ?? undefined,
    job_count: jobCount,
  }
}

export class JobCategoryModel {
  static async findAll(options?: { page?: number; limit?: number; search?: string; status?: string }): Promise<JobCategory[]> {
    let baseQuery = supabase
      .from('job_categories')
      .select(
        [
          'id',
          'name',
          'slug',
          'icon_url',
          'jobs(count)', 
        ].join(',')
      );

    // Add pagination if provided
    if (options?.page && options?.limit) {
      const start = (options.page - 1) * options.limit;
      const end = start + options.limit - 1;
      baseQuery = baseQuery.range(start, end);
    }

    const { data, error } = await baseQuery.returns<DBJobCategory[]>();

    if (error) {
      console.error('Error finding all job categories:', error)
      throw error
    }

    return (data ?? []).map(mapDBToCategory).sort((a, b) => (b.job_count ?? 0) - (a.job_count ?? 0))
  }

  static async findById(id: string): Promise<JobCategory | null> {
    const { data, error } = await supabase
      .from('job_categories')
      .select(['id', 'name', 'slug', 'icon_url', 'jobs(count)'].join(','))
      .eq('id', id)
      .maybeSingle<DBJobCategory>()

    if (error) {
      console.error('Error finding job category by id:', error)
      throw error
    }

    return data ? mapDBToCategory(data) : null
  }

  static async create(name: string, slug: string, iconUrl: string): Promise<JobCategory> {
    const payload = {
      name,
      slug,
      icon_url: iconUrl ?? null,
    }

    const { data, error } = await supabase
      .from('job_categories')
      .insert([payload])
      .select(['id', 'name', 'slug', 'icon_url', 'jobs(count)'].join(','))
      .single<DBJobCategory>()

    if (error) {
      console.error('Error creating job category:', error)
      throw error
    }

    return mapDBToCategory(data)
  }

  static async update(id: string, name: string, slug: string, iconUrl: string): Promise<JobCategory | null> {
    const payload: Partial<DBJobCategory> = {
      name,
      slug,
      icon_url: iconUrl ?? null,
    }

    const { data, error } = await supabase
      .from('job_categories')
      .update(payload)
      .eq('id', id)
      .select(['id', 'name', 'slug', 'icon_url', 'jobs(count)'].join(','))
      .maybeSingle<DBJobCategory>()

    if (error) {
      console.error('Error updating job category:', error)
      throw error
    }

    return data ? mapDBToCategory(data) : null
  }

  static async delete(id: string): Promise<boolean> {
    const { error, count } = await supabase
      .from('job_categories')
      .delete({ count: 'exact' })
      .eq('id', id)

    if (error) {
      console.error('Error deleting job category:', error)
      throw error
    }

    return (count ?? 0) > 0
  }
}
