import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function listTables() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('📋 ALL TABLES:');
    res.rows.forEach(r => console.log(`   - ${r.table_name}`));

    // Check content of EVERY table that might be products
    for (const r of res.rows) {
      if (r.table_name.toLowerCase().includes('product') || r.table_name.toLowerCase().includes('fragrance')) {
        const content = await client.query(`SELECT COUNT(*) FROM "${r.table_name}"`);
        console.log(`   🔸 ${r.table_name}: ${content.rows[0].count} rows`);
      }
    }
  } finally {
    await client.end();
  }
}

listTables();
