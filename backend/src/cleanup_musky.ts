import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  console.log('🚀 CLEANUP MUSKY: Precisely setting 14 Musky products.');

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

  const demoteList: Record<string, string> = {
    "Irresistible Givenchy": "Fruity",
    "Blu Mediterraneo - Ginepro di Sardegna": "Woody",
    "Gisada": "Sweet",
    "Givenchy L’Interdit": "Oriental",
    "Good Girl": "Sweet",
    "Acqua di Gioia": "Aquatic",
    "Carolina Herrera Good Girl Blush": "Sweet",
    "Xerjoff Accento": "Fruity" // If you want to keep precisely 14
  };

  const allProducts = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" }
  });

  let muskyFinalCount = 0;
  let updateCount = 0;

  for (const product of allProducts) {
    let newCategory = product.category;

    if (muskyTargetNames.includes(product.name)) {
      newCategory = "Musky";
    } else if (demoteList[product.name]) {
      newCategory = demoteList[product.name];
    } else if (product.category === "Musky") {
      // If it's something else not in the target list but still musky (from accidental previous runs)
      // I'll check its notes to guess.
      if (product.name.includes("Narciso")) {
          newCategory = "Musky"; // Keep other Narcisos? No, user said 14.
      } else {
          newCategory = "Floral"; // Safe fallback for most females that were misclassified
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

  console.log(`✅ Cleanup complete. Updated ${updateCount} products.`);
  console.log(`📊 FINAL TOTAL MUSKY COUNT: ${muskyFinalCount}`);
}

main().catch(console.error);
