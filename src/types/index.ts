export interface ShippingMethod {
  id: string;
  name: string;
  price: string | number;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  category: string | null;
  productType: 'extrait_parfum' | 'original_parfum' | 'accessoire';
  genderCategory: string | null;
  concentration: string | null;
  gender: string | null;
  brand: string;
  mainImage: string | null;
  galleryImages: string[];
  tags: string[];
  notes: string[];
  inspiredBy: string | null;
  rating: string | number;
  userRating?: number | null;
  reviewCount: number;
  stockQuantity: number;
  sizes: any;
  createdAt: string;
  shippingMethods?: ShippingMethod[];
}

// Offer links: a hand-picked set of products shared as one link (e.g. in sponsored ads)
export interface OfferInput {
  title: string;
  slug: string;
  productIds: string[];
  isActive?: boolean;
}

export interface OfferSummary {
  id: string;
  slug: string;
  title: string;
  isActive: boolean;
  visitCount: number;
  orderCount: number;
  createdAt: string;
  products: { id: string; name: string; mainImage: string | null }[];
}

export interface OfferLandingProduct {
  id: string;
  name: string;
  brand: string;
  inspiredBy: string | null;
  category: string | null;
  concentration: string | null;
  mainImage: string | null;
  price: number;
  sizes: { id: string; name: string; price: number }[];
}

export interface PublicOffer {
  id: string;
  slug: string;
  title: string;
  products: OfferLandingProduct[];
}
