import { Elysia } from 'elysia';
import { ResumeController } from '../controllers/ResumeController.js';

export const resumeRoutes = new Elysia()
    .group('/resumes', (app) => 
        app
            .get('/', ResumeController.getAllResumes, {
                detail: { tags: ['Resumes'] }
            })
            .get('/:id', ResumeController.getResumeById, {
                detail: { tags: ['Resumes'] }
            })
            .get('/user/:userId', ResumeController.getResumesByUserId, {
                detail: { tags: ['Resumes'] }
            })
            .post('/upload', ResumeController.uploadResume, {
                detail: { tags: ['Resumes'] }
            })
            .put('/user/:userId/:resumeId/default', ResumeController.setDefaultResume, {
                detail: { tags: ['Resumes'] }
            })
            .delete('/user/:userId/:resumeId', ResumeController.deleteResume, {
                detail: { tags: ['Resumes'] }
            })
    )