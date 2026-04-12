import { prisma } from './db/prisma';
import 'dotenv/config';

const products = [
  {
    name: "Polo Blue Gold Blend",
    category: "Man",
    inspiredBy: "Ralph Lauren — Polo Blue Gold Blend (2019)",
    productType: "extrait_parfum",
    notes: ["ginger", "citron", "lime", "grapefruit", "pepper", "cardamom", "melon", "sage", "lavender", "green apple", "incense", "amber", "patchouli", "vetiver"],
    description: "A fresh citrus-spice opening that turns aromatic and subtly fruity, finishing smoky-elegant with incense, amber, patchouli, and vetiver.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Double Whisky",
    category: "Man",
    inspiredBy: "Evaflor — Double Whisky",
    productType: "extrait_parfum",
    notes: ["bergamot", "apple", "tangerine", "cloves", "lily-of-the-valley", "cedar", "patchouli", "amber", "musk", "sandalwood"],
    description: "A warm spicy-woody scent with crisp fruit-citrus up top, a clove-tinged floral heart, and a musky amber-patchouli base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Kenzo Homme Marine",
    category: "Man",
    inspiredBy: "Kenzo — Kenzo Homme Marine (2023)",
    productType: "extrait_parfum",
    notes: ["sea notes", "ylang-ylang", "sandalwood", "musk"],
    description: "A clean marine breeze softened by sunny ylang-ylang, drying down smooth and creamy with sandalwood and musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Al Faris",
    category: "Man",
    inspiredBy: "Arabiyat — Al Faris",
    productType: "extrait_parfum",
    notes: ["driftwood", "ivy", "geranium", "plum", "coconut", "lily-of-the-valley", "orange blossom", "jasmine", "violet", "aquatic note", "cedarwood", "amberwood", "cashmere wood", "vanilla", "white musk"],
    description: "A fresh woody-floral that opens green and breezy, turns airy and aquatic with soft florals, then finishes warm with vanillic woods and clean musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Oud Voyager",
    category: "Unisex",
    inspiredBy: "Tom Ford — Oud Voyager (2025)",
    productType: "extrait_parfum",
    notes: ["geranium", "pink pepper", "citrus", "red peony", "cardamom", "saffron", "oud", "cypriol (nagarmotha)", "patchouli", "vetiver", "musk"],
    description: "A modern floral-oud where rosy geranium and spicy saffron frame deep oud woods, settling into earthy patchouli-vetiver musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Mandarino di Amalfi",
    category: "Unisex",
    inspiredBy: "Tom Ford — Mandarino di Amalfi (2014)",
    productType: "extrait_parfum",
    notes: ["lemon", "grapefruit", "mint", "basil", "tarragon", "black currant", "orange blossom", "jasmine", "clary sage", "shiso", "coriander", "black pepper", "musk", "vetiver", "amber", "labdanum", "civet"],
    description: "A sparkling Amalfi-style citrus aromatic with herbs and soft white florals, drying down musky and slightly animalic-warm.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Neroli Portofino",
    category: "Unisex",
    inspiredBy: "Tom Ford — Neroli Portofino (2011)",
    productType: "extrait_parfum",
    notes: ["bergamot", "mandarin orange", "lemon", "bitter orange", "lavender", "rosemary", "myrtle", "African orange flower", "neroli", "jasmine", "pitosporum", "amber", "ambrette (musk mallow)", "angelica"],
    description: "A refined cologne-style citrus-neroli with aromatic lavender and herbs, finishing clean and sunlit with amber and soft musks.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Intense Oud",
    category: "Unisex",
    inspiredBy: "Gucci — Intense Oud (2016)",
    productType: "extrait_parfum",
    notes: ["frankincense", "raspberry", "saffron", "pear", "Damask rose", "musk", "orange blossom", "agarwood (oud)", "leather", "patchouli", "ambergris"],
    description: "A rich fruity-incense oud where saffron and raspberry brighten smoky resins, melting into rose-musk and a leathery oud-ambergris base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Oud Vanille",
    category: "Unisex",
    inspiredBy: "Franck Olivier — Oud Vanille (2017)",
    productType: "extrait_parfum",
    notes: ["caramel", "raspberry", "orange", "incense", "rose", "patchouli", "violet", "jasmine", "vanilla", "woody notes", "spices", "musk"],
    description: "A sweet smoky rose-oud profile with caramel-berry brightness, drying down warm and spicy with vanilla woods and musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Alf Lail o Lail",
    category: "Woman",
    inspiredBy: "Ajmal — Alf Lail o Lail (2000s)",
    productType: "extrait_parfum",
    notes: ["woodsy notes", "musk", "spices", "floral notes"],
    description: "A traditional Middle Eastern mukhallat style—spiced florals and musky woods with a smoky, deep, long-lasting aura.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Blu Mare",
    category: "Unisex",
    inspiredBy: "Giardini Di Toscana — Blu Mare (2024)",
    productType: "extrait_parfum",
    notes: ["bergamot", "pink pepper", "grapefruit", "lemon", "cypress", "sea notes", "oakmoss", "ambergris"],
    description: "A salty sea-air scent that starts with bright citrus and pepper, then turns breezy and green with cypress over a mossy ambergris base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Eternity for Men",
    category: "Man",
    inspiredBy: "Calvin Klein — Eternity for Men (1990)",
    productType: "extrait_parfum",
    notes: ["lavender", "lemon", "bergamot", "mandarin orange", "sage", "juniper berries", "basil", "geranium", "jasmine", "coriander", "orange blossom", "lily-of-the-valley", "lily", "sandalwood", "musk", "vetiver", "Brazilian rosewood", "amber"],
    description: "A classic aromatic fougère that opens crisp and herbal, then settles into clean florals and smooth woods with soft amber warmth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "1881 pour Homme",
    category: "Man",
    inspiredBy: "Cerruti — 1881 pour Homme (1990)",
    productType: "extrait_parfum",
    notes: ["juniper", "cypress", "lavender", "bergamot", "carnation", "galbanum", "elemi resin", "vetiver", "ylang-ylang", "rose", "lily-of-the-valley", "cassia", "oakmoss", "pine tree", "cedar", "patchouli", "musk", "pepper", "sandalwood"],
    description: "A refined green-woody classic built on crisp conifers and aromatic herbs, with a mossy, softly musky drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Black Afgano",
    category: "Unisex",
    inspiredBy: "Nasomatto — Black Afgano (2009)",
    productType: "extrait_parfum",
    notes: ["cannabis", "green notes", "davana", "saffron", "thyme", "resins", "woodsy notes", "tobacco", "coffee", "cinnamon", "violet", "raspberry", "agarwood (oud)", "incense", "amber", "animal notes", "guaiac wood", "musk", "tonka", "cedar", "gurjan balsam", "ambroxan", "vanilla"],
    description: "A dense, smoky resin-woods fragrance with coffee-tobacco darkness and an incense-oud backbone that lingers for hours.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Khamrah Qahwa",
    category: "Unisex",
    inspiredBy: "Lattafa Perfumes — Khamrah Qahwa (2023)",
    productType: "extrait_parfum",
    notes: ["cinnamon", "cardamom", "ginger", "praline", "candied fruits", "white flowers", "vanilla", "coffee", "tonka bean", "benzoin", "musk"],
    description: "A spiced coffee-vanilla gourmand where cinnamon-cardamom warmth melts into praline sweetness and a creamy coffee-tonka base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Classic Black",
    category: "Man",
    inspiredBy: "Jaguar — Classic Black (2009)",
    productType: "extrait_parfum",
    notes: ["Granny Smith apple", "bitter orange", "mandarin orange", "tea", "sea water", "geranium", "cardamom", "nutmeg", "white musk", "Virginia cedar", "sandalwood", "vetiver", "tonka bean", "oakmoss"],
    description: "A smooth woody-aromatic with crisp fruit-citrus up top, a lightly spicy heart, and a clean musky-woody finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "LV Lovers",
    category: "Man",
    inspiredBy: "Louis Vuitton — LV Lovers (2024)",
    productType: "extrait_parfum",
    notes: ["galbanum", "bergamot", "ginger", "solar notes", "sandalwood", "cedarwood"],
    description: "A modern woody-aromatic where green galbanum and bright ginger lead into creamy sandalwood and polished cedarwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Kobraa",
    category: "Man",
    inspiredBy: "Bvlgari — Kobraa (2020)",
    productType: "extrait_parfum",
    notes: ["geranium", "olibanum", "agarwood (oud)"],
    description: "A focused incense-oud composition lifted by green geranium, turning smoky-resinous and powerfully refined in the drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Man in Black",
    category: "Man",
    inspiredBy: "Bvlgari — Man in Black (2014)",
    productType: "extrait_parfum",
    notes: ["spices", "rum", "tobacco", "leather", "iris", "tuberose", "tonka bean", "guaiac wood", "benzoin"],
    description: "A dark boozy-spicy amber where rum and tobacco melt into leathery florals, finishing smooth with tonka and resinous woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Tygar",
    category: "Man",
    inspiredBy: "Bvlgari — Tygar (2016)",
    productType: "extrait_parfum",
    notes: ["grapefruit", "ginger", "ambrette", "ambroxan", "musk", "vetiver", "patchouli"],
    description: "A high-impact grapefruit-ginger citrus built on clean ambroxan musks, finishing crisp and modern with vetiver-patchouli.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Falkar",
    category: "Man",
    inspiredBy: "Bvlgari — Falkar (2019)",
    productType: "extrait_parfum",
    notes: ["nutmeg", "cinnamon", "cypriol oil (nagarmotha)", "olibanum", "agarwood (oud)", "black musk", "saffron"],
    description: "A smoky, spicy oud-incense scent with dark musk depth and a saffron-tinted, luxurious woody finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Man Rain Essence",
    category: "Man",
    inspiredBy: "Bvlgari — Man Rain Essence (2023)",
    productType: "extrait_parfum",
    notes: ["green tea", "orange", "white lotus", "musk", "guaiac wood", "amber"],
    description: "A clean, rain-fresh musky woody scent where green tea and orange glow over lotus, crystalline musk, and smooth ambered woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Luna Rossa",
    category: "Man",
    inspiredBy: "Prada — Luna Rossa (2012)",
    productType: "extrait_parfum",
    notes: ["lavender", "bitter orange", "mint", "clary sage", "ambrette (musk mallow)", "ambroxan"],
    description: "A sharp, soapy-clean aromatic where lavender and bitter orange meet mint and sage, drying down to a sleek ambroxan-musk base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "The Most Wanted",
    category: "Man",
    inspiredBy: "Azzaro — The Most Wanted (2021)",
    productType: "extrait_parfum",
    notes: ["cardamom", "toffee", "amberwood"],
    description: "A bold three-note gourmand-amber: spicy cardamom up top, melted toffee sweetness, and a warm amberwood base that sticks close and addictive.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Wanted",
    category: "Man",
    inspiredBy: "Azzaro — Wanted (2016)",
    productType: "extrait_parfum",
    notes: ["lemon", "ginger", "lavender", "mint", "apple", "Guatemalan cardamom", "juniper", "geranium", "tonka bean", "amberwood", "Haitian vetiver"],
    description: "A lively citrus-ginger aromatic with crisp apple and cardamom in the heart, finishing warm and modern with tonka, amberwood, and vetiver.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Chrome",
    category: "Man",
    inspiredBy: "Azzaro — Chrome (1996)",
    productType: "extrait_parfum",
    notes: ["lemon", "rosemary", "bergamot", "neroli", "pineapple", "jasmine", "oakmoss", "cyclamen", "coriander", "musk", "cedar", "sandalwood", "cardamom", "Brazilian rosewood", "tonka bean"],
    description: "A bright metallic-clean citrus aromatic—sparkling lemon and herbs over airy florals—resting on smooth musks and pale woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L'Homme Libre",
    category: "Man",
    inspiredBy: "Yves Saint Laurent — L'Homme Libre",
    productType: "extrait_parfum",
    notes: ["bergamot", "ginger", "vetiver", "cedar", "ambroxan"],
    description: "A fresh and refined woody scent with bright bergamot and spicy ginger opening, drying down to clean vetiver and cedar with a modern ambroxan finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Toy 2",
    category: "Woman",
    inspiredBy: "Moschino — Toy 2 (2018)",
    productType: "extrait_parfum",
    notes: ["apple", "magnolia", "jasmine", "rose", "patchouli", "vanilla", "musk"],
    description: "A playful fruity-floral built around crisp apple and soft magnolia, settling into a gentle vanilla-musk base with light patchouli.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Bois Talisman",
    category: "Unisex",
    inspiredBy: "Ex Nihilo — Bois Talisman (2023)",
    productType: "extrait_parfum",
    notes: ["bergamot", "pink pepper", "nutmeg", "cedar", "sandalwood", "patchouli", "vetiver", "musk", "amber"],
    description: "A sophisticated woody blend where citrus and spice open the scent, leading into layered cedar, sandalwood, and earthy patchouli with soft musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Stronger With You Sandalwood",
    category: "Man",
    inspiredBy: "Giorgio Armani — Emporio Armani Stronger With You Sandalwood (2024)",
    productType: "extrait_parfum",
    notes: ["lavender", "cardamom", "sandalwood", "tonka bean", "vanilla"],
    description: "An elegant sandalwood-focused fragrance with aromatic lavender and cardamom, sweetened by creamy tonka and vanilla for a refined, warm trail.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "CR7",
    category: "Man",
    inspiredBy: "Cristiano Ronaldo — CR7 (2015)",
    productType: "extrait_parfum",
    notes: ["lavender", "green apple", "sage", "tonka bean", "musk", "cedar"],
    description: "A clean aromatic fresh scent with lavender and green apple, drying down to soft tonka and musky cedarwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Tornado",
    category: "Unisex",
    inspiredBy: "Maison Asrar — Tornado",
    productType: "extrait_parfum",
    notes: ["vanilla", "caramel", "coffee", "praline", "musk"],
    description: "A rich gourmand with deep caramel-coffee sweetness, smooth vanilla, and a warm praline-musk finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Privé Men",
    category: "Man",
    inspiredBy: "Carolina Herrera — CH Privé Men (2024)",
    productType: "extrait_parfum",
    notes: ["bergamot", "cardamom", "lavender", "vetiver", "patchouli", "amber"],
    description: "A modern aromatic woody with fresh bergamot and cardamom, leading to clean vetiver and patchouli over soft amber.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Gisada",
    category: "Unisex",
    inspiredBy: "Gisada — Gisada",
    productType: "extrait_parfum",
    notes: ["apple", "cinnamon", "vanilla", "tonka bean", "sandalwood", "musk"],
    description: "A cozy apple-cinnamon gourmand that turns warm and creamy with vanilla, tonka, and smooth sandalwood musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Bois Imperial",
    category: "Unisex",
    inspiredBy: "Essential Parfums — Bois Impérial (2020)",
    productType: "extrait_parfum",
    notes: ["Haitian vetiver", "Indonesian patchouli", "pink pepper", "nutmeg", "sandalwood", "cedar"],
    description: "A powerful woody composition centered on rich Haitian vetiver and earthy patchouli, accented by spices and smooth woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Ejaazi",
    category: "Unisex",
    inspiredBy: "Lattafa — Ejaazi (2024)",
    productType: "extrait_parfum",
    notes: ["saffron", "rose", "oud", "amber", "vanilla", "musk"],
    description: "A luxurious saffron-rose oriental with deep oud and warm amber-vanilla, finishing on soft musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Le Male Lovers",
    category: "Man",
    inspiredBy: "Jean Paul Gaultier — Le Male Lovers (2024)",
    productType: "extrait_parfum",
    notes: ["mint", "vanilla", "tonka bean", "lavender", "sandalwood"],
    description: "A fresh minty opening leads into the signature sweet vanilla-tonka heart with lavender and smooth sandalwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Le Beau Paradise Garden",
    category: "Man",
    inspiredBy: "Jean Paul Gaultier — Le Beau Paradise Garden (2025)",
    productType: "extrait_parfum",
    notes: ["coconut", "pineapple", "tonka bean", "sandalwood"],
    description: "A tropical fruity twist with juicy pineapple and creamy coconut over sweet tonka and creamy sandalwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Patchouli",
    category: "Unisex",
    inspiredBy: "Vertus — Patchouli",
    productType: "extrait_parfum",
    notes: ["patchouli", "rose", "vanilla", "amber", "musk"],
    description: "A rich, earthy patchouli centered fragrance balanced with soft rose and warm vanilla-amber musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L.12.12 Silver Grey",
    category: "Man",
    inspiredBy: "Lacoste Fragrances — L.12.12 Silver Grey (2025)",
    productType: "extrait_parfum",
    notes: ["tangerine", "frankincense", "lavender", "geranium", "ambroxan", "vetiver"],
    description: "A clean modern fougère where bright tangerine and aromatic incense slide into lavender-geranium freshness, finishing smooth with ambroxan and vetiver.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Eau de Lacoste L.12.12 White",
    category: "Man",
    inspiredBy: "Lacoste Fragrances — Eau de Lacoste L.12.12 White (2011)",
    productType: "extrait_parfum",
    notes: ["grapefruit", "rosemary", "cardamom", "ylang-ylang", "tuberose", "Virginia cedar", "suede", "vetiver", "leather"],
    description: "A sporty fresh woody-aromatic built around grapefruit and rosemary, with creamy florals in the heart and a suede-leather woody base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Armani Code Sport",
    category: "Man",
    inspiredBy: "Giorgio Armani — Armani Code Sport (2011)",
    productType: "extrait_parfum",
    notes: ["mint", "mandarin orange", "lemon", "ginger flower", "water notes", "vetiver", "amber"],
    description: "A crisp mint-and-mandarin splash that stays bright and sporty, drying down into watery vetiver with a soft amber warmth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Armani Code Absolu",
    category: "Man",
    inspiredBy: "Giorgio Armani — Armani Code Absolu (2019)",
    productType: "extrait_parfum",
    notes: ["green mandarin", "apple", "nutmeg", "orange blossom", "carrot seeds", "vanilla", "tonka bean", "suede", "woody notes"],
    description: "A warm spicy-vanilla amber where juicy mandarin-apple meets nutmeg and orange blossom, settling into a smooth suede-tonka base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Armani Code",
    category: "Man",
    inspiredBy: "Giorgio Armani — Armani Code (2004)",
    productType: "extrait_parfum",
    notes: ["lemon", "bergamot", "star anise", "olive blossom", "guaiac wood", "leather", "tonka bean", "tobacco"],
    description: "A classic seductive spicy-amber built on citrus and star anise, drying down smooth and masculine with leather, tonka, and tobacco.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Allure Homme Sport",
    category: "Man",
    inspiredBy: "Chanel — Allure Homme Sport (2004)",
    productType: "extrait_parfum",
    notes: ["orange", "sea notes", "aldehydes", "blood mandarin", "pepper", "neroli", "cedar", "vanilla", "tonka bean", "white musk", "amber", "vetiver", "elemi resin"],
    description: "A bright sporty citrus-marine opening with a clean peppery heart, finishing creamy and elegant with vanilla-tonka over musky woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  }
];

async function main() {
  console.log('🚀 Starting products insertion (Batch 5)...');
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
  console.log(`✅ Successfully synced ${count} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
