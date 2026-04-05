import 'dotenv/config'
import { prisma } from './db/prisma.js'

const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
  "https://images.unsplash.com/photo-1583467875263-d50dec37a88c?w=800",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
  "https://images.unsplash.com/photo-1588405748879-37bb850962f2?w=800",
  "https://images.unsplash.com/photo-1563170351-be02c88b4210?w=800",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
  "https://images.unsplash.com/photo-1590156221810-e62959cf0b31?w=800",
  "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",
  "https://images.unsplash.com/photo-1512777576244-b846ac3d816f?w=800"
];

async function main() {
  try {
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products to check...`);

    let updatedCount = 0;
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      let needsUpdate = false;
      let newMainImage = p.mainImage;
      let newGallery = [...p.galleryImages];

      // Check mainImage
      if (p.mainImage && p.mainImage.includes('pinimg.com')) {
        newMainImage = UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length];
        needsUpdate = true;
      }

      // Check gallery
      for (let j = 0; j < newGallery.length; j++) {
        if (newGallery[j].includes('pinimg.com')) {
          newGallery[j] = UNSPLASH_IMAGES[(i + j) % UNSPLASH_IMAGES.length];
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        console.log(`Updating product: ${p.name}`);
        await prisma.product.update({
          where: { id: p.id },
          data: {
            mainImage: newMainImage,
            galleryImages: newGallery
          }
        });
        updatedCount++;
      }
    }

    console.log(`✅ Bulk Fix Complete! Updated ${updatedCount} products with working images.`);
  } catch (error) {
    console.error('Error during bulk fix:', error);
  }
}

main()
