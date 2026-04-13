import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string)?.trim() || 'http://localhost:3001';
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string)?.trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

console.log('DEBUG: API Base URL:', API_BASE_URL);
console.log('DEBUG: Supabase URL:', SUPABASE_URL);

// Create Supabase client for auth
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getFragrances = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/fragrances`, {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch fragrances');
  }
  const data = await response.json();
  const rawProducts = data.data || [];
  return rawProducts.map((p: any) => ({
    ...p,
    category: (p.category || 'Fresh').trim(),
    genderCategory: (p.genderCategory || 'Unisex').trim()
  }));
};

// Helper function to get auth headers
const getAuthHeaders = async (includeAuth = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (session) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  } else {
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  }

  return headers;
};

// ============================================
// PRODUCTS API
// ============================================

export const productsApi = {
  // Get all products
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fragrances`, {
        headers: await getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get single product
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fragrances/${id}`, {
        headers: await getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Create product (Admin)
  create: async (product: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fragrances`, {
        method: 'POST',
        headers: await getAuthHeaders(true),
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product (Admin)
  update: async (id: string, product: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fragrances/${id}`, {
        method: 'PUT',
        headers: await getAuthHeaders(true),
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (Admin)
  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fragrances/${id}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(true),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

// ============================================
// ORDERS API
// ============================================

export const ordersApi = {
  // Get all orders (Admin)
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: await getAuthHeaders(true),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Get user's orders
  getMy: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/my`, {
        headers: await getAuthHeaders(true),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Create order
  create: async (order: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: await getAuthHeaders(true), // Send token if available
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || errorData.message || 'Failed to create order';
        throw new Error(errorMsg);
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order status (Admin)
  updateStatus: async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: await getAuthHeaders(true),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },
};

// ============================================
// AUTH API
// ============================================

export const authApi = {
  // Sign up
  signUp: async (email: string, password: string, name: string) => {
    try {
      console.log('📝 Attempting Supabase signup with:', { email, name });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'CUSTOMER',
            is_signup: true // Useful for trigger logic or post-signup hooks
          },
          emailRedirectTo: `${window.location.origin}/login` // requested redirect logic
        }
      });

      console.log('🛰️ Supabase Response:', { data, error });

      if (error) {
        console.error('❌ Supabase Signup Error:', error);
        throw error;
      }

      // If user is returned but session is null, email confirmation might be required
      if (data.user && !data.session) {
        console.log('ℹ️ User created but email confirmation required.');
        return {
          success: true,
          user: data.user,
          message: 'Please check your email to confirm your account.'
        };
      }

      // Store session if available
      if (data.session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        console.log('💾 Session stored in localStorage');
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('🚨 Error in signUp flow:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Store session
      if (data.session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));

        // Sync with local user state for UI consistency
        const user = data.user;
        if (user) {
          const localUser = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
            createdAt: user.created_at,
            addresses: [],
            wishlist: []
          };
          localStorage.setItem('hama_fragrance_current_user', JSON.stringify(localUser));
        }
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if user is admin — always query backend DB (Supabase metadata doesn't have the role)
  isAdmin: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/is-admin`, {
        headers: await getAuthHeaders(true),
      });

      if (!response.ok) {
        return { isAdmin: false };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return { isAdmin: false };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      return { success: true };
    } catch (error: any) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  // Reset password (send email)
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/?reset_password=true`,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return { success: false, error: error.message };
    }
  },

  // Update password (after reset)
  updatePassword: async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating password:', error);
      return { success: false, error: error.message };
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: await getAuthHeaders(true),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  // Update profile
  updateProfile: async (profile: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: await getAuthHeaders(true),
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      return data.profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

// ============================================
// REVIEWS API
// ============================================

export const reviewsApi = {
  // Get reviews for product
  getByProduct: async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${productId}`, {
        headers: await getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      return data.reviews || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  // Create review
  create: async (review: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: await getAuthHeaders(true),
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        throw new Error('Failed to create review');
      }

      const data = await response.json();
      return data.review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },
};

// ============================================
// WISHLIST API
// ============================================

export const wishlistApi = {
  // Get wishlist
  get: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: await getAuthHeaders(true),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      const rawProducts = data.data || [];
      return rawProducts.map((p: any) => ({
        ...p,
        image: p.mainImage || '',
        price: p.price.toString().includes('TND') ? p.price : `${p.price} TND`
      }));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },

  // Toggle wishlist item (add/remove)
  toggle: async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: await getAuthHeaders(true),
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle wishlist item');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      throw error;
    }
  },
};

// ============================================
// CART API
// ============================================

export const cartApi = {
  // Get cart
  get: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: await getAuthHeaders(true),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  },

  // Add/Update item
  updateItem: async (productId: string, quantity: number, shippingMethodId?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: await getAuthHeaders(true),
        body: JSON.stringify({ productId, quantity, shippingMethodId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item
  remove: async (productId: string, shippingMethodId?: string) => {
    try {
      const url = shippingMethodId 
        ? `${API_BASE_URL}/cart/${productId}?shippingMethodId=${shippingMethodId}`
        : `${API_BASE_URL}/cart/${productId}`;
        
      const response = await fetch(url, {
        method: 'DELETE',
        headers: await getAuthHeaders(true),
      });

      if (!response.ok) {
        throw new Error('Failed to remove cart item');
      }

      return true;
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },

  // Sync cart
  sync: async (items: { productId: string; quantity: number; shippingMethodId?: string }[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/sync`, {
        method: 'PUT',
        headers: await getAuthHeaders(true),
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        throw new Error('Failed to sync cart');
      }

      return true;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  },
};

// ============================================
// SEED DATABASE
// ============================================

export const seedDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/seed`, {
      method: 'POST',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to seed database');
    }

    const data = await response.json();
    console.log('✅ Database seeded:', data);
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsApi = {
  // Get gross revenue (Admin)
  getGrossRevenue: async (range: 'month' | 'six_months' | 'all') => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/gross?range=${range}`, {
        headers: await getAuthHeaders(true),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gross revenue');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching gross revenue:', error);
      return [];
    }
  },
};