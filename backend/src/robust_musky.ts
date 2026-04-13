import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  console.log('🚀 ROBUST REPAIR: Setting 14 Musky products with trim().');

  const muskyTargetNames = [
    "Roses Musk",
    "Rolling in Love",
    "For Her Intense",
    "For Her Musc Noir Rose",
    "Narciso",
    "Narciso Rodriguez for Him",
    "Blanc Kogane",
    "Parfums de Marly Valaya",
    "Man Rain Essence",
    "Comme une Evidence",
    "Sense",
    "مشاعر",
    "Gi",
    "YSL Mon Paris"
  ];

  const allProducts = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" }
  });

  let muskyFinalCount = 0;
  let updateCount = 0;

  for (const product of allProducts) {
    const trimmedName = product.name.trim();
    let newCategory = product.category;

    if (muskyTargetNames.some(target => target.trim().toLowerCase() === trimmedName.toLowerCase())) {
      newCategory = "Musky";
    } else {
        // If it's currently Musky but NOT in our target list, demote it
        if (product.category === "Musky") {
            // Demote based on common sense or previous category
            if (product.name.includes("Good Girl")) newCategory = "Sweet";
            else if (product.name.includes("L'Interdit")) newCategory = "Oriental";
            else if (product.name.includes("Givenchy")) newCategory = "Floral";
            else if (product.name.includes("Acqua")) newCategory = "Aquatic";
            else newCategory = "Floral"; // Default
        }
    }

    if (newCategory === "Musky") muskyFinalCount++;

    if (newCategory !== product.category) {
      await prisma.product.update({
        where: { id: product.id },
        data: { category: newCategory }
      });
      updateCount++;
    }
  }

  console.log(`✅ Done. Updated ${updateCount} products.`);
  console.log(`📊 ABSOLUTE FINAL MUSKY COUNT: ${muskyFinalCount}`);
}

main().catch(console.error);
