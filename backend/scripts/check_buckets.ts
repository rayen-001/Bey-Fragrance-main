import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function check() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) console.error(error.message);
  else {
    console.log('📦 BUCKETS FOUND:');
    data.forEach(b => console.log(`   - ID: ${b.id}, Name: ${b.name}, Public: ${b.public}`));
  }
}

check();
