import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function testStorage() {
  console.log("Checking Supabase Storage for project:", process.env.SUPABASE_URL);
  
  // 1. List buckets
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  if (bError) {
    console.error("❌ Failed to list buckets:", bError.message);
    return;
  }
  
  const fragranceBucket = buckets.find(b => b.name === 'fragrances');
  if (!fragranceBucket) {
    console.log("❌ Bucket 'fragrances' NOT FOUND. Creating it...");
    const { error: cError } = await supabase.storage.createBucket('fragrances', { public: true });
    if (cError) {
      console.error("❌ Failed to create bucket:", cError.message);
    } else {
      console.log("✅ Bucket 'fragrances' created as PUBLIC.");
    }
  } else {
    console.log(`✅ Bucket 'fragrances' exists. Public: ${fragranceBucket.public}`);
    if (!fragranceBucket.public) {
      console.log("⚠️ Bucket is PRIVATE. Fixing it...");
      const { error: uError } = await supabase.storage.updateBucket('fragrances', { public: true });
      if (uError) console.error("❌ Failed to update bucket:", uError.message);
      else console.log("✅ Bucket 'fragrances' is now PUBLIC.");
    }
  }
  
  // 2. Try an upload
  console.log("Testing upload...");
  const testContent = "test file content";
  const { data: uData, error: uError } = await supabase.storage
    .from('fragrances')
    .upload('test_connection.txt', testContent, { upsert: true });
    
  if (uError) {
    console.error("❌ Upload failed:", uError.message);
  } else {
    console.log("✅ Upload successful!");
    const { data: { publicUrl } } = supabase.storage.from('fragrances').getPublicUrl('test_connection.txt');
    console.log("🔗 Public URL:", publicUrl);
    console.log("👉 Try opening this URL in your browser. If it downloads the text, your storage is fixed!");
  }
}

testStorage();
