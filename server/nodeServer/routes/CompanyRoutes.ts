import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController.js';

const router = Router();

// GET /api/companies - Get all companies
router.get('/', CompanyController.getAllCompanies);

// GET /api/companies/:id - Get company by ID
router.get('/:id', CompanyController.getCompanyById);

// POST /api/companies - Create new company
router.post('/', CompanyController.createCompany);

// PUT /api/companies/:id - Update company
router.put('/:id', CompanyController.updateCompany);

// DELETE /api/companies/:id - Delete company
router.delete('/:id', CompanyController.deleteCompany);

export default router;