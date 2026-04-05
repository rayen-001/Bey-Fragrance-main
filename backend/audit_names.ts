import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: 'backend/.env' })

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const res = await pool.query('SELECT name FROM products ORDER BY name ASC')
    const names = res.rows.map(r => r.name)
    console.log('TOTAL:', names.length)
    console.log(JSON.stringify(names))
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

check()
