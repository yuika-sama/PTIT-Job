import {supabase} from '../config/supabase.js';
import type { UserRole } from './types/Types.js';

export interface User {
    reset_token_expiry: Date | null;
    id: string;
    email: string;
    password_hash: string;
    full_name: string;
    phone_number?: string;
    role: UserRole;
    company_id?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    refresh_token?: string | null;
    reset_token?: string | null;
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

            // Transform data to match expected format
            return data?.map(user => ({
                ...user,
                company_name: user.companies?.name || null
            })) || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    static async findById(id: string): Promise<User | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    static async findByEmail(email: string): Promise<User | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found
                }
                throw error;
            }

            return data;
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
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
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
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
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
                .select('*')
                .eq('reset_token', token)
                .gt('reset_token_expiry', new Date().toISOString())
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found or expired
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error finding user by reset token:', error);
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
}