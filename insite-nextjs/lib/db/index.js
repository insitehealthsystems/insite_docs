import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema.js'

// Next.js reads DATABASE_URL from .env.local automatically — no dotenv needed
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

pool.on('error', err => console.error('PostgreSQL pool error:', err.message))

export const db = drizzle(pool, { schema })
