
import { prisma } from './db/prisma';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    const products = await prisma.product.findMany({
      select: { name: true }
    });

    console.log(`Current products in DB: ${products.length}`);
    products.forEach(p => console.log(`- ${p.name}`));
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    // No explicit disconnect needed here as it's a proxy 
    // but Prisma client can be closed
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
