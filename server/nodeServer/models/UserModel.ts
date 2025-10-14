import {supabase} from '../config/supabase.js';
import type { UserRole } from './types/Types.js';

export interface User {
    id: string;
    email: string;
    password_hash: string;
    full_name: string;
    phone_number?: string;
    role: UserRole;
    company_id?: string;
    company_name?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    refresh_token?: string;
    reset_token?: string | null;
    reset_token_expiry: Date | null;
}

export class UserModel {
    static async findAll(): Promise<User[]> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    companies!company_id (
                        name
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error in findAll:', error);
                throw error;
            }

            const transformedData = data?.map((user: any) => ({
                id: user.id,
                email: user.email,
                password_hash: user.password_hash,
                full_name: user.full_name,
                phone_number: user.phone_number || undefined,
                role: user.role,
                company_id: user.company_id || undefined,
                company_name: user.companies?.name || undefined,
                is_active: user.is_active,
                created_at: user.created_at,
                updated_at: user.updated_at,
                refresh_token: user.refresh_token || undefined,
                reset_token: user.reset_token || null,
                reset_token_expiry: user.reset_token_expiry ? new Date(user.reset_token_expiry) : null
            })) || [];

            return transformedData;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    static async findById(id: string): Promise<User | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    companies!company_id (
                        name
                    )
                `)
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }

            const transformedUser: User = {
                id: data.id,
                email: data.email,
                password_hash: data.password_hash,
                full_name: data.full_name,
                phone_number: data.phone_number || undefined,
                role: data.role,
                company_id: data.company_id || undefined,
                company_name: data.companies?.name || undefined,
                is_active: data.is_active,
                created_at: data.created_at,
                updated_at: data.updated_at,
                refresh_token: data.refresh_token || undefined,
                reset_token: data.reset_token || null,
                reset_token_expiry: data.reset_token_expiry ? new Date(data.reset_token_expiry) : null
            };

            return transformedUser;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    static async findByEmail(email: string): Promise<User | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    companies!company_id (
                        name
                    )
                `)
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;  
                }
                throw error;
            }

            const transformedUser: User = {
                id: data.id,
                email: data.email,
                password_hash: data.password_hash,
                full_name: data.full_name,
                phone_number: data.phone_number || undefined,
                role: data.role,
                company_id: data.company_id || undefined,
                company_name: data.companies?.name || undefined,
                is_active: data.is_active,
                created_at: data.created_at,
                updated_at: data.updated_at,
                refresh_token: data.refresh_token || undefined,
                reset_token: data.reset_token || null,
                reset_token_expiry: data.reset_token_expiry ? new Date(data.reset_token_expiry) : null
            };

            return transformedUser;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    static async create(userData: {
        email: string;
        password_hash: string;
        full_name: string;
        phone_number?: string;
        role: UserRole;
        company_id?: string;
    }): Promise<User> {
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([{
                    ...userData,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select(`
                    *,
                    companies!company_id (
                        name
                    )
                `)
                .single();

            if (error) {
                throw error;
            }

            const transformedUser: User = {
                id: data.id,
                email: data.email,
                password_hash: data.password_hash,
                full_name: data.full_name,
                phone_number: data.phone_number || undefined,
                role: data.role,
                company_id: data.company_id || undefined,
                company_name: data.companies?.name || undefined,
                is_active: data.is_active,
                created_at: data.created_at,
                updated_at: data.updated_at,
                refresh_token: data.refresh_token || undefined,
                reset_token: data.reset_token || null,
                reset_token_expiry: data.reset_token_expiry ? new Date(data.reset_token_expiry) : null
            };

            return transformedUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async update(id: string, updates: Partial<User>): Promise<User> {
        try {
            const { data, error } = await supabase
                .from('users')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select(`
                    *,
                    companies!company_id (
                        name
                    )
                `)
                .single();

            if (error) {
                throw error;
            }

            const transformedUser: User = {
                id: data.id,
                email: data.email,
                password_hash: data.password_hash,
                full_name: data.full_name,
                phone_number: data.phone_number || undefined,
                role: data.role,
                company_id: data.company_id || undefined,
                company_name: data.companies?.name || undefined,
                is_active: data.is_active,
                created_at: data.created_at,
                updated_at: data.updated_at,
                refresh_token: data.refresh_token || undefined,
                reset_token: data.reset_token || null,
                reset_token_expiry: data.reset_token_expiry ? new Date(data.reset_token_expiry) : null
            };

            return transformedUser;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async delete(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    static async getUserCompany(userId: string): Promise<{ name: string | null }> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    companies!company_id (
                        name
                    )
                `)
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return { name: null };
                }
                throw error;
            }

            return { name: (data?.companies as any)?.name || null };
        } catch (error) {
            console.error('Error getting user company:', error);
            return { name: null };
        }
    }

    static async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    refresh_token: refreshToken,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error updating refresh token:', error);
            throw error;
        }
    }

    static async setResetToken(email: string, token: string, expiry: Date): Promise<void> {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    reset_token: token,
                    reset_token_expiry: expiry.toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('email', email);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error setting reset token:', error);
            throw error;
        }
    }

    static async findByResetToken(token: string): Promise<User | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    companies!company_id (
                        name
                    )
                `)
                .eq('reset_token', token)
                .gt('reset_token_expiry', new Date().toISOString())
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }

            const transformedUser: User = {
                id: data.id,
                email: data.email,
                password_hash: data.password_hash,
                full_name: data.full_name,
                phone_number: data.phone_number || undefined,
                role: data.role,
                company_id: data.company_id || undefined,
                company_name: data.companies?.name || undefined,
                is_active: data.is_active,
                created_at: data.created_at,
                updated_at: data.updated_at,
                refresh_token: data.refresh_token || undefined,
                reset_token: data.reset_token || null,
                reset_token_expiry: data.reset_token_expiry ? new Date(data.reset_token_expiry) : null
            };

            return transformedUser;
        } catch (error) {
            console.error('Error finding user by reset token:', error);
            throw error;
        }
    }

    static async findByRefreshToken(token: string): Promise<User | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    companies!company_id (
                        name
                    )
                `)
                .eq('refresh_token', token)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; 
                }
                throw error;
            }

            const transformedUser: User = {
                id: data.id,
                email: data.email,
                password_hash: data.password_hash,
                full_name: data.full_name,
                phone_number: data.phone_number || undefined,
                role: data.role,
                company_id: data.company_id || undefined,
                company_name: data.companies?.name || undefined,
                is_active: data.is_active,
                created_at: data.created_at,
                updated_at: data.updated_at,
                refresh_token: data.refresh_token || undefined,
                reset_token: data.reset_token || null,
                reset_token_expiry: data.reset_token_expiry ? new Date(data.reset_token_expiry) : null
            };

            return transformedUser;
        } catch (error) {
            console.error('Error finding user by refresh token:', error);
            throw error;
        }
    }

    static async clearResetToken(userId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    reset_token: null,
                    reset_token_expiry: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error clearing reset token:', error);
            throw error;
        }
    }

    static async updateResetToken(userId: string, token: string, expiry: Date): Promise<void> {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    reset_token: token,
                    reset_token_expiry: expiry.toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error updating reset token:', error);
            throw error;
        }
    }

    static async updatePasswordAndClearResetToken(userId: string, newPasswordHash: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    password_hash: newPasswordHash,
                    reset_token: null,
                    reset_token_expiry: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error updating password and clearing reset token:', error);
            throw error;
        }
    }
}