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
  
  const NEW_URL = process.env.SUPABASE_URL || '';
  const OLD_ID = 'eclgwlrrmfuzdkayqakg';

  console.log('🔄 Updating database image URLs...');

  const products = await prisma.product.findMany();
  for (const p of products) {
    let updated = false;
    let mainImage = p.mainImage;
    if (mainImage?.includes(OLD_ID)) {
        mainImage = mainImage.replace(`https://${OLD_ID}.supabase.co`, NEW_URL);
        updated = true;
    }

    let galleryImages = p.galleryImages as string[] || [];
    let newGallery = galleryImages.map(img => {
        if (img?.includes(OLD_ID)) {
            updated = true;
            return img.replace(`https://${OLD_ID}.supabase.co`, NEW_URL);
        }
        return img;
    });

    if (updated) {
        console.log(`   📝 Updating product: ${p.name}`);
        await prisma.product.update({
            where: { id: p.id },
            data: { 
                mainImage,
                galleryImages: newGallery
            }
        });
    }
  }

  console.log('✅ All URLs updated successfully!');
  await prisma.$disconnect();
  await pool.end();
}

run();
