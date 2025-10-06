import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  ssl: {
    rejectUnauthorized: false
  },
  options: `-c search_path=${process.env.PGSCHEMA || 'public'}`
});

pool.connect((err: Error | undefined, client, done) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Connected to Supabase database');
        done();
    }
});

export default pool