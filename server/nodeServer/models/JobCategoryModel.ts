import pool from '../config/config.js'
interface JobCategory {
    id: string;
    name: string;
    slug: string;
    job_count?: number;
    icon_url?: string;
}
export class JobCategoryModel {
    static async findAll(): Promise<JobCategory[]> {
        try {
            const result = await pool.query(
                `SELECT 
                    c.*,
                    COUNT(j.id) AS job_count
                FROM 
                    job_categories c
                LEFT JOIN 
                    jobs j ON j.category_id = c.id
                GROUP BY 
                    c.id, c.name
                ORDER BY 
                    job_count DESC;`);
            return result.rows;
        } catch (error) {
            console.error('Error finding all job categories:', error);
            throw error;
        }
    }
    static async findById(id: string): Promise<JobCategory | null> {
        try {
            const result = await pool.query('SELECT * FROM job_categories WHERE id = $1', [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error finding job category by id:', error);
            throw error;
        }
    }
    static async create(name: string, slug: string, iconUrl: string): Promise<JobCategory> {
        try {
            const result = await pool.query(
                'INSERT INTO job_categories (name, slug, icon_url) VALUES ($1, $2, $3) RETURNING *',
                [name, slug, iconUrl]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating job category:', error);
            throw error;
        }
    }
    static async update(id: string, name: string, slug: string, iconUrl: string): Promise<JobCategory | null> {
        try {
            const result = await pool.query(
                'UPDATE job_categories SET name = $1, slug = $2, icon_url = $3 WHERE id = $4 RETURNING *',
                [name, slug, iconUrl, id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating job category:', error);
            throw error;
        }
    }
    static async delete(id: string): Promise<boolean> {
        try {
            const result = await pool.query('DELETE FROM job_categories WHERE id = $1', [id]);
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error deleting job category:', error);
            throw error;
        }
    }
}