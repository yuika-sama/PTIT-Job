import pool from '../config/config.js';

interface Resume {
    id: number;
    user_id: number;
    file_url: string;
    file_name: string;
    is_default: boolean;
    uploaded_at: Date;
}

export class ResumeModel {
    static async findAll(): Promise<Resume[]> {
        try {
            const result = await pool.query('SELECT * FROM resumes');
            return result.rows;
        } catch (error) {
            throw error;
        }
    }   
    
    static async findById(id: number): Promise<Resume | null> { 
        try {
            const result = await pool.query('SELECT * FROM resumes WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            throw error;
        }   
    }
    
    static async findByUserId(userId: number): Promise<Resume[]> {
        try {
            const result = await pool.query('SELECT * FROM resumes WHERE user_id = $1', [userId]);   
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    
    static async uploadResume(userId: number, fileUrl: string, fileName: string, isDefault: boolean): Promise<Resume> {
        try {
            if (isDefault) {
                await pool.query('UPDATE resumes SET is_default = FALSE WHERE user_id = $1', [userId]);
            }
            const result = await pool.query(
                'INSERT INTO resumes (user_id, file_url, file_name, is_default, uploaded_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *', 
                [userId, fileUrl, fileName, isDefault]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }   
    }
    
    static async setDefaultResume(userId: number, resumeId: number): Promise<void> {
        try {
            await pool.query('UPDATE resumes SET is_default = FALSE WHERE user_id = $1', [userId]);
            await pool.query('UPDATE resumes SET is_default = TRUE WHERE id = $1 AND user_id = $2', [resumeId, userId]);
        } catch (error) {
            throw error;
        }
    }
    
    static async deleteResume(userId: number, resumeId: number): Promise<void> {
        try {
            await pool.query('DELETE FROM resumes WHERE id = $1 AND user_id = $2', [resumeId, userId]);
        } catch (error) {
            throw error;
        }
    }
}