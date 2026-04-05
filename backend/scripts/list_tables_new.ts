import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const NEW_DB = process.env.DATABASE_URL;

async function main() {
  if (!NEW_DB) {
    console.error('DATABASE_URL not set');
    return;
  }
  const client = new Client({ connectionString: NEW_DB });
  await client.connect();
  try {
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Tables in NEW DB:', res.rows.map(r => r.table_name));
    
    // Count products
    const productsRes = await client.query("SELECT count(*) FROM products");
    console.log('Products count in NEW DB:', productsRes.rows[0].count);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
