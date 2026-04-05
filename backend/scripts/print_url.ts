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
  const p = await prisma.product.findFirst();
  console.log('NAME:', p?.name);
  console.log('MAIN URL:', p?.mainImage);
  await prisma.$disconnect();
  await pool.end();
}

run();
