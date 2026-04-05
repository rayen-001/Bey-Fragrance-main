import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: 'backend/.env' })

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const first50 = [
    "YSL Y Eau de Parfum", "YSL Y Le Parfum", "YSL Y Eau de Toilette", "Dior Sauvage (EDT)", "Dior Sauvage (EDP)",
    "Dior Sauvage (Parfum)", "Dior Sauvage Elixir", "Bleu de Chanel (EDT)", "Bleu de Chanel (EDP)", "Bleu de Chanel Parfum",
    "Armani Acqua di Gio (EDT)", "Armani Acqua di Gio Profondo", "Armani Acqua di Gio Profumo", "Armani Stronger With You (EDT)",
    "Armani Stronger With You Intensely", "Jean Paul Gaultier Le Male (EDT)", "Jean Paul Gaultier Le Male Le Parfum",
    "Jean Paul Gaultier Ultra Male", "Jean Paul Gaultier Scandal Pour Homme", "Versace Eros (EDT)", "Versace Eros (EDP)",
    "Versace Dylan Blue (Pour Homme)", "Paco Rabanne One Million (EDT)", "Paco Rabanne One Million Elixir",
    "Paco Rabanne Invictus (EDT)", "Paco Rabanne Phantom (EDT)", "Viktor & Rolf Spicebomb Extreme",
    "Azzaro The Most Wanted Parfum", "Azzaro Wanted by Night", "Prada Luna Rossa Carbon", "Prada Luna Rossa Ocean (EDT)",
    "Prada L'Homme", "Terre d'Hermès (EDT)", "Terre d'Hermès Pure Parfum", "Montblanc Explorer", "Montblanc Legend (EDT)",
    "D&G The One for Men (EDP)", "D&G Light Blue Pour Homme", "Valentino Uomo Born in Roma", "Carolina Herrera Bad Boy (EDT)",
    "Creed Aventus", "Creed Silver Mountain Water", "Parfums de Marly Layton", "Parfums de Marly Percival",
    "Maison Francis Kurkdjian Baccarat Rouge 540 (EDP)", "Tom Ford Ombré Leather (EDP)", "Tom Ford Tobacco Vanille",
    "Tom Ford Lost Cherry", "Tom Ford Oud Wood", "Hugo Boss Bottled Elixir (2023)"
  ]
  try {
    const missing = []
    for (const name of first50) {
      const res = await pool.query('SELECT id FROM products WHERE name = $1', [name])
      if (res.rows.length === 0) {
        missing.push(name)
      }
    }
    console.log('MISSING_FROM_FIRST_50:', JSON.stringify(missing))
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

check()
