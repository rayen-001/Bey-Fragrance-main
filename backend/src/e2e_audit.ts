import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { prisma } from './db/prisma';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const API_BASE = 'http://localhost:3001';

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runAudit() {
  console.log('--- STARTING FUNCTIONAL DATA INTEGRITY AUDIT ---');
  let token = '';
  let userId = '';
  let productId = '';

  try {
    // 1. Check Products Database & Get one for testing
    console.log('\n[Phase 1: Products DB Check]');
    let products = await prisma.product.findMany({ take: 1 });
    productId = products[0].id;
    console.log(`✅ Product ID for testing: ${productId}`);

    // 2. Auth Flow (Creating Verified User & Login)
    console.log('\n[Phase 2: Auth Flow (Creating Verified User)]');
    const email = `audit_pro_${Date.now()}@gmail.com`;
    const password = 'password123';
    
    // Create using admin API to bypass confirmation
    const { data: adminData, error: adminErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Pro Audit User', role: 'CUSTOMER' }
    });
    
    if (adminErr) throw new Error(`Admin Create failed: ${adminErr.message}`);
    
    // Allow trigger to sync
    await new Promise(res => setTimeout(res, 2000));
    
    // Now login with standard supabase to get token
    const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
      email, password
    });
    
    if (loginErr) throw new Error(`Login failed: ${loginErr.message}`);
    
    userId = loginData.user.id || '';
    token = loginData.session?.access_token || '';
    console.log(`✅ Supabase Login successful, userId: ${userId}`);

    // Verify user in public.users
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      throw new Error('❌ TRIGGER MISMATCH: User not found in public.users scheme');
    }
    console.log(`✅ Prisma DB user verified: ${dbUser.email} (createdAt: ${dbUser.createdAt})`);

    // 3. Cart System Validation
    console.log('\n[Phase 3: Cart System Validation]');
    const cartRes = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId, quantity: 2 })
    });
    if (!cartRes.ok) throw new Error(`Cart insert failed: ${await cartRes.text()}`);

    const cartItems = await prisma.cartItem.findMany({ where: { userId } });
    if (cartItems.length === 0) throw new Error('❌ CART SYNC FAILED: Prisma mismatch with Cart API');
    console.log(`✅ Cart API updated ${cartItems.length} items securely via foreign keys into Prisma.`);

    // 4. Wishlist Validation
    console.log('\n[Phase 4: Wishlist / Favorites System Validation]');
    const favRes = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId })
    });
    if (!favRes.ok) throw new Error(`Favorite insert failed: ${await favRes.text()}`);

    const favorites = await prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } }
    });
    if (!favorites) throw new Error('❌ FAVORITES FAILED: Not recorded in Prisma');
    console.log('✅ Wishlist updates validated successfully.');

    // 5. Order Creation Flow
    console.log('\n[Phase 5: Order Creation System]');
    const orderRes = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        clientName: 'Audit Test Client',
        place: 'Test Address 123',
        phoneNumber: '+216 12 345 678',
        items: [{ id: productId, quantity: 2 }]
      })
    });
    
    if (!orderRes.ok) throw new Error(`Order creation failed: ${await orderRes.text()}`);
    
    const dbOrder = await prisma.order.findFirst({
      where: { userId }, include: { items: true }, orderBy: { createdAt: 'desc' }
    });

    if (!dbOrder || dbOrder.items.length === 0) {
      throw new Error('❌ ORDER FAILED: DB Order missing or items unlinked');
    }
    console.log(`✅ Order ${dbOrder.id} safely stored physically mapped to ${dbOrder.userId}`);

    // Clean up our test order so we dont clutter the Admin dashboard
    await prisma.order.delete({ where: { id: dbOrder.id } });
    await prisma.favorite.delete({ where: { id: favorites.id } });
    await prisma.cartItem.deleteMany({ where: { userId } });

    console.log('\n[Phase 6: Cleanup]');
    console.log('✅ Test orders, carts, and wishlist items cleaned safely via cascade operations.');

    console.log('\n--- ALL FUNCTIONAL AUDIT CHECKS PASSED SUCCESSFULLY ---');

  } catch (error) {
    console.error('\n❌ AUDIT FAILED:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runAudit();
