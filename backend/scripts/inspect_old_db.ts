import { Client } from 'pg';

const OLD_DB = "postgresql://postgres:beyfragrance2026@db.eclgwlrrmfuzdkayqakg.supabase.co:5432/postgres";

async function main() {
  const client = new Client({ connectionString: OLD_DB });
  await client.connect();
  try {
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Tables:', res.rows.map(r => r.table_name));
    
    // Check if 'products' exists
    const productsRes = await client.query("SELECT count(*) FROM products");
    console.log('Products (plural) count:', productsRes.rows[0].count);
    
    // Sample product
    const sampleProduct = await client.query("SELECT * FROM products LIMIT 10");
    if (sampleProduct.rows.length > 0) {
      console.log('Sample Products from OLD DB:');
      sampleProduct.rows.forEach(row => {
        console.log(`- ${row.name}: ${row.main_image}`);
      });
    } else {
      console.log('No products found in OLD DB.');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
