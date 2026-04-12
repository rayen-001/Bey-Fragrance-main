import { prisma } from './db/prisma';
import 'dotenv/config';

async function main() {
  const count = await prisma.product.count({
    where: { brand: "Hama Fragrance" }
  });
  console.log(`Total "Hama Fragrance" products: ${count}`);
  
  const allCount = await prisma.product.count();
  console.log(`Total products in database: ${allCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
