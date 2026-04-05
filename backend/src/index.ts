import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'

import fragrances from './routes/fragrances'
import auth from './routes/auth'
import upload from './routes/upload'
import favorites from './routes/favorites'
import orders from './routes/orders'
import analytics from './routes/analytics'
import cart from './routes/cart'
import reviews from './routes/reviews'
import { authMiddleware } from './middleware/auth'
import { prisma } from './db/prisma'

const app = new Hono()

// --- 1. Global Middleware ---
app.use('*', logger())

// Updated CORS to allow frontend communication and JWT headers
const productionOrigins = (process.env.FRONTEND_URL || '').split(',').filter(Boolean)
const allowedOrigins = [
  ...productionOrigins,
  'http://localhost:8080', 
  'http://localhost:5173',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5173',
].filter(Boolean) as string[]

app.use('*', cors({
  origin: allowedOrigins,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))

// --- 2. Public Routes ---
// These must be accessible without a token
app.get('/', (c) => {
  return c.json({
    message: 'Hello World from Hama Parfum Backend!',
    status: 'success'
  })
})

// Mount Auth (Login/Signup)
app.route('/auth', auth)

// --- 3. Protected Routes & Middleware ---
// Apply authMiddleware specifically to routes that require a logged-in user or admin

// Favorites, Uploads, and Analytics always require authentication
app.use('/favorites/*', authMiddleware)
app.use('/cart/*', authMiddleware)
app.use('/upload/*', authMiddleware)
app.use('/analytics/*', authMiddleware)

// Admin Protection for Fragrances and Orders:
// Fragrances: POST, PUT, DELETE require admin
// Orders: GET (all) and PUT (status) require admin
app.use('/fragrances', async (c, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(c.req.method)) {
    return authMiddleware(c, next)
  }
  await next()
})

app.use('/fragrances/:id', async (c, next) => {
  if (['PUT', 'DELETE'].includes(c.req.method)) {
    return authMiddleware(c, next)
  }
  await next()
})

app.use('/orders', async (c, next) => {
  if (['GET', 'PUT'].includes(c.req.method)) {
    return authMiddleware(c, next)
  }
  await next()
})

app.use('/orders/my', authMiddleware)

// Finally, mount the fragrance and order routes
app.route('/favorites', favorites)
app.route('/cart', cart)
app.route('/upload', upload)
app.route('/fragrances', fragrances)
app.route('/orders', orders)
app.route('/analytics', analytics)
app.route('/reviews', reviews)

// --- 4. Error Handling ---
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Route not found'
  }, 404)
})

app.onError((err, c) => {
  console.error(`[Error] ${err.message}`)
  return c.json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  }, 500)
})

// --- 5. Server Initialization ---
const port = Number(process.env.PORT) || 8081
console.log(`🚀 Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})

// Graceful Shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)