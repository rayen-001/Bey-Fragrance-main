import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function setPolicy() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();

    // 1. Drop existing one just in case
    await client.query('DROP POLICY IF EXISTS "Public Access" ON storage.objects;');
    
    // 2. Create the new one
    await client.query('CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = \'fragrances\');');

    console.log('✅ FORCED: Storage Policy created successfully!');
  } catch (err: any) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

setPolicy();
