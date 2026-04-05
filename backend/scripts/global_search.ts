import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function globalSearch() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    // Find all tables that have a name column or similar
    const tablesRes = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    
    for (const row of tablesRes.rows) {
      const tableName = row.table_name;
      try {
        const searchRes = await client.query(`SELECT * FROM "${tableName}" WHERE CAST(name AS TEXT) ILIKE '%Baccarat%'`);
        if (searchRes.rowCount! > 0) {
          console.log(`💎 FOUND IN TABLE: ${tableName}`);
          console.log(searchRes.rows);
        }
      } catch (e) {
        // Skip tables without 'name' column
      }
    }
  } finally {
    await client.end();
  }
}

globalSearch();
