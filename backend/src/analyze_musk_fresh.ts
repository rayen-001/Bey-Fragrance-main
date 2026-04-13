import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const products = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" },
    select: { name: true, category: true, notes: true, description: true }
  });

  console.log('--- Potential Musky Products missed ---');
  products.forEach(p => {
    const isMusky = p.category?.toLowerCase() === 'musky';
    const notesStr = p.notes.join(', ').toLowerCase();
    const nameStr = p.name.toLowerCase();
    const descStr = p.description?.toLowerCase() || '';

    if (!isMusky && (notesStr.includes('musk') || nameStr.includes('musk') || descStr.includes('musk'))) {
        console.log(`${p.name} | Category: ${p.category} | Notes: ${p.notes.filter(n => n.toLowerCase().includes('musk'))}`);
    }
  });

  console.log('\n--- Current Fresh Products ---');
  products.forEach(p => {
      if (p.category === 'Fresh') {
          console.log(`${p.name} | Notes: ${p.notes.join(', ')}`);
      }
  });
}

main().catch(console.error);
