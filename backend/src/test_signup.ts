import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { prisma } from './db/prisma.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSignup() {
  const email = `testuser_${Date.now()}@gmail.com`;
  const password = 'password123';
  const name = 'Test User';

  console.log(`[1] Creating user via Supabase Auth: ${email}`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: 'CUSTOMER',
        is_signup: true
      }
    }
  });

  if (error) {
    console.error('[Error] Supabase Auth SignUp failed:', error.message);
    return;
  }

  console.log('[Success] User created in Supabase Auth:', data.user?.id);

  console.log(`[2] Checking if user synced to public.users via Prisma...`);
  
  // Wait a little bit for the trigger
  await new Promise(res => setTimeout(res, 2000));

  const dbUser = await prisma.user.findUnique({
    where: { email }
  });

  if (dbUser) {
    console.log('[Success] User found in public.users!', dbUser.id);
  } else {
    console.warn('[Warning] User NOT found in public.users. The sync trigger is likely missing or failed!');
  }
}

testSignup()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
