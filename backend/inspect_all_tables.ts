import pg from 'pg'
import * as dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

async function main() {
  const client = new pg.Client({ connectionString: process.env.DIRECT_URL })
  await client.connect()
  const res = await client.query('SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = \'public\'')
  fs.writeFileSync('tables_full.txt', res.rows.map(r => r.table_name).join(', '))
  await client.end()
}

main()
