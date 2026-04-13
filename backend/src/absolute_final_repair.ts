import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  console.log('🚀 ABSOLUTE FINAL REPAIR: Fixing Musky count to 14 and eliminating improper Fresh labels.');

  // 14 Precise Musky Products
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

  // Specific "Fresh" re-assignments
  const freshToSpecific: Record<string, string> = {
    "HUGO BOSS Unlimited": "Aromatic",
    "YSL Y Le Parfum": "Aromatic",
    "YSL Myslf": "Aromatic",
    "Alpha Male": "Aromatic",
    "Greenley": "Fruity",
    "Sedley": "Citrus",
    "Boss Bottled Marine": "Aquatic",
    "Eternity for Men": "Aromatic",
    "Luna Rossa": "Aromatic",
    "CR7": "Aromatic",
    "L.12.12 Silver Grey": "Aromatic",
    "Eau de Lacoste L.12.12 White": "Woody",
    "Allure Homme Sport": "Citrus",
    "Legend": "Aromatic",
    "Dior  Sauvage": "Aromatic",
    "Ralph Lauren Polo Blue": "Aquatic",
    "Hugo Boss Boss Bottled Infinite": "Aromatic",
    "Gucci Guilty Black Pour Homme": "Aromatic",
    "Rabanne Invictus Platinum": "Aromatic",
    "Gucci Guilty Pour Homme": "Aromatic",
    "K by Dolce & Gabbana": "Aromatic",
    "Prada L’Homme": "Aromatic",
    "Hugo Boss Bottled": "Woody",
    "Acqua di Gioia": "Aquatic",
    "Creed Aventus": "Woody",
    "Nishane Hacivat": "Woody",
    "Issey Miyake L'Eau d'Issey Pour Homme": "Citrus",
    "Fragrance One — Office for Men": "Aromatic", // Just in case
    "Nautica Voyage": "Aquatic"
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
    } else if (freshToSpecific[product.name]) {
      newCategory = freshToSpecific[product.name];
    } else if (product.category === "Fresh") {
      // Any remaining Fresh products that we didn't explicitly map
      newCategory = "Aromatic";
    }

    // Capitalize correctly
    if (newCategory) {
      newCategory = newCategory.charAt(0).toUpperCase() + newCategory.slice(1).toLowerCase();
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

  console.log(`✅ Repair complete. Categories updated for ${updateCount} products.`);
  console.log(`📊 TOTAL MUSKY COUNT: ${muskyFinalCount}`);
  
  // Final check to make sure no "Fresh" is left (unless you wanted it, but the user complained about it)
  const remainingFresh = await prisma.product.count({
    where: { brand: "Hama Fragrance", category: "Fresh" }
  });
  console.log(`📊 REMAINING FRESH COUNT: ${remainingFresh}`);
}

main().catch(console.error);
