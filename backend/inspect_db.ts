import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Products (Sample) ---');
  const products = await prisma.product.findMany({ take: 5 });
  products.forEach(p => console.log(`[Product] ID: ${p.id}, Name: ${p.id}`));

  console.log('\n--- Shipping Methods (Sample) ---');
  const methods = await prisma.shippingMethod.findMany({ take: 5 });
  methods.forEach(m => console.log(`[Method] ID: ${m.id}, Name: ${m.name}, Product ID: ${m.productId}`));

  console.log('\n--- Orders (Sample) ---');
  const orders = await prisma.order.findMany({ take: 5, include: { items: true } });
  orders.forEach(o => console.log(`[Order] ID: ${o.id}, Items: ${o.items.length}`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
