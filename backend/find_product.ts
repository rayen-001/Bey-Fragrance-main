import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: {
      name: { contains: 'YSL Y', mode: 'insensitive' }
    },
    include: {
      shippingMethods: true
    }
  })
  console.log('Results:', JSON.stringify(products, null, 2))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
}).finally(() => prisma.$disconnect())
