import { Router } from 'express';
import { ResumeController } from '../controllers/ResumeController.js';

const router = Router();

// GET /api/resumes - Get all resumes
router.get('/', ResumeController.getAllResumes);

// GET /api/resumes/:id - Get resume by ID
router.get('/:id', ResumeController.getResumeById);

// GET /api/resumes/user/:userId - Get resumes by user ID
router.get('/user/:userId', ResumeController.getResumesByUserId);

// POST /api/resumes/upload - Upload new resume
router.post('/upload', ResumeController.uploadResume);

// PUT /api/resumes/user/:userId/:resumeId/default - Set default resume
router.put('/user/:userId/:resumeId/default', ResumeController.setDefaultResume);

// DELETE /api/resumes/user/:userId/:resumeId - Delete resume
router.delete('/user/:userId/:resumeId', ResumeController.deleteResume);

export default router;