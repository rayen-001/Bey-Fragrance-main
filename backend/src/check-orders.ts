import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const orders = await prisma.order.findMany()
  console.log('📦 Total Orders in DB:', orders.length)
  if (orders.length > 0) {
    console.log('Sample Order:', JSON.stringify(orders[0], null, 2))
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
