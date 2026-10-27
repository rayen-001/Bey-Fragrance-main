import { Hono, Context, Next } from 'hono'
import { z } from 'zod'
import { prisma } from '../db/prisma'
import { authMiddleware } from '../middleware/auth'

const offers = new Hono()

const MAX_PRODUCTS = 10
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const offerSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title').max(120),
  slug: z.string().trim().toLowerCase().min(2, 'Link name is too short').max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Link name can only use letters, numbers and dashes'),
  productIds: z.array(z.string().regex(UUID_PATTERN, 'Invalid product'))
    .min(1, 'Pick at least one product')
    .max(MAX_PRODUCTS, `Pick at most ${MAX_PRODUCTS} products`),
  isActive: z.boolean().optional()
})

// authMiddleware only enforces admin on specific paths, so offer admin routes check the DB role here
const requireAdmin = async (c: Context, next: Next) => {
  const payload = c.get('jwtPayload') as any
  if (payload?.role !== 'admin') {
    return c.json({ success: false, error: 'Forbidden: Admin access required' }, 403)
  }
  await next()
}

const validationError = (error: z.ZodError) => error.issues[0]?.message || 'Invalid offer'

// Only the fields the landing page needs; sizes come from shipping_methods (the real size/price rows)
const toPublicProduct = (p: any) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  inspiredBy: p.inspiredBy,
  category: p.category,
  concentration: p.concentration,
  mainImage: p.mainImage,
  price: Number(p.price),
  sizes: (p.shippingMethods || [])
    .map((m: any) => ({ id: m.id, name: m.name, price: Number(m.price) }))
    .sort((a: any, b: any) => a.price - b.price)
})

const ensureProductsExist = async (productIds: string[]) => {
  const found = await prisma.product.count({ where: { id: { in: productIds } } })
  return found === productIds.length
}

// 1. GET /offers: List all offer links with stats (Admin only)
offers.get('/', authMiddleware, requireAdmin, async (c) => {
  try {
    const list = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        products: {
          orderBy: { position: 'asc' },
          include: { product: { select: { id: true, name: true, mainImage: true } } }
        },
        _count: { select: { orders: true } }
      }
    })

    const data = list.map(o => ({
      id: o.id,
      slug: o.slug,
      title: o.title,
      isActive: o.isActive,
      visitCount: o.visitCount,
      orderCount: o._count.orders,
      createdAt: o.createdAt.toISOString(),
      products: o.products.map(op => op.product)
    }))

    return c.json({ success: true, offers: data })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 2. POST /offers: Create an offer link (Admin only)
offers.post('/', authMiddleware, requireAdmin, async (c) => {
  const parsed = offerSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ success: false, error: validationError(parsed.error) }, 400)
  }

  const { title, slug, isActive } = parsed.data
  const productIds = [...new Set(parsed.data.productIds)]

  try {
    if (!(await ensureProductsExist(productIds))) {
      return c.json({ success: false, error: 'Some products no longer exist' }, 400)
    }

    const offer = await prisma.offer.create({
      data: {
        title,
        slug,
        isActive: isActive ?? true,
        products: { create: productIds.map((productId, position) => ({ productId, position })) }
      }
    })

    console.log(`[Offers] Created offer "${offer.slug}" with ${productIds.length} products`)
    return c.json({ success: true, offer }, 201)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return c.json({ success: false, error: 'That link name is already taken' }, 409)
    }
    console.error('Error creating offer:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 3. PUT /offers/:id: Edit title, link name, products, or turn the link on/off (Admin only)
offers.put('/:id', authMiddleware, requireAdmin, async (c) => {
  const id = c.req.param('id') || ''
  if (!UUID_PATTERN.test(id)) {
    return c.json({ success: false, error: 'Offer not found' }, 404)
  }

  const parsed = offerSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ success: false, error: validationError(parsed.error) }, 400)
  }

  const { title, slug, isActive } = parsed.data
  const productIds = parsed.data.productIds ? [...new Set(parsed.data.productIds)] : undefined

  try {
    if (productIds && !(await ensureProductsExist(productIds))) {
      return c.json({ success: false, error: 'Some products no longer exist' }, 400)
    }

    const offer = await prisma.$transaction(async (tx) => {
      if (productIds) {
        await tx.offerProduct.deleteMany({ where: { offerId: id } })
      }
      return tx.offer.update({
        where: { id },
        data: {
          title,
          slug,
          isActive,
          ...(productIds && {
            products: { create: productIds.map((productId, position) => ({ productId, position })) }
          })
        }
      })
    })

    return c.json({ success: true, offer })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return c.json({ success: false, error: 'Offer not found' }, 404)
    }
    if (error?.code === 'P2002') {
      return c.json({ success: false, error: 'That link name is already taken' }, 409)
    }
    console.error('Error updating offer:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 4. DELETE /offers/:id: Delete a link; its orders stay (offer_id is set to NULL by the DB) (Admin only)
offers.delete('/:id', authMiddleware, requireAdmin, async (c) => {
  const id = c.req.param('id') || ''
  if (!UUID_PATTERN.test(id)) {
    return c.json({ success: false, error: 'Offer not found' }, 404)
  }

  try {
    await prisma.offer.delete({ where: { id } })
    return c.json({ success: true, message: 'Offer deleted' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return c.json({ success: false, error: 'Offer not found' }, 404)
    }
    console.error('Error deleting offer:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 5. GET /offers/:slug: Public landing page data (only while the link is on)
offers.get('/:slug', async (c) => {
  const slug = c.req.param('slug').toLowerCase()
  try {
    const offer = await prisma.offer.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { position: 'asc' },
          include: { product: { include: { shippingMethods: true } } }
        }
      }
    })

    if (!offer || !offer.isActive) {
      return c.json({ success: false, error: 'This offer has ended' }, 404)
    }

    return c.json({
      success: true,
      offer: {
        id: offer.id,
        slug: offer.slug,
        title: offer.title,
        products: offer.products.map(op => toPublicProduct(op.product))
      }
    })
  } catch (error) {
    console.error('Error fetching offer:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 6. POST /offers/:slug/visit: Count one visit (the landing page calls this once per browser session)
offers.post('/:slug/visit', async (c) => {
  const slug = c.req.param('slug').toLowerCase()
  try {
    await prisma.offer.updateMany({
      where: { slug, isActive: true },
      data: { visitCount: { increment: 1 } }
    })
    return c.json({ success: true })
  } catch (error) {
    console.error('Error counting offer visit:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

export default offers
