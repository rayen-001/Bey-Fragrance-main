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
  console.log(p.map(x => x.name).join(' | '));
  console.log('Total:', p.length);
}

main().catch(console.error);
