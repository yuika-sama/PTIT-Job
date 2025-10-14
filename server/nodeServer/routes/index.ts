import { Elysia } from 'elysia';
import { authRoutes } from './AuthRoutes.js';
import { userRoutes } from './UserRoutes.js';
import { jobRoutes } from './JobRoutes.js';
import { companyRoutes } from './CompanyRoutes.js';
import { jobApplicationRoutes } from './JobApplicationRoutes.js';
import { jobCategoryRoutes } from './JobCategoryRoutes.js';
import { locationRoutes } from './LocationRoutes.js';
import { resumeRoutes } from './ResumeRoutes.js';
import { statsRoutes } from './StatsRoutes.js';

export function setupApiRoutes(app: Elysia) {
    app.group('/api', (api) => {
        return api
            .use(authRoutes)
            .use(userRoutes)
            .use(jobRoutes)
            .use(companyRoutes)
            .use(jobApplicationRoutes)
            .use(jobCategoryRoutes)
            .use(locationRoutes)
            .use(resumeRoutes)
            .use(statsRoutes)
    });
    
    return app;
}