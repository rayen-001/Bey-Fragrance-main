import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter })

async function run() {
  const products = await prisma.product.findMany();
  let oldTags = 0;
  let newTags = 0;
  let externalTags = 0;

  const OLD_ID = 'eclgwlrrmfuzdkayqakg';
  const NEW_ID = 'ttynzjozzzwhwmkysjov';

  for (const p of products) {
    const urls = [p.mainImage, ...(p.galleryImages as string[] || [])];
    urls.forEach(url => {
        if (!url) return;
        if (url.includes(OLD_ID)) oldTags++;
        else if (url.includes(NEW_ID)) newTags++;
        else externalTags++;
    });
  }

  console.log(`📊 IMAGE STATS:`);
  console.log(`🛑 Old Project URLs (Broken): ${oldTags}`);
  console.log(`✅ New Project URLs: ${newTags}`);
  console.log(`🌐 External URLs (Unsplash/Pinterest): ${externalTags}`);

  await prisma.$disconnect();
  await pool.end();
}

run();
