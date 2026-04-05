import 'dotenv/config';
import { prisma } from './db/prisma.js';

async function main() {
  console.log('--- Order Debugging ---');
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      }
    });

    console.log(`Total Orders: ${orders.length}`);
    orders.forEach((o: any, i: number) => {
      console.log(`\nOrder #${i+1}:`);
      console.log(`- ID: ${o.id}`);
      console.log(`- UserID: ${o.userId || 'GUEST (NULL)'}`);
      console.log(`- Status: ${o.status}`);
      console.log(`- Date: ${o.createdAt}`);
      console.log(`- Items: ${o.items.length}`);
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
  }
}

main();
