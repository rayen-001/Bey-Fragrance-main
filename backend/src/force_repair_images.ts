import 'dotenv/config'
import { prisma } from './db/prisma'

const UPDATES = [
  { name: "Savage Spirit", url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800" },
  { name: "Imperial Venture", url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800" },
  { name: "Golden Elixir", url: "https://images.unsplash.com/photo-1583467875263-d50dec37a88c?w=800" },
  { name: "Azure Intense", url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800" },
  { name: "Midnight Petal", url: "https://images.unsplash.com/photo-1588405748879-37bb850962f2?w=800" },
  { name: "Oud Horizon", url: "https://images.unsplash.com/photo-1563170351-be02c88b4210?w=800" },
  { name: "Velvet Tobacco", url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800" },
  { name: "Silk Santal", url: "https://images.unsplash.com/photo-1590156221810-e62959cf0b31?w=800" },
  { name: "Rose Empress", url: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800" },
  { name: "Oceanic Mist", url: "https://images.unsplash.com/photo-1512777576244-b846ac3d816f?w=800" }
];

async function main() {
  console.log("Starting forced database image update...");
  for (const item of UPDATES) {
    try {
      const result = await prisma.product.updateMany({
        where: { name: item.name },
        data: { mainImage: item.url }
      });
      console.log(`Updated ${item.name}: ${result.count} record(s) -> ${item.url}`);
    } catch (e) {
      console.error(`Failed to update ${item.name}:`, e);
    }
  }
  console.log("Forced update complete.");
}

main();
