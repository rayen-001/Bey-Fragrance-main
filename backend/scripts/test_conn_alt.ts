import { Client } from 'pg';

const URL = "postgresql://postgres:beyfragrance2026@db.ttynzjozzzwhwmkysjov.supabase.co:5432/postgres";

async function testConnection() {
  console.log('Testing connection with alternative password...');
  const client = new Client({ connectionString: URL });
  try {
    await client.connect();
    console.log('✅ Connection Successful with beyfragrance2026!');
  } catch (err) {
    console.log('❌ Connection Failed with beyfragrance2026');
  } finally {
    await client.end();
  }
}

testConnection();
