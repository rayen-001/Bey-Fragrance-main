import { Hono } from 'hono'
import { prisma } from '../db/prisma'
import { z } from 'zod'
import { getSupabase } from '../db/supabase'

const fragrances = new Hono()

// const DEFAULT_IMAGE = "https://placehold.co/400x600?text=Fragrance+Photo"

// Zod schema for stock update validation
const stockUpdateSchema = z.object({
  amount: z.number().int(),
  type: z.enum(['increment', 'decrement'])
})

// 1. GET /fragrances: List all fragrances with categories and filters
fragrances.get('/', async (c) => {
  try {
    const { category, note, price_max, q, type } = c.req.query()

    // Construct Prisma where clause
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (type) {
      where.productType = type
    }

    // Search across name and inspiredBy
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { inspiredBy: { contains: q, mode: 'insensitive' } }
      ];
    }

    if (note) {
      where.notes = {
        has: note
      }
    }

    if (price_max) {
      where.price = {
        lte: parseFloat(price_max)
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        shippingMethods: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Check for user_rating if authenticated
    const authHeader = c.req.header('Authorization')
    let userId: string | null = null
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      try {
        const { data: { user } } = await getSupabase().auth.getUser(token)
        userId = user?.id || null
      } catch (e) {
        // ignore auth error for list
      }
    }

    let userRatings: Record<string, number> = {}
    if (userId) {
      const dbReviews = await prisma.review.findMany({
        where: {
          userId,
          productId: { in: products.map(p => p.id) }
        },
        select: {
          productId: true,
          rating: true
        }
      })
      dbReviews.forEach(r => {
        userRatings[r.productId] = r.rating
      })
    }

    const data = products.map(p => ({
      ...p,
      userRating: userRatings[p.id] || null
    }))

    return c.json({ success: true, count: data.length, data })
  } catch (error) {
    console.error('Error fetching fragrances:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 2. GET /fragrances/:id: Details for a specific bottle
fragrances.get('/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        shippingMethods: true
      }
    })

    if (!product) {
      return c.json({ success: false, error: 'Fragrance not found' }, 404)
    }

    // Check for user_rating
    const authHeader = c.req.header('Authorization')
    let user_rating: number | null = null
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      try {
        const { data: { user } } = await getSupabase().auth.getUser(token)
        if (user) {
          const rating = await prisma.review.findFirst({
            where: {
              userId: user.id,
              productId: product.id
            },
            select: { rating: true }
          })
          user_rating = rating?.rating || null
        }
      } catch (e) {
        // ignore auth error
      }
    }

    const data = {
      ...product,
      userRating: user_rating
    }

    return c.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching fragrance:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 3. PATCH /fragrances/:id/stock: Protected route, update stock_quantity
// Note: We use a custom auth middleware placeholder as specified in requirements
fragrances.patch('/:id/stock', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()

  // Validate the body
  const validationResult = stockUpdateSchema.safeParse(body)
  if (!validationResult.success) {
    return c.json({ success: false, error: validationResult.error.format() }, 400)
  }

  const { amount, type } = validationResult.data

  try {
    // Critical: Use a Prisma Transaction to ensure stock doesn't go below zero
    // This is an interactive transaction to handle logic before update
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Fetch current stock
      const product = await tx.product.findUnique({
        where: { id },
        select: { stockQuantity: true }
      })

      if (!product) {
        throw new Error('ProductNotFound')
      }

      // 2. Check if subtraction would result in stock < 0
      if (type === 'decrement' && product.stockQuantity < amount) {
        throw new Error('InsufficientStock')
      }

      // 3. Perform atomic update
      return tx.product.update({
        where: { id },
        data: {
          stockQuantity: {
            increment: type === 'increment' ? amount : -amount
          }
        }
      })
    })

    return c.json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        newStock: updatedProduct.stockQuantity
      }
    })
  } catch (error: any) {
    console.error('Stock update transaction failed:', error.message)

    if (error.message === 'ProductNotFound') {
      return c.json({ success: false, error: 'Fragrance not found' }, 404)
    }

    if (error.message === 'InsufficientStock') {
      return c.json({ success: false, error: 'Insufficient stock availability' }, 400)
    }

    return c.json({ success: false, error: 'Failed to update stock' }, 500)
  }
})

// Zod schema for new fragrance registration
const fragranceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  category: z.string(),
  genderCategory: z.string().optional(),
  concentration: z.string().optional(),
  gender: z.string().optional(),
  brand: z.string().default('Hama Fragrance'),
  mainImage: z.string().url().nullable().optional(),
  galleryImages: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional().default([]),
  inspiredBy: z.string().optional(),
  stockQuantity: z.number().int().default(0),
  sizes: z.array(z.any()).optional(),
  productType: z.enum(['extrait_parfum', 'original_parfum', 'accessoire']).default('extrait_parfum'),
})

// 4. POST /: Create a new fragrance (Admin restricted)
fragrances.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validation = fragranceSchema.safeParse(body)

    if (!validation.success) {
      return c.json({ success: false, error: validation.error.format() }, 400)
    }

    const newFragrance = await prisma.product.create({
      data: validation.data
    })

    // Auto-create standard shipping methods for new products
    await prisma.shippingMethod.createMany({
      data: [
        { name: '50ml', price: 25, productId: newFragrance.id },
        { name: '100ml', price: 35, productId: newFragrance.id }
      ]
    })

    return c.json({
      success: true,
      message: 'Fragrance created with standard 50ml/100ml sizes',
      data: newFragrance
    }, 201)
  } catch (error) {
    console.error('Error creating fragrance:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})
// 5. PUT /:id: Update a fragrance (Admin restricted)
fragrances.put('/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const body = await c.req.json()

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return c.json({ success: false, error: 'Fragrance not found' }, 404)
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        genderCategory: body.genderCategory,
        concentration: body.concentration,
        gender: body.gender,
        brand: body.brand,
        mainImage: body.mainImage,
        galleryImages: body.galleryImages,
        tags: body.tags,
        notes: body.notes,
        inspiredBy: body.inspiredBy,
        stockQuantity: body.stockQuantity,
        sizes: body.sizes,
        // productType: body.productType,
      }
    })

    return c.json({ success: true, message: 'Fragrance updated', data: updated })
  } catch (error) {
    console.error('Error updating fragrance:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 6. DELETE /:id: Delete a fragrance (Admin restricted)
fragrances.delete('/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return c.json({ success: false, error: 'Fragrance not found' }, 404)
    }

    await prisma.product.delete({ where: { id } })

    return c.json({ success: true, message: 'Fragrance deleted' })
  } catch (error) {
    console.error('Error deleting fragrance:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

export default fragrances
