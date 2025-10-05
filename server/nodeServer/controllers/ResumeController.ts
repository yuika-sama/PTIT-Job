import type { Request, Response } from 'express';
import { ResumeModel } from '../models/ResumeModel.js';

export class ResumeController {
    static async getAllResumes(req: Request, res: Response) {
        try {
            const resumes = await ResumeModel.findAll();
            res.status(200).json({
                success: true,
                data: resumes,
                message: 'Resumes retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getAllResumes:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getResumeById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const resumeId = parseInt(id ?? '');

            if (isNaN(resumeId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid resume ID'
                });
            }

            const resume = await ResumeModel.findById(resumeId);
            if (!resume) {
                return res.status(404).json({
                    success: false,
                    message: 'Resume not found'
                });
            }

            res.status(200).json({
                success: true,
                data: resume,
                message: 'Resume retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getResumeById:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getResumesByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const userIdNum = parseInt(userId ?? '');

            if (isNaN(userIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
            }

            const resumes = await ResumeModel.findByUserId(userIdNum);
            res.status(200).json({
                success: true,
                data: resumes,
                message: 'User resumes retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getResumesByUserId:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async uploadResume(req: Request, res: Response) {
        try {
            const { userId, fileUrl, fileName, isDefault } = req.body;

            if (!userId || !fileUrl || !fileName) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: userId, fileUrl, fileName'
                });
            }

            const newResume = await ResumeModel.uploadResume(
                parseInt(userId), 
                fileUrl, 
                fileName, 
                isDefault || false
            );

            res.status(201).json({
                success: true,
                data: newResume,
                message: 'Resume uploaded successfully'
            });
        } catch (error) {
            console.error('Error in uploadResume:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async setDefaultResume(req: Request, res: Response) {
        try {
            const { userId, resumeId } = req.params;
            const userIdNum = parseInt(userId ?? '');
            const resumeIdNum = parseInt(resumeId ?? '');

            if (isNaN(userIdNum) || isNaN(resumeIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID or resume ID'
                });
            }

            await ResumeModel.setDefaultResume(userIdNum, resumeIdNum);
            res.status(200).json({
                success: true,
                message: 'Default resume set successfully'
            });
        } catch (error) {
            console.error('Error in setDefaultResume:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteResume(req: Request, res: Response) {
        try {
            const { userId, resumeId } = req.params;
            const userIdNum = parseInt(userId ?? '');
            const resumeIdNum = parseInt(resumeId ?? '');

            if (isNaN(userIdNum) || isNaN(resumeIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID or resume ID'
                });
            }

            await ResumeModel.deleteResume(userIdNum, resumeIdNum);
            res.status(200).json({
                success: true,
                message: 'Resume deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteResume:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}