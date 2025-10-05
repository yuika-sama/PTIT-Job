import type { Request, Response } from 'express';
import { UserModel } from '../models/UserModel.js';
import type { UserRole } from '../models/types/Types.js';

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserModel.findAll();
            res.status(200).json({
                success: true,
                data: users,
                message: 'Users retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = parseInt(id ?? '');

            if (!id || isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: user,
                message: 'User retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getUserById:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async createUser(req: Request, res: Response) {
        try {
            const { email, password_hash, full_name, phone_number, role, company_id, is_active } = req.body;

            // Validate required fields
            if (!email || !password_hash || !full_name || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: email, password_hash, full_name, role'
                });
            }

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            const newUser = await UserModel.create({
                email,
                password_hash,
                full_name,
                phone_number,
                role: role as UserRole,
                company_id,
                is_active: is_active ?? true
            });

            res.status(201).json({
                success: true,
                data: newUser,
                message: 'User created successfully'
            });
        } catch (error) {
            console.error('Error in createUser:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = parseInt(id ?? '');

            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
            }

            const updatedUser = await UserModel.update(userId, req.body);
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: updatedUser,
                message: 'User updated successfully'
            });
        } catch (error) {
            console.error('Error in updateUser:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = parseInt(id ?? '');

            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
            }

            const deleted = await UserModel.delete(userId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteUser:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}