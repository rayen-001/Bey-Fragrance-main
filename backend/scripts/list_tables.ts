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
    const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('📋 PROJECT TABLES:');
    res.rows.forEach(r => console.log(`   - ${r.table_name}`));
  } finally {
    await client.end();
  }
}

check();
