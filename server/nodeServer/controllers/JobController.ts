import { JobModel } from '../models/JobModel.js';
import { validateUUID } from '../utils/uuid.js';

export class JobController {
    static async getAllJobs(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const jobs = await JobModel.findAll();
            return {
                success: true,
                data: jobs,
                message: 'Jobs retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getAllJobs:', error);
            throw new Error('Internal server error');
        }
    }

    static async getJobById({ params }: { params: { id: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;
            const jobId = validateUUID(id, 'Job ID');

            const job = await JobModel.findById(jobId);
            if (!job) {
                throw new Error('Job not found');
            }

            return {
                success: true,
                data: job,
                message: 'Job retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getJobById:', error);
            throw error;
        }
    }

    static async createJob({ body }: { body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { title, description, company_id, job_type } = body;

            if (!title || !description || !company_id || !job_type) {
                throw new Error('Missing required fields: title, description, company_id, job_type');
            }

            const newJob = await JobModel.create(body);
            return {
                success: true,
                data: newJob,
                message: 'Job created successfully'
            };
        } catch (error) {
            console.error('Error in createJob:', error);
            throw error;
        }
    }

    static async updateJob({ params, body }: { params: { id: string }; body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;
            const jobId = validateUUID(id, 'Job ID');

            const updatedJob = await JobModel.update(jobId, body);
            if (!updatedJob) {
                throw new Error('Job not found');
            }

            return {
                success: true,
                data: updatedJob,
                message: 'Job updated successfully'
            };
        } catch (error) {
            console.error('Error in updateJob:', error);
            throw error;
        }
    }

    static async deleteJob({ params }: { params: { id: string } }): Promise<{ success: boolean; message: string }> {
        try {
            const { id } = params;
            const jobId = validateUUID(id, 'Job ID');

            const deleted = await JobModel.delete(jobId);
            if (!deleted) {
                throw new Error('Job not found');
            }

            return {
                success: true,
                message: 'Job deleted successfully'
            };
        } catch (error) {
            console.error('Error in deleteJob:', error);
            throw error;
        }
    }
}