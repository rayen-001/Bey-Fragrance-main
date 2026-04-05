import path from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, './.env') })

import { prisma } from './src/db/prisma.js'

async function listTables() {
  try {
    const result = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    console.log('Tables in DB:', JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('Error listing tables:', error)
  }
}

listTables()
