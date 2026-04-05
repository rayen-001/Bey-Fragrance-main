import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';
const { Client } = pg;
const c = new Client(process.env.DATABASE_URL);
c.connect().then(() => c.query("SELECT count(*) as total, (SELECT name FROM products LIMIT 1) as name FROM products")).then(res => {
fs.writeFileSync('tables.json', JSON.stringify(res.rows, null, 2));
c.end();
}).catch(e => {
fs.writeFileSync('tables.json', JSON.stringify({error: e.message}));
});
