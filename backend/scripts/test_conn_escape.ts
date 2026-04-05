import { Client } from 'pg';

const URL = "postgresql://postgres:Thugstools120%2App@db.ttynzjozzzwhwmkysjov.supabase.co:5432/postgres";

async function testConnection() {
  console.log('Testing connection with escaped asterisk...');
  const client = new Client({ connectionString: URL });
  try {
    await client.connect();
    console.log('✅ Connection Successful with escaped asterisk!');
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.log('❌ Connection Failed with escaped asterisk:', error);
  } finally {
    await client.end();
  }
}

testConnection();
