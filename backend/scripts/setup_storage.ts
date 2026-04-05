import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupStorage() {
  console.log('📦 Setting up Supabase Storage...');

  // 1. Create the bucket
  const { data, error } = await supabase.storage.createBucket('fragrances', {
    public: true, // Make it public immediately
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    fileSizeLimit: 5242880 // 5MB limit
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Bucket "fragrances" already exists.');
    } else {
      console.error('❌ Error creating bucket:', error.message);
      return;
    }
  } else {
    console.log('🎉 Bucket "fragrances" created successfully and set to PUBLIC!');
  }

  console.log('🚀 You can now upload images to this bucket.');
}

setupStorage();
