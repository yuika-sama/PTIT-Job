import dotenv from 'dotenv';
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import pool from './config/config.js';
import { setupApiRoutes } from './routes/index.js';

dotenv.config();

const app = new Elysia()
    .use(cors())
    .use(swagger());

// Setup API routes
setupApiRoutes(app);

app.get('/test-db', async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Internal Server Error');
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