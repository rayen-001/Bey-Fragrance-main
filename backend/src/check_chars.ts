
import { prisma } from './db/prisma';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const products = await prisma.product.findMany({
    where: { name: { contains: 'Homme' } },
    select: { name: true }
  });

  products.forEach(p => {
    console.log(`Name: "${p.name}"`);
    for (let i = 0; i < p.name.length; i++) {
        process.stdout.write(p.name.charCodeAt(i).toString(16) + ' ');
    }
    console.log('\n');
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
