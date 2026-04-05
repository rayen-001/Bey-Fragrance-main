import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function fix() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    // Find products with Pinterest links
    const res = await client.query('SELECT id, name, main_image FROM products WHERE main_image LIKE \'%pinterest.com/pin/%\'');
    console.log(`🔍 Found ${res.rowCount} Pinterest pages to fix.`);

    for (const row of res.rows) {
      console.log(`📦 Processing: ${row.name}`);
      try {
        // 1. Fetch the Pinterest page
        const htmlRes = await fetch(row.main_image, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const html = await htmlRes.text();

        // 2. Find the og:image meta tag
        const match = html.match(/<meta property="og:image" content="(https:\/\/i\.pinimg\.com\/originals\/[^"]+)"/);
        let imageUrl = match ? match[1] : null;

        if (!imageUrl) {
            // Try another common pattern
            const altMatch = html.match(/"images":{"736x":{"url":"([^"]+)"/);
            imageUrl = altMatch ? altMatch[1] : null;
        }

        if (imageUrl) {
          console.log(`   ✅ Original image found: ${imageUrl}`);
          
          // 3. Download the real image
          const imgRes = await fetch(imageUrl);
          const buffer = await imgRes.arrayBuffer();

          // 4. Upload to Supabase
          const fileName = `${Date.now()}-${row.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('fragrances')
            .upload(fileName, buffer, { contentType: 'image/jpeg' });

          if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

          // 5. Update Database
          const newUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/fragrances/${fileName}`;
          await client.query('UPDATE products SET main_image = $1 WHERE id = $2', [newUrl, row.id]);
          console.log(`   ✨ Success! New URL: ${newUrl}`);
        } else {
          console.log(`   ❌ Could not find real image URL in Pinterest page.`);
        }
      } catch (err: any) {
        console.error(`   ❌ Failed for ${row.name}:`, err.message);
      }
    }
  } finally {
    await client.end();
  }
}

fix();
