import { prisma } from './src/db/prisma.js'
import dotenv from 'dotenv'

// Ensure we load the environment variables
dotenv.config()

async function main() {
  console.log('🚀 Starting price update across the database (50ml->25, 100ml->35)...');

  try {
    // 1. Update 50ml shipping methods
    const res50 = await prisma.shippingMethod.updateMany({
      where: { 
        name: { 
          contains: '50ml',
          mode: 'insensitive'
        } 
      },
      data: { price: 25 }
    })
    console.log(`✅ Updated ${res50.count} shipping methods for 50ml to 25 TND`);

    // 2. Update 100ml shipping methods
    const res100 = await prisma.shippingMethod.updateMany({
      where: { 
        name: { 
          contains: '100ml',
          mode: 'insensitive'
        } 
      },
      data: { price: 35 }
    })
    console.log(`✅ Updated ${res100.count} shipping methods for 100ml to 35 TND`);

    // 3. Update base product prices (default display price)
    const resProducts = await prisma.product.updateMany({
      data: { price: 25 }
    })
    console.log(`✅ Updated ${resProducts.count} base product prices to 25 TND`);

    console.log('✨ Database price update completed successfully.');
  } catch (error) {
    console.error('❌ FATAL ERROR during update:', error);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error updating prices:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Using $disconnect might be tricky if the proxy hasn't initialized 
    // but the get property on the proxy will initialize it.
    // However, it's safer to just exit if we can.
    process.exit(0);
  });
