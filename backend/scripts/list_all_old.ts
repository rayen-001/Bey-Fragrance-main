import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const OLD_DB = "postgresql://postgres:beyfragrance2026@db.eclgwlrrmfuzdkayqakg.supabase.co:5432/postgres";

async function listAllOld() {
  const client = new Client({ connectionString: OLD_DB });
  try {
    await client.connect();
    const res = await client.query('SELECT name FROM "Product"');
    console.log(`📋 TOTAL PRODUCTS IN OLD DB: ${res.rowCount}`);
    res.rows.forEach(r => console.log(`   - ${r.name}`));
  } finally {
    await client.end();
  }
}

listAllOld();
