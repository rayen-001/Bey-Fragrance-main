import { Context, Next } from 'hono'
import { getSupabase } from '../db/supabase'

/**
 * JWT Authentication & Role-Based Access Control Middleware using Supabase SDK.
 * This is more reliable than manual JWT parsing as it handles algorithm changes automatically.
 */
export const authMiddleware = async (c: Context, next: Next) => {
  if (c.req.method === 'OPTIONS') return next()

  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Authorization required' }, 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    // 1. Verify with Supabase (Handles HS256/ES256 automatically via their API)
    const { data: { user }, error } = await getSupabase().auth.getUser(token)

    if (error || !user) {
      console.warn(`[Auth] token verification failed: ${error?.message || 'No user found'}`)
      return c.json({ success: false, error: 'Invalid or expired session' }, 401)
    }

    // 2. Populate payload for downstream use
    const role = (user.app_metadata?.role || user.user_metadata?.role || 'customer').toLowerCase()
    const payload = {
      userId: user.id,
      sub: user.id,
      email: user.email,
      role: role,
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata
    }
    
    c.set('jwtPayload', payload)
    console.log(`[Auth] User Vertified: ${user.email} (Role: ${role})`)

    // 3. RBAC (Role Based Access Control)
    const method = c.req.method
    // NOTE: Inside a mounted sub-router, Hono strips the mount prefix.
    // e.g. a request to /orders/my has path '/my' inside the orders router,
    // and a request to /orders has path '/' inside the orders router.
    // Use c.req.url or the raw path for global middleware checks.
    const rawPath = new URL(c.req.url).pathname
    
    // Admin-only: GET /orders (all orders list) — raw path is exactly '/orders'
    const isAdminOrdersList = method === 'GET' && rawPath === '/orders'

    // Admin-only: fragrances mutations (POST/PUT/DELETE)
    const isFragranceMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
      && rawPath.startsWith('/fragrances')

    // Admin-only: order status updates (PUT /orders/:id)
    const isOrderMutation = ['PUT', 'DELETE'].includes(method)
      && rawPath.startsWith('/orders')
      && rawPath !== '/orders'
      && !rawPath.endsWith('/my')

    if (isAdminOrdersList || isFragranceMutation || isOrderMutation) {
      if (role !== 'admin') {
        console.warn(`[Auth] FORBIDDEN: User ${user.email} (role: ${role}) tried ${method} ${rawPath}`)
        return c.json({ success: false, error: 'Forbidden: Admin access required' }, 403)
      }
    }

    await next()
  } catch (err: any) {
    console.error(`[Auth] Middleware Crash:`, err)
    return c.json({ success: false, error: 'Internal Authentication Error' }, 500)
  }
}
