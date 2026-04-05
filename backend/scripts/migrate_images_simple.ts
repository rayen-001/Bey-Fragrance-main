import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { createClient } from '@supabase/supabase-js';
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
  
  const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

  try {
    console.log('🖼️ Fetching products from new DB...');
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products.`);

    for (const p of products) {
        const images = [p.mainImage, ...(Array.isArray(p.galleryImages) ? p.galleryImages : [])];
        for (const url of images) {
            if (url && typeof url === 'string' && url.includes('eclgwlrrmfuzdkayqakg.supabase.co')) {
                const fileName = url.split('/').pop();
                if (!fileName) continue;
                
                console.log(`⬇️ Downloading ${fileName}...`);
                try {
                    const res = await fetch(url);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const blob = await res.arrayBuffer();
                    
                    console.log(`⬆️ Uploading ${fileName} to new project...`);
                    const { error } = await supabase.storage.from('fragrances').upload(fileName, blob, { 
                        upsert: true,
                        contentType: res.headers.get('content-type') || 'image/jpeg'
                    });
                    if (error) console.error(`❌ Upload error: ${error.message}`);
                    else console.log(`✅ Success: ${fileName}`);
                } catch (e: any) {
                    console.error(`❌ Failed processing ${fileName}: ${e.message}`);
                }
            }
        }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
  console.log('🏁 Migration process finished.');
}

run();
