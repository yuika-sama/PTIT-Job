import { supabase } from '../config/supabase.js';
import type { JobType, JobStatus } from './types/Types.js';

interface Job {
    id: string;
    title: string;
    description: string;
    requirements?: string;
    benefits?: string;
    salary_min?: number;
    salary_max?: number;
    currency: string;
    job_type: JobType;
    status: JobStatus;
    expiry_date?: Date;
    company_id: string;
    category_id?: string;
    location_id?: string;
    company_logo?: string;
    created_at: Date;
    updated_at: Date;
}

export class JobModel {
    static async findAll(): Promise<Job[]> {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select(`
                    *,
                    companies!company_id (
                        name,
                        logo_url
                    ),
                    job_categories!category_id (
                        name
                    ),
                    locations!location_id (
                        city
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error in findAll:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }

    static async findById(id: string): Promise<Job | null> {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select(`
                    *,
                    companies!company_id (
                        name,
                        logo_url,
                        description
                    ),
                    job_categories!category_id (
                        name
                    ),
                    locations!location_id (
                        city,
                        slug
                    )
                `)
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error finding job by ID:', error);
            throw error;
        }
    }

    static async search(criteria: {
        title?: string;
        company_id?: string;
        category_id?: number;
        location_id?: number;
        job_type?: JobType;
        salary_min?: number;
        salary_max?: number;
    }): Promise<Job[]> {
        try {
            let query = supabase
                .from('jobs')
                .select(`
                    *,
                    companies!company_id (
                        name,
                        logo_url
                    ),
                    job_categories!category_id (
                        name
                    ),
                    locations!location_id (
                        city
                    )
                `)

            // Apply filters
            if (criteria.title) {
                query = query.ilike('title', `%${criteria.title}%`);
            }
            if (criteria.company_id) {
                query = query.eq('company_id', criteria.company_id);
            }
            if (criteria.category_id) {
                query = query.eq('category_id', criteria.category_id);
            }
            if (criteria.location_id) {
                query = query.eq('location_id', criteria.location_id);
            }
            if (criteria.job_type) {
                query = query.eq('job_type', criteria.job_type);
            }
            if (criteria.salary_min) {
                query = query.gte('salary_min', criteria.salary_min);
            }
            if (criteria.salary_max) {
                query = query.lte('salary_max', criteria.salary_max);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error searching jobs:', error);
            throw error;
        }
    }

    static async create(jobData: {
        title: string;
        description: string;
        requirements?: string;
        benefits?: string;
        salary_min?: number;
        salary_max?: number;
        currency: string;
        job_type: JobType;
        expiry_date?: Date;
        company_id: string;
        category_id?: string;
        location_id?: string;
    }): Promise<Job> {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .insert([{
                    ...jobData,
                    status: 'active' as JobStatus,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    }

    static async update(id: string, updates: Partial<Job>): Promise<Job> {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error updating job:', error);
            throw error;
        }
    }

    static async delete(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('Error deleting job:', error);
            throw error;
        }
    }

    static async getByCompany(companyId: string): Promise<Job[]> {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select(`
                    *,
                    job_categories!category_id (
                        name
                    ),
                    locations!location_id (
                        city
                    )
                `)
                .eq('company_id', companyId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error getting jobs by company:', error);
            throw error;
        }
    }

    static async updateStatus(id: string, status: JobStatus): Promise<Job> {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .update({
                    status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error updating job status:', error);
            throw error;
        }
    }
}