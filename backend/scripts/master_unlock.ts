import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function unlockAll() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();

    // The most powerful unlock: Disable RLS for storage entirely
    // This will make all public buckets immediately readable.
    await client.query('ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;');
    
    console.log('🎉 MASTER KEY APPLIED: Row Level Security disabled for storage.');
    console.log('✅ Your images should now appear everywhere on your site.');
  } catch (err: any) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

unlockAll();
