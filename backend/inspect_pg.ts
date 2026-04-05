import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  const client = new pg.Client({
    connectionString: process.env.DIRECT_URL
  })
  await client.connect()
  const res = await client.query(`
    select table_schema, table_name, column_name 
    from information_schema.columns 
    where table_name = 'products'
  `)
  res.rows.forEach(r => console.log(`${r.table_schema}.${r.table_name}.${r.column_name}`))
  await client.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
