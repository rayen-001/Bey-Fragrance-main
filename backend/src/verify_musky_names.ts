import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
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
    "Mon Paris"
  ];

  const dbProducts = await prisma.product.findMany({
    where: { name: { in: muskyNames } },
    select: { name: true }
  });

  const foundNames = dbProducts.map(p => p.name);
  const missingNames = muskyNames.filter(n => !foundNames.includes(n));

  console.log('--- FOUND ---');
  console.log(foundNames.join(' | '));
  console.log('\n--- MISSING ---');
  console.log(missingNames.join(' | '));
}

main().catch(console.error);
