import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const res = await prisma.product.findMany({
      select: { name: true }
    })
    console.log('Names found:', res.length)
  } catch (e: any) {
    console.error('FAILED:', e.message)
  }
}

main().finally(() => prisma.$disconnect())
