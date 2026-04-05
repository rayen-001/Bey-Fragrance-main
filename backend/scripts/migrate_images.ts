import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();
const NEW_SUPABASE_URL = process.env.SUPABASE_URL || '';
const NEW_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SERVICE_ROLE_KEY);

// Old project ID from your migration script
const OLD_PROJECT_ID = 'eclgwlrrmfuzdkayqakg';

async function migrateImages() {
  console.log('🖼️ Starting image migration from old Supabase to new one...');

  const products = await prisma.product.findMany();
  console.log(`Checking ${products.length} products...`);

  for (const product of products) {
    const imagesToProcess = [product.mainImage, ...(product.galleryImages as string[] || [])];
    
    for (const imageUrl of imagesToProcess) {
      if (!imageUrl) continue;

      // Check if it's a Supabase storage URL (and not Pinterest or something else)
      if (imageUrl.includes('supabase.co') && imageUrl.includes('/storage/v1/object/public/fragrances/')) {
        const fileName = imageUrl.split('/').pop();
        if (!fileName) continue;

        console.log(`   📦 Migrating image: ${fileName}...`);

        try {
          // 1. Download from old Supabase (using public URL)
          const response = await fetch(imageUrl);
          if (!response.ok) {
            console.error(`      ❌ Failed to download ${fileName} (HTTP ${response.status})`);
            continue;
          }
          const buffer = await response.arrayBuffer();

          // 2. Upload to new Supabase
          const { error: uploadError } = await newSupabase.storage
            .from('fragrances')
            .upload(fileName, buffer, {
              contentType: response.headers.get('content-type') || 'image/jpeg',
              upsert: true
            });

          if (uploadError) {
            console.error(`      ❌ Upload failed for ${fileName}:`, uploadError.message);
          } else {
            // 3. Update the URL in the database to point to the NEW Supabase project
            const newUrl = `${NEW_SUPABASE_URL}/storage/v1/object/public/fragrances/${fileName}`;
            
            // Note: Since you're using this for both main and gallery, we'd need more complex logic to update.
            // For now, let's just make sure the file exists in the new bucket with the SAME filename.
            // If the filename is the same, your app will automatically load it once we 
            // update the base URL in api.ts or the database urls.
            
            console.log(`      ✅ Successfully migrated ${fileName}`);
          }
        } catch (err) {
          console.error(`      ⚠️ Error processing ${fileName}:`, err);
        }
      }
    }
  }

  console.log('🚀 IMAGE MIGRATION COMPLETE!');
}

migrateImages();
