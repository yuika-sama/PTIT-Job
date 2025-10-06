import pool from '../config/config.js';
import type { UserRole } from './types/Types.js';

export interface User  {
    reset_token_expiry:  Date | null;
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
}
export class UserModel {
    static async findAll(): Promise<User[]> {
        try {
            const result = await pool.query(`SELECT 
                    u.*, 
                    c.name AS company_name
                FROM users u
                LEFT JOIN companies c ON u.company_id = c.id
                ORDER BY created_at DESC`
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    static async findById(id: string): Promise<User | null>{
        try {
            const result = await pool.query('SELECT * FROM ptitjob.users WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching user with id ${id}:`, error);
            throw error;
        }
    }

    static async findByEmail(email: string): Promise<User | null> {
        try {
            const result = await pool.query('SELECT * FROM ptitjob.users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching user with email ${email}:`, error);
            throw error;
        }   
    }

    static async getUserCompany(id: string): Promise<{ name: string | null }> {
        try {
            const result = await pool.query(
                `SELECT ptitjob.companies.name FROM ptitjob.users 
                JOIN ptitjob.companies ON ptitjob.users.company_id = ptitjob.companies.id
                 WHERE ptitjob.users.id = $1`, 
            [id]);
            if (result.rows.length === 0) {
                return { name: null };
            }   
            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching company info for user with id ${id}:`, error);
            throw error;
        }
    }

    static async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const { email, password_hash, full_name, phone_number, role, company_id, is_active } = user;
        return pool.query(
            `INSERT INTO ptitjob.users (email, password_hash, full_name, phone_number, role, company_id, is_active, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
             RETURNING *`,
            [email, password_hash, full_name, phone_number, role, company_id, is_active]
        ).then(result => result.rows[0]);
    }

    static async update(id: string, userData: Partial<User>): Promise<User | null> {
        try {
            const result = await pool.query(
                `UPDATE ptitjob.users SET 
                 email = COALESCE($2, email),
                 password_hash = COALESCE($3, password_hash),
                full_name = COALESCE($4, full_name),
                phone_number = COALESCE($5, phone_number),
                role = COALESCE($6, role),
                company_id = COALESCE($7, company_id),
                is_active = COALESCE($8, is_active),
                updated_at = NOW()
                WHERE id = $1
                RETURNING *`,
                [id, userData.email, userData.password_hash, userData.full_name, userData.phone_number,
                 userData.role, userData.company_id, userData.is_active]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async updateAccountStatus(id: string, isActive: boolean): Promise<User | null> {
        try {
            const result = await pool.query(
                `UPDATE ptitjob.users SET 
                 is_active = $2,
                 updated_at = NOW()
                    WHERE id = $1
                RETURNING *`,
                [id, isActive]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating account status:', error);
            throw error;
        }
    }

    static async delete(id: string): Promise<boolean> {
        try {
            const result = await pool.query('DELETE FROM ptitjob.users WHERE id = $1', [id]);
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    static async updateRefreshToken(id: string, refreshToken: string | null): Promise<boolean> {
        try {
            const result = await pool.query(
                'UPDATE ptitjob.users SET refresh_token = $1, updated_at = NOW() WHERE id = $2',
                [refreshToken, id]
            );
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error updating refresh token:', error);
            throw error;
        }
    }

    static async findByRefreshToken(refreshToken: string): Promise<User | null> {
        try {
            const result = await pool.query(
                'SELECT * FROM ptitjob.users WHERE refresh_token = $1 AND is_active = true',
                [refreshToken]
            );
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by refresh token:', error);
            throw error;
        }
    }

    static async updateResetToken(id: string, resetToken: string, resetTokenExpiry: Date): Promise<void> {
        try {
            await pool.query(
                'UPDATE ptitjob.users SET reset_token = $1, reset_token_expiry = $2, updated_at = NOW() WHERE id = $3',
                [resetToken, resetTokenExpiry, id]
            );
        } catch (error) {
            console.error('Error updating reset token:', error);
            throw error;
        }
    }

    static async findByResetToken(resetToken: string): Promise<User | null> {
        try {
            const result = await pool.query(
                'SELECT * FROM ptitjob.users WHERE reset_token = $1',
                [resetToken]
            );
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by reset token:', error);
            throw error;
        }
    }

    static async updatePasswordAndClearResetToken(id: string, passwordHash: string): Promise<void> {
        try {
            console.log(`🔄 Updating password for user ID: ${id}`);
            const result = await pool.query(
                'UPDATE ptitjob.users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL, updated_at = NOW() WHERE id = $2',
                [passwordHash, id]
            );
            console.log(`✅ Password updated successfully. Rows affected: ${result.rowCount}`);
            
            if (result.rowCount === 0) {
                throw new Error('No user found with the provided ID');
            }
        } catch (error) {
            console.error('❌ Error updating password and clearing reset token:', error);
            throw error;
        }
    }
}