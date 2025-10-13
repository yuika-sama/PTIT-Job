// models/LocationModel.ts
import { supabase } from '../config/supabase.js'

interface Location {
  id: string
  city: string
  slug: string
  job_count?: number
}

// “raw” từ DB (snake_case + embed)
type DBLocation = {
  id: string
  city: string
  slug: string
  jobs?: { count: number }[] | null
}

function mapDBToLocation(row: DBLocation): Location {
  const jobCount =
    Array.isArray(row.jobs) && row.jobs.length > 0 && typeof row.jobs[0]?.count === 'number'
      ? row.jobs[0].count
      : 0

  return {
    id: row.id,
    city: row.city,
    slug: row.slug,
    job_count: jobCount,
  }
}

export class LocationModel {
  static async findAll(): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select(['id', 'city', 'slug', 'jobs(count)'].join(','))
      .returns<DBLocation[]>()

    if (error) {
      console.error('Error fetching locations:', error)
      throw error
    }

    return (data ?? [])
      .map(mapDBToLocation)
      .sort((a, b) => (b.job_count ?? 0) - (a.job_count ?? 0)) // order by job_count desc (client)
  }

  static async findById(id: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select(['id', 'city', 'slug', 'jobs(count)'].join(','))
      .eq('id', id)
      .maybeSingle<DBLocation>()

    if (error) {
      console.error(`Error fetching location with id ${id}:`, error)
      throw error
    }

    return data ? mapDBToLocation(data) : null
  }

  static async findBySlug(slug: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select(['id', 'city', 'slug', 'jobs(count)'].join(','))
      .eq('slug', slug)
      .maybeSingle<DBLocation>()

    if (error) {
      console.error(`Error fetching location with slug ${slug}:`, error)
      throw error
    }

    return data ? mapDBToLocation(data) : null
  }

  static async create(location: Omit<Location, 'id' | 'job_count'>): Promise<Location> {
    const payload = {
      city: location.city,
      slug: location.slug,
    }

    const { data, error } = await supabase
      .from('locations')
      .insert([payload])
      .select(['id', 'city', 'slug', 'jobs(count)'].join(','))
      .single<DBLocation>()

    if (error) {
      console.error('Error creating location:', error)
      throw error
    }

    return mapDBToLocation(data)
  }

  static async update(
    id: string,
    location: Partial<Omit<Location, 'id' | 'job_count'>>
  ): Promise<Location | null> {
    const payload: Partial<DBLocation> = {}
    if (location.city !== undefined) payload.city = location.city
    if (location.slug !== undefined) payload.slug = location.slug

    if (Object.keys(payload).length === 0) return null

    const { data, error } = await supabase
      .from('locations')
      .update(payload)
      .eq('id', id)
      .select(['id', 'city', 'slug', 'jobs(count)'].join(','))
      .maybeSingle<DBLocation>()

    if (error) {
      console.error(`Error updating location with id ${id}:`, error)
      throw error
    }

    return data ? mapDBToLocation(data) : null
  }

  static async delete(id: string): Promise<boolean> {
    const { error, count } = await supabase
      .from('locations')
      .delete({ count: 'exact' })
      .eq('id', id)

    if (error) {
      console.error(`Error deleting location with id ${id}:`, error)
      throw error
    }

    return (count ?? 0) > 0
  }
}
