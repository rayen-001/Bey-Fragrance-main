import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eclgwlrrmfuzdkayqakg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbGd3bHJybWZ1emRrYXlxYWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUyOTU0NSwiZXhwIjoyMDkwMTA1NTQ1fQ.Fn8YHy1BwNNxMuwReiWHGZOOHZZBokegD1seNZPUnaE'; 

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.storage.createBucket('fragrances', {
    public: true,
  });
  if (error) {
    console.log('Bucket might already exist or error:', error.message);
    // Ensure it's public if it exists
    await supabase.storage.updateBucket('fragrances', { public: true });
    console.log('Ensured bucket is set to public.');
  } else {
    console.log('Successfully created "fragrances" bucket:', data);
  }
}
run();
