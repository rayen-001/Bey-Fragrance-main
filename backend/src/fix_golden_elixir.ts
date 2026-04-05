import 'dotenv/config'
import { prisma } from './db/prisma.js'

async function main() {
  try {
    const name = 'Golden Elixir'
    const workingUrl = 'https://images.unsplash.com/photo-1583522676223-b10da208430e?w=800'
    
    // Find product
    const product = await prisma.product.findFirst({
      where: { name }
    })
    
    if (product) {
      console.log(`Found product ${name} (id: ${product.id}). Updating image...`)
      await prisma.product.update({
        where: { id: product.id },
        data: { mainImage: workingUrl }
      })
      console.log('✅ Update successful!')
    } else {
      console.log(`❌ Product ${name} not found.`)
    }
  } catch (error) {
    console.error('Error updating golden elixir:', error)
  }
}

main()
