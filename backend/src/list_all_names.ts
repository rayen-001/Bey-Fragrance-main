import { prisma } from './db/prisma';
import 'dotenv/config';
import fs from 'fs';

async function main() {
  const p = await prisma.product.findMany({ select: { name: true } });
  fs.writeFileSync('all_names.txt', p.map(x => x.name).join('\n'));
}

main().catch(console.error);
