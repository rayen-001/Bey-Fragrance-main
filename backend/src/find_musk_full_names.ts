import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const p = await prisma.product.findMany({
    where: { 
        brand: "Hama Fragrance",
        name: { contains: 'Musk', mode: 'insensitive' }
    },
    select: { name: true }
  });
  console.log(p.map(x => x.name).join(' | '));
}

main().catch(console.error);
