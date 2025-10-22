import { supabase } from '../config/supabase.js';
import type { JobType, JobStatus } from './types/Types.js';

interface Job {
    id: string;
    title: string;
    description: string;
    requirements: string;
    benefits: string;
    salary_min: number;
    salary_max: number;
    currency: string;
    job_type: JobType;
    status: JobStatus;
    expiry_date: string;
    company_name: string;
    category_name: string;
    location_name: string;
    logo_url?: string | null;
    created_at: string;
    updated_at: string;
    company_id: string;
    category_id: string;
    location_id: string;
    job_count?: number;
}

export class JobModel {
    static async findAll(options?: { page?: number; limit?: number; search?: string }): Promise<Job[]> {
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
                .order('created_at', { ascending: false });

            // Add search filter if provided
            if (options?.search) {
                query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
            }

            // Add pagination if provided
            if (options?.page && options?.limit) {
                const start = (options.page - 1) * options.limit;
                const end = start + options.limit - 1;
                query = query.range(start, end);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Supabase error in findAll:', error);
                throw error;
            }

            const transformedData = data?.map((job: any) => ({
                id: job.id,
                title: job.title,
                description: job.description || '',
                requirements: job.requirements || '',
                benefits: job.benefits || '',
                salary_min: job.salary_min || 0,
                salary_max: job.salary_max || 0,
                currency: job.currency,
                job_type: job.job_type,
                status: job.status,
                expiry_date: job.expiry_date || '',
                company_name: job.companies?.name || '',
                category_name: job.job_categories?.name || '',
                location_name: job.locations?.city || '',
                logo_url: job.companies?.logo_url || null,
                created_at: job.created_at,
                updated_at: job.updated_at,
                company_id: job.company_id,
                category_id: job.category_id || '',
                location_id: job.location_id || ''
            })) || [];

            return transformedData;
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
                    return null;
                }
                throw error;
            }

            const transformedJob: Job = {
                id: data.id,
                title: data.title,
                description: data.description || '',
                requirements: data.requirements || '',
                benefits: data.benefits || '',
                salary_min: data.salary_min || 0,
                salary_max: data.salary_max || 0,
                currency: data.currency,
                job_type: data.job_type,
                status: data.status,
                expiry_date: data.expiry_date || '',
                company_name: data.companies?.name || '',
                category_name: data.job_categories?.name || '',
                location_name: data.locations?.city || '',
                logo_url: data.companies?.logo_url || null,
                created_at: data.created_at,
                updated_at: data.updated_at,
                company_id: data.company_id,
                category_id: data.category_id || '',
                location_id: data.location_id || ''
            };

            return transformedJob;
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

            const transformedData = data?.map((job: any) => ({
                id: job.id,
                title: job.title,
                description: job.description || '',
                requirements: job.requirements || '',
                benefits: job.benefits || '',
                salary_min: job.salary_min || 0,
                salary_max: job.salary_max || 0,
                currency: job.currency,
                job_type: job.job_type,
                status: job.status,
                expiry_date: job.expiry_date || '',
                company_name: job.companies?.name || '',
                category_name: job.job_categories?.name || '',
                location_name: job.locations?.city || '',
                logo_url: job.companies?.logo_url || null,
                created_at: job.created_at,
                updated_at: job.updated_at,
                company_id: job.company_id,
                category_id: job.category_id || '',
                location_id: job.location_id || ''
            })) || [];

            return transformedData;
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
                    status: 'published' as JobStatus,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
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
                .single();

            if (error) {
                throw error;
            }

            const transformedJob: Job = {
                id: data.id,
                title: data.title,
                description: data.description || '',
                requirements: data.requirements || '',
                benefits: data.benefits || '',
                salary_min: data.salary_min || 0,
                salary_max: data.salary_max || 0,
                currency: data.currency,
                job_type: data.job_type,
                status: data.status,
                expiry_date: data.expiry_date || '',
                company_name: data.companies?.name || '',
                category_name: data.job_categories?.name || '',
                location_name: data.locations?.city || '',
                logo_url: data.companies?.logo_url || null,
                created_at: data.created_at,
                updated_at: data.updated_at,
                company_id: data.company_id,
                category_id: data.category_id || '',
                location_id: data.location_id || ''
            };

            return transformedJob;
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
                .single();

            if (error) {
                throw error;
            }

            const transformedJob: Job = {
                id: data.id,
                title: data.title,
                description: data.description || '',
                requirements: data.requirements || '',
                benefits: data.benefits || '',
                salary_min: data.salary_min || 0,
                salary_max: data.salary_max || 0,
                currency: data.currency,
                job_type: data.job_type,
                status: data.status,
                expiry_date: data.expiry_date || '',
                company_name: data.companies?.name || '',
                category_name: data.job_categories?.name || '',
                location_name: data.locations?.city || '',
                logo_url: data.companies?.logo_url || null,
                created_at: data.created_at,
                updated_at: data.updated_at,
                company_id: data.company_id,
                category_id: data.category_id || '',
                location_id: data.location_id || ''
            };

            return transformedJob;
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

            const transformedData = data?.map((job: any) => ({
                id: job.id,
                title: job.title,
                description: job.description || '',
                requirements: job.requirements || '',
                benefits: job.benefits || '',
                salary_min: job.salary_min || 0,
                salary_max: job.salary_max || 0,
                currency: job.currency,
                job_type: job.job_type,
                status: job.status,
                expiry_date: job.expiry_date || '',
                company_name: '',
                category_name: job.job_categories?.name || '',
                location_name: job.locations?.city || '',
                logo_url: null,
                created_at: job.created_at,
                updated_at: job.updated_at,
                company_id: job.company_id,
                category_id: job.category_id || '',
                location_id: job.location_id || ''
            })) || [];

            return transformedData;
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
                .single();

            if (error) {
                throw error;
            }

            const transformedJob: Job = {
                id: data.id,
                title: data.title,
                description: data.description || '',
                requirements: data.requirements || '',
                benefits: data.benefits || '',
                salary_min: data.salary_min || 0,
                salary_max: data.salary_max || 0,
                currency: data.currency,
                job_type: data.job_type,
                status: data.status,
                expiry_date: data.expiry_date || '',
                company_name: data.companies?.name || '',
                category_name: data.job_categories?.name || '',
                location_name: data.locations?.city || '',
                logo_url: data.companies?.logo_url || null,
                created_at: data.created_at,
                updated_at: data.updated_at,
                company_id: data.company_id,
                category_id: data.category_id || '',
                location_id: data.location_id || ''
            };

            return transformedJob;
        } catch (error) {
            console.error('Error updating job status:', error);
            throw error;
        }
    }
}
