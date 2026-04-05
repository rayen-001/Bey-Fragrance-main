import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function run() {
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool as any)
  const prisma = new PrismaClient({ adapter })

  console.log('🔍 Diagnostic: Checking first product image URL...');

  const p = await prisma.product.findFirst();
  if (!p) {
    console.log('❌ No products found in DB.');
    return;
  }

  const url = p.mainImage;
  console.log(`🖼️ Testing URL for "${p.name}":`);
  console.log(`🔗 ${url}`);

  try {
    const res = await fetch(url!);
    console.log(`📊 HTTP Status: ${res.status} (${res.statusText})`);
    if (res.status === 403) {
      console.log('🛑 THE PROBLEM: Access Denied! You need to add a Read Policy in Supabase Storage.');
    } else if (res.status === 404) {
      console.log('❓ THE PROBLEM: File not found! The image name might be slightly different in the bucket.');
    } else if (res.ok) {
      console.log('✅ Success! The URL is reachable. If you still see nothing, it might be a frontend display issue.');
    }
  } catch (err: any) {
    console.error('⚠️ Fetch failed:', err.message);
  }

  await prisma.$disconnect();
  await pool.end();
}

run();
