import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({ take: 3 });
  console.log('🖼️ ACTUAL IMAGE LINKS IN DATABASE:');
  products.forEach(p => {
    console.log(`   - Product: ${p.name}`);
    console.log(`     Link: ${p.image_url}`);
  });
  await prisma.$disconnect();
}

check();
