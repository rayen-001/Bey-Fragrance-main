import { Hono } from 'hono'
import { prisma } from '../db/prisma'
import { authMiddleware } from '../middleware/auth'
import { z } from 'zod'

const cart = new Hono<{
  Variables: {
    jwtPayload: any
  }
}>()

// All cart routes are protected
cart.use('*', authMiddleware)

const cartItemSchema = z.object({
  productId: z.string().min(1),
  shippingMethodId: z.string().min(1).nullable().optional().transform(v => v || null),
  quantity: z.number().int().positive().default(1)
})

const syncSchema = z.array(z.object({
  productId: z.string().min(1),
  shippingMethodId: z.string().min(1).nullable().optional().transform(v => v || null),
  quantity: z.number().int().positive()
}))

// 1. GET /cart: Fetch user's cart items
cart.get('/', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any
    const userId = payload?.userId

    if (!userId) {
      return c.json({ success: false, error: 'User ID not found in token' }, 401)
    }

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
        shippingMethod: true
      }
    })

    return c.json({
      success: true,
      data: items.filter((item: any) => item.product).map((item: any) => ({
        id: item.product.id,
        cartItemId: item.id,
        name: item.product.name,
        price: item.shippingMethod ? item.shippingMethod.price.toString() + ' TND' : item.product.price.toString() + ' TND',
        image: item.product.mainImage,
        quantity: item.quantity,
        size: item.shippingMethod ? item.shippingMethod.name : '50ml',
        shippingMethodId: item.shippingMethodId,
        notes: (Array.isArray(item.product.notes) ? item.product.notes.join(', ') : '')
      }))
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 2. POST /cart: Add or update item in cart
cart.post('/', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any
    const userId = payload?.userId
    const body = await c.req.json()
    const validation = cartItemSchema.safeParse(body)

    if (!validation.success) {
      return c.json({ success: false, error: 'Valid Product ID and quantity are required' }, 400)
    }

    const { productId, quantity, shippingMethodId } = validation.data

    // Check if fragrance exists
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return c.json({ success: false, error: 'Fragrance not found' }, 404)
    }

    // Upsert logic: Increment quantity if exists, else create
    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId_shippingMethodId: {
          userId,
          productId,
          shippingMethodId: (shippingMethodId || null) as any

        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId,
        productId,
        quantity,
        shippingMethodId: shippingMethodId || null
      }
    })

    return c.json({ success: true, data: item })
  } catch (error) {
    console.error('Error handling cart item:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 3. DELETE /cart/:productId: Remove item from cart
cart.delete('/:productId', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any
    const userId = payload?.userId
    const productId = c.req.param('productId')
    const { shippingMethodId } = c.req.query()

    // Use deleteMany to avoid error 404 if record missing
    await prisma.cartItem.deleteMany({
      where: {
        userId,
        productId,
        shippingMethodId: (shippingMethodId === 'null' ? null : (shippingMethodId || undefined)) as string | null | undefined
      }
    })

    return c.json({ success: true, message: 'Removed from cart' })
  } catch (error) {
    console.error('Error removing cart item:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 4. PUT /cart/sync: Sync entire cart (e.g. from local storage)
cart.put('/sync', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any
    const userId = payload?.userId
    const body = await c.req.json()
    const validation = syncSchema.safeParse(body)

    if (!validation.success) {
      return c.json({ success: false, error: 'Invalid sync data format' }, 400)
    }

    const itemsToSync = validation.data

    // Clear existing cart and replace with new items
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { userId } }),
      prisma.cartItem.createMany({
        data: itemsToSync.map((item: any) => ({
          userId,
          productId: item.productId,
          shippingMethodId: item.shippingMethodId || null,
          quantity: item.quantity
        }))
      })
    ])

    return c.json({ success: true, message: 'Cart synced' })
  } catch (error) {
    console.error('Error syncing cart:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

export default cart
