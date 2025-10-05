import pool from '../config/config.js';
import type { ApplicationStatus } from './types/Types.js';
interface JobApplication {
    id: number;
    job_id: number;
    user_id: number;    
    resume_id: number;
    cover_letter?: string;
    status: ApplicationStatus;
    applied_at: Date;
}
export class JobApplicationModel {
    static async findAll(): Promise<JobApplication[]> {
        try {
            const result = await pool.query(`
                SELECT ja.*, j.title as job_title, u.full_name as applicant_name, c.name as company_name
                FROM job_applications ja
                LEFT JOIN jobs j ON ja.job_id = j.id
                LEFT JOIN users u ON ja.user_id = u.id
                LEFT JOIN companies c ON j.company_id = c.id
                ORDER BY ja.applied_at DESC
            `);
            return result.rows;
        } catch (error) {
            console.error('Error finding all job applications:', error);
            throw error;
        }
    }

    static async findByJobId(jobId: number): Promise<JobApplication[]> {
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

    static async findByUserId(userId: number): Promise<JobApplication[]> {
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

    static async updateStatus(id: number, status: ApplicationStatus): Promise<JobApplication | null> {
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