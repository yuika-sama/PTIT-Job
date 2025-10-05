import { Router } from 'express';
import { JobCategoryController } from '../controllers/JobCategoryController.js';

const router = Router();

// GET /api/categories - Get all job categories
router.get('/', JobCategoryController.getAllCategories);

// GET /api/categories/:id - Get category by ID
router.get('/:id', JobCategoryController.getCategoryById);

// POST /api/categories - Create new category
router.post('/', JobCategoryController.createCategory);

// PUT /api/categories/:id - Update category
router.put('/:id', JobCategoryController.updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', JobCategoryController.deleteCategory);

export default router;