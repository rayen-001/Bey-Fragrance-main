import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function check() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query('SELECT id, name, image_url FROM "Product" WHERE image_url LIKE \'%pinterest%\'');
    console.log(`🔍 Found ${res.rowCount} products with Pinterest links:`);
    res.rows.forEach(r => console.log(`   - ${r.name}: ${r.image_url}`));
  } finally {
    await client.end();
  }
}

check();
