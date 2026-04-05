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
