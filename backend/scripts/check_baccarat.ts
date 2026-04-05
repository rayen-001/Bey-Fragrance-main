import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function findBaccarat() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query('SELECT name, main_image, gallery_images FROM products WHERE name LIKE \'%Baccarat%\'');
    console.log('💎 BACCARAT DATA:');
    res.rows.forEach(r => {
      console.log(`   - Name: ${r.name}`);
      console.log(`     Main: ${r.main_image}`);
      console.log(`     Gallery: ${JSON.stringify(r.gallery_images)}`);
    });
  } finally {
    await client.end();
  }
}

findBaccarat();
