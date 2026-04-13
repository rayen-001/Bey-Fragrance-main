import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const products = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" },
    select: { name: true, category: true, notes: true, description: true }
  });

  const potentiallyMusky = products.filter(p => {
    const isMusky = p.category?.toLowerCase() === 'musky';
    const hasMusk = p.notes.some(n => n.toLowerCase().includes('musk')) || 
                    p.name.toLowerCase().includes('musk') || 
                    (p.description?.toLowerCase().includes('musk') ?? false);
    return !isMusky && hasMusk;
  });

  console.log('--- POTENTIAL MUSKY (NOT CURRENTLY CATEGORIZED AS MUSKY) ---');
  potentiallyMusky.forEach(p => {
    console.log(`- ${p.name} (Current: ${p.category})`);
  });

  const freshOnes = products.filter(p => p.category === 'Fresh');
  console.log('\n--- CURRENT FRESH PRODUCTS ---');
  freshOnes.forEach(p => {
    console.log(`- ${p.name} (Notes: ${p.notes.join(', ')})`);
  });
}

main().catch(console.error);
