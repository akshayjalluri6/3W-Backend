import pkg from 'pg';
const { Pool } = pkg;
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL from .env
});

// Optional: You can handle errors and log when the connection is established
pool.on('connect', () => {
    console.log('Connected to the database successfully!');
});

pool.on('error', (err) => {
    console.error('Error with the database connection:', err);
});

export default pool;
