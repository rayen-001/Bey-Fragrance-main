import { prisma } from './db/prisma';
import 'dotenv/config';

const products = [
  {
    name: "Pure Poison",
    category: "Woman",
    inspiredBy: "Dior — Pure Poison (2004)",
    productType: "extrait_parfum",
    notes: ["jasmine", "orange", "bergamot", "Sicilian mandarin", "gardenia", "orange blossom", "sandalwood", "white amber", "cedar", "white musk"],
    description: "A luminous white-floral bouquet where jasmine and orange blossom glow over smooth woods and clean white musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Blush",
    category: "Woman",
    inspiredBy: "Marc Jacobs — Blush (2004)",
    productType: "extrait_parfum",
    notes: ["jasmine", "peach", "bergamot", "honeysuckle", "orange blossom", "freesia", "tuberose", "cashmere wood", "musk", "sandalwood"],
    description: "A jasmine-forward floral with a soft peachy opening and a warm musky-woody drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "1881",
    category: "Woman",
    inspiredBy: "Cerruti — 1881 (1995)",
    productType: "extrait_parfum",
    notes: ["mimosa", "iris", "rose", "freesia", "violet", "lily-of-the-valley", "jasmine", "bergamot", "chamomile", "narcissus", "galbanum", "geranium", "coriander", "Brazilian rosewood", "orange blossom", "tuberose", "musk", "sandalwood", "cedar", "vanilla", "amber"],
    description: "A classic, elegant floral with powdery iris and soft woods, balanced by warm amber and vanilla.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L'Instant de Guerlain",
    category: "Woman",
    inspiredBy: "Guerlain — L'Instant de Guerlain (2003)",
    productType: "extrait_parfum",
    notes: ["mandarin", "red apple", "bergamot", "magnolia", "iris", "ylang-ylang", "jasmine", "white honey", "vanilla", "amber", "benzoin", "musk"],
    description: "A honeyed amber-floral that melts magnolia and iris into a warm vanilla-benzoin glow.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Coconut Passion",
    category: "Woman",
    inspiredBy: "Victoria's Secret — Coconut Passion",
    productType: "extrait_parfum",
    notes: ["coconut", "vanilla", "lily-of-the-valley", "chamomile", "aloe vera"],
    description: "A cozy coconut-vanilla gourmand body mist softened with airy florals for an easy, creamy skin scent.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Wonder Rose",
    category: "Woman",
    inspiredBy: "Zara — Wonder Rose (2016)",
    productType: "extrait_parfum",
    notes: ["red berries", "peach", "rose", "violet", "cedar", "vanilla", "musk"],
    description: "A bright fruity-rose scent with a soft vanilla-musk base that keeps it sweet and wearable.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Hypnotic Poison",
    category: "Woman",
    inspiredBy: "Dior — Hypnotic Poison (1998)",
    productType: "extrait_parfum",
    notes: ["coconut", "plum", "apricot", "Brazilian rosewood", "jasmine", "tuberose", "caraway", "rose", "lily-of-the-valley", "vanilla", "almond", "sandalwood", "musk"],
    description: "A seductive almond-vanilla oriental with a creamy coconut-fruit opening and a warm musky finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Coco",
    category: "Woman",
    inspiredBy: "Chanel — Coco (1984)",
    productType: "extrait_parfum",
    notes: ["Bulgarian rose", "coriander", "peach", "jasmine", "mandarin orange", "cloves", "rose", "mimosa", "orange blossom", "clover", "amber", "sandalwood", "opoponax", "tonka bean", "civet", "vanilla", "labdanum"],
    description: "A rich spicy-amber classic where cloves and florals sink into resinous vanilla-labdanum warmth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Gabrielle",
    category: "Woman",
    inspiredBy: "Chanel — Gabrielle (2017)",
    productType: "extrait_parfum",
    notes: ["grapefruit", "mandarin orange", "black currant", "orange blossom", "jasmine", "ylang-ylang", "tuberose", "lily-of-the-valley", "pear", "pink pepper", "musk", "sandalwood", "cashmeran", "orris"],
    description: "A radiant white-floral bouquet with a crisp citrus start and a soft musky-woody base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Roses Musk",
    category: "Woman",
    inspiredBy: "Montale — Roses Musk (2009)",
    productType: "extrait_parfum",
    notes: ["rose", "musk", "jasmine"],
    description: "A minimalist rose-musk trail with a subtle jasmine lift, clean yet intensely present.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Tommy Girl",
    category: "Woman",
    inspiredBy: "Tommy Hilfiger — Tommy Girl (1996)",
    productType: "extrait_parfum",
    notes: ["apple tree blossom", "mandarin orange", "camelia", "black currant", "lemon", "honeysuckle", "grapefruit", "rose", "lily", "mint", "violet", "magnolia", "jasmine", "cedar", "sandalwood", "leather"],
    description: "A crisp, energetic fruity-floral with citrus and green notes over a light woody-leathery base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Flora Gorgeous Orchid",
    category: "Woman",
    inspiredBy: "Gucci — Flora Gorgeous Orchid (2024)",
    productType: "extrait_parfum",
    notes: ["vanilla", "vanilla orchid", "ozonic notes"],
    description: "A modern airy vanilla floral, pairing creamy vanilla with a luminous ozonic freshness.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "My Way Ylang",
    category: "Woman",
    inspiredBy: "Giorgio Armani — My Way Ylang (2024)",
    productType: "extrait_parfum",
    notes: ["mango", "coconut", "orange blossom", "bergamot", "ylang-ylang", "tuberose", "vanilla", "white musk", "cedarwood"],
    description: "A tropical-floral twist on My Way, blending mango-coconut brightness into creamy vanilla musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Roberto Cavalli",
    category: "Woman",
    inspiredBy: "Roberto Cavalli — Roberto Cavalli (2012)",
    productType: "extrait_parfum",
    notes: ["pink pepper", "African orange flower", "vanilla", "benzoin", "tonka bean"],
    description: "A bold warm floral-amber with spicy pink pepper up top and a deep vanilla-benzoin drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Fame",
    category: "Woman",
    inspiredBy: "Rabanne — Fame (2022)",
    productType: "extrait_parfum",
    notes: ["mango", "bergamot", "jasmine", "olibanum", "vanilla", "sandalwood"],
    description: "A glossy mango-jasmine scent with an incense shimmer, settling into creamy vanilla sandalwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Hareem Al Sultan Gold",
    category: "Woman",
    inspiredBy: "Khadlaj Perfumes — Hareem Al Sultan Gold (2023)",
    productType: "extrait_parfum",
    notes: ["bergamot", "jasmine", "peony", "pineapple", "peach", "plum", "musk", "sandalwood", "patchouli"],
    description: "A juicy tropical-fruity floral that dries down to smooth musk, sandalwood, and patchouli.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Because It's You",
    category: "Woman",
    inspiredBy: "Giorgio Armani — Emporio Armani Because It’s You (2017)",
    productType: "extrait_parfum",
    notes: ["raspberry", "lemon", "neroli", "rose", "vanilla", "musk", "amberwood"],
    description: "A playful raspberry-rose gourmand with a soft vanilla-musky amberwood base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Emporio Armani In Love With You",
    category: "Woman",
    inspiredBy: "Giorgio Armani — Emporio Armani In Love With You (2019)",
    productType: "extrait_parfum",
    notes: ["raspberry", "black currant", "sour cherry", "rose", "jasmine", "wormwood", "patchouli"],
    description: "A juicy red-berry and cherry opening that turns softly floral, finishing with a clean, modern patchouli signature.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Roses Greedy",
    category: "Unisex",
    inspiredBy: "Mancera — Roses Greedy (2012)",
    productType: "extrait_parfum",
    notes: ["peach", "black currant", "mandarin orange", "pink pepper", "coconut", "rose", "jasmine", "white musk", "sugar", "vanilla", "amber", "benzoin"],
    description: "A sweet, luminous rose-jasmine bouquet with fruity coconut sparkle on top and a creamy vanilla-musk amber drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Flower by Kenzo",
    category: "Woman",
    inspiredBy: "Kenzo — Flower by Kenzo (2000)",
    productType: "extrait_parfum",
    notes: ["Bulgarian rose", "hawthorn", "black currant", "mandarin orange", "Parma violet", "rose", "opoponax", "jasmine", "vanilla", "white musk", "incense"],
    description: "A signature powdery-floral built around violet and rose, warmed by resinous opoponax and softened with vanilla-white musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Bonbon",
    category: "Woman",
    inspiredBy: "Viktor&Rolf — Bonbon (2014)",
    productType: "extrait_parfum",
    notes: ["peach", "mandarin orange", "orange", "caramel", "orange blossom", "jasmine", "amber", "sandalwood", "guaiac wood", "cedar"],
    description: "A candy-like caramel gourmand brightened by juicy citrus and peach, wrapped in smooth woods and warm amber.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Idylle",
    category: "Woman",
    inspiredBy: "Guerlain — Idylle (2009)",
    productType: "extrait_parfum",
    notes: ["rose", "lily-of-the-valley", "peony", "freesia", "lilac", "jasmine", "patchouli", "white musk", "raspberry", "litchi"],
    description: "A romantic modern floral where dewy rose and muguet float over a soft musky-chypre base with a subtle fruity lift.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Vénus",
    category: "Woman",
    inspiredBy: "Nina Ricci — Vénus (2024)",
    productType: "extrait_parfum",
    notes: ["magnolia leaf", "mandarin", "magnolia", "jasmine", "vanilla", "patchouli"],
    description: "A sleek magnolia-centered chypre-floral made addictive with vanilla and textured with smooth patchouli in the base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Teriaq",
    category: "Unisex",
    inspiredBy: "Lattafa Perfumes — Teriaq (2024)",
    productType: "extrait_parfum",
    notes: ["pink pepper", "caramel", "bitter almond", "apricot", "white flowers", "rose", "rhubarb", "honey", "vanilla", "musk", "vetiver", "labdanum", "leather"],
    description: "A decadent caramel-almond gourmand with fruity florals and honeyed warmth, grounded by leathery labdanum and vanilla musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Tilia",
    category: "Unisex",
    inspiredBy: "Marc-Antoine Barrois — Tilia (2024)",
    productType: "extrait_parfum",
    notes: ["linden blossom", "broom", "jasmine", "heliotrope"],
    description: "A sunlit floral built around linden blossom, with airy jasmine and a soft heliotrope veil that feels warm and optimistic.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L’Extase",
    category: "Woman",
    inspiredBy: "Nina Ricci — L’Extase (2015)",
    productType: "extrait_parfum",
    notes: ["pink pepper", "pear", "raspberry", "Turkish rose", "white flowers", "jasmine", "caramel", "vanilla", "amber", "musk", "patchouli", "benzoin"],
    description: "A sensual rose-vanilla amber with a fruity-floral start and a warm, slightly gourmand drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Jimmy Choo Fever",
    category: "Woman",
    inspiredBy: "Jimmy Choo — Jimmy Choo Fever (2018)",
    productType: "extrait_parfum",
    notes: ["plum", "litchi", "grapefruit", "heliotrope", "vanilla orchid", "jasmine", "tonka bean", "benzoin", "hazelnut", "sandalwood"],
    description: "A dark fruity-vanilla scent where juicy plum meets a creamy floral heart, settling into toasted tonka and benzoin.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Cinéma",
    category: "Woman",
    inspiredBy: "Yves Saint Laurent — Cinéma (2004)",
    productType: "extrait_parfum",
    notes: ["clementine", "almond blossom", "cyclamen", "peony", "jasmine", "amber", "vanilla", "musk", "sandalwood"],
    description: "A glamorous amber-vanilla floral with a soft citrus-floral opening and a warm, luminous, slightly powdery base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Club de Nuit Woman",
    category: "Woman",
    inspiredBy: "Armaf — Club de Nuit Woman",
    productType: "extrait_parfum",
    notes: ["rose", "geranium", "jasmine", "litchi", "ambergris", "musk", "vanilla"],
    description: "A bright floral-fruity style centered on rose and jasmine, drying down to a warm, slightly sweet musky-vanillic trail.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Iris Root",
    category: "Unisex",
    inspiredBy: "Loewe — Iris Root (2025)",
    productType: "extrait_parfum",
    notes: ["timur pepper", "angelica", "orris root", "iris"],
    description: "A minimalist iris-root composition—peppery and herbal up top—focused on creamy, chalky orris and elegant iris tones.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Orza",
    category: "Unisex",
    inspiredBy: "Tiziana Terenzi — Orza (2020)",
    productType: "extrait_parfum",
    notes: ["wild berries", "coconut", "green apple", "plum", "orchid", "mandarin orange", "magnolia", "jasmine", "Bulgarian rose", "lily-of-the-valley", "caramel", "musk", "Madagascar vanilla", "benzoin", "amber", "sandalwood"],
    description: "A juicy fruit-and-caramel statement softened by florals, finishing creamy with vanilla, musk, amber, and sandalwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Cassiopea",
    category: "Unisex",
    inspiredBy: "Tiziana Terenzi — Cassiopea (2015)",
    productType: "extrait_parfum",
    notes: ["passionfruit", "cassis", "lemon", "fern", "tea rose", "lily-of-the-valley", "carnation", "tonka bean", "musk", "sandalwood"],
    description: "A vibrant tropical-fruity opening that turns softly floral, resting on a smooth tonka-musk sandalwood base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Libra",
    category: "Unisex",
    inspiredBy: "Tiziana Terenzi — Libra (2022)",
    productType: "extrait_parfum",
    notes: ["bergamot", "grapefruit", "lemon", "rose", "tuberose", "ambergris", "cedarwood", "jasmine", "orris root", "benzoin", "musk", "oakmoss", "patchouli", "vanilla", "vetiver"],
    description: "A bright citrus-rose opening with a refined musky-ambergris heart, finishing earthy and elegant with moss, patchouli, and vanilla.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Glamour",
    category: "Woman",
    inspiredBy: "Arvea — Glamour",
    productType: "extrait_parfum",
    notes: ["raspberry", "black currant", "jasmine", "Damask rose", "vanilla"],
    description: "A fruity-floral with a juicy berry opening, a jasmine-rose heart, and a smooth sweet vanilla base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Dolce Blue Jasmine",
    category: "Woman",
    inspiredBy: "Dolce&Gabbana — Dolce Blue Jasmine (2024)",
    productType: "extrait_parfum",
    notes: ["blue fig", "jasmine sambac", "cedarwood"],
    description: "A modern, airy jasmine built around a cool fig facet and a clean cedarwood base for an easy everyday trail.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Rolling in Love",
    category: "Unisex",
    inspiredBy: "By Kilian — Rolling in Love (2019)",
    productType: "extrait_parfum",
    notes: ["ambrette seeds", "almond milk", "iris", "musk", "tonka bean", "tuberose"],
    description: "A creamy “white” scent that blends almond milk and iris into a soft, intimate musk, warmed by tonka and tuberose.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Jasmin Noir",
    category: "Woman",
    inspiredBy: "Bvlgari — Jasmin Noir (2008)",
    productType: "extrait_parfum",
    notes: ["gardenia", "green sap", "jasmine", "almond", "licorice", "woods", "tonka bean"],
    description: "A dark, luxurious jasmine wrapped in green-gardenia accents and deepened by woods and tonka for a sensual finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Splendida Iris d'Or",
    category: "Woman",
    inspiredBy: "Bvlgari — Splendida Iris d'Or (2017)",
    productType: "extrait_parfum",
    notes: ["green notes", "bergamot", "iris", "mimosa", "violet leaf", "orris", "sandalwood", "tonka bean", "vetiver"],
    description: "A refined iris bouquet that starts green and fresh, then turns softly powdery and elegant over smooth woods and tonka.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Washwasha",
    category: "Woman",
    inspiredBy: "Lattafa Perfumes — Washwasha",
    productType: "extrait_parfum",
    notes: ["raspberry", "bitter orange", "pink pepper", "tuberose", "French orange flower", "jasmine", "osmanthus", "neroli", "tonka bean", "vanilla", "musk", "benzoin", "cashmirwood", "amber"],
    description: "A sweet fruity-white-floral that blooms into creamy tuberose and orange blossom, finishing warm with vanilla, amber, and musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Mayar",
    category: "Woman",
    inspiredBy: "Lattafa Perfumes — Mayar (2022)",
    productType: "extrait_parfum",
    notes: ["litchi", "raspberry", "violet leaf", "white rose", "peony", "jasmine", "musk", "vanilla"],
    description: "A bright litchi-raspberry floral with a fresh peony-rose heart and a clean musky-vanilla drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Eden Juicy Apple | 01",
    category: "Unisex",
    inspiredBy: "Kayali — Eden Juicy Apple | 01 (2021)",
    productType: "extrait_parfum",
    notes: ["red apple", "litchi", "black currant", "pink grapefruit", "wild berries", "raspberry bloom", "jasmine", "May rose", "sugar", "musk", "vanilla flower", "amber", "moss"],
    description: "A candy-juicy apple and berry burst with a light floral core, drying down sweet and musky with ambered warmth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Vanilla Candy Rock Sugar | 42",
    category: "Unisex",
    inspiredBy: "Kayali — Vanilla Candy Rock Sugar | 42 (2024)",
    productType: "extrait_parfum",
    notes: ["violet leaves", "candied pear", "marshmallow", "vanilla cream", "ylang-ylang", "rum", "bubble gum", "jelly bean", "white caramel", "labdanum", "jasmine", "rock sugar", "tonka", "vetiver", "patchouli", "sandalwood", "cashmere woods"],
    description: "A playful candy-gourmand with pear, marshmallow, and vanilla cream, turning sticky-sweet with bubble gum and caramel over a warm woody base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Vanilla | 28",
    category: "Unisex",
    inspiredBy: "Kayali — Vanilla | 28 (2018)",
    productType: "extrait_parfum",
    notes: ["vanilla orchid", "creamy jasmine", "vanilla infusion", "vanilla surabsolute", "tonka", "brown sugar", "musk", "patchouli", "amber"],
    description: "A deep, addictive vanilla built around brown sugar and tonka, finishing smooth and cozy with musk, patchouli, and amber.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "The Wedding Silk Santal | 36",
    category: "Unisex",
    inspiredBy: "Kayali — The Wedding Silk Santal | 36 (2023)",
    productType: "extrait_parfum",
    notes: ["sparkling champagne", "white freesia", "blackcurrant", "pink praline", "jasmine", "rose damascena", "orange blossom", "white nectarine", "sugared musk", "sandalwood", "oakmoss", "vanilla absolute", "amber"],
    description: "A bright, elegant warm-floral where champagne and freesia sparkle over praline-kissed flowers, settling into creamy sandalwood and sugared musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Maui in a Bottle Sweet Banana | 37",
    category: "Unisex",
    inspiredBy: "Kayali — Maui in a Bottle Sweet Banana | 37",
    productType: "extrait_parfum",
    notes: ["sweet banana", "coconut cream", "gardenia", "jasmine", "rum", "sandalwood", "vanilla bourbon"],
    description: "A tropical banana-coconut cream scent that glows with sunny white florals, then dries down boozy-smooth with rum, sandalwood, and vanilla bourbon.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Oudgasm Vanilla Oud | 36",
    category: "Unisex",
    inspiredBy: "Kayali — Oudgasm Vanilla Oud | 36 (2023)",
    productType: "extrait_parfum",
    notes: ["green pear", "praline", "saffron", "jasmine", "Bulgarian rose", "cashmere woods", "vanilla sugar", "white musk", "oakmoss", "vanilla oud"],
    description: "A plush vanilla-oud blend where saffron and praline meet a rose-tinted floral heart, finishing musky and woody with cashmere and oakmoss.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  }
];

async function main() {
  console.log('🚀 Starting products insertion...');
  let count = 0;
  for (const product of products) {
    try {
      await prisma.product.upsert({
        where: { name_brand: { name: product.name, brand: "Hama Fragrance" } },
        update: product,
        create: product
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
