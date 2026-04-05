
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function inspect() {
    const OLD_URL = "postgresql://postgres:beyfragrance2026@db.eclgwlrrmfuzdkayqakg.supabase.co:5432/postgres";
    const NEW_URL = process.env.DIRECT_URL;

    console.log("🕵️ Inspecting databases...");

    for (const [label, url] of [["SOURCE", OLD_URL], ["TARGET", NEW_URL]] as const) {
        if (!url) { console.log(`\n--- ${label} --- (Skipped: No URL)`); continue; }
        console.log(`\n--- ${label} ---`);
        const c = new Client({ connectionString: url });
        try {
            await c.connect();
            for (const table of ['users', 'products', 'orders', 'order_items']) {
                try {
                    const r = await c.query(`SELECT count(*) FROM ${table}`);
                    console.log(`Table: ${table} -> Count: ${r.rows[0].count}`);
                } catch { console.log(`Table: ${table} -> Not found`); }
            }
        } catch (e: any) { console.error(`Error ${label}:`, e.message); }
        finally { await c.end(); }
    }
}
inspect();
