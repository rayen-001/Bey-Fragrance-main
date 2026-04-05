import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: 'backend/.env' })

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const res = await pool.query('SELECT name FROM products ORDER BY created_at DESC LIMIT 50')
    console.log('Recent 50 products:', res.rows.map(r => r.name).join(', '))
  } catch (err) {
    console.error('Error fetching products:', err)
  } finally {
    await pool.end()
  }
}

check()
