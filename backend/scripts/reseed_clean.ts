import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || '';

async function reseed() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    console.log('🗑️ DELETING ALL PRODUCTS...');
    await client.query('DELETE FROM products');

    const products = [
      { name: "Azure Intense", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800", inspired: "Bleu de Chanel" },
      { name: "Golden Elixir", img: "https://images.unsplash.com/photo-1592947966142-97ee1961b992?w=800", inspired: "Baccarat Rouge 540" },
      { name: "Midnight Petal", img: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800", inspired: "Black Opium" },
      { name: "Velvet Tobacco", img: "https://images.unsplash.com/photo-1583467875263-d50dec37a88c?w=800", inspired: "Tobacco Vanille" }
    ];

    console.log('🌱 SEEDING NEW PRODUCTS...');
    for (const p of products) {
      await client.query(
        'INSERT INTO products (id, name, main_image, price, category, stock_quantity, inspired_by, brand) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          crypto.randomUUID(),
          p.name,
          p.img,
          85.00,
          'Premium',
          50,
          p.inspired,
          'Bey Fragrance'
        ]
      );
    }
    console.log('✅ RE-SEED COMPLETE!');
  } finally {
    await client.end();
  }
}

reseed();
