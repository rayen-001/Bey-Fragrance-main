import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function list() {
  console.log('📦 Checking "fragrances" bucket contents...');
  const { data, error } = await supabase.storage.from('fragrances').list();
  
  if (error) {
    console.error('❌ Error listing files:', error.message);
  } else {
    console.log(`✅ Found ${data.length} files in the bucket!`);
    data.slice(0, 5).forEach(f => console.log(`   - ${f.name}`));
    if (data.length > 5) console.log(`   ... and ${data.length - 5} more.`);
  }
}

list();
