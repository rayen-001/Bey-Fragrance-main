import pkg from 'pg';
const { Client } = pkg;

async function check() {
    const OLD_DB = "postgresql://postgres:beyfragrance2026@db.eclgwlrrmfuzdkayqakg.supabase.co:5432/postgres";
    const client = new Client(OLD_DB);
    try {
        await client.connect();
        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        console.log('SURVEY:' + JSON.stringify(res.rows.map(r => r.table_name)));
    } catch (e) {
        console.error('ERR:' + e.message);
    } finally {
        await client.end();
    }
}
check();
