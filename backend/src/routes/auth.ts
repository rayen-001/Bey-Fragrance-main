import { Hono } from 'hono'
import { prisma } from '../db/prisma'
import bcrypt from 'bcryptjs'
import { sign } from 'hono/jwt'
import { z } from 'zod'

const auth = new Hono()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// POST /auth/register: Hash password and save user
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const validation = registerSchema.safeParse(body)
    
    if (!validation.success) {
      return c.json({ success: false, error: validation.error.format() }, 400)
    }

    const { email, password, fullName } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return c.json({ success: false, error: 'User already exists' }, 400)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: 'CUSTOMER', // Default role
      }
    })

    return c.json({ 
      success: true, 
      message: 'User registered successfully',
      userId: user.id 
    }, 201)
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ success: false, error: 'Registration failed' }, 500)
  }
})

// Alias for register
auth.post('/signup', async (c) => {
  return c.redirect('/auth/register', 307)
})

// POST /auth/login: Verify password and return JWT
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const validation = loginSchema.safeParse(body)
    
    if (!validation.success) {
      return c.json({ success: false, error: validation.error.format() }, 400)
    }

    const { email, password } = validation.data

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return c.json({ success: false, error: 'Invalid email or password' }, 401)
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return c.json({ success: false, error: 'Invalid email or password' }, 401)
    }

    // Sign JWT
    const secret = process.env.JWT_SECRET || 'default-secret'
    const payload = {
      userId: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h expiration
    }
    
    const token = await sign(payload, secret, 'HS256')

    return c.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ success: false, error: 'Login failed' }, 500)
  }
})

import { authMiddleware } from '../middleware/auth'

// GET /auth/is-admin: Check if current user is an admin
auth.get('/is-admin', authMiddleware, async (c) => {
  const payload = c.get('jwtPayload') as any
  const userMetadata = payload.user_metadata || {}
  const role = userMetadata.role || payload.role
  
  const isAdmin = role === 'admin'
  
  return c.json({
    isAdmin,
    user: {
      id: payload.userId,
      email: payload.email,
      role: role
    }
  })
})

export default auth
