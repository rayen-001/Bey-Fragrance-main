import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- TEST RUN START ---')
  console.log('TIMESTAMP:', new Date().toISOString())
  try {
    const res = await prisma.product.findMany({
      select: { name: true },
      take: 1
    })
    console.log('SUCCESS: Name found:', res[0]?.name)
  } catch (e: any) {
    console.error('FAIL:', e.message)
  }
  console.log('--- TEST RUN END ---')
}

main().finally(() => prisma.$disconnect())
