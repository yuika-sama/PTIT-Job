import pool from '../config/config.js';
import type { ApplicationStatus } from './types/Types.js';
interface JobApplication {
    id: string;
    job_id: string;
    user_id: string;    
    resume_id: string;
    cover_letter?: string;
    status: ApplicationStatus;
    applied_at: Date;
    user_name?: string;
    user_email?: string;
    job_name?: string;
    file_url?: string;
}
export class JobApplicationModel {
    static async findAll(): Promise<JobApplication[]> {
        try {
            const result = await pool.query(`
                select ja.*, u.full_name as user_name, u.email as user_email, j.title as job_name, r.file_url as file_url
                    from ptitjob.job_applications ja
                    left join ptitjob.users u on ja.user_id = u.id
                    left join ptitjob.jobs j on ja.job_id = j.id
                    left join ptitjob.resumes r on ja.resume_id = r.id
                ORDER BY applied_at DESC;
            `);
            return result.rows;
        } catch (error) {
            console.error('Error finding all job applications:', error);
            throw error;
        }
    }

    static async findByJobId(jobId: string): Promise<JobApplication[]> {
        try {
            const result = await pool.query(`
                SELECT ja.*, u.full_name as applicant_name, u.email as applicant_email
                FROM job_applications ja
                LEFT JOIN users u ON ja.user_id = u.id
                WHERE ja.job_id = $1
                ORDER BY ja.applied_at DESC
            `, [jobId]);
            return result.rows;
        } catch (error) {
            console.error('Error finding applications by job id:', error);
            throw error;
        }
    }

    static async findByUserId(userId: string): Promise<JobApplication[]> {
        try {
            const result = await pool.query(`
                SELECT ja.*, j.title as job_title, c.name as company_name
                FROM job_applications ja
                LEFT JOIN jobs j ON ja.job_id = j.id
                LEFT JOIN companies c ON j.company_id = c.id
                WHERE ja.user_id = $1
                ORDER BY ja.applied_at DESC
            `, [userId]);
            return result.rows;
        } catch (error) {
            console.error('Error finding applications by user id:', error);
            throw error;
        }
    }

    static async create(applicationData: Omit<JobApplication, 'id' | 'applied_at' | 'status'>): Promise<JobApplication> {
        try {
            const result = await pool.query(
                `INSERT INTO job_applications (job_id, user_id, resume_id, cover_letter) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING *`,
                [applicationData.job_id, applicationData.user_id, applicationData.resume_id, applicationData.cover_letter]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating job application:', error);
            throw error;
        }
    }

    static async updateStatus(id: string, status: ApplicationStatus): Promise<JobApplication | null> {
        try {
            const result = await pool.query(
                'UPDATE job_applications SET status = $2 WHERE id = $1 RETURNING *',
                [id, status]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating application status:', error);
            throw error;
        }
    }
}