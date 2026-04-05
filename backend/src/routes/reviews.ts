import { Hono } from 'hono'
import { prisma } from '../db/prisma.js'
import { getSupabase } from '../db/supabase.js'

const reviews = new Hono()

// GET /reviews/:productId — Fetch all reviews for a product
reviews.get('/:productId', async (c) => {
  const productId = c.req.param('productId')

  try {
    const productReviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { fullName: true, email: true }
        }
      }
    })

    const formatted = productReviews.map(r => ({
      id: r.id,
      userId: r.userId,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      userName: r.user?.fullName || r.user?.email?.split('@')[0] || 'Anonymous'
    }))

    return c.json({ success: true, reviews: formatted })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// POST /reviews — Submit a star rating (authenticated)
reviews.post('/', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const token = authHeader.split(' ')[1]
  let userId: string | null = null
  let userEmail: string | null = null
  let userFullName: string | null = null

  try {
    const { data: { user }, error } = await getSupabase().auth.getUser(token)
    if (error || !user) {
      return c.json({ success: false, error: 'Invalid token' }, 401)
    }
    userId = user.id
    userEmail = user.email || ''
    userFullName = user.user_metadata?.full_name || user.user_metadata?.name || null
  } catch {
    return c.json({ success: false, error: 'Auth error' }, 401)
  }

  const { productId, rating, comment } = await c.req.json()

  if (!productId || !rating || rating < 1 || rating > 5) {
    return c.json({ success: false, error: 'productId and rating (1-5) are required' }, 400)
  }

  try {
    // Ensure user exists in local users table (FK constraint)
    await prisma.user.upsert({
      where: { id: userId! },
      create: {
        id: userId!,
        email: userEmail!,
        password: 'EXTERNAL_AUTH',
        fullName: userFullName || userEmail!.split('@')[0],
        role: 'CUSTOMER',
      },
      update: {}
    })

    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: { productId, userId: userId! }
    })

    let review
    if (existing) {
      // Update existing review
      review = await prisma.review.update({
        where: { id: existing.id },
        data: { rating: Math.round(rating), comment: comment || null }
      })
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          productId,
          userId: userId!,
          rating: Math.round(rating),
          comment: comment || null
        }
      })
    }

    // Recalculate product rating & reviewCount
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true }
    })
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 100) / 100,
        reviewCount: allReviews.length
      }
    })

    return c.json({ success: true, review })
  } catch (error) {
    console.error('Error creating review:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

export default reviews
