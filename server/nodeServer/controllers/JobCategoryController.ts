import { JobCategoryModel } from '../models/JobCategoryModel.js';
import { validateUUID } from '../utils/uuid.js';

export class JobCategoryController {
    static async getAllCategories(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const categories = await JobCategoryModel.findAll();
            return {
                success: true,
                data: categories,
                message: 'Job categories retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getAllCategories:', error);
            throw new Error('Internal server error');
        }
    }

    static async getCategoryById({ params }: { params: { id: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;

            if (!id) {
                throw new Error('Category ID is required');
            }

            const categoryId = validateUUID(id, 'Category ID');
            const category = await JobCategoryModel.findById(categoryId);
            if (!category) {
                throw new Error('Job category not found');
            }

            return {
                success: true,
                data: category,
                message: 'Job category retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getCategoryById:', error);
            throw error;
        }
    }

    static async createCategory({ body }: { body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { name, slug } = body;

            if (!name || !slug) {
                throw new Error('Name and slug are required');
            }

            const newCategory = await JobCategoryModel.create(name, slug);

            return {
                success: true,
                data: newCategory,
                message: 'Job category created successfully'
            };
        } catch (error) {
            console.error('Error in createCategory:', error);
            throw error;
        }
    }

    static async updateCategory({ params, body }: { params: { id: string }; body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;
            const { name, slug } = body;

            if (!id) {
                throw new Error('Category ID is required');
            }

            if (!name || !slug) {
                throw new Error('Name and slug are required');
            }

            const categoryId = validateUUID(id, 'Category ID');
            const updatedCategory = await JobCategoryModel.update(categoryId, name, slug);
            if (!updatedCategory) {
                throw new Error('Job category not found');
            }

            return {
                success: true,
                data: updatedCategory,
                message: 'Job category updated successfully'
            };
        } catch (error) {
            console.error('Error in updateCategory:', error);
            throw error;
        }
    }

    static async deleteCategory({ params }: { params: { id: string } }): Promise<{ success: boolean; message: string }> {
        try {
            const { id } = params;

            if (!id) {
                throw new Error('Category ID is required');
            }

            const categoryId = validateUUID(id, 'Category ID');
            const deleted = await JobCategoryModel.delete(categoryId);
            if (!deleted) {
                throw new Error('Job category not found');
            }

            return {
                success: true,
                message: 'Job category deleted successfully'
            };
        } catch (error) {
            console.error('Error in deleteCategory:', error);
            throw error;
        }
    }
}