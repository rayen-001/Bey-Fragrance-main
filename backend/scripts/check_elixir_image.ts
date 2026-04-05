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
    const res = await client.query('SELECT main_image FROM products WHERE name = \'Golden Elixir\'');
    if (res.rowCount! > 0) {
      console.log(`🖼️ GOLDEN ELIXIR IMAGE: ${res.rows[0].main_image}`);
    } else {
      console.log('❌ Golden Elixir not found.');
    }
  } finally {
    await client.end();
  }
}

check();
