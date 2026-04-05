import { Client } from 'pg';
import { PrismaClient } from '@prisma/client';

// OLD CREDENTIALS
const OLD_DB = "postgresql://postgres:beyfragrance2026@db.eclgwlrrmfuzdkayqakg.supabase.co:5432/postgres";

// NEW CLIENT (Uses current .env)
const prisma = new PrismaClient();

async function migrate() {
  const oldClient = new Client({ connectionString: OLD_DB });
  
  try {
    console.log('Connecting to old database...');
    await oldClient.connect();
    
    // 1. Get Products
    console.log('Fetching old products...');
    const productsRes = await oldClient.query('SELECT * FROM "Product"');
    const products = productsRes.rows;
    console.log(`Found ${products.length} products.`);

    // 2. Get Users
    console.log('Fetching old users...');
    const usersRes = await oldClient.query('SELECT * FROM "User"');
    const users = usersRes.rows;
    console.log(`Found ${users.length} users.`);

    // 3. Migrate Products to New DB
    console.log('Migrating products to new database...');
    for (const p of products) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {
          name: p.name,
          brand: p.brand,
          inspiredBy: p.inspiredBy,
          description: p.description,
          price: p.price,
          category: p.category,
          concentration: p.concentration,
          gender: p.gender,
          notes: Array.isArray(p.notes) ? p.notes : (p.notes ? [p.notes] : []),
          stockQuantity: p.stockQuantity,
          mainImage: p.mainImage,
          galleryImages: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
        },
        create: {
          id: p.id,
          name: p.name,
          brand: p.brand,
          inspiredBy: p.inspiredBy,
          description: p.description,
          price: p.price,
          category: p.category,
          concentration: p.concentration,
          gender: p.gender,
          notes: Array.isArray(p.notes) ? p.notes : (p.notes ? [p.notes] : []),
          stockQuantity: p.stockQuantity,
          mainImage: p.mainImage,
          galleryImages: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
        }
      });
    }

    // 4. Migrate Users to New DB
    console.log('Migrating users to new database...');
    for (const u of users) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {
          email: u.email,
          fullName: u.fullName,
          password: u.password,
          role: u.role,
        },
        create: {
          id: u.id,
          email: u.email,
          fullName: u.fullName,
          password: u.password,
          role: u.role,
        }
      });
    }

    console.log('🚀 MIGRATION COMPLETE! Your original data is now in the new project.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await oldClient.end();
    await prisma.$disconnect();
  }
}

migrate();
