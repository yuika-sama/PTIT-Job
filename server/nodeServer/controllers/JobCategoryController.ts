import type { Request, Response } from 'express';
import { JobCategoryModel } from '../models/JobCategoryModel.js';

export class JobCategoryController {
    static async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await JobCategoryModel.findAll();
            res.status(200).json({
                success: true,
                data: categories,
                message: 'Job categories retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getAllCategories:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getCategoryById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const categoryId = parseInt(id ?? '');

            if (isNaN(categoryId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category ID'
                });
            }

            const category = await JobCategoryModel.findById(categoryId);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Job category not found'
                });
            }

            res.status(200).json({
                success: true,
                data: category,
                message: 'Job category retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getCategoryById:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async createCategory(req: Request, res: Response) {
        try {
            const { name, slug } = req.body;

            if (!name || !slug) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and slug are required'
                });
            }

            const newCategory = await JobCategoryModel.create(name, slug);

            res.status(201).json({
                success: true,
                data: newCategory,
                message: 'Job category created successfully'
            });
        } catch (error) {
            console.error('Error in createCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, slug } = req.body;
            const categoryId = parseInt(id ?? '');

            if (isNaN(categoryId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category ID'
                });
            }

            if (!name || !slug) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and slug are required'
                });
            }

            const updatedCategory = await JobCategoryModel.update(categoryId, name, slug);
            if (!updatedCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Job category not found'
                });
            }

            res.status(200).json({
                success: true,
                data: updatedCategory,
                message: 'Job category updated successfully'
            });
        } catch (error) {
            console.error('Error in updateCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const categoryId = parseInt(id ?? '');

            if (isNaN(categoryId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category ID'
                });
            }

            const deleted = await JobCategoryModel.delete(categoryId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Job category not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Job category deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}