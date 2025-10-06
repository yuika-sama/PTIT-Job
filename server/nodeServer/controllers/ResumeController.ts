import { ResumeModel } from '../models/ResumeModel.js';
import { validateUUID } from '../utils/uuid.js';

export class ResumeController {
    static async getAllResumes(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const resumes = await ResumeModel.findAll();
            return {
                success: true,
                data: resumes,
                message: 'Resumes retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getAllResumes:', error);
            throw new Error('Internal server error');
        }
    }

    static async getResumeById({ params }: { params: { id: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;
            
            if (!id) {
                throw new Error('Resume ID is required');
            }

            const resumeId = validateUUID(id, 'Resume ID');
            const resume = await ResumeModel.findById(resumeId);
            if (!resume) {
                throw new Error('Resume not found');
            }

            return {
                success: true,
                data: resume,
                message: 'Resume retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getResumeById:', error);
            throw error;
        }
    }

    static async getResumesByUserId({ params }: { params: { userId: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { userId } = params;

            if (!userId) {
                throw new Error('User ID is required');
            }

            const userIdValidated = validateUUID(userId, 'User ID');
            const resumes = await ResumeModel.findByUserId(userIdValidated);
            return {
                success: true,
                data: resumes,
                message: 'User resumes retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getResumesByUserId:', error);
            throw error;
        }
    }

    static async uploadResume({ body }: { body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { userId, fileUrl, fileName, isDefault } = body;

            if (!userId || !fileUrl || !fileName) {
                throw new Error('Missing required fields: userId, fileUrl, fileName');
            }

            const userIdValidated = validateUUID(userId, 'User ID');
            const newResume = await ResumeModel.uploadResume(
                userIdValidated, 
                fileUrl, 
                fileName, 
                isDefault || false
            );

            return {
                success: true,
                data: newResume,
                message: 'Resume uploaded successfully'
            };
        } catch (error) {
            console.error('Error in uploadResume:', error);
            throw error;
        }
    }

    static async setDefaultResume({ params }: { params: { userId: string; resumeId: string } }): Promise<{ success: boolean; message: string }> {
        try {
            const { userId, resumeId } = params;

            if (!userId || !resumeId) {
                throw new Error('User ID and Resume ID are required');
            }

            const userIdValidated = validateUUID(userId, 'User ID');
            const resumeIdValidated = validateUUID(resumeId, 'Resume ID');

            await ResumeModel.setDefaultResume(userIdValidated, resumeIdValidated);
            return {
                success: true,
                message: 'Default resume set successfully'
            };
        } catch (error) {
            console.error('Error in setDefaultResume:', error);
            throw error;
        }
    }

    static async deleteResume({ params }: { params: { userId: string; resumeId: string } }): Promise<{ success: boolean; message: string }> {
        try {
            const { userId, resumeId } = params;

            if (!userId || !resumeId) {
                throw new Error('User ID and Resume ID are required');
            }

            const userIdValidated = validateUUID(userId, 'User ID');
            const resumeIdValidated = validateUUID(resumeId, 'Resume ID');

            await ResumeModel.deleteResume(userIdValidated, resumeIdValidated);
            return {
                success: true,
                message: 'Resume deleted successfully'
            };
        } catch (error) {
            console.error('Error in deleteResume:', error);
            throw error;
        }
    }
}