import { Hono } from 'hono'
import { prisma } from '../db/prisma.js'
import { authMiddleware } from '../middleware/auth.js'
import { z } from 'zod'

const favorites = new Hono<{
  Variables: {
    jwtPayload: any
  }
}>()

// All favorites routes are protected
favorites.use('*', authMiddleware)

const favoriteSchema = z.object({
  productId: z.string().uuid()
})

// 1. POST /favorites: Add a bottle to user's list
favorites.post('/', async (c) => {
  try {
    const userId = c.get('jwtPayload').userId
    const body = await c.req.json()
    const validation = favoriteSchema.safeParse(body)
    
    if (!validation.success) {
      return c.json({ success: false, error: 'Valid Product ID is required' }, 400)
    }

    const { productId } = validation.data

    // Check if fragrance exists
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return c.json({ success: false, error: 'Fragrance not found' }, 404)
    }

    // Toggle logic: If already favorited, remove it; else, add it.
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    })

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      })
      return c.json({ success: true, message: 'Removed from favorites' })
    }

    await prisma.favorite.create({
      data: { userId, productId }
    })

    return c.json({ success: true, message: 'Added to favorites' }, 201)
  } catch (error) {
    console.error('Error handling favorite:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 2. GET /favorites: Get logged-in user's fragrances
favorites.get('/', async (c) => {
  try {
    const userId = c.get('jwtPayload').userId
    
    const likedFragrances = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            mainImage: true,
            category: true
          }
        }
      }
    })

    // Extract products from the pivot relation
    const products = likedFragrances.map((f: any) => f.product)

    return c.json({ 
      success: true, 
      count: products.length, 
      data: products 
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

export default favorites
