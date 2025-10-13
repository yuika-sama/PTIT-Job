import { UserModel } from '../models/UserModel.js';
import type { UserRole } from '../models/types/Types.js';
import { validateUUID } from '../utils/uuid.js';
import bcrypt from 'bcrypt';

export class UserController {
    static async getAllUsers(query?: any): Promise<{ success: boolean; data: any; message: string }> {
        try {
            console.log('🔍 UserController.getAllUsers called with query:', query);
            const users = await UserModel.findAll();
            
            // Get company information for each user
            const usersWithCompany = await Promise.all(
                users.map(async (user) => {
                    try {
                        const companyInfo = await UserModel.getUserCompany(user.id);
                        return {
                            ...user,
                            company_name: companyInfo.name || null
                        };
                    } catch (error) {
                        return {
                            ...user,
                            company_name: null
                        };
                    }
                })
            );
            
            console.log('✅ Users fetched successfully:', usersWithCompany.length, 'users');
            return {
                success: true,
                data: usersWithCompany,
                message: 'Users retrieved successfully'
            };
        } catch (error: any) {
            console.error('❌ Error in getAllUsers:', error);
            throw new Error(error.message || 'Internal server error');
        }
    }

    static async getUserStats(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            console.log('🔍 UserController.getUserStats called');
            const users = await UserModel.findAll();
            
            const stats = {
                total: users.length,
                active: users.filter(user => user.is_active).length,
                byRole: users.reduce((acc: any, user) => {
                    acc[user.role] = (acc[user.role] || 0) + 1;
                    return acc;
                }, {})
            };

            console.log('✅ User stats calculated:', stats);
            return {
                success: true,
                data: stats,
                message: 'User statistics retrieved successfully'
            };
        } catch (error: any) {
            console.error('❌ Error in getUserStats:', error);
            throw new Error(error.message || 'Failed to get user statistics');
        }
    }

    static async toggleUserStatus({ params }: { params: { id: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            console.log('🔍 UserController.toggleUserStatus called for user:', params.id);
            const user = await UserModel.findById(params.id);
            if (!user) {
                throw new Error('User not found');
            }

            const updatedUser = await UserModel.update(params.id, {
                is_active: !user.is_active
            });

            if (!updatedUser) {
                throw new Error('Failed to update user status');
            }

            console.log('✅ User status toggled:', updatedUser.is_active ? 'active' : 'inactive');
            return {
                success: true,
                data: updatedUser,
                message: `User ${updatedUser.is_active ? 'activated' : 'deactivated'} successfully`
            };
        } catch (error: any) {
            console.error('❌ Error in toggleUserStatus:', error);
            throw error;
        }
    }

    static async getUserById({ params }: { params: { id: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;
            const userId = validateUUID(id, 'User ID');

            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Get company information
            try {
                const companyInfo = await UserModel.getUserCompany(userId);
                const userWithCompany = {
                    ...user,
                    company_name: companyInfo.name || null
                };
                
                return {
                    success: true,
                    data: userWithCompany,
                    message: 'User retrieved successfully'
                };
            } catch (error) {
                return {
                    success: true,
                    data: { ...user, company_name: null },
                    message: 'User retrieved successfully'
                };
            }
        } catch (error) {
            console.error('Error in getUserById:', error);
            throw error;
        }
    }

    static async createUser({ body }: { body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { email, password_hash, full_name, phone_number, role, company_id, is_active } = body;
            const save_password_hash = bcrypt.hashSync(password_hash, 10); // In real implementation, hash the password
            // Validate required fields
            if (!email || !save_password_hash || !full_name || !role) {
                throw new Error('Missing required fields: email, password_hash, full_name, role');
            }

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const newUser = await UserModel.create({
                email,
                password_hash: save_password_hash,
                full_name,
                phone_number,
                role: role as UserRole,
                company_id
            });

            return {
                success: true,
                data: newUser,
                message: 'User created successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: 'Failed to create user'
            }
        }
    }

    static async updateUser({ params, body }: { params: { id: string }, body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;
            console.log(id)
            const userId = validateUUID(id, 'User ID');

            const updatedUser = await UserModel.update(userId, body);
            if (!updatedUser) {
                throw new Error('User not found');
            }

            return {
                success: true,
                data: updatedUser,
                message: 'User updated successfully'
            };
        } catch (error) {
            console.error('Error in updateUser:', error);
            throw error;
        }
    }

    static async deleteUser({ params }: { params: { id: string } }) {
        try {
            const { id } = params;
            const userId = validateUUID(id, 'User ID');

            const deleted = await UserModel.delete(userId);
            if (!deleted) {
                throw new Error('User not found');
            }

            return {
                success: true,
                message: 'User deleted successfully'
            };
        } catch (error) {
            console.error('Error in deleteUser:', error);
            throw error;
        }
    }
}