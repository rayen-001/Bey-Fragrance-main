import path from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, './.env') })

import { prisma } from './src/db/prisma.js'

async function updateDb() {
  console.log('🚀 Starting surgical DB update with corrected table names...')
  
  try {
    // 1. Delete all 20ml shipping methods
    const deletedMethods = await prisma.$executeRaw`DELETE FROM "shipping_methods" WHERE "name" = '20ml'`
    console.log(`✅ Deleted ${deletedMethods} occurrences of 20ml shipping methods.`)

    // 2. Update 50ml prices to 22
    const updated50 = await prisma.$executeRaw`UPDATE "shipping_methods" SET "price" = 22 WHERE "name" = '50ml'`
    console.log(`✅ Updated ${updated50} occurrences of 50ml prices to 22.`)

    // 3. Update 100ml prices to 32
    const updated100 = await prisma.$executeRaw`UPDATE "shipping_methods" SET "price" = 32 WHERE "name" = '100ml'`
    console.log(`✅ Updated ${updated100} occurrences of 100ml prices to 32.`)

    // 4. Update product base prices
    const updatedProducts = await prisma.$executeRaw`UPDATE "products" SET "price" = 22`
    console.log(`✅ Updated ${updatedProducts} products' base price to 22.`)

    console.log('🎉 DB update complete!')
  } catch (error) {
    console.error('❌ Error during DB update:', error)
  } finally {
    // Disconnect if possible
  }
}

updateDb()
