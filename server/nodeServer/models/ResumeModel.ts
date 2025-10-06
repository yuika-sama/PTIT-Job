import pool from '../config/config.js';

interface Resume {
    id: string;
    user_id: string;
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
    
    static async findById(id: string): Promise<Resume | null> { 
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
    
    static async findByUserId(userId: string): Promise<Resume[]> {
        try {
            const result = await pool.query('SELECT * FROM resumes WHERE user_id = $1', [userId]);   
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    
    static async uploadResume(userId: string, fileUrl: string, fileName: string, isDefault: boolean): Promise<Resume> {
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
    
    static async setDefaultResume(userId: string, resumeId: string): Promise<void> {
        try {
            await pool.query('UPDATE resumes SET is_default = FALSE WHERE user_id = $1', [userId]);
            await pool.query('UPDATE resumes SET is_default = TRUE WHERE id = $1 AND user_id = $2', [resumeId, userId]);
        } catch (error) {
            throw error;
        }
    }
    
    static async deleteResume(userId: string, resumeId: string): Promise<void> {
        try {
            await pool.query('DELETE FROM resumes WHERE id = $1 AND user_id = $2', [resumeId, userId]);
        } catch (error) {
            throw error;
        }
    }
}