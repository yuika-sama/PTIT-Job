import dotenv from 'dotenv';
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import pool from './config/config.js';
import { supabaseAdmin } from './config/supabase.js';
import { setupApiRoutes } from './routes/index.js';
import SupabaseUtils from './utils/supabaseUtils.js';

dotenv.config();

const app = new Elysia()
    .use(cors())
    .use(swagger());

// Setup API routes
setupApiRoutes(app);

app.get('/test-db', async () => {
    try {
        const result = await pool.query('SELECT NOW() as current_time, current_database() as database_name');
        return {
            success: true,
            message: 'Connected to Supabase successfully',
            data: result.rows[0]
        };
    } catch (error) {
        console.error('Error executing query', error);
        return {
            success: false,
            message: 'Failed to connect to database',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
});

// Test Supabase client
app.get('/test-supabase', async () => {
    try {
        const { data, error } = await supabaseAdmin
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'ptitjob')
            .limit(5);

        if (error) {
            throw error;
        }

        return {
            success: true,
            message: 'Supabase client working',
            tables: data || []
        };
    } catch (error) {
        console.error('Error with Supabase client', error);
        return {
            success: false,
            message: 'Supabase client error',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
});

// Check Supabase setup and migration readiness
app.get('/setup-check', async () => {
    return await SupabaseUtils.testConnection();
});

// Prepare for migration (create schema if needed)
app.get('/prepare-migration', async () => {
    return await SupabaseUtils.prepareMigration();
});

// Get ptitjob schema tables
app.get('/ptitjob-tables', async () => {
    try {
        const tables = await SupabaseUtils.getTablesInPtitjobSchema();
        return {
            success: true,
            tables: tables,
            count: tables.length
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
});

// Health check
app.get('/health', () => {
    return {
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    };
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🦊 Elysia server is running on port ${PORT}`);
    console.log(`API endpoints available at: http://localhost:${PORT}/api`);
    console.log(`Swagger documentation at: http://localhost:${PORT}/swagger`);
}); 
console.log('Server started');