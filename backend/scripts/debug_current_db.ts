import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function debugData() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const urlParts = connectionString.split('@')[1];
    console.log(`🔌 CONNECTED TO: ${urlParts}`);
    const res = await client.query('SELECT name, main_image FROM products');
    console.log('📋 CURRENT DB CONTENT:');
    res.rows.forEach(r => console.log(`   🔸 ${r.name} -> ${r.main_image}`));
  } finally {
    await client.end();
  }
}

debugData();
