import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const categories = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
    where: { brand: "Hama Fragrance" }
  });
  console.log('Categories:', categories);

  const genders = await prisma.product.groupBy({
    by: ['genderCategory'],
    _count: true,
    where: { brand: "Hama Fragrance" }
  });
  console.log('Genders:', genders);
  
  const freshProducts = await prisma.product.findMany({
    where: { 
        brand: "Hama Fragrance",
        category: "Fresh"
    },
    select: { name: true }
  });
  console.log('Fresh Products:', freshProducts.map(p => p.name));
}

main().catch(console.error);
