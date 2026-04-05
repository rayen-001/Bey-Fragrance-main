import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Landing from './components/Landing';
import Story from './components/Story';
import Shop from './components/Shop';
import Checkout from './components/Checkout';
import Admin from './components/Admin';
import Account from './components/Account';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Cart, { type CartItem } from './components/Cart';
import { type Product } from './lib/products';
import { getCurrentUser, logout, type User } from './lib/auth';
import { isAdminLoggedInSync } from './lib/adminAuth';
import { productsApi, ordersApi, authApi, getFragrances, supabase, cartApi, wishlistApi } from './lib/api';


type Page = 'home' | 'story' | 'shop' | 'checkout' | 'admin' | 'account';

interface Order {
  id: string;
  clientName: string;
  phoneNumber: string;
  place: string;
  product: string;
  quantity: number;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Shipped';
  totalPrice?: number;
}

import { Routes, Route, useNavigate } from 'react-router-dom';
import Contact from './components/Contact';
import ShippingInfo from './components/ShippingInfo';
import Returns from './components/Returns';
import FAQ from './components/FAQ';
import SizeGuide from './components/SizeGuide';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

export default function App() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    price: string;
    shippingMethodId?: string;
    sizeName?: string;
    concentration?: string;
  } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedInSync());
  const [isLoading, setIsLoading] = useState(true);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load user and check session on mount + Listen for Auth changes
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        handleAuthEvent('initial', session);
      } catch (err) {
        console.error('Error on auth init:', err);
        setIsLoading(false);
      }
    };

    const handleAuthEvent = (event: string, session: any) => {
      console.log(`🔐 Auth Event [${event}]:`, session?.user?.email);

      if (session) {
        const user = session.user;

        // Populate local user state
        const uiUser: User = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
          createdAt: user.created_at,
          addresses: [],
          wishlist: []
        };

        setCurrentUser(uiUser);

        // Sync to localStorage for other components relying on it
        localStorage.setItem('hama_fragrance_current_user', JSON.stringify(uiUser));

        // Always check admin status from backend DB (Supabase metadata doesn't have the role)
        authApi.isAdmin().then((result) => {
          const adminStatus = result.isAdmin === true;
          setIsAdmin(adminStatus);
          if (adminStatus) {
            localStorage.setItem('hama_fragrance_admin_session', JSON.stringify({
              email: user.email,
              loginTime: new Date().toISOString()
            }));
          }
        }).catch(() => setIsAdmin(false));
      } else {
        setIsAdmin(false);
        setCurrentUser(null);
        localStorage.removeItem('hama_fragrance_current_user');
        localStorage.removeItem('hama_fragrance_admin_session');
      }
      
      setIsLoading(false);
    };

    // Initialize
    initAuth();

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthEvent(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check for password reset on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset_password') === 'true') {
      setShowResetPassword(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Load products from Supabase on mount
  useEffect(() => {
    const loadProductsFromDB = async () => {
      try {
        console.log('🔄 Loading fragrances..');
        const loadedProducts = await getFragrances();
        console.log('✅ Loaded', loadedProducts.length, 'fragrances');
        setProducts(loadedProducts as any);
      } catch (error) {
        console.error('❌ Error loading fragrances:', error);
      }
    };
    
    loadProductsFromDB();
  }, []);

  // Load orders for admin or current user
  useEffect(() => {
    const loadOrdersFromDB = async () => {
      try {
        if (isAdmin) {
          console.log('🔄 Loading all orders from Supabase...');
          const loadedOrders = await ordersApi.getAll();
          setOrders(loadedOrders);
        } else if (currentUser) {
          console.log('🔄 Loading user orders...');
          const myOrders = await ordersApi.getMy();
          setOrders(myOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('❌ Error loading orders:', error);
      }
    };
    
    loadOrdersFromDB();
  }, [isAdmin, currentUser?.id]);

  // Load wishlist for current user
  useEffect(() => {
    const loadWishlistFromDB = async () => {
      if (!currentUser) {
        setWishlistItems([]);
        return;
      }
      try {
        console.log('🔄 Loading wishlist from database...');
        const items = await wishlistApi.get();
        setWishlistItems(items);
        console.log('✅ Loaded', items.length, 'wishlist items');
      } catch (error) {
        console.error('❌ Error loading wishlist:', error);
      }
    };
    
    loadWishlistFromDB();
  }, [currentUser]);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('hama_fragrance_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  const [isDBCartLoaded, setIsDBCartLoaded] = useState(false);

  // Persist cart changes to LocalStorage and DB
  useEffect(() => {
    const persistCart = async () => {
      // Prevent syncing back empty state if we're still loading the DB cart
      if (isCartLoading) return;

      // Always save to localStorage for guest/offline support
      try {
        localStorage.setItem('hama_fragrance_cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to local storage:', error);
      }

      // If logged in, ONLY sync to database if we have already successfully loaded the DB cart once.
      // This prevents overwriting the saved DB cart with a fresh empty local cart on the exact millisecond of login.
      if (currentUser && isDBCartLoaded) {
        try {
          await cartApi.sync(cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            shippingMethodId: item.shippingMethodId
          })));
          console.log('✅ Cart synced to database');
        } catch (error) {
          console.error('❌ Error persisting cart to DB:', error);
        }
      }
    };
    
    persistCart();
  }, [cartItems, currentUser, isDBCartLoaded, isCartLoading]);

  // Sync cart from DB on login
  useEffect(() => {
    const syncCartFromDB = async () => {
      if (!currentUser) return;
      setIsCartLoading(true);
      try {
        const dbCart = await cartApi.get();
        if (dbCart && dbCart.length > 0) {
          setCartItems(dbCart);
        }
      } catch (error) {
        console.error('❌ Error loading cart from DB:', error);
      } finally {
        setIsDBCartLoaded(true);
        setIsCartLoading(false);
      }
    };
    syncCartFromDB();
  }, [currentUser]);

  // Check if admin is logged in
  useEffect(() => {
    setIsAdmin(isAdminLoggedInSync());
  }, []);

  const handleLoginSuccess = async () => {
    // Refresh from the live Supabase session — not stale localStorage
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const user = session.user;
        const uiUser: User = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
          createdAt: user.created_at,
          addresses: [],
          wishlist: []
        };
        setCurrentUser(uiUser);
        localStorage.setItem('hama_fragrance_current_user', JSON.stringify(uiUser));
        console.log('✅ handleLoginSuccess: currentUser set from live Supabase session:', uiUser.id);
      } else {
        const user = getCurrentUser();
        setCurrentUser(user);
      }
    } catch (err) {
      console.error('handleLoginSuccess error:', err);
      const user = getCurrentUser();
      setCurrentUser(user);
    }
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    handleLoginSuccess(); // Now populates currentUser
    navigate('/admin');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout(); // Also clear local storage
      setCurrentUser(null);
      setCartItems([]);
      setIsDBCartLoaded(false);
      setIsAdmin(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: clear local states anyway
      logout();
      setCurrentUser(null);
      setCartItems([]);
      setIsDBCartLoaded(false);
      setIsAdmin(false);
      navigate('/');
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }

    // Optimistic UI update
    setWishlistItems(prev => {
      const isFavorited = prev.some(item => item.id === product.id);
      if (isFavorited) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });

    try {
      console.log('🔄 Toggling wishlist in database for product:', product.id);
      await wishlistApi.toggle(product.id);
      console.log('✅ Wishlist updated in database');
    } catch (error) {
      console.error('❌ Error toggling wishlist:', error);
      // Rollback on error
      const items = await wishlistApi.get();
      setWishlistItems(items);
    }
  };

  const handleAddToCart = (product: Product, selectedSize?: { id: string; name: string; price: number }) => {
    const shippingMethodId = selectedSize?.id;
    const sizeName = selectedSize?.name || '50ml';
    const priceText = selectedSize ? `${selectedSize.price} TND` : product.price;
    
    // Create a unique ID for this product+size combination
    const cartItemId = shippingMethodId ? `${product.id}-${shippingMethodId}` : product.id;
    const existingItem = cartItems.find(item => item.id === cartItemId);
    
    if (existingItem) {
      // Update quantity
      setCartItems(cartItems.map(item =>
        item.id === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        shippingMethodId: shippingMethodId,
        name: product.name,
        price: priceText,
        image: product.image,
        quantity: 1,
        notes: (Array.isArray(product.notes) ? product.notes.join(', ') : (product.notes || '')),
        size: sizeName,
        concentration: product.concentration,
        checked: true,
      };
      setCartItems([...cartItems, newItem]);
    }
    
    // Show cart briefly
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleToggleCartItemCheck = (id: string, checked: boolean) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, checked } : item
    ));
  };

  const handleUpdateCartItemSize = (id: string, newSize: { id: string; name: string; price: number }) => {
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item.id === id);
      if (!itemToUpdate) return prevItems;

      const newId = `${itemToUpdate.productId}-${newSize.id}`;
      
      // If an item with the new ID already exists, merge quantities
      const existingItem = prevItems.find(item => item.id === newId);
      if (existingItem && newId !== id) {
        return prevItems
          .filter(item => item.id !== id)
          .map(item => 
            item.id === newId 
              ? { ...item, quantity: item.quantity + itemToUpdate.quantity } 
              : item
          );
      }

      // Otherwise, just update the current item
      return prevItems.map(item =>
        item.id === id ? {
          ...item,
          id: newId,
          shippingMethodId: newSize.id,
          size: newSize.name,
          price: `${newSize.price} TND`
        } : item
      );
    });
  };

  const handleCartCheckout = () => {
    const checkedItems = cartItems.filter(item => item.checked !== false);
    if (checkedItems.length > 0) {
      setSelectedProduct(null);
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }
  };

  const handleBuyProduct = (
    productId: string, 
    productName: string, 
    price: string, 
    shippingMethodId?: string, 
    sizeName?: string, 
    concentration?: string
  ) => {
    setSelectedProduct({ 
      id: productId, 
      name: productName, 
      price,
      shippingMethodId,
      sizeName,
      concentration
    });
    setIsCheckoutOpen(true);
  };

  const handleOrderSubmit = async (orderData: { 
    clientName: string; 
    place: string; 
    product: string; 
    quantity: number; 
    phoneNumber: string; 
    items?: any[]; 
    totalPrice?: number;
    shippingFee?: number;
    deliveryMethod?: string;
  }) => {
    try {
      const payload = {
        ...orderData,
        userId: currentUser?.id || null,
        items: orderData.items?.map(item => ({
          id: item.productId || item.id, // Support both formats
          name: item.name,
          quantity: item.quantity,
          shippingMethodId: item.shippingMethodId
        })),
        totalPrice: orderData.totalPrice,
      };

      console.log('📝 Submitting order to API...', payload);
      const newOrder = await ordersApi.create(payload);
      
      if (newOrder) {
        setOrders(prev => [newOrder as Order, ...prev]); // Add to top of list
        console.log('✅ Order created successfully and persisted in DB:', newOrder);

        // Clear only if it was a cart checkout
        if (!selectedProduct) {
          setCartItems([]);
          localStorage.removeItem('hama_fragrance_cart');
        }
      }
    } catch (error) {
      console.error('❌ Error submitting order:', error);
      throw error; 
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      console.log(`🔄 Updating order ${orderId} status to ${status}...`);
      await ordersApi.updateStatus(orderId, status);
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      console.log('✅ Order status updated in backend');
    } catch (error) {
      console.error('❌ Error updating order status:', error);
    }
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigationProps = {
    cartItemsCount,
    onCartOpen: () => setIsCartOpen(true),
    currentUser: currentUser ? { id: currentUser.id, name: currentUser.name, email: currentUser.email } : null,
    isAdmin, // Add this
    onLoginClick: () => setShowLogin(true),
    onAccountClick: () => handleNavigate('account'),
    onAdminClick: () => handleNavigate('admin'), // Add this
    onLogout: handleLogout,
    wishlistItems,
    onToggleWishlist: handleToggleWishlist,
    onAddToCart: handleAddToCart,
  };

  const handleNavigate = (page: string) => {
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Routes>
        <Route path="/" element={
          <Landing 
            onNavigate={handleNavigate}
            {...navigationProps}
          />
        } />
        
        <Route path="/story" element={
          <Story 
            onNavigate={handleNavigate}
            {...navigationProps}
          />
        } />
        <Route path="/shop" element={
          <Shop 
            onNavigate={handleNavigate} 
            onBuyProduct={handleBuyProduct}
            products={products}
            {...navigationProps}
          />
        } />

        <Route path="/contact" element={
          <Contact
            onNavigate={handleNavigate}
            {...navigationProps}
          />
        } />

        <Route path="/admin" element={
          isAdmin ? (
            <Admin
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1510] to-[#000000] flex items-center justify-center p-4">
              <div className="text-center">
                <h1 className="font-serif text-3xl text-white mb-4">Admin Access Required</h1>
                <p className="text-white/60 mb-6">Please login with admin credentials</p>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black font-medium rounded-sm hover:opacity-90 transition-opacity"
                >
                  Login as Admin
                </button>
              </div>
            </div>
          )
        } />

        <Route path="/account" element={
          <Account
            onNavigate={handleNavigate}
            products={products}
            orders={orders}
            {...navigationProps}
          />
        } />

        <Route path="/shipping" element={<ShippingInfo onNavigate={handleNavigate} {...navigationProps} />} />
        <Route path="/returns" element={<Returns onNavigate={handleNavigate} {...navigationProps} />} />
        <Route path="/faq" element={<FAQ onNavigate={handleNavigate} {...navigationProps} />} />
        <Route path="/size-guide" element={<SizeGuide onNavigate={handleNavigate} {...navigationProps} />} />
        <Route path="/privacy" element={<PrivacyPolicy onNavigate={handleNavigate} {...navigationProps} />} />
        <Route path="/terms" element={<TermsOfService onNavigate={handleNavigate} {...navigationProps} />} />
      </Routes>
      
      {/* Cart Component */}
      <Cart
        items={cartItems}
        wishlistItems={wishlistItems}
        orders={orders}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onToggleCheck={handleToggleCartItemCheck}
        onUpdateSize={handleUpdateCartItemSize}
        onCheckout={handleCartCheckout}
        onRemoveItem={handleRemoveFromCart}
        onAddToWishlist={handleToggleWishlist}
        onRemoveFromWishlist={(id) => {
          const product = wishlistItems.find(p => p.id === id);
          if (product) handleToggleWishlist(product);
        }}
        onMoveToCart={(product) => {
          handleAddToCart(product);
          const p = wishlistItems.find(item => item.id === product.id);
          if (p) handleToggleWishlist(p);
        }}
        onOrderSubmit={handleOrderSubmit}
        currentUser={currentUser}
        products={products}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedProduct={selectedProduct}
        cartItems={cartItems.filter(item => item.checked !== false)}
        onSubmitOrder={handleOrderSubmit}
        currentUser={currentUser}
      />

      {/* Auth Modals */}
      <AnimatePresence>
        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            onLoginSuccess={handleLoginSuccess}
            onAdminLogin={handleAdminLogin}
            onSwitchToSignUp={() => {
              setShowLogin(false);
              setShowSignUp(true);
            }}
            onForgotPassword={() => {
              setShowLogin(false);
              setShowForgotPassword(true);
            }}
          />
        )}
        {showSignUp && (
          <SignUp
            onClose={() => setShowSignUp(false)}
            onSignUpSuccess={handleLoginSuccess}
            onSwitchToLogin={() => {
              setShowSignUp(false);
              setShowLogin(true);
            }}
          />
        )}
        {showForgotPassword && (
          <ForgotPassword
            onClose={() => setShowForgotPassword(false)}
            onBackToLogin={() => {
              setShowForgotPassword(false);
              setShowLogin(true);
            }}
          />
        )}
        {showResetPassword && (
          <ResetPassword
            onSuccess={() => {
              setShowResetPassword(false);
              setShowLogin(true);
            }}
            onCancel={() => setShowResetPassword(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}