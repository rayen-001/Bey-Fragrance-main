import { prisma } from './db/prisma';
import 'dotenv/config';

const products = [
  {
    name: "Yum Boujee Marshmallow | 81",
    category: "Unisex",
    inspiredBy: "Kayali — Yum Boujee Marshmallow | 81 (2024)",
    productType: "extrait_parfum",
    notes: ["Pink Lady apple", "nectarine blossom", "freesia", "Italian lemon", "pink marshmallow", "strawberry", "coconut flakes", "orange blossom", "whipped vanilla", "raspberry sugar", "pink musk", "ambrox"],
    description: "A fluffy strawberry-marshmallow gourmand brightened by apple and lemon, melting into whipped vanilla and soft musky ambrox sweetness.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Yum Pistachio Gelato | 33",
    category: "Unisex",
    inspiredBy: "Kayali — Yum Pistachio Gelato | 33 (2023)",
    productType: "extrait_parfum",
    notes: ["pistachio gelato", "hazelnut", "Italian bergamot", "sweet rum", "cardamom", "white peach", "muguet", "jasmine", "raspberry", "white peony", "green pear", "geranium", "whipped cream", "marshmallow", "cotton candy", "Turkish delight", "cocoa", "cedarwood", "sandalwood", "tonka"],
    description: "A decadent pistachio dessert perfume—nutty, creamy, and boozy—finishing in whipped sugar, soft woods, and tonka warmth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Maldives in a Bottle Ylang Coco | 20",
    category: "Unisex",
    inspiredBy: "Kayali — Maldives in a Bottle Ylang Coco | 20 (2024)",
    productType: "extrait_parfum",
    notes: ["wild lemon", "starfruit", "banana blossom", "rosemary", "ylang-ylang", "mimosa", "white plumeria", "coconut milk", "sandalwood", "vanilla", "guaiac wood"],
    description: "A serene tropical-aquatic with citrus and starfruit over solar florals, drying down creamy with coconut milk, sandalwood, and vanilla.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Pink Me Up",
    category: "Unisex",
    inspiredBy: "Atelier des Ors — Pink Me Up (2022)",
    productType: "extrait_parfum",
    notes: ["bergamot", "orange blossom", "champagne accord", "rose centifolia", "blackberry", "patchouli", "musk"],
    description: "A sparkling “champagne-rose” fragrance with juicy blackberry facets, finishing clean and sensual with soft patchouli-musk depth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Black Opium Le Parfum",
    category: "Woman",
    inspiredBy: "Yves Saint Laurent — Black Opium Le Parfum (2022)",
    productType: "extrait_parfum",
    notes: ["pear", "cinnamon", "green mandarin", "jasmine sambac", "solar notes", "orange blossom", "Madagascar vanilla", "bourbon vanilla", "vanilla absolute", "coffee", "vanilla orchid", "patchouli"],
    description: "A richer, more vanilla-driven Black Opium where spiced pear and luminous white florals melt into a coffee-vanilla overdose with a patchouli edge.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Scandal à Paris",
    category: "Woman",
    inspiredBy: "Jean Paul Gaultier — Scandal à Paris (2019)",
    productType: "extrait_parfum",
    notes: ["pear", "jasmine", "honey"],
    description: "A lighter, sparkling honeyed scent where juicy pear and airy jasmine lead into a clean, addictive honey finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Scandal By Night",
    category: "Woman",
    inspiredBy: "Jean Paul Gaultier — Scandal By Night (2018)",
    productType: "extrait_parfum",
    notes: ["honey", "bitter orange", "citruses", "cherry", "tuberose", "orange blossom", "pear", "nard (jatamansi)", "tonka bean", "vanilla", "patchouli", "sandalwood", "amberwood", "white musk"],
    description: "A bold night-time honey-cherry gourmand wrapped in white florals, then deepened with vanilla-tonka, woods, and warm amber musks.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Scandal Intense",
    category: "Woman",
    inspiredBy: "Jean Paul Gaultier — Scandal Intense (2025)",
    productType: "extrait_parfum",
    notes: ["cardamom", "ylang-ylang", "vanilla absolute"],
    description: "A streamlined spicy-floral vanilla where cardamom lifts creamy ylang-ylang, settling into a smooth vanilla absolute finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "So Scandal!",
    category: "Woman",
    inspiredBy: "Jean Paul Gaultier — So Scandal! (2020)",
    productType: "extrait_parfum",
    notes: ["raspberry", "tuberose", "jasmine sambac", "orange blossom", "milk"],
    description: "A loud, glamorous raspberry-white-floral with a creamy milk nuance that makes the tuberose feel plush and addictive.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "La Bomba",
    category: "Woman",
    inspiredBy: "Carolina Herrera — La Bomba (2025)",
    productType: "extrait_parfum",
    notes: ["pitahaya (dragon fruit)", "red peony", "frangipani", "vanilla", "patchouli"],
    description: "A bright tropical-floral built around dragon fruit and creamy frangipani, grounded by sweet vanilla and modern patchouli.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "So Elixir",
    category: "Woman",
    inspiredBy: "Yves Rocher — So Elixir (2009)",
    productType: "extrait_parfum",
    notes: ["bergamot", "Damask rose", "jasmine", "incense", "patchouli", "tonka bean"],
    description: "A sensual floral-woody incense perfume where rose and jasmine glow over patchouli and tonka for a warm, sophisticated trail.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "For Her Intense",
    category: "Woman",
    inspiredBy: "Narciso Rodriguez — For Her Eau de Parfum Intense (2025)",
    productType: "extrait_parfum",
    notes: ["peach", "Calabrian bergamot", "musk", "white blossoms", "red lily", "amber", "vanilla", "moss", "vetiver"],
    description: "A modern musky floral-fruity where peachy brightness and creamy white florals melt into a warm amber-vanilla base with mossy depth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "For Her Musc Noir Rose",
    category: "Woman",
    inspiredBy: "Narciso Rodriguez — For Her Musc Noir Rose (2022)",
    productType: "extrait_parfum",
    notes: ["plum", "pink pepper", "bergamot", "musk", "rose", "tuberose", "vanilla"],
    description: "A sensual rose-and-musk signature: juicy plum and spice up top, plush florals in the heart, and a smooth vanilla finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "All Of Me",
    category: "Woman",
    inspiredBy: "Narciso Rodriguez — All Of Me (2023)",
    productType: "extrait_parfum",
    notes: ["magnolia", "rose", "bourbon geranium", "musk", "sandalwood"],
    description: "A clean, modern floral built around magnolia and rose, softened by the house’s signature musc and creamy sandalwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Narciso",
    category: "Woman",
    inspiredBy: "Narciso Rodriguez — Narciso (2014)",
    productType: "extrait_parfum",
    notes: ["gardenia", "white rose", "musk", "white cedar extract", "cedar", "vetiver"],
    description: "A sleek “white-on-white” musk: creamy gardenia and rose over a smooth cedar-vetiver base that feels elegant and intimate.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Narcisse Noir",
    category: "Woman",
    inspiredBy: "Caron — Narcisse Noir (1911)",
    productType: "extrait_parfum",
    notes: ["narcissus", "African orange flower", "jasmine", "orange", "tincture of rose", "sandalwood", "musk", "vetiver"],
    description: "A legendary dark floral-oriental where narcissus and orange blossom glow through a smoky, sensual sandalwood-musk base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Nina",
    category: "Woman",
    inspiredBy: "Nina Ricci — Nina (2006)",
    productType: "extrait_parfum",
    notes: ["Italian lemon", "lime", "candied apple", "caramel", "gardenia", "cedarwood", "white musk"],
    description: "A playful “toffee apple” gourmand—sparkling citrus over a glossy caramel-apple heart with a clean musky-woody drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Ma Dame",
    category: "Woman",
    inspiredBy: "Jean Paul Gaultier — Ma Dame (2008)",
    productType: "extrait_parfum",
    notes: ["orange", "grenadine", "rose", "musk", "Virginia cedar"],
    description: "A bright, cheeky rose with a fruity grenadine twist, settling into a soft, clean musk-cedar finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Seductive",
    category: "Woman",
    inspiredBy: "Guess — Seductive (2010)",
    productType: "extrait_parfum",
    notes: ["pear", "bergamot", "black currant", "jasmine", "African orange flower", "orris root", "vanilla", "cashmere wood", "olibanum"],
    description: "A flirty pear-and-white-floral scent that turns creamy and smooth, with vanilla and cashmere woods warmed by a soft incense touch.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Her",
    category: "Woman",
    inspiredBy: "Burberry — Her (2018)",
    productType: "extrait_parfum",
    notes: ["strawberry", "raspberry", "blackberry", "sour cherry", "black currant", "mandarin orange", "lemon", "violet", "jasmine", "musk", "vanilla", "cashmeran", "woody notes", "amber", "oakmoss", "patchouli"],
    description: "A bold berries-and-musk signature: juicy red fruits upfront, a light floral heart, and a warm woody-amber finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Miami Blossom",
    category: "Woman",
    inspiredBy: "Escada — Miami Blossom (2019)",
    productType: "extrait_parfum",
    notes: ["watermelon", "blueberry", "orange", "pineapple", "tiare flower", "jasmine", "tuberose", "ambroxan", "musk", "sandalwood"],
    description: "A tropical summer cocktail—bright fruit and pineapple over creamy white florals, drying down to musky ambroxan warmth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Supreme Bouquet",
    category: "Unisex",
    inspiredBy: "Yves Saint Laurent — Supreme Bouquet (2013)",
    productType: "extrait_parfum",
    notes: ["fruity notes", "pear", "pink pepper", "tuberose", "ylang-ylang", "jasmine", "amber", "musk", "patchouli"],
    description: "A lush tuberose bouquet with a juicy pear-pepper opening, settling into warm amber-musk and elegant patchouli depth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Escada Margaretha Ley",
    category: "Woman",
    inspiredBy: "Escada — Escada Margaretha Ley (1990)",
    productType: "extrait_parfum",
    notes: ["hyacinth", "coconut", "peach", "bergamot", "ylang-ylang", "jasmine", "clove", "African orange flower", "iris", "sandalwood", "vanilla", "musk"],
    description: "A rich 90s floriental—creamy coconut-peach and white florals over warm vanilla sandalwood and soft musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Premier Jour",
    category: "Woman",
    inspiredBy: "Nina Ricci — Premier Jour (2001)",
    productType: "extrait_parfum",
    notes: ["sweet pea", "mandarin orange", "gardenia", "orchid", "musk", "sandalwood", "woodsy notes", "vanilla"],
    description: "A gentle, intimate floral where airy sweet pea and mandarin meet creamy gardenia-orchid, resting on soft vanilla woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Goddess",
    category: "Woman",
    inspiredBy: "Burberry — Goddess (2023)",
    productType: "extrait_parfum",
    notes: ["vanilla", "lavender", "cacao", "ginger", "vanilla caviar", "vanilla absolute"],
    description: "A modern vanilla built in layers—aromatic lavender and ginger over creamy vanilla depth with a subtle cacao warmth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Angel Fantasm",
    category: "Woman",
    inspiredBy: "Mugler — Angel Fantasm (2024)",
    productType: "extrait_parfum",
    notes: ["pineapple", "bergamot", "coconut", "tiare flower", "patchouli", "bourbon vanilla", "amber"],
    description: "A fruity-amber Angel flanker where juicy pineapple and coconut-tiare creaminess melt into patchouli and rich bourbon vanilla.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Gi",
    category: "Woman",
    inspiredBy: "Racco — Gi (2009)",
    productType: "extrait_parfum",
    notes: ["pink pepper", "white musk", "peony", "iris"],
    description: "A soft, clean floral-musk with a bright pink-pepper lift, blending powdery iris and peony into a smooth white-musk veil.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Dylan Purple",
    category: "Woman",
    inspiredBy: "Versace — Dylan Purple (2022)",
    productType: "extrait_parfum",
    notes: ["bitter orange", "pear", "bergamot", "purple freesia", "pomarose", "mahonial", "ambrox", "Iso E Super", "belambre woods", "Virginia cedar", "musk"],
    description: "A sparkling pear-citrus floral with a sleek modern woody-musk base that feels bright, clean, and effortlessly feminine.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Invite Only Amber | 23",
    category: "Unisex",
    inspiredBy: "Kayali — Invite Only Amber | 23 (2021)",
    productType: "extrait_parfum",
    notes: ["black cherry", "honey", "tobacco leaf", "Madagascar vanilla", "amber resin", "chocolate hazelnut", "oud oil"],
    description: "A smoky-sweet amber gourmand where cherry and honey meet tobacco and deep resinous vanilla, finished with a dark oud accent.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Oudgasm Rose Oud | 16",
    category: "Unisex",
    inspiredBy: "Kayali — Oudgasm Rose Oud | 16 (2023)",
    productType: "extrait_parfum",
    notes: ["Bulgarian rose", "Madagascan vanilla", "oud"],
    description: "A sensual rose-oud blend sweetened with vanilla—rich, dark, and designed to leave a plush, addictive trail.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Fleur Majesty Rose Royale | 31",
    category: "Woman",
    inspiredBy: "Kayali — Fleur Majesty Rose Royale | 31 (2025)",
    productType: "extrait_parfum",
    notes: ["pear", "peach", "mandarin", "orange", "rose", "peony", "violet", "magnolia", "musk", "vanilla", "ambrox super", "praline", "vetiver"],
    description: "A juicy fruity-rose floral where pear and peach brighten a romantic bouquet, drying down creamy-sweet with vanilla praline and soft musks.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Voilà!",
    category: "Woman",
    inspiredBy: "Gissah — Voilà! (2025)",
    productType: "extrait_parfum",
    notes: ["orange blossom", "heliotrope", "honey", "mandarin orange", "jasmine", "amber", "rose", "musk"],
    description: "A honeyed white-floral amber—softly radiant and feminine—warming into rosy musk with an ambery glow.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Ajwad",
    category: "Unisex",
    inspiredBy: "Lattafa — Ajwad (2021)",
    productType: "extrait_parfum",
    notes: ["fruity notes", "rose", "jasmine", "orris", "vanilla", "cedar", "amber", "musk"],
    description: "A smooth fruity-floral that turns creamy and warm, settling into an ambery woody-musky base with a soft vanilla sheen.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Crème Brûlée",
    category: "Unisex",
    inspiredBy: "Theodoros Kalotinis — Crème Brûlée (2024)",
    productType: "extrait_parfum",
    notes: ["caramelized sugar", "caramel", "vanilla", "custard", "whipped cream", "coconut milk"],
    description: "A hyper-gourmand dessert scent—burnt sugar crust over creamy vanilla custard—rich, cozy, and unapologetically edible.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Love Delight",
    category: "Woman",
    inspiredBy: "Amouage — Love Delight (2024)",
    productType: "extrait_parfum",
    notes: ["ginger", "cinnamon", "heliotrope", "jasmine", "rose", "vanilla", "cypriol (nagarmotha)"],
    description: "A warm spicy-gourmand floral where ginger and cinnamon glow over a soft heliotrope-rose heart, finishing creamy and sensual with vanilla and earthy cypriol.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Pink Sugar",
    category: "Woman",
    inspiredBy: "Aquolina — Pink Sugar (2004)",
    productType: "extrait_parfum",
    notes: ["raspberry", "orange", "bergamot", "fig leaf", "cotton candy", "licorice", "strawberry", "red berries", "lily-of-the-valley", "caramel", "vanilla", "musk", "tonka bean", "sandalwood"],
    description: "A cult-classic cotton-candy gourmand—bright fruity sugar at first, then a sticky caramel-vanilla drydown with a distinctive licorice twist.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Hot as Rose",
    category: "Woman",
    inspiredBy: "Lancôme — Absolue Hot As Rose (2024)",
    productType: "extrait_parfum",
    notes: ["centifolia rose", "blackcurrant bud", "juniper berry", "cypress", "rosemary", "patchouli"],
    description: "A radiant rose warmed by aromatic herbs and a fruity blackcurrant edge, finishing earthy and textured with patchouli.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Chance Splendide",
    category: "Woman",
    inspiredBy: "Chanel — Chance Splendide (2025)",
    productType: "extrait_parfum",
    notes: ["raspberry accord", "rose", "violet", "geranium", "iris", "cedar", "white musk"],
    description: "A sparkling fruity-floral where raspberry and rose feel airy and bright, polished by powdery iris and clean cedar-white musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Eclaire",
    category: "Unisex",
    inspiredBy: "Lattafa — Eclaire (2024)",
    productType: "extrait_parfum",
    notes: ["caramel", "milk", "sugar", "white flowers", "honey", "vanilla", "praline", "musk"],
    description: "A creamy dessert gourmand that opens with caramel-milk sweetness, then melts into honeyed vanilla-praline musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Tropical Boost",
    category: "Woman",
    inspiredBy: "Zara — Tropical Boost (2022)",
    productType: "extrait_parfum",
    notes: ["pineapple", "grapefruit", "mandarin orange", "jasmine", "rose", "almond milk", "brown sugar", "woody notes"],
    description: "A bright tropical fruit splash with a soft floral heart and a creamy sugary finish over light woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "La Fiesta",
    category: "Woman",
    inspiredBy: "Mango — La Fiesta (2021)",
    productType: "extrait_parfum",
    notes: ["pear", "bergamot", "orange blossom", "jasmine", "iris", "vanilla"],
    description: "A cheerful white-floral with juicy pear and citrus freshness, warmed by a smooth vanilla drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Decadence",
    category: "Woman",
    inspiredBy: "Marc Jacobs — Decadence (2015)",
    productType: "extrait_parfum",
    notes: ["plum", "saffron", "iris", "Bulgarian rose", "jasmine sambac", "vetiver", "amber"],
    description: "A sensual plum-and-iris amber with a saffron glow, turning plush and elegant over warm vetivered amber.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L'Impératrice Royale",
    category: "Woman",
    inspiredBy: "Dolce&Gabbana — L'Impératrice Royale (2025)",
    productType: "extrait_parfum",
    notes: ["cranberry", "azalea", "Virginia cedar"],
    description: "A tangy cranberry opening blooms into airy azalea, then dries down sleek and modern with clean cedarwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "I Want Choo",
    category: "Woman",
    inspiredBy: "Jimmy Choo — I Want Choo (2020)",
    productType: "extrait_parfum",
    notes: ["mandarin orange", "peach", "jasmine", "red lily", "vanilla"],
    description: "A glamorous peach-vanilla floral where bright mandarin and juicy peach melt into a smooth, addictive vanilla base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Dolce Garden",
    category: "Woman",
    inspiredBy: "Dolce&Gabbana — Dolce Garden (2018)",
    productType: "extrait_parfum",
    notes: ["mandarin orange", "neroli", "magnolia", "coconut", "frangipani", "ylang-ylang", "vanilla", "almond milk", "sandalwood"],
    description: "A sunny tropical floral-gourmand—coconut and frangipani wrapped in creamy almond milk and vanilla over smooth sandalwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Aqua Allegoria Mandarine Basilic",
    category: "Woman",
    inspiredBy: "Guerlain — Aqua Allegoria Mandarine Basilic (2007)",
    productType: "extrait_parfum",
    notes: ["mandarin orange", "basil", "green tea", "bitter orange", "woody notes"],
    description: "A sparkling mandarin-and-basil freshness with a clean green-tea nuance and an airy woody finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Scandal Absolu",
    category: "Woman",
    inspiredBy: "Jean Paul Gaultier — Scandal Absolu (2024)",
    productType: "extrait_parfum",
    notes: ["tuberose", "black fig", "sandalwood"],
    description: "A daring tuberose-forward scent sweetened with syrupy black fig, drying down creamy and sensual with sandalwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Libre Vanille",
    category: "Woman",
    inspiredBy: "Yves Saint Laurent — Libre Vanille (2025)",
    productType: "extrait_parfum",
    notes: ["bourbon vanilla", "rum", "lavender", "orange blossom"],
    description: "A gourmand-leaning Libre twist where aromatic lavender and orange blossom are wrapped in boozy rum and dense vanilla warmth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Libre Flowers & Flames",
    category: "Woman",
    inspiredBy: "Yves Saint Laurent — Libre Flowers & Flames (2024)",
    productType: "extrait_parfum",
    notes: ["lavender", "bergamot", "orange blossom", "lily", "coconut", "vanilla"],
    description: "A warm solar-floral where lavender and orange blossom meet creamy coconut nuance and glowing lily, finished with smooth vanilla.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  }
];

async function main() {
  console.log('🚀 Starting products insertion (Batch 2)...');
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
