import 'dotenv/config'
import { prisma } from './db/prisma'

async function main() {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { mainImage: { contains: 'supabase.co' } },
          { galleryImages: { hasSome: ['supabase.co'] } }
        ]
      },
      select: {
        name: true,
        mainImage: true
      }
    })
    console.log(`FOUND ${products.length} Supabase images`)
    products.forEach(p => console.log(`${p.name}: ${p.mainImage}`))
  } catch (error) {
    console.error('Error in debug script:', error)
  }
}

main()
