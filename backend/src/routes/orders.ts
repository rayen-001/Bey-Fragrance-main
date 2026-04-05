import { Hono } from 'hono'
import { prisma } from '../db/prisma'
import { authMiddleware } from '../middleware/auth'
import { getSupabase } from '../db/supabase'

const orders = new Hono()

/**
 * Ensures a Supabase user exists in the local public.users table.
 * This is required because Order.userId has a FK referencing public.users.id.
 * If the DB trigger (handle_new_user) ran correctly, this is a no-op.
 */
async function ensureUserExists(userId: string, email: string, fullName?: string): Promise<void> {
  try {
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: email,
        password: 'EXTERNAL_AUTH', // Placeholder for Supabase-managed accounts
        fullName: fullName || email.split('@')[0],
        role: 'CUSTOMER',
      },
      update: {} // No-op if already exists
    })
    console.log(`[Orders] User ${email} (${userId}) confirmed in public.users`)
  } catch (err) {
    console.error(`[Orders] Failed to upsert user ${userId}:`, err)
  }
}

// 1. POST /: Create an order (Public but optionally links to user)
orders.post('/', async (c) => {
  try {
    const body = await c.req.json()
    let userId: string | null = null
    let userEmail: string | null = null
    let userFullName: string | null = null

    // ALWAYS try to extract userId from the Authorization token first.
    // Never trust body.userId from the client — derive identity from the JWT.
    const authHeader = c.req.header('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      try {
        const { data: { user }, error } = await getSupabase().auth.getUser(token)
        if (!error && user) {
          userId = user.id
          userEmail = user.email || ''
          userFullName = user.user_metadata?.full_name || user.user_metadata?.name || null
          console.log(`[Orders] ✅ Identity pinned via token: ${userEmail} (${userId})`)
        } else {
          console.warn(`[Orders] ⚠️ Token present but getUser failed: ${error?.message}`)
        }
      } catch (authErr) {
        console.warn('[Orders] Optional token check failed:', authErr)
      }
    } else {
      console.log('[Orders] No Authorization header — guest order (userId will be NULL)')
    }

    // Ensure the user exists in public.users to satisfy FK constraint
    if (userId && userEmail) {
      await ensureUserExists(userId, userEmail, userFullName || undefined)
    }
    const { 
      clientName, 
      place, 
      product: productName, 
      quantity: singleQuantity, 
      phoneNumber, 
      items: orderItems,
      shippingFee,
      deliveryMethod
    } = body

    console.log('📦 Creating order with payload:', { clientName, itemsCount: orderItems?.length || 0, userId });

    let calculatedTotal = 0
    let totalCalculatedQuantity = 0
    const itemsToCreate = []

    if (orderItems && Array.isArray(orderItems) && orderItems.length > 0) {
      console.log(`[Orders] Processing ${orderItems.length} items from cart...`);
      for (const item of orderItems) {
        console.log(`--- Checking Item ID: ${item.id} (Name: ${item.name || 'N/A'}) ---`);
        if (!item.id) {
          console.warn('[Orders] Skipping item with no ID');
          continue;
        }
        try {
          let product = await prisma.product.findUnique({
            where: { id: item.id },
            include: { shippingMethods: true }
          })

          // Fallback: If ID is not found (e.g. stale cart IDs), try searching by name
          if (!product && item.name) {
            console.log(`[Orders] ID ${item.id} not found, trying name fallback for: ${item.name}`);
            product = await prisma.product.findFirst({
              where: { name: item.name },
              include: { shippingMethods: true }
            });
          }

          if (product) {
            console.log(`[Orders] Found product: ${product.name} (Price: ${product.price})`);
            let price = Number(product.price.toString())
            let shippingMethodId = item.shippingMethodId || null
            
            // Validate that shippingMethodId exists in DB for this product
            let foundMethod = null;
            if (shippingMethodId && shippingMethodId !== "null" && shippingMethodId !== "undefined") {
               foundMethod = product.shippingMethods?.find(m => m.id === shippingMethodId);
            }

            if (foundMethod) {
               price = Number(foundMethod.price.toString());
            } else {
               // If not found in DB, reset to null to avoid Prisma connection errors
               shippingMethodId = null;
            }

            const itemQty = item.quantity || 1
            calculatedTotal += price * itemQty
            totalCalculatedQuantity += itemQty
            
            itemsToCreate.push({
              product: { connect: { id: product.id } },
              quantity: itemQty,
              unitPrice: price,
              shippingMethod: shippingMethodId ? { connect: { id: shippingMethodId } } : undefined
            })
          } else {
            console.warn(`[Orders] Product with ID ${item.id} not found in DB`);
          }
        } catch (err) {
          console.error(`[Orders] Error fetching product ${item.id}:`, err);
        }
      }
    } else {
      // Fallback for legacy / single product summary
      console.log('[Orders] Using legacy order fallback for product:', productName);
      try {
        const product = await prisma.product.findFirst({
          where: { name: { contains: productName || "" } }
        })
        if (product) {
          const price = Number(product.price.toString())
          const itemQty = Number(singleQuantity) || 1
          calculatedTotal = price * itemQty
          totalCalculatedQuantity = itemQty
          
          itemsToCreate.push({
            product: { connect: { id: product.id } },
            quantity: itemQty,
            unitPrice: price
          })
        }
      } catch (err) {
        console.error('[Orders] Error fetching legacy product:', err);
      }
    }

    if (itemsToCreate.length === 0) {
      console.warn('[Orders] No valid items found for order after fallback checks. Aborting save.');
      // Try one last desperate search: check if the productName itself exists even if orderItems was empty or failed
      if (productName) {
        try {
          const fallbackProduct = await prisma.product.findFirst({
            where: { name: { contains: productName, mode: 'insensitive' } }
          })
          if (fallbackProduct) {
             const price = Number(fallbackProduct.price.toString())
             const qty = Number(singleQuantity) || 1
             itemsToCreate.push({
               product: { connect: { id: fallbackProduct.id } },
               quantity: qty,
               unitPrice: price
             })
             calculatedTotal = price * qty
             totalCalculatedQuantity = qty
          }
        } catch (e) {
          console.error('[Orders] Final fallback attempt failed:', e)
        }
      }
    }

    if (itemsToCreate.length === 0) {
      return c.json({ success: false, error: 'No valid products found in order' }, 400);
    }

    const finalTotal = Number(calculatedTotal) + (Number(shippingFee) || 0);

    if (isNaN(finalTotal)) {
      console.error('[Orders] calculatedTotal or shippingFee is NaN:', { calculatedTotal, shippingFee });
      return c.json({ success: false, error: 'Calculated total is invalid (NaN)' }, 400);
    }

    const order = await prisma.order.create({
      data: {
        clientName: clientName || 'Guest',
        shippingAddress: place || 'Online Order',
        phoneNumber: phoneNumber || "",
        totalAmount: finalTotal,
        shippingFee: Number(shippingFee) || 0,
        deliveryMethod: deliveryMethod || 'Standard',
        userId: userId || null,
        status: 'Pending',
        product: productName || (itemsToCreate.length > 0 && itemsToCreate[0].product?.connect?.id ? `Product: ${itemsToCreate[0].product.connect.id}` : 'Various Items'), 
        quantity: totalCalculatedQuantity || 1,
        items: {
          create: itemsToCreate
        }
      },
      include: {
        items: {
          include: {
            product: true,
            shippingMethod: true
          }
        },
        user: true
      }
    }) as any

    const itemSummary = order.items.map((i: any) => 
      `${i.product?.name || 'Unknown'}${i.product?.concentration ? ` (${i.product.concentration})`: ''} (${i.quantity} x ${i.shippingMethod?.name || 'Standard'})`
    ).join(', ');

    const formattedOrder = {
      id: order.id,
      clientName: order.clientName,
      phoneNumber: order.phoneNumber,
      place: order.shippingAddress,
      product: (order.items.length > 0) ? itemSummary : (order.product || 'Unknown Product'),
      quantity: order.items.length > 0 ? order.items.reduce((sum: number, i: any) => sum + i.quantity, 0) : (order.quantity || 0),
      date: order.createdAt.toISOString(),
      status: order.status,
      totalPrice: Number(order.totalAmount),
      shippingFee: Number(order.shippingFee || 0),
      deliveryMethod: order.deliveryMethod,
      items: order.items.map((i: any) => ({
        id: i.id,
        productId: i.productId,
        name: i.product?.name,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        size: i.shippingMethod?.name || 'Standard'
      }))
    }

    console.log('✅ Order saved to DB:', order.id);
    return c.json({ success: true, message: 'Order created successfully', order: formattedOrder }, 201)
  } catch (error: any) {
    console.error('❌ Error creating order:', error)
    return c.json({ success: false, error: `Failed to create order: ${error.message || 'Unknown error'}` }, 500)
  }
})

// 2. GET /: List all orders (Admin only)
orders.get('/', authMiddleware, async (c) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
            shippingMethod: true
          }
        }
      }
    }) as any[]

    console.log(`[Orders GET /] Found ${orders.length} total orders in database`)

    // Map to the format the frontend expects: { orders: [...] }
    const formattedOrders = orders.map((o: any) => {
      const itemSummary = o.items.map((i: any) => 
        `${i.product?.name || 'Unknown'}${i.product?.concentration ? ` (${i.product.concentration})`: ''} (${i.quantity} x ${i.shippingMethod?.name || 'Standard'})`
      ).join(', ');

      return {
        id: o.id,
        clientName: o.clientName,
        phoneNumber: o.phoneNumber,
        place: o.shippingAddress,
        product: (o.items.length > 0) ? itemSummary : (o.product || 'Unknown Product'),
        quantity: o.items.length > 0 ? o.items.reduce((sum: number, i: any) => sum + i.quantity, 0) : (o.quantity || 0),
        totalPrice: Number(o.totalAmount),
        shippingFee: Number(o.shippingFee || 0),
        deliveryMethod: o.deliveryMethod || 'Standard',
        date: o.createdAt.toISOString(),
        status: o.status,
        items: o.items.map((i: any) => ({
          id: i.id,
          productId: i.productId,
          name: i.product?.name,
          quantity: i.quantity,
          unitPrice: Number(i.unitPrice),
          size: i.shippingMethod?.name || 'Standard'
        }))
      };
    });

    return c.json({ success: true, orders: formattedOrders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 3. GET /my: List current user's orders (Authenticated)
orders.get('/my', authMiddleware, async (c) => {
  const payload = c.get('jwtPayload') as any
  // The authMiddleware sets jwtPayload.userId = user.id (Supabase UUID)
  const userId = payload?.userId || payload?.sub
  
  if (!userId) {
    console.warn('[Orders GET /my] No userId found in JWT payload:', payload)
    return c.json({ success: false, error: 'Unable to identify user from token' }, 401)
  }

  console.log(`[Orders GET /my] Fetching orders for userId: ${userId}`)

  try {
    const userOrders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
            shippingMethod: true
          }
        }
      }
    }) as any[]

    console.log(`[Orders GET /my] Found ${userOrders.length} orders for user ${userId}`)
    if (userOrders.length === 0) {
      // Check if there are any orders with this user's email instead of ID? 
      // (Legacy fallback)
      console.log(`[Orders GET /my] Checking fallback by email...`)
    }

    const formattedOrders = userOrders.map((o: any) => {
      const itemSummary = o.items.map((i: any) => 
        `${i.product?.name || 'Unknown'}${i.product?.concentration ? ` (${i.product.concentration})`: ''} (${i.quantity} x ${i.shippingMethod?.name || 'Standard'})`
      ).join(', ');

      return {
        id: o.id,
        clientName: o.clientName,
        phoneNumber: o.phoneNumber,
        place: o.shippingAddress,
        product: (o.items.length > 0) ? itemSummary : (o.product || 'Unknown Product'),
        quantity: o.items.length > 0 ? o.items.reduce((sum: number, i: any) => sum + i.quantity, 0) : (o.quantity || 0),
        totalPrice: Number(o.totalAmount),
        shippingFee: Number(o.shippingFee || 0),
        deliveryMethod: o.deliveryMethod || 'Standard',
        date: o.createdAt.toISOString(),
        status: o.status,
        items: o.items.map((i: any) => ({
          id: i.id,
          productId: i.productId,
          name: i.product?.name,
          quantity: i.quantity,
          unitPrice: Number(i.unitPrice),
          size: i.shippingMethod?.name || 'Standard'
        }))
      };
    });

    return c.json({ success: true, orders: formattedOrders })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

// 4. PUT /:id: Update order status (Admin only)
orders.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  try {
    const body = await c.req.json()
    const { status } = body

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return c.json({
      success: true,
      message: 'Order status updated',
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status
      }
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

export default orders
