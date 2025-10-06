import { Elysia } from 'elysia';
import { JobApplicationController } from '../controllers/JobApplicationController.js';

export const jobApplicationRoutes = new Elysia()
    .group('/applications', (app) => 
        app
            .get('', JobApplicationController.getAllApplications, {
                detail: { tags: ['Job Applications'] }
            })
            .get('/job/:jobId', JobApplicationController.getApplicationsByJobId, {
                detail: { tags: ['Job Applications'] }
            })
            .get('/user/:userId', JobApplicationController.getApplicationsByUserId, {
                detail: { tags: ['Job Applications'] }
            })
            .post('/', JobApplicationController.createApplication, {
                detail: { tags: ['Job Applications'] }
            })
            .put('/:id/status', JobApplicationController.updateApplicationStatus, {
                detail: { tags: ['Job Applications'] }
            })
    )