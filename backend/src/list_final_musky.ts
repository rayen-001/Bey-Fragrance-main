import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const p = await prisma.product.findMany({
    where: { 
        brand: "Hama Fragrance",
        category: "Musky"
    },
    select: { name: true }
  });
  console.log('--- FINAL MUSKY PRODUCTS ---');
  p.forEach((x, i) => console.log(`${i+1}. ${x.name}`));
}

main().catch(console.error);
