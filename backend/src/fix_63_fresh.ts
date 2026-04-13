import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const vaildCategories = ['Aquatic', 'Aromatic', 'Citrus', 'Floral', 'Fresh', 'Fruity', 'Musky', 'Oriental', 'Spicy', 'Sweet', 'Woody'];
  
  console.log('🔗 Starting master category cleanup...');
  
  // 1. Handle products with category set to a gender
  const genderCates = ['unisex', 'woman', 'man', 'Unisex', 'Woman', 'Man'];
  
  for (const gc of genderCates) {
    const products = await prisma.product.findMany({
      where: { category: gc }
    });
    
    for (const p of products) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          genderCategory: gc.toLowerCase(),
          category: 'Fresh' // Default these to Fresh as per dashboard logic
        }
      });
    }
    if (products.length > 0) {
      console.log(`✅ Fixed ${products.length} products that had '${gc}' as their scent category. Moved to genderCategory and set scent to 'Fresh'.`);
    }
  }

  // 2. Finally, any product still not in the valid list should probably be 'Fresh'
  // (This handles nulls, empties, or weird values)
  const result = await prisma.product.updateMany({
    where: {
      OR: [
        { category: null },
        { category: '' },
        { NOT: { category: { in: vaildCategories } } }
      ],
      brand: "Hama Fragrance"
    },
    data: {
      category: 'Fresh'
    }
  });
  console.log(`✅ Normalized ${result.count} miscellaneous/missing categories to 'Fresh'.`);

  console.log('✨ Database cleanup complete. 63 products should now be correctly categorized as Fresh.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
