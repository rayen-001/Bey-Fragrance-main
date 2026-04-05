import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function main() {
  const prisma = new PrismaClient()
  try {
    const products = await (prisma as any).$queryRawUnsafe('SELECT * FROM public.products LIMIT 1')
    console.log('Result:', products[0] ? Object.keys(products[0]) : 'No products found')
  } catch (e: any) {
    console.error('FAILED:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
