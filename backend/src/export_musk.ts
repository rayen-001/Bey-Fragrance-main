import { prisma } from './db/prisma';
import 'dotenv/config';
import fs from 'fs';

async function main() {
  const products = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" }
  });

  const muskyByDesc = products.filter(p => 
    p.description?.toLowerCase().includes('musky') || 
    p.notes.some(n => n.toLowerCase().includes('musk'))
  );

  let output = `Found ${muskyByDesc.length} potential Musky products.\n\n`;
  muskyByDesc.forEach(p => {
    output += `- ${p.name} | Category: ${p.category} | Notes: ${p.notes.join(', ')}\n`;
  });

  fs.writeFileSync('musky_candidates.txt', output);
}

main().catch(console.error);
