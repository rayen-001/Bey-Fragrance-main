import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const products = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" },
    select: { name: true, category: true, genderCategory: true }
  });
  console.log(JSON.stringify(products, null, 2));
}

main().catch(console.error);
