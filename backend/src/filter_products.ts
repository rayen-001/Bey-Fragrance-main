
import { prisma } from './db/prisma';
import * as dotenv from 'dotenv';
dotenv.config();

const approvedNames = [
  "1 Million",
  "1 Million Lucky",
  "1 Million Royal",
  "Acqua di Gioia (EDP)",
  "Amir Al Arab (أمير العرب)",
  "Baccarat Rouge 540",
  "Badi Al Oud (بديع العود)",
  "Black XS",
  "Bleu de Chanel Eau de Parfum",
  "Bleu de Chanel Parfum (Exclusive)",
  "Boss Bottled (EDT)",
  "Boss Bottled Elixir",
  "Boss Bottled Infinite",
  "Burberry Her (EDP)",
  "Carolina Herrera 212 VIP Black",
  "Carolina Herrera Good Girl Blush",
  "Chanel Allure Sensuelle",
  "Chanel No. 5 (EDP)",
  "Chloé Eau de Parfum",
  "CK One",
  "Creed Aventus (EDP)",
  "D&G The Only One",
  "Dior Homme Intense (EDP)",
  "Dior Homme Sport (EDT)",
  "Dior Sauvage (Eau de Toilette)",
  "Dior Sauvage (EDP)",
  "Dior Sauvage Elixir",
  "Emporio Armani Stronger With You",
  "Evaflor Whisky Silver",
  "Fakhr Lattafa (فخر لطافة)",
  "Givenchy L’Interdit (EDP)",
  "Good Girl (EDP)",
  "Gucci Bloom (EDP)",
  "Gucci Guilty Black Pour Homme",
  "Gucci Guilty Elixir de Parfum Pour Homme",
  "Gucci Guilty Pour Homme (EDT)",
  "Guerlain La Petite Robe Noire",
  "Guerlain Mon Guerlain (EDP)",
  "Hermès Terre d’Hermès (EDT)",
  "Hugo Boss Boss Bottled (EDT)",
  "Hugo Boss Boss Bottled Elixir",
  "Hugo Boss Boss Bottled Infinite",
  "Hugo Boss Boss Orange Man",
  "Hugo Boss The Scent Elixir For Him",
  "Invictus (EDT)",
  "Issey Miyake L'Eau d'Issey Pour Homme",
  "J'adore (EDP)",
  "JPG Le Beau",
  "JPG La Belle (EDP)",
  "JPG Le Male",
  "JPG Le Male Elixir",
  "JPG Le Male Elixir Absolu",
  "JPG Le Male Le Parfum",
  "JPG Scandal (Woman)",
  "JPG Scandal Pour Homme",
  "JPG Ultra Male",
  "K by Dolce & Gabbana",
  "Kajal Almaz (Almas)",
  "Kenzo L'Eau par Kenzo Marine Pour Homme",
  "Lancôme Idôle (EDP)",
  "Lancôme La Vie Est Belle (EDP)",
  "Lattafa Khamrah (خمرة)",
  "Lattafa Yara (Pink)",
  "Maison Margiela Replica By the Fireplace",
  "Mancera Cedrat Boise",
  "Mancera Choco Violette",
  "Mancera Paris Roses Vanille",
  "Miss Dior (EDP 2021)",
  "Montale Arabians Tonka",
  "Montale Rendez-Vous à Paris",
  "Montale Rose Musk",
  "Montblanc Legend (EDT)",
  "Nautica Voyage",
  "Nishane Hacivat (EDP)",
  "Orto Parisi Megamare",
  "Oud Satin Mood",
  "Parfums de Marly Delina",
  "Parfums de Marly Layton",
  "Parfums de Marly Valaya",
  "Prada L’Homme (EDT) ",
  "Prada Paradoxe (EDP)",
  "Pure XS",
  "Rabanne Invictus Legend",
  "Rabanne Invictus Platinum",
  "Ralph Lauren Polo Black",
  "Ralph Lauren Polo Blue (EDT)",
  "Ralph Lauren Polo Red",
  "Ralph Lauren Ralph’s Club (EDP)",
  "Sauvage (Eau Forte)",
  "Scandal Pour Homme",
  "Scandal Pour Homme Absolu",
  "Scandal Pour Homme Intense",
  "Sheikh Al Shuyukh (شيخ الشيوخ)",
  "Spicebomb Extreme",
  "Stronger With You Absolutely",
  "Stronger With You Intensely",
  "Terenzi Kirke (Extrait de Parfum)",
  "Tom Ford Black Orchid (EDP)",
  "Tom Ford Noir Extreme (EDP)",
  "Tom Ford Ombré Leather (EDP)",
  "Tom Ford Oud Wood (EDP)",
  "Tom Ford Tobacco Vanille (EDP)",
  "Tom Ford Vanille Fatale (EDP)",
  "Valentino Uomo Born in Roma",
  "Versace Crystal Noir (EDP)",
  "Versace Eros (EDP)",
  "Versace Eros (EDT)",
  "Versace Eros Najim (Parfum)",
  "Versace Eros Pour Femme (EDP)",
  "Viktor&Rolf Flowerbomb",
  "Viktor&Rolf Spicebomb (EDT)",
  "Xerjoff Accento (EDP)",
  "Xerjoff Alexandria II (EDP)",
  "Xerjoff Erba Gold (EDP)",
  "Xerjoff Erba Pura (EDP)",
  "Xerjoff Naxos (EDP)",
  "Xerjoff Overdose (EDP)",
  "Xerjoff Renaissance (EDP)",
  "Xerjoff Torino 22 (EDP)",
  "YSL Black Opium (EDP)",
  "YSL Black Opium Le Parfum",
  "YSL La Nuit de L’Homme (EDT)",
  "YSL Libre (EDP)",
  "YSL Libre Intense (EDP)",
  "YSL Mon Paris (EDP)",
  "YSL Myslf (EDP)",
  "YSL Y Eau de Parfum",
  "YSL Y Elixir",
  "YSL Y Le Parfum"
];

async function main() {
  const uniqueApproved = [...new Set(approvedNames.map(n => n.trim()))];
  const normalizedApproved = uniqueApproved.map(n => n.toLowerCase());
  
  const allProducts = await prisma.product.findMany({
    select: { id: true, name: true }
  });

  console.log(`Initial count: ${allProducts.length}`);

  const toKeepIds: string[] = [];
  const toDeleteIds: string[] = [];
  const keptNames = new Set<string>();

  for (const product of allProducts) {
    const normName = product.name.trim().toLowerCase();
    if (normalizedApproved.includes(normName)) {
      toKeepIds.push(product.id);
      keptNames.add(product.name.trim().toLowerCase());
    } else {
      toDeleteIds.push(product.id);
    }
  }

  console.log(`Found ${toKeepIds.length} products to KEEP.`);
  console.log(`Found ${toDeleteIds.length} products to DELETE.`);

  // Alert which approved names are NOT in the database
  const missing = uniqueApproved.filter(n => !keptNames.has(n.toLowerCase()));
  if (missing.length > 0) {
    console.log(`WARNING: ${missing.length} approved products were NOT found in the database:`);
    missing.forEach(m => console.log(`- MISSING: ${m}`));
  }

  if (toDeleteIds.length > 0) {
    const deleted = await prisma.product.deleteMany({
      where: {
        id: { in: toDeleteIds }
      }
    });
    console.log(`Successfully deleted ${deleted.count} products from database.`);
  } else {
    console.log("Nothing to delete.");
  }

  const finalProducts = await prisma.product.findMany({
    select: { name: true },
    orderBy: { name: 'asc' }
  });

  console.log(`\nFinal count in DB: ${finalProducts.length}`);
  console.log(`Expected approved products: ${uniqueApproved.length}`);
  
  console.log("\nApproved Products now in DB:");
  finalProducts.forEach(p => console.log(`- ${p.name}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
