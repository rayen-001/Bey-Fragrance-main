import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  const client = new pg.Client({ connectionString: process.env.DIRECT_URL })
  await client.connect()
  const res = await client.query('SELECT current_database(), current_schema()')
  console.log('Current DB/Schema:', res.rows[0])
  
  const tables = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'')
  console.log('Tables in public:', tables.rows.map(t => t.table_name).join(', '))
  
  await client.end()
}

main()
