import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

async function check(urlName: string, url: string | undefined) {
  console.log(`Checking ${urlName}: ${url?.split('@')[1]}`) // Log host/db only for privacy
  if (!url) return
  const client = new pg.Client({ connectionString: url })
  try {
    await client.connect()
    const res = await client.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'product_type'
    `)
    console.log(`${urlName} has product_type:`, res.rowCount > 0)
  } catch (e: any) {
    console.log(`${urlName} ERROR:`, e.message)
  } finally {
    await client.end()
  }
}

async function main() {
  await check('DATABASE_URL', process.env.DATABASE_URL)
  await check('DIRECT_URL', process.env.DIRECT_URL)
}

main()
