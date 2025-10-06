import { Elysia } from 'elysia';
import { JobCategoryController } from '../controllers/JobCategoryController.js';

export const jobCategoryRoutes = new Elysia()
    .group('/categories', (app) => 
        app
            .get('/', JobCategoryController.getAllCategories, {
                detail: { tags: ['Job Categories'] }
            })
            .get('/:id', JobCategoryController.getCategoryById, {
                detail: { tags: ['Job Categories'] }
            })
            .post('/', JobCategoryController.createCategory, {
                detail: { tags: ['Job Categories'] }
            })
            .put('/:id', JobCategoryController.updateCategory, {
                detail: { tags: ['Job Categories'] }
            })
            .delete('/:id', JobCategoryController.deleteCategory, {
                detail: { tags: ['Job Categories'] }
            })
    )