import pool from '../config/config.js';
import type { UserRole } from './types/Types.js';
interface User  {
    id: number;
    email: string;
    password_hash: string
    full_name: string;
    phone_number?: string;
    role: UserRole;
    company_id?: number;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export class UserModel {
    static async findAll(): Promise<User[]> {
        try {
            const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
            return result.rows;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    static async findById(id: number): Promise<User | null>{
        try {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
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
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching user with email ${email}:`, error);
            throw error;
        }   
    }
    static async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const { email, password_hash, full_name, phone_number, role, company_id, is_active } = user;
        return pool.query(
            `INSERT INTO users (email, password_hash, full_name, phone_number, role, company_id, is_active, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
             RETURNING *`,
            [email, password_hash, full_name, phone_number, role, company_id, is_active]
        ).then(result => result.rows[0]);
    }

    static async update(id: number, userData: Partial<User>): Promise<User | null> {
        try {
            const result = await pool.query(
                `UPDATE users SET 
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

    static async delete(id: number): Promise<boolean> {
        try {
            const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}