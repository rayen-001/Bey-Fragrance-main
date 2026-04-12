import { prisma } from './db/prisma';
import 'dotenv/config';

const products = [
  {
    name: "Allure Homme Edition Blanche",
    category: "Man",
    inspiredBy: "Chanel — Allure Homme Edition Blanche (2008)",
    productType: "extrait_parfum",
    notes: ["Sicilian lemon", "Calabrian bergamot", "pink pepper", "Madagascar vanilla", "sandalwood", "tonka bean", "Tahitian vetiver", "musk", "cedar", "amber"],
    description: "A refined lemon-and-vanilla signature that feels creamy and polished, resting on smooth woods, musk, and warm amber.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "1 Million Lucky",
    category: "Man",
    inspiredBy: "Rabanne — 1 Million Lucky (2018)",
    productType: "extrait_parfum",
    notes: ["plum", "ozonic notes", "grapefruit", "bergamot", "hazelnut", "honey", "cedar", "cashmere wood", "orange blossom", "jasmine", "amberwood", "patchouli", "vetiver", "oakmoss"],
    description: "A bold woody gourmand-fresh mix where plum and airy ozone meet hazelnut-honey sweetness, settling into mossy woods and patchouli.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Black XS",
    category: "Man",
    inspiredBy: "Rabanne — Black XS (2005)",
    productType: "extrait_parfum",
    notes: ["lemon", "sage", "praline", "cinnamon", "tolu balsam", "black cardamom", "patchouli", "Brazilian rosewood", "black amber"],
    description: "A sweet spicy woody-amber with a crisp citrus opening, a praline-cinnamon heart, and a dark patchouli-amber finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Black XS L'Exces for Him",
    category: "Man",
    inspiredBy: "Rabanne — Black XS L'Exces for Him (2012)",
    productType: "extrait_parfum",
    notes: ["Amalfi lemon", "lavender", "cypriol (nagarmotha)", "sea notes", "amber", "patchouli"],
    description: "A fresher Black XS offshoot—lemon and lavender over salty marine notes—drying down warm with amber and patchouli.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Noir Kogane",
    category: "Unisex",
    inspiredBy: "Giorgio Armani — Noir Kogane (2024)",
    productType: "extrait_parfum",
    notes: ["tobacco", "Haitian vetiver", "elemi", "saffron", "leather"],
    description: "A sleek tobacco-leather scent sharpened by vetiver and saffron, with elemi adding a resinous lift before the smooth leather drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Blanc Kogane",
    category: "Unisex",
    inspiredBy: "Giorgio Armani — Blanc Kogane (2024)",
    productType: "extrait_parfum",
    notes: ["aldehydes", "Indian jasmine", "white musk", "lily", "patchouli", "vetiver"],
    description: "A crisp aldehydic-white-floral musk that feels clean and luminous at first, then turns warmer and deeper with patchouli-vetiver.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Armani Privé Vert Malachite",
    category: "Unisex",
    inspiredBy: "Giorgio Armani — Armani Privé Vert Malachite (2016)",
    productType: "extrait_parfum",
    notes: ["bitter orange", "petitgrain", "jasmine sambac", "ylang-ylang", "pink pepper", "lily", "vanilla", "benzoin"],
    description: "A dense creamy white-floral where jasmine and lily dominate, sweetened by vanilla-benzoin and brightened with a bitter-citrus opening.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Armani Privé Rouge Malachite",
    category: "Unisex",
    inspiredBy: "Giorgio Armani — Armani Privé Rouge Malachite (2016)",
    productType: "extrait_parfum",
    notes: ["tuberose", "pink pepper", "clary sage", "jasmine sambac", "ylang-ylang", "benzoin", "cashmeran", "orange blossom", "amber"],
    description: "A bold tuberose-centered white-floral with aromatic spice and creamy woods, finishing warm and glowing with amber.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Blue Turquoise",
    category: "Unisex",
    inspiredBy: "Ex Nihilo — Blue Turquoise (2023)",
    productType: "extrait_parfum",
    notes: ["grapefruit", "bergamot", "ginger", "orange blossom", "musk", "ambroxan", "cedar"],
    description: "A luminous citrus fragrance dominated by sharp grapefruit and ginger, drying down to a clean, radiant musky-woody base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Light Blue Intense",
    category: "Woman",
    inspiredBy: "Dolce&Gabbana — Light Blue Intense (2020)",
    productType: "extrait_parfum",
    notes: ["Sicilian lemon", "apple", "bellflower", "jasmine", "musk", "amber", "oakmoss"],
    description: "A vibrant citrus-floral with zesty lemon and crisp apple opening, balanced by delicate jasmine and a soft musky-oakmoss base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "The One",
    category: "Man",
    inspiredBy: "Dolce&Gabbana — The One (2008)",
    productType: "extrait_parfum",
    notes: ["ginger", "cardamom", "orange", "basil", "coriander", "cedar", "amber", "tobacco"],
    description: "A warm, refined spicy-woody oriental with fresh ginger-cardamom sparkle melting into smooth tobacco-amber depth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "King",
    category: "Man",
    inspiredBy: "Dolce&Gabbana — The One King (2024)",
    productType: "extrait_parfum",
    notes: ["bergamot", "lavender", "geranium", "vetiver", "tonka bean", "amber"],
    description: "A regal aromatic fougère with bright citrus-lavender opening, smooth geranium heart, and warm tonka-amber finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Pineapple",
    category: "Unisex",
    inspiredBy: "Dolce&Gabbana — Pineapple (2024)",
    productType: "extrait_parfum",
    notes: ["pineapple", "coconut", "bergamot", "jasmine", "vanilla", "musk", "patchouli"],
    description: "A juicy tropical pineapple fragrance brightened by coconut and citrus, settling into creamy vanilla and soft woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "VIB 3",
    category: "Unisex",
    inspiredBy: "Dolce&Gabbana — VIB 3 (2024)",
    productType: "extrait_parfum",
    notes: ["mango", "passionfruit", "orange blossom", "vanilla", "sandalwood", "musk"],
    description: "A vibrant tropical fruit cocktail with juicy mango and passionfruit, wrapped in soft orange blossom and creamy vanilla musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Choco Violette",
    category: "Unisex",
    inspiredBy: "Mancera — Choco Violette (2024)",
    productType: "extrait_parfum",
    notes: ["violet", "chocolate", "rose", "patchouli", "vanilla", "tonka bean", "musk"],
    description: "A gourmand floral where powdery violet meets rich dark chocolate, balanced by rose and a warm vanilla-tonka base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Whisky Silver",
    category: "Man",
    inspiredBy: "Lattafa — Whisky Silver (2024)",
    productType: "extrait_parfum",
    notes: ["whisky", "apple", "lavender", "cinnamon", "cedarwood", "vetiver", "amber", "musk"],
    description: "A smooth boozy-woody scent with whisky and apple opening, aromatic lavender-cinnamon heart, and warm cedar-amber drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Layl Malaki",
    category: "Man",
    inspiredBy: "Lattafa — Layl Malaki (2024)",
    productType: "extrait_parfum",
    notes: ["lavender", "bergamot", "cinnamon", "oud", "amber", "vanilla", "musk"],
    description: "A rich oriental fougère with aromatic lavender and spice, deepened by oud and a warm vanilla-amber base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Kalemat",
    category: "Unisex",
    inspiredBy: "Arabian Oud — Kalemat (2013)",
    productType: "extrait_parfum",
    notes: ["saffron", "oud", "rose", "amber", "musk", "vanilla", "woodsy notes"],
    description: "A luxurious Middle Eastern oud-rose composition warmed by saffron and rich amber-vanilla for a deep, regal trail.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Angel Share",
    category: "Unisex",
    inspiredBy: "By Kilian — Angel's Share (2020)",
    productType: "extrait_parfum",
    notes: ["cognac", "cinnamon", "tonka bean", "oak", "praline", "vanilla", "sandalwood"],
    description: "A warm, boozy gourmand that captures the scent of cognac aging in oak barrels with cinnamon, praline, and creamy tonka.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L'Amour",
    category: "Woman",
    inspiredBy: "Unknown — L'Amour",
    productType: "extrait_parfum",
    notes: ["rose", "jasmine", "orange blossom", "vanilla", "musk", "sandalwood"],
    description: "A romantic white-floral bouquet centered on rose and jasmine, softened by creamy vanilla and clean musks.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Almas",
    category: "Unisex",
    inspiredBy: "Kajal — Almas (2021)",
    productType: "extrait_parfum",
    notes: ["saffron", "rose", "oud", "amber", "vanilla", "musk", "patchouli"],
    description: "A rich, velvety saffron-rose oud with warm amber and vanilla creating an opulent, long-lasting oriental-woody profile.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Kurky",
    category: "Unisex",
    inspiredBy: "Kajal — Kurky (2022)",
    productType: "extrait_parfum",
    notes: ["bergamot", "lavender", "cinnamon", "oud", "patchouli", "vanilla", "amber", "musk"],
    description: "A spicy oriental with bright citrus-lavender opening, warm cinnamon, and a deep oud-vanilla amber drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  }
];

async function main() {
  console.log('🚀 Starting final products insertion (Batch 6)...');
  let count = 0;
  for (const product of products) {
    try {
      await prisma.product.upsert({
        where: { name_brand: { name: product.name, brand: "Hama Fragrance" } },
        update: product,
        create: {
            ...product,
            brand: "Hama Fragrance"
        }
      });
      count++;
    } catch (e) {
      console.error(`❌ Failed to insert ${product.name}:`, e);
    }
  }
  console.log(`✅ Successfully synced ${count} final products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
