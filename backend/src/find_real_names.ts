import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const p = await prisma.product.findMany({
    where: { 
        OR: [
            { inspiredBy: { contains: 'Roses Musk' } },
            { inspiredBy: { contains: 'Rolling in Love' } }
        ]
    },
    select: { name: true, inspiredBy: true }
  });
  p.forEach(x => console.log(`Name: "${x.name}" | InspiredBy: "${x.inspiredBy}"`));
}

main().catch(console.error);
