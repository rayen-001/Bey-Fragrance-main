import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter })

const productsData = [
  {
    name: "YSL Y Eau de Parfum",
    brand: "Bey Fragrance",
    inspiredBy: "Yves Saint Laurent — Y Eau de Parfum",
    description: "Fresh aromatic-woody “blue” style: crisp and clean herbs/florals on top, then smooth modern woods in the drydown.",
    price: 22,
    category: "Woody",
    genderCategory: "Man",
    notes: ["Sage", "Geranium", "Sensual Woods"],
    stockQuantity: 100,
    mainImage: "https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dwf3e109c7/pdp/images/727YSL/Y-EDP-Bottle.jpg?q=85&sh=840&sm=cut&sw=640",
    galleryImages: ["https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dwf2721bea/pdp/images/727YSL/Sage.jpg?q=85&sh=300&sm=cut&sw=300"]
  },
  {
    name: "YSL Y Le Parfum",
    brand: "Bey Fragrance",
    inspiredBy: "Yves Saint Laurent — Y Le Parfum",
    description: "A dark, more intense Y with a fresh aromatic lift, then a rich woody-amber trail (pine/patchouli/fir style).",
    price: 22,
    category: "Oriental",
    genderCategory: "Man",
    notes: ["Fresh Geranium", "Pine", "Patchouli", "Fir Balsam"],
    stockQuantity: 100,
    mainImage: "https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dw5a2b87a4/pdp/images/WW-507861YSL/Y%20LP%20About%20Image.jpg?q=85&sh=840&sm=cut&sw=640",
    galleryImages: ["https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dw0b537502/pdp/images/WW-507861YSL/2%20Y%20LP%20Pine%20Image.jpg?q=85&sh=300&sm=cut&sw=300"]
  },
  {
    name: "YSL Y Elixir",
    brand: "Bey Fragrance",
    inspiredBy: "Yves Saint Laurent — Y Elixir",
    description: "The most concentrated Y direction: fresh aromatic lavender/geranium up top, then a deeper, more luxurious oud-woody base.",
    price: 22,
    category: "Oriental",
    genderCategory: "Man",
    notes: ["Lavender", "Fresh Geranium", "Sensual Oud Wood", "Incense"],
    stockQuantity: 100,
    mainImage: "https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dwb18f3db6/pdp/images/728YSL/Y%20Elixir%20About%20Image.jpg?q=85&sh=640&sm=cut&sw=640",
    galleryImages: ["https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dw3ed8fc70/pdp/images/728YSL/4%20Y%20Elixir%20Oud%20Image.jpg?q=85&sh=300&sm=cut&sw=300"]
  },
  {
    name: "YSL MYSLF Eau de Parfum",
    brand: "Bey Fragrance",
    inspiredBy: "Yves Saint Laurent — MYSLF Eau de Parfum",
    description: "Clean modern woody-floral: sparkling citrus opening, bright orange blossom heart, then smooth woods/patchouli/ambery musks.",
    price: 22,
    category: "Floral",
    genderCategory: "Man",
    notes: ["Bergamot", "Orange Blossom Absolute", "Woods", "Patchouli", "Ambrofix™"],
    stockQuantity: 100,
    mainImage: "https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dw71c49ac1/pdp/images/WW-51115YSL/myslf-eau-de-parfum-bottle-visual.jpg?q=85&sh=840&sm=cut&sw=840",
    galleryImages: ["https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dwe25ca994/pdp/images/WW-51115YSL/myslf-eau-de-parfum-sec-6-visual-2-mobile.jpg?q=85&sh=1000&sm=cut&sw=740"]
  },
  {
    name: "Ralph Lauren Polo Red (Eau de Toilette)",
    brand: "Bey Fragrance",
    inspiredBy: "Ralph Lauren — Polo Red Eau de Toilette",
    description: "A bold woody-spicy profile: bright red grapefruit energy, aromatic warmth in the middle, and a darker coffee/woods base.",
    price: 22,
    category: "Woody",
    genderCategory: "Man",
    notes: ["Red Grapefruit", "Coffee", "Redwood", "Cranberry", "Lemon", "Lavender", "Saffron", "Sage"],
    stockQuantity: 100,
    mainImage: "https://www.ralphlaurenfragrances.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ralphlauren-master-catalog/default/dw28c8a487/images/2024%20Lando%20Polo%20Red/RLFE006/ralph-lauren-fragrances-polo-red-eau-de-toilette-harm-125ml-front.jpg?q=70&sfrm=jpg&sh=430&sm=cut&sw=430",
    galleryImages: ["https://www.ralphlaurenfragrances.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ralphlauren-us-Library/default/dw4e326234/images/pdp/RLFE006/pdp-product-adv-dynamic-2-RLFE006.jpg?q=70&sfrm=png&sh=585&sm=cut&sw=585"]
  },
  {
    name: "Ralph Lauren Polo Blue (Eau de Toilette)",
    brand: "Bey Fragrance",
    inspiredBy: "Ralph Lauren — Polo Blue Eau de Toilette",
    description: "Classic fresh aquatic-citrus style: watery melon freshness, clean herbal tones, and a soft suede/musk base.",
    price: 22,
    category: "Fresh",
    genderCategory: "Man",
    notes: ["Fresh Melon", "Basil Verbena", "Smooth Suede", "Cucumber"],
    stockQuantity: 100,
    mainImage: "https://www.ralphlaurenfragrances.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ralphlauren-master-catalog/default/dw925533d8/images/pdp/RLFE001/ralph-lauren-fragrances-polo-blue-eau-de-toilette-75ml-front.jpg?q=70&sfrm=jpg&sh=430&sm=cut&sw=430",
    galleryImages: ["https://www.ralphlaurenfragrances.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ralphlauren-us-Library/default/dw4b912b96/images/pdp/RLFE001/rl_frag_polo_blue_edt_25_ingredient_freshmelon_1x1.jpg?q=70&sfrm=jpg&sh=585&sm=cut&sw=585"]
  }
]

const shippingMethods = [
  { name: "50ml", price: 22 },
  { name: "100ml", price: 32 }
]

async function main() {
  console.log('🧹 Cleaning up database...')
  
  // Clean up order items and cart items first due to foreign key constraints if not handled by CASCADE
  // Since we have ON DELETE CASCADE in schema, deleting products should clean up relations
  await prisma.cartItem.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.shippingMethod.deleteMany({})
  await prisma.product.deleteMany({})

  console.log('✨ Seeding new products...')

  for (const productInfo of productsData) {
    const product = await prisma.product.create({
      data: {
        name: productInfo.name,
        brand: productInfo.brand,
        inspiredBy: productInfo.inspiredBy,
        description: productInfo.description,
        price: productInfo.price,
        category: productInfo.category,
        genderCategory: productInfo.genderCategory,
        notes: productInfo.notes,
        stockQuantity: productInfo.stockQuantity,
        mainImage: productInfo.mainImage,
        galleryImages: productInfo.galleryImages,
      }
    })

    // Create shipping methods for each product
    for (const sm of shippingMethods) {
      await prisma.shippingMethod.create({
        data: {
          name: sm.name,
          price: sm.price,
          productId: product.id
        }
      })
    }
  }

  console.log('✅ Success! Integrated 6 new premium products with dynamic sizes.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })