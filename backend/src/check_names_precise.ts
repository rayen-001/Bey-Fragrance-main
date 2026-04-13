import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const p = await prisma.product.findMany({
    where: { 
        OR: [
            { name: { contains: 'Roses' } },
            { name: { contains: 'Rolling' } }
        ]
    },
    select: { name: true }
  });
  console.log(p.map(x => `"${x.name}"`).join(' | '));
}

main().catch(console.error);
