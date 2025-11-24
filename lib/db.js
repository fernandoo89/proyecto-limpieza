import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // USA variable del entorno de Vercel/Railway
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false // Para Railway, necesita esto en prod
});

export default pool;
