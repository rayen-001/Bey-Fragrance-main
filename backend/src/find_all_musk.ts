import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const products = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" }
  });

  const muskyByDesc = products.filter(p => 
    p.description?.toLowerCase().includes('musky') || 
    p.notes.some(n => n.toLowerCase() === 'musk' || n.toLowerCase() === 'white musk')
  );

  console.log(`Found ${muskyByDesc.length} potential Musky products based on desc/notes.`);
  muskyByDesc.forEach(p => {
    console.log(`- ${p.name} | Category: ${p.category}`);
  });
}

main().catch(console.error);
