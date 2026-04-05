import 'dotenv/config'
import { prisma } from './db/prisma'

async function main() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        mainImage: true,
        galleryImages: true
      }
    })
    console.log(`FOUND ${products.length} products in database`)
    products.forEach(p => {
      console.log(`PRODUCT: ${p.name} (id: ${p.id})`)
      console.log(`  - Main Image: ${p.mainImage}`)
      console.log(`  - Gallery: ${p.galleryImages.join(', ')}`)
    })
  } catch (error) {
    console.error('Error listing all products:', error)
  }
}

main()
