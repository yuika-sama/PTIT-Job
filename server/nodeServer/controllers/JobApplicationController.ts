import { JobApplicationModel } from '../models/JobApplicationModel.js';
import { validateUUID } from '../utils/uuid.js';
import type { ApplicationStatus } from '../models/types/Types.js';

export class JobApplicationController {
    static async getAllApplications(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const applications = await JobApplicationModel.findAll();
            console.log("✅ Applications fetched successfully:", applications.length, "applications");
            return {
                success: true,
                data: applications,
                message: 'Job applications retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getAllApplications:', error);
            throw new Error('Internal server error');
        }
    }

    static async getApplicationsByJobId({ params }: { params: { jobId: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { jobId } = params;

            if (!jobId) {
                throw new Error('Job ID is required');
            }

            const jobIdValidated = validateUUID(jobId, 'Job ID');
            const applications = await JobApplicationModel.findByJobId(jobIdValidated);
            return {
                success: true,
                data: applications,
                message: 'Job applications retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getApplicationsByJobId:', error);
            throw error;
        }
    }

    static async getApplicationsByUserId({ params }: { params: { userId: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { userId } = params;

            if (!userId) {
                throw new Error('User ID is required');
            }

            const userIdValidated = validateUUID(userId, 'User ID');
            const applications = await JobApplicationModel.findByUserId(userIdValidated);
            return {
                success: true,
                data: applications,
                message: 'User applications retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getApplicationsByUserId:', error);
            throw error;
        }
    }

    static async createApplication({ body }: { body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { job_id, user_id, resume_id, cover_letter } = body;

            if (!job_id || !user_id || !resume_id) {
                throw new Error('Missing required fields: job_id, user_id, resume_id');
            }

            const newApplication = await JobApplicationModel.create({
                job_id,
                user_id,
                resume_id,
                cover_letter
            });

            return {
                success: true,
                data: newApplication,
                message: 'Job application submitted successfully'
            };
        } catch (error) {
            console.error('Error in createApplication:', error);
            throw error;
        }
    }

    static async updateApplicationStatus({ params, body }: { params: { id: string }; body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;
            const { status } = body;

            if (!id) {
                throw new Error('Application ID is required');
            }

            if (!status) {
                throw new Error('Status is required');
            }

            const applicationId = validateUUID(id, 'Application ID');
            const updatedApplication = await JobApplicationModel.updateStatus(applicationId, status as ApplicationStatus);
            if (!updatedApplication) {
                throw new Error('Job application not found');
            }

            return {
                success: true,
                data: updatedApplication,
                message: 'Application status updated successfully'
            };
        } catch (error) {
            console.error('Error in updateApplicationStatus:', error);
            throw error;
        }
    }
}