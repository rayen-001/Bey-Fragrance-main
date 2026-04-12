import { prisma } from './db/prisma';
import 'dotenv/config';

const checkNames = [
  "Allure Homme Edition Blanche",
  "1 Million Lucky",
  "Black XS",
  "Black XS L'Exces for Him",
  "Noir Kogane",
  "Blanc Kogane",
  "Armani Privé Vert Malachite",
  "Armani Privé Rouge Malachite",
  "Blue Turquoise",
  "Light Blue Intense",
  "The One",
  "King",
  "Pineapple",
  "VIB 3",
  "Choco Violette",
  "Whisky Silver",
  "Layl Malaki",
  "Kalemat",
  "Angel Share",
  "L'Amour",
  "Almas",
  "Kurky"
];

async function main() {
  const products = await prisma.product.findMany({
    where: { 
        brand: "Hama Fragrance",
        name: { in: checkNames }
    },
    select: { name: true, category: true, genderCategory: true }
  });
  products.forEach(p => {
    console.log(`${p.name} | Category: ${p.category} | Gender: ${p.genderCategory}`);
  });
}

main().catch(console.error);
