import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const p = await prisma.product.findMany({
    where: { 
        brand: "Hama Fragrance",
        OR: [
            { name: { contains: 'musk', mode: 'insensitive' } },
            { notes: { hasSome: ['musk', 'Musk', 'white musk', 'White Musk', 'Musky Woods', 'white musks'] } }
        ]
    }
  });
  console.log(p.map(x => x.name).join(' | '));
  console.log('Total:', p.length);
}

main().catch(console.error);
