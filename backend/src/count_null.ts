import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const count = await prisma.product.count({ where: { category: null } });
  console.log('Products with NULL category:', count);
  const emptyStringCount = await prisma.product.count({ where: { category: '' } });
  console.log('Products with EMPTY STRING category:', emptyStringCount);
}

main().catch(console.error).finally(() => prisma.$disconnect());
