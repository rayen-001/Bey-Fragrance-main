import pkg from 'pg';
const { Client } = pkg;

async function migrate() {
    const OLD_DB = "postgresql://postgres:beyfragrance2026@db.eclgwlrrmfuzdkayqakg.supabase.co:5432/postgres";
    const NEW_DB = "postgresql://postgres:Thugstools120*pp@db.ttynzjozzzwhwmkysjov.supabase.co:5432/postgres";

    const oldClient = new Client(OLD_DB);
    const newClient = new Client(NEW_DB);

    try {
        console.log('Connecting to databases...');
        await oldClient.connect();
        await newClient.connect();

        const tables = ['users', 'products', 'favorites', 'cart_items', 'orders', 'order_items', 'reviews'];

        for (const table of tables) {
            console.log(`Migrating table: ${table}...`);
            
            // 1. Fetch data from OLD
            const res = await oldClient.query(`SELECT * FROM public.${table}`);
            const rows = res.rows;
            console.log(`  Found ${rows.length} rows.`);

            if (rows.length === 0) continue;

            // 2. Clear NEW table
            // Note: We use TRUNCATE CASCADE to handle foreign keys
            await newClient.query(`TRUNCATE public.${table} CASCADE`);

            // 3. Prepare Insertion
            const columns = Object.keys(rows[0]);
            const colList = columns.map(c => `"${c}"`).join(', ');
            const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

            const insertQuery = `INSERT INTO public.${table} (${colList}) VALUES (${placeholders})`;

            // 4. Batch Insert (simplified)
            for (const row of rows) {
                const values = columns.map(col => row[col]);
                await newClient.query(insertQuery, values);
            }
            console.log(`  Successfully migrated ${table}.`);
        }

        console.log('🚀 UNIVERSE RESTORED! All products, users, and data are migrated.');
    } catch (e) {
        console.error('Migration Aborted:', e.message);
    } finally {
        await oldClient.end();
        await newClient.end();
    }
}

migrate();
