import { Elysia } from 'elysia';
import { JobController } from '../controllers/JobController.js';

export const jobRoutes = new Elysia()
    .group('/jobs', (app) => 
        app
            .get('/', JobController.getAllJobs, {
                detail: { tags: ['Jobs'] }
            })
            .get('/search', JobController.searchJobs, {
                detail: { tags: ['Jobs'] }
            })
            .get('/:id', JobController.getJobById, {
                detail: { tags: ['Jobs'] }
            })
            .post('/', JobController.createJob, {
                detail: { tags: ['Jobs'] }
            })
            .put('/:id', JobController.updateJob, {
                detail: { tags: ['Jobs'] }
            })
            .delete('/:id', JobController.deleteJob, {
                detail: { tags: ['Jobs'] }
            })
    )