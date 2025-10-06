import pool from '../config/config.js';
import { supabaseAdmin } from '../config/supabase.js';

export class SupabaseUtils {
    
    /**
     * Kiểm tra xem schema ptitjob có tồn tại không
     */
    static async checkSchema(): Promise<boolean> {
        try {
            const result = await pool.query(`
                SELECT schema_name 
                FROM information_schema.schemata 
                WHERE schema_name = 'ptitjob'
            `);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error checking schema:', error);
            return false;
        }
    }

    /**
     * Tạo schema ptitjob nếu chưa tồn tại
     */
    static async createSchemaIfNotExists(): Promise<boolean> {
        try {
            const schemaExists = await this.checkSchema();
            if (!schemaExists) {
                await pool.query('CREATE SCHEMA IF NOT EXISTS ptitjob');
                console.log('✅ Created ptitjob schema');
                return true;
            }
            console.log('✅ ptitjob schema already exists');
            return true;
        } catch (error) {
            console.error('❌ Error creating schema:', error);
            return false;
        }
    }

    /**
     * Lấy danh sách tables trong schema ptitjob
     */
    static async getTablesInPtitjobSchema(): Promise<string[]> {
        try {
            const result = await pool.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'ptitjob'
                ORDER BY table_name
            `);
            return result.rows.map((row: any) => row.table_name);
        } catch (error) {
            console.error('Error getting tables:', error);
            return [];
        }
    }

    /**
     * Test connection và thông tin database
     */
    static async testConnection(): Promise<{
        success: boolean;
        info?: any;
        error?: string;
    }> {
        try {
            const result = await pool.query(`
                SELECT 
                    current_database() as database_name,
                    current_user as user_name,
                    version() as postgres_version,
                    NOW() as current_time
            `);
            
            const schemaExists = await this.checkSchema();
            const tables = await this.getTablesInPtitjobSchema();
            
            return {
                success: true,
                info: {
                    ...result.rows[0],
                    ptitjob_schema_exists: schemaExists,
                    ptitjob_tables: tables,
                    table_count: tables.length
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Migrate từ local database (helper function)
     */
    static async prepareMigration(): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }> {
        try {
            // Tạo schema nếu chưa có
            const schemaCreated = await this.createSchemaIfNotExists();
            if (!schemaCreated) {
                return {
                    success: false,
                    message: 'Failed to create ptitjob schema'
                };
            }

            // Kiểm tra connection
            const connectionTest = await this.testConnection();
            if (!connectionTest.success) {
                return {
                    success: false,
                    message: 'Database connection failed',
                    data: connectionTest.error
                };
            }

            return {
                success: true,
                message: 'Supabase ready for migration',
                data: connectionTest.info
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error preparing migration',
                data: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}

export default SupabaseUtils;