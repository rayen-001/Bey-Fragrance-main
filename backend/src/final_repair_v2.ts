import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  console.log('🚀 REPAIR: Reaching 14 Musky with reliable matching...');

  const muskyKeywords = [
    "Roses Musk",
    "Rolling in Love",
    "For Her Intense",
    "Musc Noir Rose",
    "Narciso Rodriguez for Him",
    "Blanc Kogane",
    "Valaya",
    "Man Rain Essence",
    "Comme une Evidence",
    "Sense",
    "مشاعر",
    "Gi",
    "Mon Paris",
    "Accento"
  ];

  const freshUpdate: Record<string, string> = {
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
    "Issey Miyake L'Eau d'Issey Pour Homme": "Citrus"
  };

  const allProducts = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" }
  });

  let muskyCount = 0;
  let updateCount = 0;

  for (const product of allProducts) {
    let targetCategory = product.category;

    // Musky Check (Partial)
    const isMusky = muskyKeywords.some(k => product.name.includes(k));
    // Special case for "Narciso" precisely
    const isPreciseNarciso = product.name === "Narciso" || product.name === "Narciso Rodriguez";

    if (isMusky || isPreciseNarciso) {
        targetCategory = "Musky";
    } else if (freshUpdate[product.name]) {
        targetCategory = freshUpdate[product.name];
    } else if (product.category === "Fresh") {
        // Fallback for any remaining Fresh
        targetCategory = "Aromatic";
    }

    if (targetCategory) {
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

  console.log(`✅ Updated ${updateCount} products.`);
  console.log(`📊 Final Musky Count: ${muskyCount}`);
}

main().catch(console.error);
