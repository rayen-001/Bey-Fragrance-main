import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  console.log('🚀 Final validation & casing cleanup...');
  
  const products = await prisma.product.findMany({
      where: { brand: "Hama Fragrance" }
  });

  let fixed = 0;

  for (const p of products) {
      if (!p.category) continue;
      
      const low = p.category.toLowerCase();
      // Only fix if it's one of our specific scent types
      const scentTypes = ['floral', 'woody', 'citrus', 'oriental', 'sweet', 'fruity', 'aquatic', 'aromatic', 'musky', 'leather'];
      
      if (scentTypes.includes(low)) {
          const capitalized = low.charAt(0).toUpperCase() + low.slice(1);
          if (p.category !== capitalized) {
              await prisma.product.update({
                  where: { id: p.id },
                  data: { category: capitalized }
              });
              fixed++;
          }
      }
  }

  console.log(`✅ Casing cleanup complete. Fixed ${fixed} records.`);
}

main().catch(console.error);
