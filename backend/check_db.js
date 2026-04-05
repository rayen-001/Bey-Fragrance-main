import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;
const c = new Client(process.env.DIRECT_URL);
c.connect().then(() => c.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")).then(res => {
console.log('TABLES:', res.rows.map(r => r.table_name));
c.end();
}).catch(e => console.error(e.message));
