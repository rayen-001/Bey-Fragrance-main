import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const all = await prisma.product.findMany({
    take: 5
  })
  console.log('Results:', all.map(p => p.name).join(', '))
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
