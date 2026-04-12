import { prisma } from './db/prisma';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// 1. Load the gender mapping extracted from seed files
const genderMap: Record<string, string> = JSON.parse(
  fs.readFileSync('c:/Users/asus/Desktop/projet/Bey-Fragrance-main/backend/src/extracted_genders.json', 'utf-8')
);

// 2. Load the scent family mapping (from final_repair_categories.ts)
// I will include the mapping here for reliability
const scentMap: Record<string, string> = {
  "Pure Poison": "Floral",
  "Blush": "Floral",
  "1881": "Floral",
  "L'Instant de Guerlain": "Oriental",
  "Coconut Passion": "Sweet",
  "Wonder Rose": "Fruity",
  "Hypnotic Poison": "Oriental",
  "Coco": "Oriental",
  "Gabrielle": "Floral",
  "Roses Musk": "Musky",
  "Tommy Girl": "Floral", // Corrected back to Floral
  "Flora Gorgeous Orchid": "Sweet",
  "My Way Ylang": "Fruity",
  "Roberto Cavalli": "Oriental",
  "Fame": "Fruity",
  "Hareem Al Sultan Gold": "Fruity",
  "Because It's You": "Sweet",
  "Emporio Armani In Love With You": "Fruity",
  "Roses Greedy": "Floral",
  "Flower by Kenzo": "Floral",
  "Bonbon": "Sweet",
  "Idylle": "Floral",
  "Vénus": "Floral",
  "Teriaq": "Sweet",
  "Tilia": "Floral",
  "L’Extase": "Oriental",
  "Jimmy Choo Fever": "Sweet",
  "Cinéma": "Oriental",
  "Club de Nuit Woman": "Floral",
  "Iris Root": "Floral",
  "Orza": "Fruity",
  "Cassiopea": "Fruity",
  "Libra": "Citrus",
  "Glamour": "Fruity",
  "Dolce Blue Jasmine": "Floral",
  "Rolling in Love": "Musky",
  "Jasmin Noir": "Floral",
  "Splendida Iris d'Or": "Floral",
  "Washwasha": "Floral",
  "Mayar": "Fruity",
  "Eden Juicy Apple | 01": "Fruity",
  "Vanilla Candy Rock Sugar | 42": "Sweet",
  "Vanilla | 28": "Sweet",
  "The Wedding Silk Santal | 36": "Floral",
  "Maui in a Bottle Sweet Banana | 37": "Fruity",
  "Oudgasm Vanilla Oud | 36": "Woody",
  "Yum Boujee Marshmallow | 81": "Sweet",
  "Yum Pistachio Gelato | 33": "Sweet",
  "Maldives in a Bottle Ylang Coco | 20": "Aquatic",
  "Pink Me Up": "Fruity",
  "Black Opium Le Parfum": "Sweet",
  "Scandal à Paris": "Sweet",
  "Scandal By Night": "Oriental",
  "Scandal Intense": "Sweet",
  "So Scandal!": "Floral",
  "La Bomba": "Fruity",
  "So Elixir": "Oriental",
  "For Her Intense": "Musky",
  "For Her Musc Noir Rose": "Musky",
  "All Of Me": "Floral",
  "Narciso": "Musky",
  "Narcisse Noir": "Oriental",
  "Nina": "Sweet",
  "Ma Dame": "Floral",
  "Seductive": "Fruity",
  "Her": "Fruity",
  "Miami Blossom": "Fruity",
  "Supreme Bouquet": "Floral",
  "Escada Margaretha Ley": "Oriental",
  "Premier Jour": "Floral",
  "Goddess": "Sweet",
  "Angel Fantasm": "Sweet",
  "Gi": "Musky",
  "Dylan Purple": "Fruity",
  "Invite Only Amber | 23": "Oriental",
  "Oudgasm Rose Oud | 16": "Woody",
  "Fleur Majesty Rose Royale | 31": "Floral",
  "Voilà!": "Oriental",
  "Ajwad": "Fruity",
  "Crème Brûlée": "Sweet",
  "Love Delight": "Sweet",
  "Pink Sugar": "Sweet",
  "Hot as Rose": "Spicy",
  "Chance Splendide": "Floral",
  "Eclaire": "Sweet",
  "Tropical Boost": "Fruity",
  "La Fiesta": "Floral",
  "Decadence": "Oriental",
  "L'Impératrice Royale": "Fruity",
  "I Want Choo": "Sweet",
  "Dolce Garden": "Sweet",
  "Aqua Allegoria Mandarine Basilic": "Citrus",
  "Scandal Absolu": "Oriental",
  "Libre Vanille": "Sweet",
  "Libre Flowers & Flames": "Floral",
  "Les Sables Roses": "Woody",
  "California Dream": "Citrus",
  "Étoile Filante": "Fruity",
  "Stellar Times": "Oriental",
  "Lady Million": "Sweet",
  "Irresistible Givenchy": "Fruity",
  "L'Interdit Absolu": "Oriental",
  "L'Interdit Rouge": "Oriental",
  "L’Interdit Le Parfum": "Oriental",
  "Insolence": "Floral",
  "Comme une Evidence": "Musky",
  "Incidence": "Fruity",
  "Daisy": "Floral", // Corrected
  "La Vie est Belle L'Elixir": "Sweet",
  "La Vie est Belle Vanille": "Sweet",
  "Devotion": "Sweet",
  "Diamant": "Sweet",
  "My Burberry": "Floral",
  "Donna Born in Roma": "Sweet",
  "Alien": "Oriental",
  "Orchid": "Floral",
  "Olympéa": "Oriental",
  "Chance": "Floral", // Corrected
  "Sense": "Musky",
  "Flowerbomb Tiger Lily": "Fruity",
  "Manifesto L’Elixir": "Oriental",
  "Nomade Nuit d’Égypte": "Oriental",
  "Quelques Notes d’Amour": "Floral",
  "La Nuit Trésor": "Sweet",
  "Trésor Midnight Rose": "Fruity",
  "Flora": "Floral",
  "Bamboo": "Floral",
  "Gucci Guilty": "Oriental",
  "Le Parfum": "Floral",
  "Million Gold": "Sweet",
  "Yara Candy": "Sweet",
  "Q": "Fruity",
  "Bombshell": "Fruity",
  "Bombshell Intense": "Fruity",
  "Rose Star": "Floral",
  "Rose Amira": "Oriental",
  "L.12.12 Rose Eau Intense": "Floral",
  "Guidance": "Oriental",
  "Candy Love": "Sweet",
  "مشاعر": "Musky",
  "غرام": "Oriental",
  "أميرة العرب": "Oriental",
  "My Way": "Floral",
  "Challenge": "Citrus",
  "Boss Bottled Pacific": "Woody",
  "L'eau d'Issey": "Aquatic",
  "Eau de Lacoste L.12.12 Blue": "Citrus",
  "Narciso Rodriguez for Him": "Musky",
  "Alpha Male": "Fresh",
  "UDV Blue": "Aquatic",
  "Desert Dawn": "Woody",
  "Lamar": "Fruity",
  "Oud Maracujá": "Woody",
  "Mangonifiscent": "Fruity",
  "Paradigme": "Oriental",
  "Bad Boy": "Spicy",
  "Bois d'Argent": "Woody",
  "Fahrenheit": "Woody",
  "Stronger With You Amber": "Oriental",
  "Stronger With You Tobacco": "Oriental",
  "Stronger With You Oud": "Woody",
  "Stronger With You Leather": "Woody",
  "Imagination": "Citrus",
  "Pacific Chill": "Fruity",
  "Afternoon Swim": "Citrus",
  "Ombre Nomade": "Woody",
  "Greenley": "Fresh",
  "Sedley": "Fresh",
  "Perseus": "Citrus",
  "Althaïr": "Sweet",
  "Silver Scent": "Oriental",
  "Vanilla Ecstasy": "Sweet",
  "Roses Vanille": "Sweet",
  "Coco Vanille": "Sweet",
  "Black Vanilla": "Sweet",
  "Classe'": "Oriental",
  "Cool Water": "Aquatic",
  "Champion": "Woody",
  "Golden Dust": "Oriental",
  "Blu Mediterraneo - Ginepro di Sardegna": "Woody",
  "Chairman": "Woody",
  "Legend": "Fresh",
  "Gentleman": "Woody",
  "Gentleman Society": "Woody",
  "Vanilla Powder": "Sweet",
  "Le Beau": "Sweet",
  "Boss Bottled Marine": "Fresh",
  "Hudson Valley": "Fruity",
  "Cedrat Boisé": "Citrus",
  "Messi": "Woody",
  "Summer Hammer": "Fruity",
  "Blue Talisman": "Citrus",
  "Polo Blue Gold Blend": "Woody",
  "Double Whisky": "Oriental",
  "Kenzo Homme Marine": "Aquatic",
  "Al Faris": "Woody",
  "Oud Voyager": "Woody",
  "Mandarino di Amalfi": "Citrus",
  "Neroli Portofino": "Citrus",
  "Intense Oud": "Oriental",
  "Oud Vanille": "Oriental",
  "Alf Lail o Lail": "Woody",
  "Blu Mare": "Aquatic",
  "Eternity for Men": "Fresh",
  "1881 pour Homme": "Woody",
  "Black Afgano": "Woody",
  "Khamrah Qahwa": "Sweet",
  "Classic Black": "Woody",
  "LV Lovers": "Woody",
  "Kobraa": "Woody",
  "Man in Black": "Oriental",
  "Tygar": "Citrus",
  "Falkar": "Woody",
  "Man Rain Essence": "Musky",
  "Luna Rossa": "Fresh",
  "The Most Wanted": "Sweet",
  "Wanted": "Spicy",
  "Chrome": "Citrus",
  "L'Homme Libre": "Woody",
  "Toy 2": "Fruity",
  "Bois Talisman": "Woody",
  "Stronger With You Sandalwood": "Woody",
  "CR7": "Fresh",
  "Tornado": "Sweet",
  "Privé Men": "Woody",
  "Gisada": "Sweet",
  "Bois Imperial": "Woody",
  "Ejaazi": "Oriental",
  "Le Male Lovers": "Sweet",
  "Le Beau Paradise Garden": "Fruity",
  "Patchouli": "Woody",
  "L.12.12 Silver Grey": "Fresh",
  "Eau de Lacoste L.12.12 White": "Fresh",
  "Armani Code Sport": "Citrus",
  "Armani Code Absolu": "Oriental",
  "Armani Code": "Oriental",
  "Allure Homme Sport": "Fresh",
  "Allure Homme Edition Blanche": "Citrus",
  "1 Million Lucky": "Woody",
  "Black XS": "Oriental",
  "Black XS L'Exces for Him": "Aquatic",
  "Noir Kogane": "Woody",
  "Blanc Kogane": "Musky",
  "Armani Privé Vert Malachite": "Floral",
  "Armani Privé Rouge Malachite": "Floral",
  "Blue Turquoise": "Citrus",
  "Light Blue Intense": "Citrus",
  "The One": "Oriental",
  "King": "Oriental",
  "Pineapple": "Fruity",
  "VIB 3": "Fruity",
  "Choco Violette": "Sweet",
  "Whisky Silver": "Woody",
  "Layl Malaki": "Oriental",
  "Kalemat": "Oriental",
  "Angel Share": "Sweet",
  "L'Amour": "Floral",
  "Almas": "Woody",
  "Kurky": "Oriental"
};

async function main() {
  console.log('🚀 UNIFIED REPAIR: Fixing both Scent Category and Gender Category...');
  
  const allProducts = await prisma.product.findMany({
    where: { brand: "Hama Fragrance" }
  });

  let updateCount = 0;

  for (const product of allProducts) {
    const scentFamily = scentMap[product.name];
    const originalGender = genderMap[product.name];
    
    // Determine the new values
    // If scentFamily is not in map, but product.category is currently a scent family, keep it.
    // If product.category is Man/Woman/Unisex, it definitely needs fixing.
    
    let newCategory = scentFamily || product.category;
    let newGender = originalGender || product.genderCategory;

    // Special logic: if current category is a gender, move it to genderCategory
    if (['Man', 'Woman', 'Unisex'].includes(product.category || '')) {
        newGender = product.category;
        // If we moved it, we need a new category. Reset to scentFamily if available, otherwise "Fresh"
        newCategory = scentFamily || "Fresh";
    }

    // Ensure first letter is capitalized
    if (newCategory) {
        newCategory = newCategory.charAt(0).toUpperCase() + newCategory.slice(1).toLowerCase();
    }
    if (newGender) {
        newGender = newGender.charAt(0).toUpperCase() + newGender.slice(1).toLowerCase();
    }

    // Performance optimization: only update if changed
    if (newCategory !== product.category || newGender !== product.genderCategory) {
        try {
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    category: newCategory,
                    genderCategory: newGender
                }
            });
            updateCount++;
        } catch (e) {
            console.error(`❌ Failed to update ${product.name}:`, e);
        }
    }
  }

  console.log(`✅ Success! Synchronized ${updateCount} products with dual-category mapping.`);
}

main().catch(console.error);
