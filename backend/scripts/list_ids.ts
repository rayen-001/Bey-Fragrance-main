import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function listIds() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query('SELECT id, name FROM products');
    console.log('🆔 ALL PRODUCT IDS:');
    res.rows.forEach(r => console.log(`   - ${r.name}: ${r.id}`));
  } finally {
    await client.end();
  }
}

listIds();
