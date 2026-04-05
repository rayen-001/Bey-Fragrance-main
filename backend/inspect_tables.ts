import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  const client = new pg.Client({
    connectionString: process.env.DIRECT_URL
  })
  await client.connect()
  const res = await client.query(`
    select table_schema, table_name 
    from information_schema.tables 
    where table_name = 'products'
  `)
  console.log('Tables named products found:', res.rows)
  await client.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
