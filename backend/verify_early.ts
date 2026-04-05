import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: 'backend/.env' })

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const namesToCheck = [
    'YSL Y Eau de Parfum', 'YSL Y Le Parfum', 'YSL La Nuit de l\'Homme', 'YSL Libre (EDP)', 'YSL Libre Intense',
    'Hugo Boss Bottled Elixir (2023)', 'Dior Sauvage Elixir', 'Dior Sauvage Eau de Parfum', 'Prada Luna Rossa Carbon',
    'YSL Y Eau de Toilette', 'YSL Myslf', 'YSL Tuxedo', 'YSL Babycat'
  ]
  try {
    for (const name of namesToCheck) {
      const res = await pool.query('SELECT name FROM products WHERE name = $1', [name])
      console.log(`${name}: ${res.rows.length > 0 ? 'Existed' : 'MISSING'}`)
    }
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

check()
