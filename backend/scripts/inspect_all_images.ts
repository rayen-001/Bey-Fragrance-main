import { Client } from 'pg';
import * as fs from 'fs';

const OLD_DB = "postgresql://postgres:beyfragrance2026@db.eclgwlrrmfuzdkayqakg.supabase.co:5432/postgres";

async function main() {
  const client = new Client({ connectionString: OLD_DB });
  await client.connect();
  try {
    const res = await client.query("SELECT name, main_image FROM products");
    let output = '';
    res.rows.forEach(row => {
      output += `${row.name}: ${row.main_image}\n`;
    });
    fs.writeFileSync('all_images.txt', output);
    console.log('Done writing to all_images.txt');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
