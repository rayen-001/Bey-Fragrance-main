import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

// Note: In this project's frontend (Shop.tsx):
// - 'genderCategory' is used for Gender (Man, Woman, Unisex)
// - 'category' is used for Fragrance Type (Fresh, Woody, Oriental, etc.)
const products = [
  {
    name: "YSL Y Eau de Parfum",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Yves Saint Laurent — Y Eau de Parfum (2018)",
    notes: ["Apple", "Ginger", "Bergamot", "Sage", "Juniper Berries", "Geranium", "Amberwood", "Tonka Bean", "Cedar", "Vetiver", "Olibanum"],
    description: "Modern “blue” aromatic fougère: crisp fruity-spicy freshness up top, clean herbal heart, and warm woody-amber drydown.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.50757.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_50757.jpeg"]
  },
  {
    name: "YSL Y Le Parfum",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Yves Saint Laurent — Y Le Parfum (2021)",
    notes: ["Apple", "Aldehydes", "Grapefruit", "Ginger", "Lavender", "Sage", "Geranium", "Tonka Bean", "Cedar", "Olibanum", "Patchouli"],
    description: "Deeper, darker Y—clean aldehydic-citrus lift with aromatic lavender/sage, then smooth tonka-woods with incense-like resin.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.64718.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_64718.jpeg"]
  },
  {
    name: "YSL Y Elixir",
    genderCategory: "Man",
    category: "Oriental",
    inspiredBy: "Yves Saint Laurent — Y Elixir (2024)",
    notes: ["Lavender", "Geranium", "Frankincense (Incense)", "Oud"],
    description: "Most intense Y direction: aromatic lavender/geranium brightness over a dark resinous frankincense + oud base for a richer, more “night” vibe.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.90024.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_90024.jpeg"]
  },
  {
    name: "YSL MYSLF Eau de Parfum",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Yves Saint Laurent — MYSLF Eau de Parfum (2023)",
    notes: ["Calabrian Bergamot", "Orange Blossom", "Patchouli", "Ambrofix™"],
    description: "Clean, bright citrus-floral woods—easy daily wear with fresh orange blossom heart and modern woody-amber base.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.84094.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_84094.jpeg"]
  },
  {
    name: "JPG Le Male Lover",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Jean Paul Gaultier — Le Male Lover (2024)",
    notes: ["White Pepper", "Finger Lime", "Ambergris", "Sea Notes", "Musk", "Vanilla", "Woody Notes"],
    description: "Salty-skin + airy marine musk wrapped in creamy vanilla woods, sharpened with pepper and fresh citrus twist.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.89720.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_89720.jpeg"]
  },
  {
    name: "JPG Le Beau Paradise Garden",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Jean Paul Gaultier — Le Beau Paradise Garden (2024)",
    notes: ["Green Notes", "Watery Notes", "Mint", "Ginger", "Coconut", "Fig", "Salt", "Tonka Bean", "Sandalwood"],
    description: "Tropical green-fresh vibes with minty aquatic freshness, then salty coconut/fig, finishing creamy tonka-sandalwood.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.88836.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_88836.jpeg"]
  },
  {
    name: "Ralph Lauren Polo Red",
    genderCategory: "Man",
    category: "Spicy",
    inspiredBy: "Ralph Lauren — Polo Red (2013)",
    notes: ["Cranberry", "Grapefruit", "Italian Lemon", "Saffron", "Sage", "Red Ginger", "Amber", "Coffee", "Woodsy Notes"],
    description: "Bright red-citrus energy with warm spicy heart and noticeable coffee-amber wood base.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.18598.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_18598.jpeg"]
  },
  {
    name: "Ralph Lauren Polo Black",
    genderCategory: "Man",
    category: "Fruity",
    inspiredBy: "Ralph Lauren — Polo Black (2005)",
    notes: ["Iced Mango", "Lemon", "Tangerine", "Sage", "Wormwood", "Patchouli", "Sandalwood", "Tonka Bean"],
    description: "Sleek fruity-woody scent—tropical mango/citrus up front with smooth woods and slightly aromatic-dry edge.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.1197.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_1197.jpeg"]
  },
  {
    name: "Ralph Lauren Polo Blue (EDT)",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Ralph Lauren — Polo Blue (2003)",
    notes: ["Cucumber", "Melon", "Mandarin Orange", "Basil", "Sage", "Geranium", "Suede", "Woodsy Notes", "Musk"],
    description: "Classic fresh “shower-gel” blue: juicy watery freshness, clean herbs, and soft musky-suede base.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.1198.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_1198.jpeg"]
  },
  {
    name: "Nishane Hacivat",
    genderCategory: "Unisex",
    category: "Fruity",
    inspiredBy: "Nishane — Hacivat (2017)",
    notes: ["Pineapple", "Grapefruit", "Bergamot", "Jasmine", "Cedar", "Patchouli", "Oakmoss", "Woody Notes"],
    description: "Sparkling pineapple-citrus over a confident chypre-woody structure with oakmoss depth—bold, crisp, and long-lasting style.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.44174.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_44174.jpeg"]
  },
  {
    name: "Orto Parisi Megamare",
    genderCategory: "Unisex",
    category: "Aquatic",
    inspiredBy: "Orto Parisi — Megamare (2019)",
    notes: ["Seaweed", "Ambergris", "Sea Notes", "Salty Notes", "Marine Notes"],
    description: "Intense salty-marine-animalic scent: deep oceanic feeling with ambergris warmth. Powerful, lasting, and bold.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.54932.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_54932.jpeg"]
  },
  {
    name: "Nautica Voyage",
    genderCategory: "Man",
    category: "Aquatic",
    inspiredBy: "Nautica — Voyage (2006)",
    notes: ["Apple", "Green Leaves", "Lotus", "Mimosa", "Cedarwood", "Musk", "Moss", "Amber"],
    description: "Fresh aquatic-green everyday scent: crisp apple/green notes up top, watery-floral freshness in middle, and clean woody-musky drydown.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.913.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_913.jpeg"]
  },
  {
    name: "Vertus Sole Patchouli",
    genderCategory: "Unisex",
    category: "Woody",
    inspiredBy: "Vertus — Sole Patchouli (2017)",
    notes: ["Patchouli", "Green Notes", "Marshmallow", "Sweet Notes"],
    description: "Modern patchouli-forward niche style: green-fresh opening feel with smoother sweet-woody trail that's cozy but still “clean niche.”",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.46352.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_46352.jpeg"]
  },
  {
    name: "Maison Margiela Replica By the Fireplace",
    genderCategory: "Unisex",
    category: "Sweet",
    inspiredBy: "Maison Margiela — Replica By the Fireplace (2015)",
    notes: ["Pink Pepper", "Orange Flower", "Clove", "Chestnut Accord", "Guaiac Wood", "Vanilla", "Peru Balsam", "Cashmeran"],
    description: "Cozy smoky-sweet woods: toasted chestnuts and crackling wood wrapped in creamy vanilla warmth (best in cool weather).",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.31623.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_31623.jpeg"]
  },
  {
    name: "Hugo Boss Boss Bottled (EDT)",
    genderCategory: "Man",
    category: "Spicy",
    inspiredBy: "Hugo Boss — Boss Bottled (1998)",
    notes: ["Apple", "Plum", "Bergamot", "Lemon", "Oakmoss", "Geranium", "Cinnamon", "Mahogany", "Carnation", "Vanilla", "Sandalwood", "Cedar", "Vetiver", "Olive Tree"],
    description: "Classic versatile masculine: crisp fruity-citrus start, warm cinnamon-spice heart, and smooth woody-vanilla finish.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.383.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_383.jpeg"]
  },
  {
    name: "Hugo Boss Boss Orange Man",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Hugo Boss — Boss Orange for Men (2011)",
    notes: ["Red Apple", "Coriander", "Incense", "Sichuan Pepper", "Vanilla", "Woody Notes", "Bubinga Wood"],
    description: "Warm casual “comfort” scent: sweet apple-vanilla with soft spice and woods—easy for daily wear and relaxed settings.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.11070.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_11070.jpeg"]
  },
  {
    name: "Hugo Boss The Scent Elixir For Him",
    genderCategory: "Man",
    category: "Spicy",
    inspiredBy: "Hugo Boss — Boss The Scent Elixir For Him (2024)",
    notes: ["Red Pepper (Pimento)", "Lavender (Lavandin)", "Caledonian Sandalwood"],
    description: "Seductive ambery-leathery style with hot pimento opening, mellow sandalwood, and lavandin heart.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.88879.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_88879.jpeg"]
  },
  {
    name: "Hugo Boss Boss Bottled Elixir",
    genderCategory: "Man",
    category: "Oriental",
    inspiredBy: "Hugo Boss — Boss Bottled Elixir (2023)",
    notes: ["Frankincense", "Cardamom", "Vetiver", "Patchouli", "Cedarwood", "Labdanum"],
    description: "Darker, more intense Bottled: incense-spice opening, earthy patchouli/vetiver core, and rich woody-amber feel.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.84074.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_84074.jpeg"]
  },
  {
    name: "Hugo Boss Boss Bottled Infinite",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Hugo Boss — Boss Bottled Infinite (2019)",
    notes: ["Apple", "Cinnamon", "Sage", "Mandarin Orange", "Lavender", "Rosemary", "Patchouli", "Sandalwood", "Olive Tree"],
    description: "Bright citrus-aromatic freshness with a smooth woody finish—easy daily-driver.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.54551.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_54551.jpeg"]
  },
  {
    name: "Hugo Boss Boss Bottled Unlimited (Boss White)",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Hugo Boss — Boss Bottled Unlimited (2014)",
    notes: ["Mint", "Grapefruit", "Pineapple", "Rose", "Cinnamon", "Sandalwood", "Musk", "Labdanum"],
    description: "Fresh energetic twist on Bottled: minty-citrus burst, fruity/spicy heart, and warm musky woods.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.24055.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_24055.jpeg"]
  },
  {
    name: "Lacoste L.12.12 Silver Grey (Lacoste Gris)",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Lacoste — L.12.12 Silver Grey (2025)",
    notes: ["Tangerine", "Frankincense (Olibanum)", "Lavender", "Geranium", "Ambroxan", "Vetiver"],
    description: "Fresh aromatic fougère with a clean citrus-resin opening, aromatic lavender/geranium core, and a modern ambrox-vetiver woody drydown.",
    mainImage: "https://fimgs.net/mdimg/perfume-thumbs/375x500.105772.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_105772.jpeg"]
  },
  {
    name: "Gucci Guilty Elixir de Parfum Pour Homme",
    genderCategory: "Man",
    category: "Oriental",
    inspiredBy: "Gucci — Guilty Elixir de Parfum Pour Homme (2023)",
    notes: ["Nutmeg", "Orange Blossom", "Pimento Seeds", "Orris", "Osmanthus", "Ambrofix™", "Benzoin", "Patchouli", "Vanilla"],
    description: "Rich ambery-leathery style with creamy iris/orange-blossom warmth, spicy lift, and a smooth vanilla–benzoin–patchouli base.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.84547.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_84547.jpeg"]
  },
  {
    name: "Gucci Guilty Pour Homme (EDT)",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Gucci — Guilty Pour Homme (2011)",
    notes: ["Lavender", "Amalfi Lemon", "Orange Blossom", "Cedar", "Patchouli", "Vanilla"],
    description: "Fresh aromatic-citrus opening with a clean white-floral heart, finishing woody and softly sweet.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.11037.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_11037.jpeg"]
  },
  {
    name: "Gucci Guilty Black Pour Homme",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Gucci — Guilty Black Pour Homme (2013)",
    notes: ["Lavender", "Green Coriander", "Green Notes", "Orange Blossom", "Neroli", "Cedar", "Patchouli"],
    description: "Fresh green-aromatic fougère with an edgy herbal opening, bright neroli/orange blossom, and a woody patchouli base.",
    mainImage: "https://fimgs.net/mdimg/perfume-thumbs/375x500.17322.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_17322.jpeg"]
  },
  {
    name: "Versace Eros (EDT)",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Versace — Eros (2012)",
    notes: ["Mint", "Green Apple", "Lemon", "Tonka Bean", "Ambroxan", "Geranium", "Vanilla", "Cedar", "Vetiver", "Oakmoss"],
    description: "Loud fresh-sweet signature: minty/apple brightness up top, creamy tonka core, and vanilla woods in the drydown.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.16657.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_16657.jpeg"]
  },
  {
    name: "Versace Eros Najim (Parfum)",
    genderCategory: "Man",
    category: "Oriental",
    inspiredBy: "Versace — Eros Najim Parfum (2024)",
    notes: ["Yellow Mandarin", "Clary Sage", "Saffron", "Cardamom", "Oud", "Cedarwood", "Caramel", "Patchouli", "Vetiver", "Incense", "Tonka Bean"],
    description: "Middle-East-leaning Eros flanker: warm spicy citrus opening, woody oud/cedar heart sweetened by caramel, deep incense-tonka base.",
    mainImage: "https://www.versace.com/dw/image/v2/BGWN_PRD/on/demandware.static/-/Sites-ver-master-catalog/default/dwbd16cb05/original/90_R740310-R100MLS_RNUL_20_Eros~Najim~Parfum~100~ml-Fragrances~~Body~Care-Versace-online-store_0_0.jpg?q=85&strip=true&sw=850",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_99116.jpeg"]
  },
  {
    name: "Rabanne Invictus Platinum",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Rabanne — Invictus Platinum (2022)",
    notes: ["Absinthe", "Grapefruit", "Mint", "Lavender", "Cypress", "Patchouli"],
    description: "Fresh green-aromatic Invictus: icy absinthe/mint freshness over clean lavender, finishing with cypress-patchouli woods.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.72557.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_72557.jpeg"]
  },
  {
    name: "Rabanne Invictus Legend",
    genderCategory: "Man",
    category: "Aquatic",
    inspiredBy: "Rabanne — Invictus Legend (2019)",
    notes: ["Sea Notes", "Sea Salt", "Grapefruit", "Bay Leaf", "Geranium", "Spices", "Red Amber", "Guaiac Wood"],
    description: "Dense sweet-salty marine: oceanic grapefruit opening, aromatic bay/geranium, warm amber-woody finish.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.54323.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_54323.jpeg"]
  },
  {
    name: "Chanel Allure Homme Sport (EDT)",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Chanel — Allure Homme Sport (2004)",
    notes: ["Mandarin", "Orange", "Aquatic Notes", "Aldehydes", "Cedar", "Pepper", "Neroli", "Vetiver", "White Musk", "Tonka Bean", "Amber"],
    description: "Sporty fresh signature: sparkling citrus + airy marine, then smooth woods, ending musky-tonka warm.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.607.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_607.jpeg"]
  },
  {
    name: "Chanel Allure Homme Édition Blanche",
    genderCategory: "Man",
    category: "Citrus",
    inspiredBy: "Chanel — Allure Homme Édition Blanche (2008)",
    notes: ["Sicilian Lemon", "Bergamot", "Pink Pepper", "Sandalwood", "Tonka Bean", "Vetiver", "Vanilla", "Musk", "Cedar", "Amber"],
    description: "Elegant “lemon-vanilla” Chanel: bright citrus opening, creamy woods, smooth vanilla-tonka base.",
    mainImage: "https://fimgs.net/mdimg/perfume-thumbs/375x500.2653.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_2653.jpeg"]
  },
  {
    name: "Giorgio Armani Armani Code Sport",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Giorgio Armani — Armani Code Sport (2011)",
    notes: ["Mint", "Mandarin Orange", "Lemon", "Ginger Flower", "Water Notes", "Vetiver", "Amber"],
    description: "Bright sporty citrus-aromatic: mint + mandarin freshness, zesty lemon/ginger, clean watery-amber vetiver drydown.",
    mainImage: "https://fimgs.net/mdimg/perfume-thumbs/375x500.11649.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_11649.jpeg"]
  },
  {
    name: "Giorgio Armani Armani Code Absolu",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Giorgio Armani — Armani Code Absolu (2019)",
    notes: ["Green Mandarin", "Apple", "Nutmeg", "Orange Blossom", "Carrot Seeds", "Vanilla", "Tonka Bean", "Suede", "Woody Notes"],
    description: "Sweet sensual vanilla-leather vibe: fruity-citrus top, spicy/floral heart, warm suede-vanilla-tonka base.",
    mainImage: "https://fimgs.net/mdimg/perfume-thumbs/375x500.53106.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_53106.jpeg"]
  },
  {
    name: "Armani Code (aka “Black Code”)",
    genderCategory: "Man",
    category: "Oriental",
    inspiredBy: "Giorgio Armani — Armani Code (2004)",
    notes: ["Lemon", "Bergamot", "Star Anise", "Olive Blossom", "Guaiac Wood", "Leather", "Tonka Bean", "Tobacco"],
    description: "Classic seductive oriental: bright citrus into smooth spice/floral warmth, then leather-tonka-tobacco base.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.412.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_412.jpeg"]
  },
  {
    name: "Armani Code Eau de Toilette (2023)",
    genderCategory: "Man",
    category: "Fresh",
    notes: ["Green Mandarin", "Lavender", "Tonka Bean", "Cedar"],
    description: "Cleaner, modern Code: fresh green-citrus + lavender, finishing smooth and woody with tonka/cedar.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.79263.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_79263.jpeg"]
  },
  {
    name: "Scandal Pour Homme Intense",
    genderCategory: "Man",
    category: "Spicy",
    inspiredBy: "Jean Paul Gaultier — Scandal Pour Homme Intense (2025)",
    notes: ["Clary Sage", "Vetiver", "Leather"],
    description: "Herbal sage opening, earthy vetiver core, darker leather finish—more mature night vibe.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.102884.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_102884.jpeg"]
  },
  {
    name: "Scandal Pour Homme Absolu",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Jean Paul Gaultier — Scandal Pour Homme Absolu (2024)",
    notes: ["Mirabelle", "Chestnut", "Sandalwood"],
    description: "Sweet-gourmand but elegant: juicy mirabelle into creamy chestnut, then smooth sandalwood.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.91053.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_91053.jpeg"]
  },
  {
    name: "Scandal Pour Homme",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Jean Paul Gaultier — Scandal Pour Homme (2021)",
    notes: ["Mandarin Orange", "Clary Sage", "Caramel", "Tonka Bean", "Vetiver"],
    description: "Sweet addictive caramel-tonka with aromatic sage and clean vetiver base.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.68074.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_68074.jpeg"]
  },
  {
    name: "CK One",
    genderCategory: "Unisex",
    category: "Citrus",
    inspiredBy: "Calvin Klein — CK One (1994)",
    notes: ["Lemon", "Green Notes", "Bergamot", "Mandarin Orange", "Pineapple", "Cardamom", "Papaya", "Lily-of-the-Valley", "Jasmine", "Violet", "Rose", "Green Tea", "Musky", "Cedar", "Sandalwood", "Oakmoss", "Amber"],
    description: "Iconic fresh-citrus unisex: sparkling fruits, soft florals, and clean musky green-tea woods.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.276.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_276.jpeg"]
  },
  {
    name: "Dior Sauvage (Eau de Toilette)",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Dior — Sauvage (2015)",
    notes: ["Calabrian Bergamot", "Pepper", "Sichuan Pepper", "Lavender", "Pink Pepper", "Vetiver", "Patchouli", "Geranium", "Elemi", "Ambroxan", "Cedar", "Labdanum"],
    description: "Modern “blue” fresh-spicy: sharp bergamot-pepper, aromatic heart, powerful ambroxan woody drydown.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.31861.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_31861.jpeg"]
  },
  {
    name: "Bleu de Chanel Parfum (Exclusive)",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Chanel — Bleu de Chanel Parfum (2018)",
    notes: ["Lemon Zest", "Bergamot", "Mint", "Artemisia", "Lavender", "Pineapple", "Geranium", "Green Notes", "Sandalwood", "Cedar", "Amberwood", "Iso E Super", "Tonka Bean"],
    description: "Smoothest, richest Bleu: refined aromatics with creamy woods and tonka depth.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.49912.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_49912.jpeg"]
  },
  {
    name: "Bleu de Chanel Eau de Parfum",
    genderCategory: "Man",
    category: "Fresh",
    inspiredBy: "Chanel — Bleu de Chanel EDP (2014)",
    notes: ["Grapefruit", "Lemon", "Mint", "Bergamot", "Pink Pepper", "Aldehydes", "Coriander", "Ginger", "Nutmeg", "Jasmine", "Melon", "Incense", "Amber", "Cedar", "Sandalwood", "Amberwood", "Patchouli", "Labdanum"],
    description: "Polished woody-aromatic: fresh citrus + aromatics, then warmer incense-amber woods.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.25967.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_25967.jpeg"]
  },
  {
    name: "1 Million Royal",
    genderCategory: "Man",
    category: "Spicy",
    inspiredBy: "Rabanne — 1 Million Royal (2023)",
    notes: ["Cardamom", "Tangerine", "Bergamot", "Lavender", "Sage", "Violet Leaf", "Benzoin", "Cedar", "Patchouli"],
    description: "Modern smoother 1 Million: spicy-citrus opening, aromatic heart, resinous woody base.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.79159.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_79159.jpeg"]
  },
  {
    name: "1 Million Lucky",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Rabanne — 1 Million Lucky (2018)",
    notes: ["Plum", "Ozonic Notes", "Grapefruit", "Bergamot", "Hazelnut", "Honey", "Cedar", "Cashmere Wood", "Orange Blossom", "Jasmine", "Amberwood", "Patchouli", "Vetiver", "Oakmoss"],
    description: "Sweet-fresh with nutty twist: airy fruit lift, hazelnut-honey warmth, woody-green base.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.48903.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_48903.jpeg"]
  },
  {
    name: "1 Million",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Rabanne — 1 Million (2008)",
    notes: ["Blood Mandarin", "Grapefruit", "Mint", "Cinnamon", "Spicy Notes", "Rose", "Amber", "Leather", "Woody Notes", "Indian Patchouli"],
    description: "Famous sweet-spicy DNA: citrus-mint spark, warm cinnamon/rose, bold amber-leather woods.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.3747.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_3747.jpeg"]
  },
  {
    name: "Black XS",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Rabanne — Black XS (2005)",
    notes: ["Lemon", "Sage", "Praline", "Cinnamon", "Tolu Balsam", "Black Cardamom", "Patchouli", "Brazilian Rosewood", "Black Amber"],
    description: "Sweet-dark and edgy: praline-cinnamon warmth over deep amber woods with patchouli.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.514.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_514.jpeg"]
  },
  {
    name: "Pure XS",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Rabanne — Pure XS (2017)",
    notes: ["Ginger", "Grapefruit", "Thyme", "Bergamot", "Green Accord", "Vanilla", "Liquor", "Cinnamon", "Leather", "Apple", "Myrrh", "Sugar", "Woody Notes", "Cedar", "Cashmeran", "Patchouli"],
    description: "Sweet-spicy seduction: zesty top, boozy vanilla-leather heart, warm resinous sugary woods.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.46038.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_46038.jpeg"]
  },
  {
    name: "Black XS L’Exces for Him",
    genderCategory: "Man",
    category: "Aquatic",
    inspiredBy: "Rabanne — Black XS L’Exces for Him (2012)",
    notes: ["Amalfi Lemon", "Lavender", "Cypriol (Nagarmotha)", "Sea Notes", "Amber", "Patchouli"],
    description: "Fresher XS: lemon-lavender + marine touch, finishing amber-patchouli.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.13805.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_13805.jpeg"]
  },
  {
    name: "Valentino Uomo Born in Roma",
    genderCategory: "Man",
    category: "Woody",
    inspiredBy: "Valentino — Uomo Born in Roma (2019)",
    notes: ["Mineral Notes", "Violet Leaf", "Salt", "Sage", "Ginger", "Woody Notes", "Vetiver"],
    description: "Mineral-salty modern woody: sharp mineral/violet opening, aromatic heart, clean vetiver woods base.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.55963.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_55963.jpeg"]
  },
  {
    name: "Emporio Armani Stronger With You",
    genderCategory: "Man",
    category: "Sweet",
    inspiredBy: "Giorgio Armani — Stronger With You (2017)",
    notes: ["Chestnut", "Sugar", "Sage", "Lavender", "Vanilla", "Smoke"],
    description: "Cozy sweet signature: sugary chestnut warmth, aromatics, and smooth vanilla-smoke drydown.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.45258.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_45258.jpeg"]
  },
  {
    name: "Noir Kogane",
    genderCategory: "Unisex",
    category: "Woody",
    inspiredBy: "Giorgio Armani — Noir Kogane (2024)",
    notes: ["Tobacco", "Haitian Vetiver", "Elemi", "Saffron", "Leather"],
    description: "Dark refined leather-tobacco with vetiver depth and resinous spice.",
    mainImage: "https://fimgs.net/mdimg/perfume/375x500.88628.jpg",
    galleryImages: ["https://fimgs.net/mdimg/perfume-social-cards/en-p_c_88628.jpeg"]
  }
]

async function main() {
  console.log('--- STARTING SQL PRODUCT SEEDING (CORRECT CATEGORIES) ---')
  
  for (const p of products) {
    try {
      const productId = crypto.randomUUID()
      console.log(`Inserting ${p.name}...`)
      
      const sizesJson = JSON.stringify([
          { id: crypto.randomUUID(), name: '50ml', price: 25 },
          { id: crypto.randomUUID(), name: '100ml', price: 35 }
      ])

      // 1. Insert Product
      await pool.query(
        `INSERT INTO products (
          id, name, description, price, category, inspired_by, gender_category, 
          main_image, gallery_images, notes, brand, stock_quantity, sizes, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())`,
        [
          productId, p.name, p.description, 25, p.category, p.inspiredBy, p.genderCategory,
          p.mainImage, p.galleryImages, p.notes, "Bey Fragrance", 100, sizesJson
        ]
      )

      // 2. Insert size-based shipping methods linked to product
      await pool.query(
        `INSERT INTO shipping_methods (id, name, price, product_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [crypto.randomUUID(), '50ml', 25, productId]
      )
      await pool.query(
        `INSERT INTO shipping_methods (id, name, price, product_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [crypto.randomUUID(), '100ml', 35, productId]
      )

    } catch (err: any) {
      console.error(`- Error adding ${p.name}:`, err.message)
    }
  }

  console.log('--- SEEDING DONE ---')
}

main().finally(() => pool.end())
