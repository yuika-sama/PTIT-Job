import pool from '../config/config.js';
interface Location {
    id: string;
    city: string;
    slug: string;
    job_count?: number; // Extended field for display
}

export class LocationModel {
    static async findAll(): Promise<Location[]> {
        try {
            const result = await pool.query(`
                select l.*, count(j.location_id) as job_count from locations l
                left join jobs j on j.location_id = l.id
                group by l.id
                order by job_count desc;
            `);
            return result.rows;
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    }

    static async findById(id: string): Promise<Location | null> {
        try {
            const result = await pool.query('SELECT * FROM locations WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching location with id ${id}:`, error);
            throw error;
        }
    }

    static async findBySlug(slug: string): Promise<Location | null> {   
        try {
            const result = await pool.query('SELECT * FROM locations WHERE slug = $1', [slug]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching location with slug ${slug}:`, error);
            throw error;
        }
    }

    static async create(location: Omit<Location, 'id'>): Promise<Location> {
        const { city, slug } = location;
        return pool.query(
            `INSERT INTO locations (city, slug)
             VALUES ($1, $2)
             RETURNING *`,
            [city, slug]
        ).then(result => result.rows[0]);
    }

    static async update(id: string, location: Partial<Omit<Location, 'id'>>): Promise<Location | null> {
        try {
            const fields = [];
            const values = [];
            let index = 1;
            for (const key in location) {
                fields.push(`${key} = $${index}`);
                values.push((location as any)[key]);
                index++;
            }
            if (fields.length === 0) {
                return null;
            }
            values.push(id);
            const result = await pool.query(
                `UPDATE locations SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
                values
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error updating location with id ${id}:`, error);
            throw error;
        }
    }

    static async delete(id: string): Promise<boolean> {
        try {
            const result = await pool.query('DELETE FROM locations WHERE id = $1', [id]);
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error(`Error deleting location with id ${id}:`, error);
            throw error;
        }
    }
}