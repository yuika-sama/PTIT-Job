import type { Request, Response } from 'express';
import { JobModel } from '../models/JobModel.js';
import type { JobType, JobStatus } from '../models/types/Types.js';

export class JobController {
    static async getAllJobs(req: Request, res: Response) {
        try {
            const jobs = await JobModel.findAll();
            res.status(200).json({
                success: true,
                data: jobs,
                message: 'Jobs retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getAllJobs:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getJobById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const jobId = parseInt(id ?? '');

            if (isNaN(jobId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid job ID'
                });
            }

            const job = await JobModel.findById(jobId);
            if (!job) {
                return res.status(404).json({
                    success: false,
                    message: 'Job not found'
                });
            }

            res.status(200).json({
                success: true,
                data: job,
                message: 'Job retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getJobById:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async createJob(req: Request, res: Response) {
        try {
            const { title, description, company_id, job_type, status } = req.body;

            if (!title || !description || !company_id || !job_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: title, description, company_id, job_type'
                });
            }

            const newJob = await JobModel.create(req.body);
            res.status(201).json({
                success: true,
                data: newJob,
                message: 'Job created successfully'
            });
        } catch (error) {
            console.error('Error in createJob:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateJob(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const jobId = parseInt(id ?? '');

            if (isNaN(jobId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid job ID'
                });
            }

            const updatedJob = await JobModel.update(jobId, req.body);
            if (!updatedJob) {
                return res.status(404).json({
                    success: false,
                    message: 'Job not found'
                });
            }

            res.status(200).json({
                success: true,
                data: updatedJob,
                message: 'Job updated successfully'
            });
        } catch (error) {
            console.error('Error in updateJob:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteJob(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const jobId = parseInt(id ?? '');

            if (isNaN(jobId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid job ID'
                });
            }

            const deleted = await JobModel.delete(jobId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Job not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Job deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteJob:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}