import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  const client = new pg.Client({ connectionString: process.env.DIRECT_URL })
  await client.connect()
  const res = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'products'
  `)
  console.log('Columns:', res.rows.map(r => r.column_name).join(', '))
  await client.end()
}

main()
