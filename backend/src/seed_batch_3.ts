import { prisma } from './db/prisma';
import 'dotenv/config';

const products = [
  {
    name: "Les Sables Roses",
    category: "Unisex",
    inspiredBy: "Louis Vuitton — Les Sables Roses (2019)",
    productType: "extrait_parfum",
    notes: ["rose", "Bulgarian rose", "agarwood (oud)", "ambergris", "saffron", "black pepper"],
    description: "A luxurious rose-oud centered on deep, velvety rose petals dusted with saffron and pepper, drying down with ambergris warmth.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "California Dream",
    category: "Unisex",
    inspiredBy: "Louis Vuitton — California Dream (2020)",
    productType: "extrait_parfum",
    notes: ["mandarin orange", "pear", "ambrette (musk mallow)", "musk", "benzoin"],
    description: "A sunny mandarin-citrus scent softened by pear and clean musks, with benzoin adding a warm, skin-like glow.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Étoile Filante",
    category: "Woman",
    inspiredBy: "Louis Vuitton — Étoile Filante (2021)",
    productType: "extrait_parfum",
    notes: ["strawberry", "osmanthus", "jasmine", "magnolia", "white musk"],
    description: "A bright strawberry-osmanthus floral that feels airy and joyful, finishing as a soft, clean white-musk veil.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Stellar Times",
    category: "Unisex",
    inspiredBy: "Louis Vuitton — Stellar Times (2021)",
    productType: "extrait_parfum",
    notes: ["orange blossom", "white amber", "Peru balsam", "woody notes"],
    description: "A radiant amber-floral where orange blossom shines over smooth, glowing resins and elegant woods.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Lady Million",
    category: "Woman",
    inspiredBy: "Rabanne — Lady Million (2010)",
    productType: "extrait_parfum",
    notes: ["raspberry", "neroli", "Amalfi lemon", "jasmine", "African orange flower", "gardenia", "white honey", "patchouli", "amber"],
    description: "A glamorous fruity-white-floral sweetened with honey, finishing warm and sensual with patchouli and amber.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Irresistible Givenchy",
    category: "Woman",
    inspiredBy: "Givenchy — Irresistible Givenchy (2020)",
    productType: "extrait_parfum",
    notes: ["pear", "ambrette (musk mallow)", "rose", "iris", "musk", "Virginia cedar"],
    description: "A clean, modern pear-and-rose scent with a polished musky-woody base that feels effortless and elegant.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L'Interdit Absolu",
    category: "Woman",
    inspiredBy: "Givenchy — L'Interdit Absolu (2024)",
    productType: "extrait_parfum",
    notes: ["Guatemalan cardamom", "lavender", "neroli", "Indian tuberose", "jasmine sambac", "orange blossom", "tobacco", "rum", "patchouli", "Haitian vetiver"],
    description: "A darker, bolder L’Interdit: aromatic spice and white florals over a boozy tobacco-tinged patchouli-vetiver base.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L'Interdit Rouge",
    category: "Woman",
    inspiredBy: "Givenchy — L'Interdit Rouge (2021)",
    productType: "extrait_parfum",
    notes: ["ginger", "blood orange", "tuberose", "jasmine", "pimento leaf", "sandalwood", "patchouli", "vetiver"],
    description: "A spicy-citrus take on the L’Interdit white-floral signature, deepened by creamy woods and earthy patchouli-vetiver.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L’Interdit Le Parfum",
    category: "Woman",
    inspiredBy: "Givenchy — L’Interdit Le Parfum (2025)",
    productType: "extrait_parfum",
    notes: ["pear", "bitter almond", "apple", "tuberose", "jasmine", "mimosa", "benzoin", "myrrh", "patchouli", "opoponax", "vetiver"],
    description: "A “forbidden fruit” white-floral amber where pear and almond meet radiant tuberose, finishing resinous and velvety.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Insolence",
    category: "Woman",
    inspiredBy: "Guerlain — Insolence (2006)",
    productType: "extrait_parfum",
    notes: ["raspberry", "red berries", "bergamot", "lemon", "violet", "rose", "orange blossom", "iris", "tonka bean", "resins", "musk", "sandalwood"],
    description: "A bold violet-iris floral with a sparkling berry opening and a smooth, powdery tonka-musk drydown.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Comme une Evidence",
    category: "Woman",
    inspiredBy: "Yves Rocher — Comme une Evidence (2003)",
    productType: "extrait_parfum",
    notes: ["rhubarb", "violet leaf", "lily-of-the-valley", "rose", "oakmoss", "patchouli", "musk"],
    description: "A refined floral-chypre style with fresh green facets and rose-muguet clarity, anchored by soft mossy musk and patchouli.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Incidence",
    category: "Woman",
    inspiredBy: "Yves de Sistelle — Incidence",
    productType: "extrait_parfum",
    notes: ["pear", "bergamot", "mandarin", "rose", "jasmine", "iris", "cedar", "musk", "amber"],
    description: "A bright pear-citrus floral that turns softly powdery with iris, finishing warm and clean with cedar, amber, and musk.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Daisy",
    category: "Woman",
    inspiredBy: "Marc Jacobs — Daisy (2007)",
    productType: "extrait_parfum",
    notes: ["violet leaf", "blood grapefruit", "strawberry", "violet", "gardenia", "jasmine", "musk", "white woods", "vanilla"],
    description: "A crisp, youthful fresh-floral with sparkling grapefruit and soft strawberry, drying down to clean musks and pale woods.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "La Vie est Belle L'Elixir",
    category: "Woman",
    inspiredBy: "Lancôme — La Vie est Belle L'Elixir (2024)",
    productType: "extrait_parfum",
    notes: ["raspberry", "liquor", "Calabrian bergamot", "violet leaf", "rose", "leather", "cacao butter", "cedarwood"],
    description: "A richer, jammy raspberry-violet twist with a smooth cocoa-butter creaminess and a chic leather-cedar finish.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "La Vie est Belle Vanille",
    category: "Woman",
    inspiredBy: "Lancôme — La Vie est Belle Vanille",
    productType: "extrait_parfum",
    notes: ["vanilla", "iris", "orange blossom", "jasmine", "praline", "tonka bean", "patchouli"],
    description: "A vanilla-forward take on the La Vie Est Belle DNA, blending creamy florals with praline sweetness and a soft patchouli finish.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Devotion",
    category: "Woman",
    inspiredBy: "Dolce&Gabbana — Devotion (2023)",
    productType: "extrait_parfum",
    notes: ["candied lemon", "orange blossom", "panettone accord", "vanilla"],
    description: "A bright candied-lemon gourmand softened by orange blossom, drying down into a smooth, warm vanilla pastry trail.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Diamant",
    category: "Woman",
    inspiredBy: "Diamant",
    productType: "extrait_parfum",
    notes: ["bergamot", "pear", "jasmine", "orange blossom", "vanilla", "praline", "musk"],
    description: "A sparkling fruity-floral that settles into a soft, creamy vanilla-praline musk drydown.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "My Burberry",
    category: "Woman",
    inspiredBy: "Burberry — My Burberry (2014)",
    productType: "extrait_parfum",
    notes: ["sweet pea", "bergamot", "quince", "freesia", "geranium", "damask rose", "centifolia rose", "patchouli", "rain accord"],
    description: "A modern British floral inspired by a garden after rain—crisp, dewy petals over elegant patchouli depth.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Donna Born in Roma",
    category: "Woman",
    inspiredBy: "Valentino — Donna Born in Roma (2019)",
    productType: "extrait_parfum",
    notes: ["black currant", "bergamot", "pink pepper", "jasmine", "jasmine tea", "bourbon vanilla", "guaiac wood", "cashmeran"],
    description: "A vibrant blackcurrant-jasmine floral wrapped in a cozy bourbon-vanilla and modern woody base.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Alien",
    category: "Woman",
    inspiredBy: "Mugler — Alien (2005)",
    productType: "extrait_parfum",
    notes: ["jasmine sambac", "cashmeran", "amber"],
    description: "A powerful jasmine-amber signature—radiant, mysterious, and long-lasting with a smooth woody-amber glow.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Orchid",
    category: "Woman",
    inspiredBy: "Zara — Orchid",
    productType: "extrait_parfum",
    notes: ["bergamot", "pear", "rose", "jasmine", "vanilla", "musk"],
    description: "A soft fruity-floral with a gentle rose-jasmine heart and a clean vanilla-musk base for easy wear.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Olympéa",
    category: "Woman",
    inspiredBy: "Rabanne — Olympéa (2015)",
    productType: "extrait_parfum",
    notes: ["green mandarin", "water jasmine", "ginger flower", "salt", "vanilla", "ambergris", "sandalwood", "cashmere wood"],
    description: "A distinctive salty-vanilla amber where fresh florals meet creamy woods for a sensual, sun-warmed finish.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Chance",
    category: "Woman",
    inspiredBy: "Chanel — Chance (2003)",
    productType: "extrait_parfum",
    notes: ["pink pepper", "lemon", "pineapple", "hyacinth", "jasmine", "iris", "patchouli", "vetiver", "white musk", "vanilla"],
    description: "A sparkling, clean chypre-style freshness—zesty and bright up top, then softly musky with elegant patchouli-vetiver.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Sense",
    category: "Woman",
    inspiredBy: "Laverne — Sense",
    productType: "extrait_parfum",
    notes: ["bergamot", "pear", "jasmine", "orange blossom", "vanilla", "amber", "musk"],
    description: "A smooth fruity-white-floral that dries down into a warm, comforting vanilla-amber musk.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Flowerbomb Tiger Lily",
    category: "Woman",
    inspiredBy: "Viktor&Rolf — Flowerbomb Tiger Lily (2024)",
    productType: "extrait_parfum",
    notes: ["mango", "coconut milk", "tiger lily accord", "jasmine", "benzoin", "musk"],
    description: "A tropical-fruity floral where juicy mango and creamy coconut frame a bright tiger-lily bloom, finishing soft and resin-warm.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Manifesto L’Elixir",
    category: "Woman",
    inspiredBy: "Yves Saint Laurent — Manifesto L’Elixir (2013)",
    productType: "extrait_parfum",
    notes: ["bergamot", "mandarin orange", "jasmine", "tuberose", "vanilla", "tonka bean", "amber", "cashmere wood"],
    description: "A richer, warmer Manifesto—white florals wrapped in dense vanilla-tonka amber with a smooth woody finish.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Nomade Nuit d’Égypte",
    category: "Woman",
    inspiredBy: "Chloé — Nomade Nuit d’Égypte (2024)",
    productType: "extrait_parfum",
    notes: ["myrrh", "cinnamon", "ginger", "orange blossom", "cypriol (nagarmotha)", "kyphi accord", "vanilla", "sandalwood"],
    description: "A resinous, spicy floral inspired by ancient perfumery—warm myrrh and spices over a smooth, ambery-woody base.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Quelques Notes d’Amour",
    category: "Woman",
    inspiredBy: "Yves Rocher — Quelques Notes d’Amour (2014)",
    productType: "extrait_parfum",
    notes: ["Damask rose", "guaiac wood", "benzoin"],
    description: "A romantic rose wrapped in smooth smoky woods, finished with a soft resinous sweetness.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "La Nuit Trésor",
    category: "Woman",
    inspiredBy: "Lancôme — La Nuit Trésor (2015)",
    productType: "extrait_parfum",
    notes: ["pear", "bergamot", "tangerine", "strawberry", "passionfruit", "rose", "vanilla orchid", "praline", "patchouli", "incense", "papyrus"],
    description: "A dark fruity-gourmand where juicy pear and berries melt into praline-vanilla depth with a sensual incense-patchouli trail.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Trésor Midnight Rose",
    category: "Woman",
    inspiredBy: "Lancôme — Trésor Midnight Rose (2011)",
    productType: "extrait_parfum",
    notes: ["raspberry", "rose", "black currant bud", "pink pepper", "jasmine", "peony", "vanilla", "musk", "cedar"],
    description: "A flirty raspberry-rose with a lively berry sparkle, drying down soft and smooth with vanilla musk and light woods.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Flora",
    category: "Woman",
    inspiredBy: "Gucci — Flora by Gucci (2009)",
    productType: "extrait_parfum",
    notes: ["citrus", "peony", "rose", "osmanthus", "sandalwood", "patchouli"],
    description: "A polished floral bouquet with rose and peony brightness, grounded by elegant patchouli and creamy sandalwood.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Bamboo",
    category: "Woman",
    inspiredBy: "Gucci — Bamboo (2015)",
    productType: "extrait_parfum",
    notes: ["bergamot", "ylang-ylang", "Casablanca lily", "orange blossom", "sandalwood", "Tahitian vanilla", "amber", "musk"],
    description: "A smooth white-floral with a refined woody backbone—creamy, modern, and softly warm in the drydown.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Gucci Guilty",
    category: "Woman",
    inspiredBy: "Gucci — Gucci Guilty (2010)",
    productType: "extrait_parfum",
    notes: ["pink pepper", "mandarin orange", "bergamot", "peach", "lilac", "geranium", "patchouli", "amber"],
    description: "A warm, slightly sweet floral-amber with spicy citrus on top and a sensual patchouli-amber base.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Le Parfum",
    category: "Woman",
    inspiredBy: "Elie Saab — Le Parfum (2011)",
    productType: "extrait_parfum",
    notes: ["orange blossom", "jasmine", "rose", "honey", "patchouli", "cedar"],
    description: "A luminous orange-blossom floral with a honeyed warmth, anchored by elegant patchouli and cedar.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Million Gold",
    category: "Woman",
    inspiredBy: "Rabanne — Million Gold for Her (2024)",
    productType: "extrait_parfum",
    notes: ["mandarin orange", "pear", "rose", "jasmine", "vanilla", "musk", "cashmeran"],
    description: "A glossy fruity-floral with a smooth vanilla-musk base, designed to feel radiant, feminine, and addictive.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Yara Candy",
    category: "Woman",
    inspiredBy: "Lattafa — Yara Candy",
    productType: "extrait_parfum",
    notes: ["strawberry", "black currant", "tangerine", "gardenia", "jasmine", "vanilla", "musk", "sandalwood"],
    description: "A candy-sweet fruity floral with a creamy vanilla-musk finish and a soft, playful trail.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Q",
    category: "Woman",
    inspiredBy: "Dolce&Gabbana — Q by Dolce&Gabbana (2023)",
    productType: "extrait_parfum",
    notes: ["Sicilian lemon", "blood orange", "cherry", "jasmine", "heliotrope", "cedarwood", "musk"],
    description: "A bright citrus-cherry fruity floral that dries down clean and modern with cedar and soft musks.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Bombshell",
    category: "Woman",
    inspiredBy: "Victoria’s Secret — Bombshell (2010)",
    productType: "extrait_parfum",
    notes: ["grapefruit", "passionfruit", "pineapple", "tangerine", "strawberry", "peony", "jasmine", "vanilla orchid", "red berries", "musk", "oakmoss", "woods"],
    description: "A bright, juicy fruity-floral built for compliments—sparkling citrus and tropical fruit over a clean musky base.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Bombshell Intense",
    category: "Woman",
    inspiredBy: "Victoria’s Secret — Bombshell Intense (2019)",
    productType: "extrait_parfum",
    notes: ["cherry", "red peony", "vanilla"],
    description: "A deeper, sweeter Bombshell style where juicy cherry and plush peony melt into a smooth vanilla finish.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Rose Star",
    category: "Unisex",
    inspiredBy: "Dior — Rose Star",
    productType: "extrait_parfum",
    notes: ["rose", "raspberry", "pink pepper", "patchouli", "musk"],
    description: "A radiant rose with a lightly fruity sparkle, settling into a clean, modern patchouli-musk drydown.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Rose Amira",
    category: "Unisex",
    inspiredBy: "Guerlain — Rose Amira",
    productType: "extrait_parfum",
    notes: ["Damask rose", "saffron", "amber", "benzoin", "patchouli", "musk"],
    description: "A rich rose-amber wrapped in warm saffron and resins, finishing smooth, deep, and softly musky.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L.12.12 Rose Eau Intense",
    category: "Woman",
    inspiredBy: "Lacoste — L.12.12 Rose Eau Intense (2021)",
    productType: "extrait_parfum",
    notes: ["mandarin orange", "white tea", "pepper", "rose", "cotton flower", "musk", "sandalwood"],
    description: "A brighter, more vibrant rose with clean tea freshness, drying down soft and smooth with musks and sandalwood.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Guidance",
    category: "Unisex",
    inspiredBy: "Amouage — Guidance (2023)",
    productType: "extrait_parfum",
    notes: ["pear", "hazelnut", "olibanum (frankincense)", "saffron", "rose", "jasmine sambac", "osmanthus", "sandalwood", "ambergris", "vanilla", "labdanum"],
    description: "A luxurious fruity-floral amber where pear and hazelnut meet incense and rose, finishing creamy, resinous, and enveloping.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Candy Love",
    category: "Woman",
    inspiredBy: "Escada — Candy Love (2020)",
    productType: "extrait_parfum",
    notes: ["candied apple", "rose", "whipped cream", "vanilla", "musk"],
    description: "A fun candy-apple gourmand softened by rosy sweetness and finished with creamy whipped-vanilla musk.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "مشاعر",
    category: "Unisex",
    inspiredBy: "Mecca Perfumes — مشاعر",
    productType: "extrait_parfum",
    notes: ["vanilla", "rice accord", "musk", "woody notes"],
    description: "A soft, clean musky scent with a creamy vanilla-rice warmth and a smooth woody finish.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "غرام",
    category: "Unisex",
    inspiredBy: "Swiss Arabian — Gharaam",
    productType: "extrait_parfum",
    notes: ["saffron", "jasmine", "spicy notes", "woody notes", "amber"],
    description: "A warm amber-woody oriental where saffron-spiced jasmine melts into a smooth, lasting woody-amber base.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "أميرة العرب",
    category: "Unisex",
    inspiredBy: "Lattafa — Ameerat Al Arab",
    productType: "extrait_parfum",
    notes: ["citrus notes", "spicy notes", "resinous notes", "jasmine", "oud", "woody notes", "musk"],
    description: "A bold Middle Eastern amber style that opens fresh and spiced, then settles into jasmine, oud-woods, and musk.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "My Way",
    category: "Woman",
    inspiredBy: "Giorgio Armani — My Way (2020)",
    productType: "extrait_parfum",
    notes: ["Calabrian bergamot", "orange blossom", "tuberose", "jasmine", "Madagascar vanilla", "white musk", "Virginia cedarwood"],
    description: "A bright white-floral led by orange blossom and tuberose, softened by vanilla and clean musks over smooth cedar.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Challenge",
    category: "Man",
    inspiredBy: "Lacoste — Challenge (2009)",
    productType: "extrait_parfum",
    notes: ["Amalfi lemon", "tangerine", "bergamot", "ginger", "lavender", "violet leaf", "teak wood", "ebony wood"],
    description: "A crisp citrus-aromatic with a fresh spicy heart and a clean, dry woody finish.",
    price: 25.0,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  }
];

async function main() {
  console.log('🚀 Starting products insertion (Batch 3)...');
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
