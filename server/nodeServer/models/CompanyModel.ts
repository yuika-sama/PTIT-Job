import pool from '../config/config.js';
 interface Company {
    id: number;
    name: string;
    description?: string;
    website?: string;
    location?: string;
    company_size?: string;
    logoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
export class CompanyModel {
    static async findAll(): Promise<Company[]>{
        try{
            const result = await pool.query('SELECT * FROM companies ORDER BY created_at DESC');
            return result.rows;
        } catch (error) {
            console.error('Error fetching companies:', error);
            throw error;
        }
    }

    static async findById(id: number): Promise<Company | null> {
        try {
            const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching company with id ${id}:`, error);
            throw error;
        }
    }

    static create(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
        const { name, description, website, company_size, logoUrl } = company;
        return pool.query(
            `INSERT INTO companies (name, description, website, company_size, logo_url, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
             RETURNING *`,
            [name, description, website, company_size, logoUrl]
        ).then(result => result.rows[0]);
    }

    static async update(id: number, companyData: Partial<Company>): Promise<Company | null> {
        try {
            const result = await pool.query(
                `UPDATE companies SET 
                 name = COALESCE($2, name),
                 description = COALESCE($3, description),
                 website = COALESCE($4, website),
                 logo_url = COALESCE($5, logo_url),
                 company_size = COALESCE($6, company_size),
                 updated_at = NOW()
                 WHERE id = $1 
                 RETURNING *`,
                [id, companyData.name, companyData.description,
                 companyData.website, companyData.logoUrl, companyData.company_size]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating company:', error);
            throw error;
        }
    }

    static async delete (id: number): Promise<boolean> {
        try {
            const result = await pool.query('DELETE FROM companies WHERE id = $1', [id]);
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error(`Error deleting company with id ${id}:`, error);
            throw error;
        }
    }
}