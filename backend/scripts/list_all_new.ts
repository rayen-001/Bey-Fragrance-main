import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function listAll() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query('SELECT name FROM products');
    console.log(`📋 TOTAL PRODUCTS IN NEW DB: ${res.rowCount}`);
    res.rows.forEach(r => console.log(`   - ${r.name}`));
  } finally {
    await client.end();
  }
}

listAll();
