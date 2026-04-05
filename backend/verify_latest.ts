import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: 'backend/.env' })

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const namesToCheck = [
    'Bad Boy (EDT)', 'Invictus (EDT)', 'Boss Bottled Night', 'Montblanc Explorer', 'Montblanc Legend (EDT)',
    'Prada Luna Rossa Black', 'L\'Homme Ideal Platine Prive', 'Burberry Weekend for Men', 'Lacoste Red (Style in Play)',
    'Jean Paul Gaultier Le Male', 'D&G The One for Man (EDT)', 'Roja Parfums Apex (EDP)', 'Parfums de Marly Carlisle (EDP)'
  ]
  try {
    for (const name of namesToCheck) {
      const res = await pool.query('SELECT id FROM products WHERE name = $1', [name])
      console.log(`${name}: ${res.rows.length > 0 ? 'Existed' : 'MISSING'}`)
    }
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

check()
