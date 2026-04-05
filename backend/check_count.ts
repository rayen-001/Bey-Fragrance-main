import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: 'backend/.env' })

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const res = await pool.query('SELECT COUNT(*) FROM products')
    console.log('TOTAL_PRODUCTS_COUNT:', res.rows[0].count)
  } catch (err) {
    console.error('Error fetching product count:', err)
  } finally {
    await pool.end()
  }
}

check()
