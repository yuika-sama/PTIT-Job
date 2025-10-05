import pool from '../config/config.js';
import type {JobType, JobStatus} from './types/Types.js';
interface Job {
    id: number;
    title: string;
    description: string;
    requirements?: string;
    benefits?: string;
    salary_min?: number
    salary_max?: number
    currency: string;
    job_type: JobType;
    status: JobStatus
    expiry_date?: Date;
    company_id: number;
    category_id?: number;
    location_id?: number;
    createdAt: Date;
    updatedAt: Date;
}

export class JobModel {
    static async findAll(): Promise<Job[]> {
        try {
            const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
            return result.rows as Job[];
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }

    static async findById(id: number): Promise<Job | null> {
        try {
            const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0] as Job;
        } catch (error) {
            console.error(`Error fetching job with id ${id}:`, error);
            throw error;
        }
    }

    static async create(jobData: Partial<Job>): Promise<Job> {
        const {
            title, description, requirements, benefits, salary_min, salary_max,
            currency, job_type, status, expiry_date, company_id, category_id, location_id
        } = jobData;    
        try {
            const result = await pool.query(
                `INSERT INTO jobs 
                (title, description, requirements, benefits, salary_min, salary_max, currency, job_type, status, expiry_date, company_id, category_id, location_id, "created_at", "updated_at") 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) 
                RETURNING *`,
                [title, description, requirements, benefits, salary_min, salary_max,
                 currency, job_type, status, expiry_date, company_id, category_id, location_id]
            );
            return result.rows[0] as Job;
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    }
    static async update(id: number, jobData: Partial<Job>): Promise<Job | null> {
        const {
            title, description, requirements, benefits, salary_min, salary_max,
            currency, job_type, status, expiry_date, company_id, category_id, location_id
        } = jobData;    
        try {
            const result = await pool.query(
                `UPDATE jobs SET
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                requirements = COALESCE($3, requirements),
                benefits = COALESCE($4, benefits),
                salary_min = COALESCE($5, salary_min),
                salary_max = COALESCE($6, salary_max),
                currency = COALESCE($7, currency),
                job_type = COALESCE($8, job_type),
                status = COALESCE($9, status),
                expiry_date = COALESCE($10, expiry_date),
                company_id = COALESCE($11, company_id),
                category_id = COALESCE($12, category_id),
                location_id = COALESCE($13, location_id),
                "updated_at" = NOW()
                WHERE id = $14
                RETURNING *`,
                [title, description, requirements, benefits, salary_min, salary_max,
                    currency, job_type, status, expiry_date, company_id, category_id, location_id, id]
            );
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0] as Job;
        } catch (error) {
            console.error(`Error updating job with id ${id}:`, error);
            throw error;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const result = await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error(`Error deleting job with id ${id}:`, error);
            throw error;
        }
    }
}