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
      { name: "Azure Intense", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800", inspired: "Bleu de Chanel" },
      { name: "Golden Elixir", img: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800", inspired: "Baccarat Rouge 540" },
      { name: "Midnight Petal", img: "https://images.unsplash.com/photo-1592947966142-97ee1961b992?w=800", inspired: "Black Opium" },
      { name: "Velvet Tobacco", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800", inspired: "Tobacco Vanille" },
      { name: "Savage Spirit", img: "https://images.unsplash.com/photo-1588405864443-f111de999605?w=800", inspired: "Sauvage" },
      { name: "Silk Santal", img: "https://images.unsplash.com/photo-1615484477778-ca3b77942c2c?w=800", inspired: "Santal 33" },
      { name: "Rose Empress", img: "https://images.unsplash.com/photo-1616949113021-aa2f14371465?w=800", inspired: "Rose Prick" },
      { name: "Imperial Venture", img: "https://images.unsplash.com/photo-1617814076367-b757c7a72d48?w=800", inspired: "Aventus" },
      { name: "Oceanic Mist", img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800", inspired: "Acqua di Gio" },
      { name: "Oud Horizon", img: "https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=800", inspired: "Oud Wood" }
    ];

    console.log('🌱 SEEDING 10 NEW PRODUCTS...');
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
    console.log('✅ RE-SEED COMPLETE! 10 Products ready.');
  } finally {
    await client.end();
  }
}

reseed();
