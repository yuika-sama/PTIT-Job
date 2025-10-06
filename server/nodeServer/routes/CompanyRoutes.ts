import { Elysia } from 'elysia';
import { CompanyController } from '../controllers/CompanyController.js';

export const companyRoutes = new Elysia()
    .group('/companies', (app) => 
        app
            .get('/', CompanyController.getAllCompanies, {
                detail: { tags: ['Companies'] }
            })
            .get('/:id', CompanyController.getCompanyById, {
                detail: { tags: ['Companies'] }
            })
            .post('/', CompanyController.createCompany, {
                detail: { tags: ['Companies'] }
            })
            .put('/:id', CompanyController.updateCompany, {
                detail: { tags: ['Companies'] }
            })
            .delete('/:id', CompanyController.deleteCompany, {
                detail: { tags: ['Companies'] }
            })
        )
