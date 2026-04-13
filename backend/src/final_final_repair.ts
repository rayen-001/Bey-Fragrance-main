import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  console.log('🚀 FINAL FINAL REPAIR: Reaching 14 Musky and fixing Fresh products...');

  // 1. Definite Musky products (Aiming for 14)
  const muskyNames = [
    "Roses Musk",
    "Rolling in Love",
    "For Her Intense",
    "For Her Musc Noir Rose",
    "Narciso",
    "Narciso Rodriguez for Him",
    "Blanc Kogane",
    "Valaya",
    "Man Rain Essence",
    "Comme une Evidence",
    "Sense",
    "مشاعر",
    "Gi",
    "Mon Paris" // 14th candidate
  ];

  // 2. Specific fixes for "Fresh" products (Moving to Aromatic/Citrus/Woody/Aquatic)
  const freshFixes: Record<string, string> = {
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
    "Parfums de Marly Valaya": "Musky" // Handled by muskyNames as well
  };

  const allProducts = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" }
  });

  let muskyCount = 0;
  let updateCount = 0;

  for (const product of allProducts) {
    let targetCategory = product.category;

    // Apply Musky override
    if (muskyNames.includes(product.name)) {
        targetCategory = "Musky";
    } else if (freshFixes[product.name]) {
        targetCategory = freshFixes[product.name];
    }

    // Ensure Title Case and handle potential "Man/Woman/Unisex" in category
    if (targetCategory) {
        if (['Man', 'Woman', 'Unisex'].includes(targetCategory)) {
            // This case should be handled by my previous unified_repair, but being safe
            targetCategory = "Aromatic"; // Default for misclassified fresh men scents
        }
        targetCategory = targetCategory.charAt(0).toUpperCase() + targetCategory.slice(1).toLowerCase();
    }

    if (targetCategory === "Musky") muskyCount++;

    if (targetCategory !== product.category) {
        await prisma.product.update({
            where: { id: product.id },
            data: { category: targetCategory }
        });
        updateCount++;
    }
  }

  console.log(`✅ Fixed categories for ${updateCount} products.`);
  console.log(`📊 Final Musky Count in DB: ${muskyCount}`);
}

main().catch(console.error);
