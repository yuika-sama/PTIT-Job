import type { Request, Response } from 'express';
import { JobApplicationModel } from '../models/JobApplicationModel.js';
import type { ApplicationStatus } from '../models/types/Types.js';

export class JobApplicationController {
    static async getAllApplications(req: Request, res: Response) {
        try {
            const applications = await JobApplicationModel.findAll();
            res.status(200).json({
                success: true,
                data: applications,
                message: 'Job applications retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getAllApplications:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getApplicationsByJobId(req: Request, res: Response) {
        try {
            const { jobId } = req.params;
            const jobIdNum = parseInt(jobId ?? '');

            if (isNaN(jobIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid job ID'
                });
            }

            const applications = await JobApplicationModel.findByJobId(jobIdNum);
            res.status(200).json({
                success: true,
                data: applications,
                message: 'Job applications retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getApplicationsByJobId:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getApplicationsByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const userIdNum = parseInt(userId ?? '');

            if (isNaN(userIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
            }

            const applications = await JobApplicationModel.findByUserId(userIdNum);
            res.status(200).json({
                success: true,
                data: applications,
                message: 'User applications retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getApplicationsByUserId:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async createApplication(req: Request, res: Response) {
        try {
            const { job_id, user_id, resume_id, cover_letter } = req.body;

            if (!job_id || !user_id || !resume_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: job_id, user_id, resume_id'
                });
            }

            const newApplication = await JobApplicationModel.create({
                job_id,
                user_id,
                resume_id,
                cover_letter
            });

            res.status(201).json({
                success: true,
                data: newApplication,
                message: 'Job application submitted successfully'
            });
        } catch (error) {
            console.error('Error in createApplication:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateApplicationStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const applicationId = parseInt(id ?? '');

            if (isNaN(applicationId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid application ID'
                });
            }

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const updatedApplication = await JobApplicationModel.updateStatus(applicationId, status as ApplicationStatus);
            if (!updatedApplication) {
                return res.status(404).json({
                    success: false,
                    message: 'Job application not found'
                });
            }

            res.status(200).json({
                success: true,
                data: updatedApplication,
                message: 'Application status updated successfully'
            });
        } catch (error) {
            console.error('Error in updateApplicationStatus:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}