import pool from '../config/config.js'
interface JobCategory {
    id: number;
    name: string;
    slug: string
}
export class JobCategoryModel {
    static async findAll(): Promise<JobCategory[]> {
        try {
            const result = await pool.query('SELECT * FROM job_categories ORDER BY name');
            return result.rows;
        } catch (error) {
            console.error('Error finding all job categories:', error);
            throw error;
        }
    }
    static async findById(id: number): Promise<JobCategory | null> {
        try {
            const result = await pool.query('SELECT * FROM job_categories WHERE id = $1', [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error finding job category by id:', error);
            throw error;
        }
    }
    static async create(name: string, slug: string): Promise<JobCategory> {
        try {
            const result = await pool.query(
                'INSERT INTO job_categories (name, slug) VALUES ($1, $2) RETURNING *',
                [name, slug]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating job category:', error);
            throw error;
        }
    }
    static async update(id: number, name: string, slug: string): Promise<JobCategory | null> {
        try {
            const result = await pool.query(
                'UPDATE job_categories SET name = $1, slug = $2 WHERE id = $3 RETURNING *',
                [name, slug, id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating job category:', error);
            throw error;
        }
    }
    static async delete(id: number): Promise<boolean> {
        try {
            const result = await pool.query('DELETE FROM job_categories WHERE id = $1', [id]);
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error deleting job category:', error);
            throw error;
        }
    }
}