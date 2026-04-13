import { prisma } from './db/prisma';
import 'dotenv/config';
import * as fs from 'fs';

async function main() {
  const cats = await prisma.product.groupBy({ by: ['category'], _count: true });
  const genders = await prisma.product.groupBy({ by: ['genderCategory'], _count: true });
  
  console.log('Categories:', cats);
  console.log('Genders:', genders);
  
  const freshInGender = await prisma.product.findMany({
    where: { genderCategory: { contains: 'Fresh', mode: 'insensitive' } },
    select: { name: true, category: true, genderCategory: true }
  });
  console.log('Fresh in Gender Field:', freshInGender);
}

main().catch(console.error).finally(() => prisma.$disconnect());
