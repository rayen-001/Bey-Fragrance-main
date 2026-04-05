import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function checkElixir() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query('SELECT * FROM products WHERE name = \'Golden Elixir\'');
    console.log('✨ GOLDEN ELIXIR DATA:');
    console.log(res.rows);
  } finally {
    await client.end();
  }
}

checkElixir();
