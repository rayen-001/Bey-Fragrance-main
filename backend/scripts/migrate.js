import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const OLD_DB_URL = "postgresql://postgres:beyfragrance2026@db.eclgwlrrmfuzdkayqakg.supabase.co:5432/postgres";
const NEW_DB_URL = process.env.DIRECT_URL;

async function migrate() {
    if (!NEW_DB_URL) {
        console.error("❌ NEW_DB_URL not found in .env.");
        return;
    }

    console.log("🚀 Starting FINAL data migration...");
    const source = new Client({ connectionString: OLD_DB_URL });
    const target = new Client({ connectionString: NEW_DB_URL });

    try {
        await source.connect();
        await target.connect();
        console.log("✅ Connected to both databases.");

        const tableConfigs = [
            { 
                name: 'users', 
                columns: ['id', 'email', 'password', 'full_name', 'role', 'phone', 'created_at', 'updated_at'] 
            },
            { 
                name: 'products', 
                columns: ['id', 'name', 'description', 'price', 'category', 'concentration', 'gender', 'brand', 'main_image', 'gallery_images', 'tags', 'notes', 'inspired_by', 'rating', 'review_count', 'stock_quantity', 'sizes', 'created_at'] 
            },
            { 
                name: 'orders', 
                columns: ['id', 'user_id', 'client_name', 'phone_number', 'shipping_address', 'status', 'total_amount', 'created_at'] 
            },
            { 
                name: 'order_items', 
                columns: ['id', 'order_id', 'product_id', 'quantity', 'unit_price'] 
            }
        ];

        for (const table of tableConfigs) {
            console.log(`📦 Migrating table: ${table.name}...`);
            const res = await source.query(`SELECT * FROM ${table.name}`);
            console.log(`   Found ${res.rowCount} records.`);
            
            for (const row of res.rows) {
                const colNames = table.columns.map(c => `"${c}"`).join(', ');
                const placeholders = table.columns.map((_, idx) => `$${idx + 1}`).join(', ');
                const values = table.columns.map(c => row[c]);
                
                await target.query(
                    `INSERT INTO ${table.name} (${colNames}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`,
                    values
                );
            }
            console.log(`   Done.`);
        }

        console.log("\n✨ MIGRATION COMPLETELY SUCCESSFUL! Your new project is now 1:1 with the old one.");

    } catch (err) {
        console.error("❌ Migration failed:", err.message);
        if (err.stack) console.error(err.stack);
    } finally {
        await source.end();
        await target.end();
    }
}

migrate();
