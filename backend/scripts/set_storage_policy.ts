import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function setPolicy() {
  console.log('🔓 Unlocking Supabase Storage images...');

  const client = new Client({ connectionString });
  
  try {
    await client.connect();

    // SQL to create a public read policy for the 'fragrances' bucket
    const sql = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' 
          AND schemaname = 'storage' 
          AND policyname = 'Public Access'
        ) THEN
          CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'fragrances');
        END IF;
      END
      $$;
    `;

    await client.query(sql);
    console.log('✅ Storage Policy "Public Access" created successfully!');
    console.log('🎉 Your images should now be visible on your website.');
  } catch (err: any) {
    console.error('❌ Error creating policy:', err.message);
  } finally {
    await client.end();
  }
}

setPolicy();
