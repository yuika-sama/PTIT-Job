import { Router } from 'express';
import { JobController } from '../controllers/JobController.js';

const router = Router();

// GET /api/jobs - Get all jobs
router.get('/', JobController.getAllJobs);

// GET /api/jobs/:id - Get job by ID
router.get('/:id', JobController.getJobById);

// POST /api/jobs - Create new job
router.post('/', JobController.createJob);

// PUT /api/jobs/:id - Update job
router.put('/:id', JobController.updateJob);

// DELETE /api/jobs/:id - Delete job
router.delete('/:id', JobController.deleteJob);

export default router;