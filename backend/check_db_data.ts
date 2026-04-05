import path from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, './.env') })

import { prisma } from './src/db/prisma.js'

async function checkData() {
  try {
    const products = await prisma.product.findMany({
      include: {
        shippingMethods: true
      }
    })
    console.log('--- PRODUCTS IN DB ---')
    products.forEach(p => {
      console.log(`Product: ${p.name}, Base Price: ${p.price}`)
      console.log(`  Sizes JSON: ${JSON.stringify(p.sizes)}`)
      p.shippingMethods.forEach(sm => {
        console.log(`  - Relation Size: ${sm.name}, Price: ${sm.price}`)
      })
    })
  } catch (error) {
    console.error('Error checking data:', error)
  }
}

checkData()
