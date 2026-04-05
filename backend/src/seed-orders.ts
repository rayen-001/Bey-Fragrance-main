import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding sample orders...')

  // Clear existing orders first
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()

  // Get a product to associate with orders
  const product = await prisma.product.findFirst()
  if (!product) {
    console.error('❌ No products found in DB. Please seed fragrances first.')
    return
  }

  // Create a sample order
  const order = await prisma.order.create({
    data: {
      clientName: 'Jane Smith',
      shippingAddress: '123 Luxury Ave, Tunis',
      totalAmount: 250.00,
      status: 'Pending',
      items: {
        create: [
          {
            productId: product.id,
            quantity: 2,
            unitPrice: product.price
          }
        ]
      }
    }
  })

  console.log('✅ Seeded 1 sample order:', order.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
