import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: 'backend/.env' })

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const resTotal = await pool.query('SELECT COUNT(*) FROM products')
    console.log('Total Products:', resTotal.rows[0].count)
    
    const resNew = await pool.query("SELECT COUNT(*) FROM products WHERE brand = 'Bey Fragrance'")
    console.log('New Products (Bey Fragrance):', resNew.rows[0].count)
    
    const resOther = await pool.query("SELECT COUNT(*) FROM products WHERE brand != 'Bey Fragrance' OR brand IS NULL")
    console.log('Old Products:', resOther.rows[0].count)
    
    // Check if some names are repeated
    const resDuplicates = await pool.query('SELECT name, COUNT(*) FROM products GROUP BY name HAVING COUNT(*) > 1')
    console.log('Duplicates found:', resDuplicates.rows.length)
    if (resDuplicates.rows.length > 0) {
        console.log(JSON.stringify(resDuplicates.rows))
    }
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

check()
