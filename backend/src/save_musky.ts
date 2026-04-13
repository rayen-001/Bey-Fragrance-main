import { prisma } from './db/prisma';
import 'dotenv/config';
import fs from 'fs';

async function main() {
  const p = await prisma.product.findMany({
    where: { 
        brand: "Hama Fragrance",
        category: "Musky"
    },
    select: { name: true, category: true }
  });
  
  const names = p.map(x => x.name).join('\n');
  fs.writeFileSync('current_musky.txt', names);
  console.log('Saved 20 names to current_musky.txt');
}

main().catch(console.error);
