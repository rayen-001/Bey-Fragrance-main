import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const p = await prisma.product.findMany({
    where: { 
        inspiredBy: { contains: 'Narciso Rodriguez', mode: 'insensitive' }
    }
  });
  p.forEach(x => console.log(`${x.name} | Category: ${x.category} | Inspired By: ${x.inspiredBy}`));
}

main().catch(console.error);
