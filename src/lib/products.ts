export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  images: string[];
  category: string;
  productType?: 'extrait_parfum' | 'original_parfum' | 'accessoire';
  genderCategory?: 'Man' | 'Woman' | 'Unisex';
  tags: string[];
  notes: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  shippingMethods?: { id: string; name: string; price: number }[];
  concentration?: string;
  brand?: string;
  gender?: string;
  inspiredBy?: string;
  season?: string[];
  occasion?: string[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const defaultProducts: Product[] = [
  {
    id: 'e08e008f-1695-44f6-9241-b1ea502aaf45',
    name: 'YSL Y Eau de Parfum',
    price: '22 TND',
    image: 'https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dwf3e109c7/pdp/images/727YSL/Y-EDP-Bottle.jpg?q=85&sh=840&sm=cut&sw=640',
    images: [
      'https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dwf2721bea/pdp/images/727YSL/Sage.jpg?q=85&sh=300&sm=cut&sw=300'
    ],
    category: 'Man',
    genderCategory: 'Man',
    tags: ['Fresh', 'Woody', 'Blue'],
    notes: 'Sage, Geranium, Sensual Woods',
    description: 'Fresh aromatic-woody “blue” style: crisp and clean herbs/florals on top, then smooth modern woods in the drydown.',
    rating: 4.8,
    reviewCount: 156,
    shippingMethods: [
      { id: '2a9e7a8d-edf6-42c6-b72d-ab2b8ad68275', name: '50ml', price: 22 },
      { id: '3b2a3071-7dec-4d6e-8c56-8d5c2cab470a', name: '100ml', price: 32 },
    ],
    brand: 'Hama Fragrance',
    inspiredBy: 'Yves Saint Laurent — Y Eau de Parfum',
  },
  {
    id: 'a48c2527-b7e1-46f2-b6eb-f9b14b8f1778',
    name: 'YSL Y Le Parfum',
    price: '22 TND',
    image: 'https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dw5a2b87a4/pdp/images/WW-507861YSL/Y%20LP%20About%20Image.jpg?q=85&sh=840&sm=cut&sw=640',
    images: [
      'https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dw0b537502/pdp/images/WW-507861YSL/2%20Y%20LP%20Pine%20Image.jpg?q=85&sh=300&sm=cut&sw=300'
    ],
    category: 'Man',
    genderCategory: 'Man',
    tags: ['Dark', 'Intense', 'Woody'],
    notes: 'Fresh Geranium, Pine, Patchouli, Fir Balsam',
    description: 'A darker, more intense Y with a fresh aromatic lift, then a rich woody-amber trail (pine/patchouli/fir style).',
    rating: 4.9,
    reviewCount: 124,
    shippingMethods: [
      { id: '1e70643f-f07e-4a87-8b9a-d18ed0c34c50', name: '50ml', price: 22 },
      { id: '7565c1d6-26ce-4db8-9399-bb3b9d3a444c', name: '100ml', price: 32 },
    ],
    brand: 'Hama Fragrance',
    inspiredBy: 'Yves Saint Laurent — Y Le Parfum',
  },
  {
    id: '7a6065bc-a2df-4fbe-88d9-3b1e9a8d7e73',
    name: 'YSL Y Elixir',
    price: '22 TND',
    image: 'https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dwb18f3db6/pdp/images/728YSL/Y%20Elixir%20About%20Image.jpg?q=85&sh=640&sm=cut&sw=640',
    images: [
      'https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dw3ed8fc70/pdp/images/728YSL/4%20Y%20Elixir%20Oud%20Image.jpg?q=85&sh=300&sm=cut&sw=300'
    ],
    category: 'Man',
    genderCategory: 'Man',
    tags: ['Luxurious', 'Oud', 'Concentrated'],
    notes: 'Lavender, Fresh Geranium, Sensual Oud Wood, Incense',
    description: 'The most concentrated Y direction: fresh aromatic lavender/geranium up top, then a deeper, more luxurious oud-woody base.',
    rating: 4.7,
    reviewCount: 89,
    shippingMethods: [
      { id: '9ffa3044-af14-4c75-aae4-2b3f12a4c3ab', name: '50ml', price: 22 },
      { id: 'a7748c2d-bf68-4447-8404-f4db0106ecf1', name: '100ml', price: 32 },
    ],
    brand: 'Hama Fragrance',
    inspiredBy: 'Yves Saint Laurent — Y Elixir',
  },
  {
    id: '49f9600b-cf42-4833-aad8-700b8d653701',
    name: 'YSL MYSLF Eau de Parfum',
    price: '22 TND',
    image: 'https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dw71c49ac1/pdp/images/WW-51115YSL/myslf-eau-de-parfum-bottle-visual.jpg?q=85&sh=840&sm=cut&sw=840',
    images: [
      'https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-us-Library/default/dwe25ca994/pdp/images/WW-51115YSL/myslf-eau-de-parfum-sec-6-visual-2-mobile.jpg?q=85&sh=1000&sm=cut&sw=740'
    ],
    category: 'Man',
    genderCategory: 'Man',
    tags: ['Modern', 'Floral', 'Clean'],
    notes: 'Bergamot, Orange Blossom Absolute, Woods, Patchouli, Ambrofix™',
    description: 'Clean modern woody-floral: sparkling citrus opening, bright orange blossom heart, then smooth woods/patchouli/ambery musks.',
    rating: 4.6,
    reviewCount: 210,
    shippingMethods: [
      { id: '126a6ee5-4c98-46dd-a3dd-36e3106c6047', name: '50ml', price: 22 },
      { id: 'bce2ddfe-c3b9-4937-a9f6-1e88ea6358fd', name: '100ml', price: 32 },
    ],
    brand: 'Hama Fragrance',
    inspiredBy: 'Yves Saint Laurent — MYSLF Eau de Parfum',
  },
];

// LocalStorage functions
const STORAGE_KEY = 'hama_fragrance_products';

export function loadProducts(): Product[] {
  if (typeof window === 'undefined') return defaultProducts;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const products = JSON.parse(stored);
      return products.length > 0 ? products : defaultProducts;
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
  
  return defaultProducts;
}

export function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
  };
  
  const products = loadProducts();
  const updatedProducts = [...products, newProduct];
  saveProducts(updatedProducts);
  
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): void {
  const products = loadProducts();
  const updatedProducts = products.map(p => 
    p.id === id ? { ...p, ...updates } : p
  );
  saveProducts(updatedProducts);
}

export function deleteProduct(id: string): void {
  const products = loadProducts();
  const updatedProducts = products.filter(p => p.id !== id);
  saveProducts(updatedProducts);
}