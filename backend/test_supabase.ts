import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
    console.log(`Connecting to: ${supabaseUrl}`);

    // Check Products Table
    const { data: products, error: pError } = await supabase.from('products').select('id, name').limit(3);
    if (pError) console.error("Error fetching products:", pError);
    else console.log(`✅ Products found: ${products.length} (first: ${products?.[0]?.name})`);

    // Check Users Table
    const { data: users, error: uError } = await supabase.from('users').select('id, email').limit(3);
    if (uError) console.error("Error fetching users:", uError);
    else console.log(`✅ Users found: ${users.length}`);

    // Check Orders Table
    const { data: orders, error: oError } = await supabase.from('orders').select('*').limit(3);
    if (oError) console.error("Error fetching orders:", oError);
    else console.log(`✅ Orders found: ${orders.length}`);
}

testSupabase();
