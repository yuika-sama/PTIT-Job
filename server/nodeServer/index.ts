import dotenv from 'dotenv';
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { supabaseAdmin, supabasePublic } from './config/supabase.js';
import { setupApiRoutes } from './routes/index.js';
dotenv.config();

const app = new Elysia()
  .use(cors())
  .use(swagger());

setupApiRoutes(app);

app.get('/test-db', async () => {
  try {
    const [{ data: ping, error: pingErr }, { data: who, error: whoErr }] = await Promise.all([
      supabaseAdmin.rpc('health_check'),
      supabaseAdmin.rpc('whoami'),
    ]);

    if (pingErr) throw pingErr;
    if (whoErr) throw whoErr;

    return {
      success: true,
      message: 'Connected to Supabase (admin client)',
      connection: 'supabase-admin',
      now: ping?.[0]?.now ?? null,
      whoami: who ?? null,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Supabase connection test failed (admin):', error);
    return {
      success: false,
      message: 'Failed to connect to Supabase (admin)',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

/**
 * Test whoami với public client (anon key) để xác thực role phía REST
 */
app.get('/whoami', async () => {
  try {
    const { data, error } = await supabasePublic.rpc('whoami');
    if (error) throw error;
    return { success: true, whoami: data ?? null };
  } catch (error) {
    return {
      success: false,
      message: 'whoami failed (public)',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

/**
 * Đếm users bằng admin client (bypass RLS) – nếu lỗi ở đây thì thường là nhầm bảng/schema
 */
app.get('/users-count/admin', async () => {
  try {
    const { count, error } = await supabaseAdmin
      .from('users')            // đảm bảo bảng nằm trong schema 'public'
      .select('*', { head: true, count: 'exact' });
    if (error) throw error;
    return { success: true, connection: 'admin', count };
  } catch (error) {
    return {
      success: false,
      connection: 'admin',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

/**
 * Đếm users bằng public client (anon key) – sẽ fail nếu chưa mở RLS/policy
 */
app.get('/users-count/public', async () => {
  try {
    const { count, error } = await supabasePublic
      .from('users')
      .select('*', { head: true, count: 'exact' });
    if (error) throw error;
    return { success: true, connection: 'public', count };
  } catch (error) {
    return {
      success: false,
      connection: 'public',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

// Health check
app.get('/health', () => ({
  success: true,
  message: 'Server is running',
  timestamp: new Date().toISOString(),
}));

const PORT = process.env.PORT || 3000;
// app.listen(PORT, '0.0.0.0');
app.listen(PORT, () => {
  console.log(`🦊 Elysia server is running on port ${PORT}`);
  console.log(`Swagger documentation at: http://localhost:${PORT}/swagger`);
});
console.log('Server started');
