import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function robustFix() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    // Get all products
    const res = await client.query('SELECT id, name, main_image, gallery_images FROM products');
    console.log(`🔍 Processing ${res.rowCount} products...`);

    for (const row of res.rows) {
      console.log(`\n📦 Product: ${row.name}`);
      let updatedMain = row.main_image;
      let updatedGallery = row.gallery_images || [];
      let needsUpdate = false;

      // Helper function to process a single URL
      const processUrl = async (url: string, context: string) => {
        if (!url || !url.includes('pinterest')) return url;
        
        console.log(`   🛠️ Fixing ${context}: ${url}`);
        try {
          let directImageUrl = url;

          // 1. If it's a Pin page, scrape it
          if (url.includes('/pin/')) {
            const htmlRes = await fetch(url, {
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
            });
            const html = await htmlRes.text();
            const match = html.match(/<meta property="og:image" content="(https:\/\/i\.pinimg\.com\/originals\/[^"]+)"/);
            const altMatch = html.match(/"images":{"736x":{"url":"([^"]+)"/);
            directImageUrl = match ? match[1] : (altMatch ? altMatch[1] : url);
          }

          if (!directImageUrl.includes('i.pinimg.com')) {
            console.log(`   ⚠️ Could not find direct image for ${url}, skipping...`);
            return url;
          }

          // 2. Download direct image
          const imgRes = await fetch(directImageUrl, {
             headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
          });
          if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.statusText}`);
          
          const buffer = await imgRes.arrayBuffer();

          // 3. Upload to Supabase
          const fileName = `${Date.now()}-${row.name.replace(/\s+/g, '-').toLowerCase()}-${context}.jpg`;
          const { data, error } = await supabase.storage
            .from('fragrances')
            .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true });

          if (error) throw new Error(`Upload failed: ${error.message}`);

          // 4. Return new public URL
          needsUpdate = true;
          return `${process.env.SUPABASE_URL}/storage/v1/object/public/fragrances/${fileName}`;
        } catch (err: any) {
          console.error(`   ❌ Failed: ${err.message}`);
          return url;
        }
      };

      // Process Main Image
      updatedMain = await processUrl(row.main_image, 'main');

      // Process Gallery Images
      const newGallery = [];
      for (let i = 0; i < updatedGallery.length; i++) {
        newGallery.push(await processUrl(updatedGallery[i], `gallery-${i}`));
      }
      updatedGallery = newGallery;

      // Save if anything changed
      if (needsUpdate) {
        await client.query('UPDATE products SET main_image = $1, gallery_images = $2 WHERE id = $3', [updatedMain, updatedGallery, row.id]);
        console.log(`   ✨ SAVED: Database updated.`);
      } else {
        console.log(`   ✅ OK: Not point to Pinterest.`);
      }
    }
  } finally {
    await client.end();
  }
}

robustFix();
