import { Router } from 'express';
import { JobApplicationController } from '../controllers/JobApplicationController.js';

const router = Router();

// GET /api/applications - Get all applications
router.get('/', JobApplicationController.getAllApplications);

// GET /api/applications/job/:jobId - Get applications by job ID
router.get('/job/:jobId', JobApplicationController.getApplicationsByJobId);

// GET /api/applications/user/:userId - Get applications by user ID
router.get('/user/:userId', JobApplicationController.getApplicationsByUserId);

// POST /api/applications - Create new application
router.post('/', JobApplicationController.createApplication);

// PUT /api/applications/:id/status - Update application status
router.put('/:id/status', JobApplicationController.updateApplicationStatus);

export default router;