import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const p = await prisma.product.findFirst({ where: { name: 'Roses Musk' } });
  console.log(JSON.stringify(p, null, 2));
}

main().catch(console.error);
