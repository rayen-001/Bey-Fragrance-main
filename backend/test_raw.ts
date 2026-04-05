import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const rawResult = await prisma.$queryRaw`SELECT * FROM products LIMIT 1`
    console.log('Raw Result Keys:', Object.keys(rawResult[0]))
  } catch (e: any) {
    console.error('Raw Query Failed:', e.message)
  }
}

main().finally(() => prisma.$disconnect())
