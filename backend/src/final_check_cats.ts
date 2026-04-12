import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const categories = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
    where: { brand: "Hama Fragrance" }
  });
  console.log('Categories:', JSON.stringify(categories, null, 2));
}

main().catch(console.error);
