import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const OLD_DB = "postgresql://postgres:beyfragrance2026@db.eclgwlrrmfuzdkayqakg.supabase.co:5432/postgres";

async function checkOld() {
  const client = new Client({ connectionString: OLD_DB });
  try {
    await client.connect();
    const res = await client.query('SELECT name, "mainImage", gallery_images FROM "Product" LIMIT 5');
    console.log('📦 OLD DATABASE SAMPLES:');
    res.rows.forEach(r => {
      console.log(`   - Product: ${r.name}`);
      console.log(`     Main: ${r.mainImage}`);
    });
  } catch (err: any) {
    // If table casing is wrong, try lowercase
    try {
      const res2 = await client.query('SELECT name, main_image FROM products LIMIT 5');
        console.log('📦 OLD DATABASE SAMPLES (Lowercase):');
        res2.rows.forEach(r => {
          console.log(`   - Product: ${r.name}`);
          console.log(`     Main: ${r.main_image}`);
        });
    } catch (err2: any) {
        console.error('❌ Table not found in old DB:', err2.message);
    }
  } finally {
    await client.end();
  }
}

checkOld();
