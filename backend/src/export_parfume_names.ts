
import { prisma } from './db/prisma';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  try {
    const products = await prisma.product.findMany({
      select: { name: true },
      orderBy: { name: 'asc' }
    });

    const names = products.map(p => p.name).join('\n');
    const outputPath = path.join(process.cwd(), '..', 'parfume_supabase.txt');
    
    fs.writeFileSync(outputPath, names, 'utf8');

    console.log(`Successfully exported ${products.length} perfume names to: ${outputPath}`);
  } catch (error) {
    console.error('Error exporting products:', error);
    process.exit(1);
  }
}

main();
