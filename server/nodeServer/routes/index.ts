import { Router } from 'express';
import userRoutes from './UserRoutes.js';
import companyRoutes from './CompanyRoutes.js';
import jobRoutes from './JobRoutes.js';
import jobApplicationRoutes from './JobApplicationRoutes.js';
import resumeRoutes from './ResumeRoutes.js';
import jobCategoryRoutes from './JobCategoryRoutes.js';
import locationRoutes from './LocationRoutes.js';

const router = Router();

// Mount all routes
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', jobApplicationRoutes);
router.use('/resumes', resumeRoutes);
router.use('/categories', jobCategoryRoutes);
router.use('/locations', locationRoutes);

export default router;