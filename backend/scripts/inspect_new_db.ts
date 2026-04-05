import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter })



async function main() {
  try {
    const products = await prisma.product.findMany();
    console.log('Products count in target DB:', products.length);
    if (products.length > 0) {
      console.log('Sample product:', JSON.stringify(products[0], null, 2));
    } else {
      console.log('No products found in target DB.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
