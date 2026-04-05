import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: 'backend/.env' })

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const names = [
    'Jean Paul Gaultier Scandal Pour Homme', 'Bleu de Chanel (EDP)', 'Versace Eros (EDT)', 'Montblanc Explorer', 'Montblanc Legend (EDT)'
  ]
  try {
    for (const name of names) {
      const res = await pool.query('SELECT name FROM products WHERE name = $1', [name])
      console.log(`${name}: ${res.rows.length}`)
    }
    
    // Also check for 'Dior Sauvage (EDT)' and 'Sauvage (EDT)'
    const names2 = ['Dior Sauvage (EDT)', 'Sauvage (EDT)', 'Armani Acqua di Gio (EDT)', 'Acqua di Gio (EDT)']
    for (const name of names2) {
      const res = await pool.query('SELECT name FROM products WHERE name = $1', [name])
      console.log(`${name}: ${res.rows.length}`)
    }
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

check()
