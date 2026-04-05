import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const product = await prisma.product.findFirst()
  if (!product) {
    console.log('No products found to create order')
    return
  }

  console.log('Using product:', product.id)

  try {
    const order = await prisma.order.create({
      data: {
        clientName: 'Test User',
        shippingAddress: 'Test Address',
        phoneNumber: '12345678',
        totalAmount: product.price,
        userId: null,
        status: 'Pending',
        items: {
          create: [{
            productId: product.id,
            quantity: 1,
            unitPrice: product.price
          }]
        }
      }
    })
    console.log('Order created successfully:', order.id)
  } catch (error) {
    console.error('Error creating order:', error)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
