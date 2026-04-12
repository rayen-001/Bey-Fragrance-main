import { prisma } from './db/prisma';
import 'dotenv/config';

const products = [
  {
    name: "Boss Bottled Pacific",
    category: "Man",
    inspiredBy: "Hugo Boss — Boss Bottled Pacific (2023)",
    productType: "extrait_parfum",
    notes: ["coconut", "salt", "lemon", "cashmeran", "cypress", "sandalwood", "patchouli"],
    description: "A modern salty-coconut summer woody scent with bright lemon and smooth cashmeran woods in the drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "L'eau d'Issey",
    category: "Woman",
    inspiredBy: "Issey Miyake — L'eau d'Issey (1992)",
    productType: "extrait_parfum",
    notes: ["lotus", "melon", "freesia", "rose water", "rose", "calone", "cyclamen", "lily-of-the-valley", "lily", "water peony", "carnation", "musk", "tuberose", "exotic woods", "osmanthus", "cedar", "sandalwood", "amber"],
    description: "A transparent watery-floral classic—dewy petals and melon freshness over a soft musky-woody base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Eau de Lacoste L.12.12 Blue",
    category: "Man",
    inspiredBy: "Lacoste — Eau de Lacoste L.12.12 Blue (2011)",
    productType: "extrait_parfum",
    notes: ["grapefruit", "mint", "sage", "African orange flower", "fern", "patchouli", "Virginia cedar"],
    description: "A sporty grapefruit-mint freshness with aromatic sage and a clean, green woody-patchouli base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Narciso Rodriguez for Him",
    category: "Man",
    inspiredBy: "Narciso Rodriguez — Narciso Rodriguez for Him (2007)",
    productType: "extrait_parfum",
    notes: ["violet leaf", "musk", "patchouli", "amber"],
    description: "A distinctive violet-leaf and musk composition with earthy patchouli and a smooth ambery finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Alpha Male",
    category: "Man",
    inspiredBy: "Heavenduft — Alpha Male",
    productType: "extrait_parfum",
    notes: ["bergamot", "neroli", "lemon", "lime", "sugan mantri", "lavender", "sandalwood", "cedarwood", "vetiver", "civet", "patchouli", "vanilla absolute", "oakmoss"],
    description: "A classic barbershop-style fougère: bright citrus and lavender over woods, moss, and a warm musky-vanilla depth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "UDV Blue",
    category: "Man",
    inspiredBy: "Ulric de Varens — UDV Blue (1993)",
    productType: "extrait_parfum",
    notes: ["lavender", "musk", "woody notes", "amber"],
    description: "A simple aromatic-aquatic profile built around clean lavender and musks over a light woody amber base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Desert Dawn",
    category: "Unisex",
    inspiredBy: "Byredo — Desert Dawn (2024)",
    productType: "extrait_parfum",
    notes: ["rose petals", "cardamom", "sandalwood", "cedarwood", "carrot seeds", "musk", "papyrus", "vetiver", "silk"],
    description: "A serene spicy-woody scent where rose and cardamom glow at sunrise, drying down to papyrus, vetiver, and soft musks.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Lamar",
    category: "Unisex",
    inspiredBy: "Kajal — Lamar (2020)",
    productType: "extrait_parfum",
    notes: ["pineapple", "red berries", "apple", "cardamom", "coriander", "Bulgarian rose", "Turkish rose", "magnolia", "jasmine sambac", "musk", "vanilla", "amber", "cashmere wood", "cedar", "moss"],
    description: "A luxurious tropical-fruity rose with bright pineapple up top, settling into creamy amber-vanilla woods and musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Oud Maracujá",
    category: "Unisex",
    inspiredBy: "Maison Crivelli — Oud Maracujá (2023)",
    productType: "extrait_parfum",
    notes: ["passionfruit", "fruity notes", "saffron", "Turkish rose", "agarwood (oud)", "benzoin", "Indonesian patchouli leaf", "leather", "akigalawood", "amber", "vanilla", "labdanum"],
    description: "A striking contrast of juicy passionfruit and saffron-rose over dark oud and leather, finishing ambery with vanilla and labdanum.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Mangonifiscent",
    category: "Unisex",
    inspiredBy: "Unique'e Luxury — Mangonifiscent (2023)",
    productType: "extrait_parfum",
    notes: ["mango", "bergamot", "rose", "geranium", "jasmine", "honey", "patchouli", "musk", "vanilla", "sandalwood", "amber", "moss"],
    description: "A ripe mango fragrance with a honeyed glow and a rich patchouli-amber base that keeps it plush and long-lasting.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Paradigme",
    category: "Man",
    inspiredBy: "Prada — Paradigme (2025)",
    productType: "extrait_parfum",
    notes: ["Calabrian bergamot", "musk", "bourbon geranium", "rose geranium", "benzoin", "Peru balsam", "guaiac wood"],
    description: "A modern ambery-fougère with clean bergamot-musk brightness, drying down resinous and smooth with balsams and guaiac wood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Bad Boy",
    category: "Man",
    inspiredBy: "Carolina Herrera — Bad Boy (2019)",
    productType: "extrait_parfum",
    notes: ["white pepper", "bergamot", "pink pepper", "cedarwood", "clary sage", "tonka bean", "cacao"],
    description: "A bold peppery-aromatic opening that turns smooth and warm, finishing with tonka and cacao sweetness over woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Bois d'Argent",
    category: "Unisex",
    inspiredBy: "Dior — Bois d'Argent (2004)",
    productType: "extrait_parfum",
    notes: ["iris", "cypress", "juniper berries", "myrrh", "patchouli", "woody notes", "honey", "vanilla", "amber", "resins", "musk", "leather"],
    description: "An elegant iris-wood fragrance with resinous myrrh depth, softened by honeyed amber and a smooth musky-leathery trail.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Fahrenheit",
    category: "Man",
    inspiredBy: "Dior — Fahrenheit (1988)",
    productType: "extrait_parfum",
    notes: ["nutmeg flower", "lavender", "cedar", "mandarin orange", "chamomile", "bergamot", "hawthorn", "lemon", "violet leaf", "nutmeg", "sandalwood", "carnation", "honeysuckle", "jasmine", "lily-of-the-valley", "leather", "vetiver", "musk", "amber", "patchouli", "tonka bean"],
    description: "A legendary violet-leather woody scent with an aromatic citrus opening and a warm, rugged, unmistakable drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Stronger With You Amber",
    category: "Unisex",
    inspiredBy: "Giorgio Armani — Emporio Armani Stronger With You Amber (2023)",
    productType: "extrait_parfum",
    notes: ["amber", "lavender", "vanilla"],
    description: "A warm amber-vanilla signature lifted by aromatic lavender for a smooth, addictive, softly sensual trail.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Stronger With You Tobacco",
    category: "Man",
    inspiredBy: "Giorgio Armani — Emporio Armani Stronger With You Tobacco (2024)",
    productType: "extrait_parfum",
    notes: ["pink pepper", "black pepper", "cardamom", "elemi", "sage", "tobacco", "chestnut", "cinnamon leaf", "chili pepper", "bourbon vanilla", "amber", "guaiac wood", "benzoin"],
    description: "A spicy-tobacco amber where peppers and cardamom meet toasted chestnut, drying down rich with vanilla, benzoin, and guaiac wood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Stronger With You Oud",
    category: "Man",
    inspiredBy: "Giorgio Armani — Emporio Armani Stronger With You Oud (2022)",
    productType: "extrait_parfum",
    notes: ["vanilla", "agarwood (oud)", "lavender extract"],
    description: "A streamlined vanilla-oud accented by aromatic lavender, designed to feel smooth, modern, and confident.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Stronger With You Leather",
    category: "Man",
    inspiredBy: "Giorgio Armani — Emporio Armani Stronger With You Leather (2020)",
    productType: "extrait_parfum",
    notes: ["chestnut", "spices", "elemi", "lavender", "sage", "vanilla", "leather", "guaiac wood", "agarwood (oud)"],
    description: "A warm chestnut-and-spice opening leads into aromatic lavender, settling into a dense vanilla-leather base with smoky woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Imagination",
    category: "Man",
    inspiredBy: "Louis Vuitton — Imagination (2021)",
    productType: "extrait_parfum",
    notes: ["citron", "Calabrian bergamot", "Sicilian orange", "Tunisian neroli", "Nigerian ginger", "Ceylon cinnamon", "Chinese black tea", "ambroxan", "guaiac wood", "olibanum"],
    description: "A polished citrus-aromatic where bright citrus and neroli meet spicy ginger-cinnamon, drying down tea-like and ambery-woody.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Pacific Chill",
    category: "Unisex",
    inspiredBy: "Louis Vuitton — Pacific Chill (2023)",
    productType: "extrait_parfum",
    notes: ["citron", "orange", "lemon", "mint", "black currant", "coriander", "apricot", "basil", "carrot seeds", "May rose", "fig", "dates", "ambrette"],
    description: "A vibrant citrus-fruit blend with cooling mint and blackcurrant, softening into apricot-rose and a smooth fig-ambrette base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Afternoon Swim",
    category: "Unisex",
    inspiredBy: "Louis Vuitton — Afternoon Swim (2019)",
    productType: "extrait_parfum",
    notes: ["mandarin orange", "Sicilian orange", "bergamot", "ambergris", "ginger"],
    description: "A radiant, minimalist orange-citrus splash with a gentle ginger bite, resting on airy ambergris for a clean sunlit finish.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Ombre Nomade",
    category: "Unisex",
    inspiredBy: "Louis Vuitton — Ombre Nomade (2018)",
    productType: "extrait_parfum",
    notes: ["agarwood (oud)", "rose", "incense", "raspberry", "saffron", "amberwood", "benzoin", "birch", "geranium"],
    description: "A bold rose-oud wrapped in smoke and incense, sweetened by raspberry and deepened with benzoin and birch for a dark, luxurious aura.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Greenley",
    category: "Unisex",
    inspiredBy: "Parfums de Marly — Greenley (2020)",
    productType: "extrait_parfum",
    notes: ["green apple", "Calabrian bergamot", "mandarin orange", "petitgrain", "cedar", "cashmeran", "pomarose", "violet", "oakmoss", "musk", "amberwood", "patchouli"],
    description: "A crisp green-apple citrus freshness with an aromatic heart, drying down clean and modern with musks, amberwood, and oakmoss.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Sedley",
    category: "Unisex",
    inspiredBy: "Parfums de Marly — Sedley (2019)",
    productType: "extrait_parfum",
    notes: ["lemon", "mint", "bergamot", "grapefruit", "mandarin orange", "lavender", "rosemary", "geranium", "olibanum", "ambroxan", "sandalwood", "cedar", "cashmeran", "vetiver", "patchouli"],
    description: "A bright “fizzy” citrus-mint aromatic that stays clean and uplifting, finishing on sleek ambroxan woods and vetiver.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Perseus",
    category: "Man",
    inspiredBy: "Parfums de Marly — Perseus (2024)",
    productType: "extrait_parfum",
    notes: ["grapefruit", "bergamot", "black currant", "vetiver", "green mandarin", "geranium", "dry wood", "cashmere wood", "ambergris", "balsam fir", "cedar", "tonka bean"],
    description: "A grapefruit-forward citrus-woody scent with a crisp vetiver core, settling into dry woods, ambergris, and creamy tonka warmth.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Althaïr",
    category: "Man",
    inspiredBy: "Parfums de Marly — Althaïr (2023)",
    productType: "extrait_parfum",
    notes: ["cinnamon", "orange blossom", "cardamom", "bergamot", "bourbon vanilla", "elemi", "praline", "musk", "ambroxan", "guaiac wood", "tonka", "candied almond"],
    description: "A modern spiced vanilla where orange blossom and cinnamon glow, melting into praline-rich sweetness and creamy woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Silver Scent",
    category: "Man",
    inspiredBy: "Jacques Bogart — Silver Scent (2006)",
    productType: "extrait_parfum",
    notes: ["orange blossom", "lemon", "lavender", "cardamom", "nutmeg", "rosemary", "coriander", "geranium", "litchi", "tonka bean", "teak wood", "vetiver"],
    description: "A bold, sweet-spicy oriental with citrus and aromatics up top, drying down into a distinctive litchi-tonka woody base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Vanilla Ecstasy",
    category: "Woman",
    inspiredBy: "Montale — Vanilla Extasy (2008)",
    productType: "extrait_parfum",
    notes: ["apricot", "apricot blossom", "vanilla", "ylang-ylang", "jasmine", "benzoin", "sandalwood", "resins", "mahogany"],
    description: "A juicy apricot-vanilla gourmand floral that turns creamy and warm, finishing balsamic-woody with benzoin and smooth resins.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Roses Vanille",
    category: "Woman",
    inspiredBy: "Mancera — Roses Vanille (2011)",
    productType: "extrait_parfum",
    notes: ["Italian lemon", "Turkish rose", "vanilla", "white musk", "cedar"],
    description: "A bright lemon-rose opening melts into a smooth vanilla-musk base, with cedar adding a clean woody structure.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Coco Vanille",
    category: "Woman",
    inspiredBy: "Mancera — Coco Vanille (2016)",
    productType: "extrait_parfum",
    notes: ["coconut", "white peach", "tiare flower", "ylang-ylang", "jasmine", "Madagascar vanilla", "white musk", "woody notes"],
    description: "A creamy tropical coconut-vanilla wrapped in solar white florals, drying down soft and musky with smooth woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Black Vanilla",
    category: "Unisex",
    inspiredBy: "Mancera — Black Vanilla (2017)",
    productType: "extrait_parfum",
    notes: ["white peach", "black currant", "coconut", "Calabrian bergamot", "violet", "Egyptian jasmine", "Bulgarian rose", "Madagascar vanilla", "white musk"],
    description: "A fruity-floral vanilla where peach and blackcurrant sparkle over a soft violet-rose heart, finishing clean and creamy with musk and vanilla.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Classe'",
    category: "Woman",
    inspiredBy: "Khadlaj — Classe'",
    productType: "extrait_parfum",
    notes: ["cumin", "heliotrope", "bergamot", "bitter almond", "jasmine", "lavender", "sandalwood", "vanilla", "amber"],
    description: "A warm spicy-floral that opens aromatic and slightly powdery, then settles into a creamy vanilla-amber sandalwood base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Cool Water",
    category: "Man",
    inspiredBy: "Davidoff — Cool Water (1988)",
    productType: "extrait_parfum",
    notes: ["sea water", "lavender", "mint", "green notes", "rosemary", "calone", "coriander", "sandalwood", "neroli", "geranium", "jasmine", "musk", "oakmoss", "cedar", "tobacco", "ambergris"],
    description: "A classic aromatic-aquatic splash—fresh marine herbs up top, clean florals and sandalwood in the heart, and a musky mossy-cedar drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Champion",
    category: "Man",
    inspiredBy: "Davidoff — Champion (2010)",
    productType: "extrait_parfum",
    notes: ["bergamot", "lemon", "clary sage", "galbanum", "oakmoss", "cedar"],
    description: "A crisp citrus-aromatic that quickly turns earthy and masculine, finishing on dry cedar and oakmoss.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Golden Dust",
    category: "Unisex",
    inspiredBy: "Sunnamusk — Golden Dust",
    productType: "extrait_parfum",
    notes: ["Egyptian balsam", "Damask rose", "grapefruit", "vanilla", "honeysuckle", "musk", "fruity notes", "resins", "amber", "floral notes"],
    description: "A luminous rose-grapefruit opening melts into sweet vanilla and honeysuckle, drying down warm, ambery, and balsamic with musky resins.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Blu Mediterraneo - Ginepro di Sardegna",
    category: "Unisex",
    inspiredBy: "Acqua di Parma — Blu Mediterraneo - Ginepro di Sardegna (2014)",
    productType: "extrait_parfum",
    notes: ["juniper", "allspice", "pepper", "nutmeg", "bergamot", "cypress", "sage", "Virginia cedar"],
    description: "A brisk juniper-and-spice aromatic with a dry Mediterranean woods feel, finishing clean and elegant on cedar.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Chairman",
    category: "Man",
    inspiredBy: "Paris Bleu — Chairman",
    productType: "extrait_parfum",
    notes: ["candied apple", "basil", "bergamot", "lavender", "jasmine", "cinnamon", "leather", "amber", "vanilla", "patchouli", "cedar"],
    description: "A sweet aromatic-woody profile where apple and bergamot lead into lavender-cinnamon warmth, ending in amber-vanilla woods and leather.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Legend",
    category: "Man",
    inspiredBy: "Montblanc — Legend (2011)",
    productType: "extrait_parfum",
    notes: ["lavender", "pineapple", "bergamot", "lemon verbena", "red apple", "dried fruits", "oakmoss", "geranium", "coumarin", "rose", "tonka bean", "sandalwood"],
    description: "A clean aromatic fougère with a fruity-lavender sparkle up top, drying down smooth and cozy with tonka and sandalwood.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Gentleman",
    category: "Man",
    inspiredBy: "Givenchy — Gentleman (1974)",
    productType: "extrait_parfum",
    notes: ["bergamot", "cinnamon", "honey", "lemon", "rose", "tarragon", "cedarwood", "jasmine", "orris root", "patchouli", "amber", "leather", "musk", "oakmoss", "vanilla", "vetiver"],
    description: "A vintage masculine chypre-leather where honeyed spice and aromatic herbs sit over patchouli, oakmoss, and a deep leathery-amber base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Gentleman Society",
    category: "Man",
    inspiredBy: "Givenchy — Gentleman Society (2023)",
    productType: "extrait_parfum",
    notes: ["cardamom", "sage", "French narcissus", "Haitian vetiver", "Madagascar vetiver", "vanilla", "palo santo", "cedar"],
    description: "A modern aromatic-woody scent built around fresh sage and cardamom over a refined vetiver core, softened by vanilla and woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Vanilla Powder",
    category: "Unisex",
    inspiredBy: "Matiere Premiere — Vanilla Powder (2023)",
    productType: "extrait_parfum",
    notes: ["coconut powder", "heliotrope", "Madagascar vanilla", "vanilla absolute", "white musk", "palo santo", "coconut", "lactones"],
    description: "A dense “dry vanilla” profile where coconut powder and heliotrope create a soft cloud effect, grounded by musks and palo santo woodiness.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Le Beau",
    category: "Man",
    inspiredBy: "Jean Paul Gaultier — Le Beau (2019)",
    productType: "extrait_parfum",
    notes: ["bergamot", "coconut", "tonka bean"],
    description: "A simple, addictive tropical trio—bright bergamot over creamy coconut, finishing sweet and sun-warmed with tonka.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Boss Bottled Marine",
    category: "Man",
    inspiredBy: "Hugo Boss — Boss Bottled Marine (2022)",
    productType: "extrait_parfum",
    notes: ["frosted apple", "mint", "cinnamon", "clary sage", "cashmere wood", "patchouli"],
    description: "A cool, sporty fresh woody scent—icy apple and mint up top, aromatic spice in the heart, and a clean cashmere-wood drydown.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Hudson Valley",
    category: "Unisex",
    inspiredBy: "Gissah — Hudson Valley (2020)",
    productType: "extrait_parfum",
    notes: ["black currant", "rose", "spicy notes", "patchouli", "amber", "musk", "woody notes"],
    description: "A bold fruity-floral amber with a noticeable blackcurrant lift and a warm, statement-making patchouli-amber musk base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Cedrat Boisé",
    category: "Unisex",
    inspiredBy: "Mancera — Cedrat Boisé (2011)",
    productType: "extrait_parfum",
    notes: ["Sicilian lemon", "bergamot", "black currant", "spicy notes", "fruity notes", "patchouli leaf", "water jasmine", "cedar", "leather", "sandalwood", "vanilla", "white musk", "moss"],
    description: "A bright citrus-fruity opening with a refined woody-leathery backbone, finishing smooth with vanilla musk and mossy woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Messi",
    category: "Man",
    inspiredBy: "Messi — Messi Eau de Parfum (2024)",
    productType: "extrait_parfum",
    notes: ["cardamom", "apple leaf", "cypress", "leather", "lavender", "orris root", "vanilla bean", "patchouli", "Virginian cedar"],
    description: "A modern woody-aromatic with spicy green freshness up top, a smooth leather-lavender heart, and a warm vanilla-patchouli cedar base.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Summer Hammer",
    category: "Unisex",
    inspiredBy: "Lorenzo Pazzaglia — Summer Hammer (2023)",
    productType: "extrait_parfum",
    notes: ["mango", "pineapple", "coconut", "bergamot", "white rum", "coconut milk", "white flowers", "marine notes", "musk", "sandalwood", "amber", "vetiver"],
    description: "A tropical cocktail of mango-pineapple and coconut with a breezy marine touch, drying down creamy-woody with ambered musk.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  },
  {
    name: "Blue Talisman",
    category: "Unisex",
    inspiredBy: "Ex Nihilo — Blue Talisman (2023)",
    productType: "extrait_parfum",
    notes: ["pear", "bergamot", "mandarin orange", "ginger", "orange blossom", "georgywood", "musk", "Ambrofix™", "akigalawood", "cedar"],
    description: "A bright juicy pear-citrus opening sharpened by ginger, settling into a clean modern musky-woody base with abstract woods.",
    price: 25.00,
    stockQuantity: 100,
    mainImage: "",
    galleryImages: []
  }
];

async function main() {
  console.log('🚀 Starting products insertion (Batch 4)...');
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
