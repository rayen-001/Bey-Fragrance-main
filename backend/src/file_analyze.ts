import { prisma } from './db/prisma';
import 'dotenv/config';
import fs from 'fs';

async function main() {
  const products = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" },
    select: { name: true, category: true, notes: true, description: true }
  });

  let output = '--- POTENTIAL MUSKY (NOT CURRENTLY CATEGORIZED AS MUSKY) ---\n';
  const potentiallyMusky = products.filter(p => {
    const isMusky = p.category?.toLowerCase() === 'musky';
    const hasMusk = p.notes.some(n => n.toLowerCase().includes('musk')) || 
                    p.name.toLowerCase().includes('musk') || 
                    (p.description?.toLowerCase().includes('musk') ?? false);
    return !isMusky && hasMusk;
  });

  potentiallyMusky.forEach(p => {
    output += `- ${p.name} (Current: ${p.category})\n`;
  });

  output += '\n--- CURRENT FRESH PRODUCTS ---\n';
  const freshOnes = products.filter(p => p.category === 'Fresh');
  freshOnes.forEach(p => {
    output += `- ${p.name} (Notes: ${p.notes.join(', ')})\n`;
  });

  fs.writeFileSync('analysis_result.txt', output);
  console.log('Analysis saved to analysis_result.txt');
}

main().catch(console.error);
