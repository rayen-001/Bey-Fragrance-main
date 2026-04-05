import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const URL = process.env.DATABASE_URL;

async function testConnection() {
  console.log('Testing connection to:', URL);
  const client = new Client({ connectionString: URL });
  try {
    await client.connect();
    console.log('✅ Connection Successful!');
    const res = await client.query('SELECT NOW()');
    console.log('Time from DB:', res.rows[0]);
  } catch (err) {
    console.error('❌ Connection Failed:', err);
  } finally {
    await client.end();
  }
}

testConnection();
