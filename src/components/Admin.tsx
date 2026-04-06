import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, ShoppingBag, TrendingUp, Edit2, Trash2, Plus, LogOut, X, Tag, Image as ImageIcon, Upload, BarChart3, Search } from 'lucide-react';
import { Button } from './ui/button';
import { logoutAdmin } from '../lib/adminAuth';
import { AnalyticsStats } from './AnalyticsStats';
import { GrossRevenueChart } from './GrossRevenueChart';
import { getFragrances, productsApi, ordersApi } from '../lib/api';
import type { Product as ApiProduct } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string)?.trim() || 'http://localhost:3002';
const DEFAULT_IMAGE = "https://placehold.co/400x600?text=Fragrance+Photo";

interface OrderItem {
  id: string;
  productId: string;
  name?: string;
  quantity: number;
  unitPrice: number;
  size: string;
}

interface Order {
  id: string;
  clientName: string;
  phoneNumber?: string;
  place: string;
  product: string;
  quantity: number;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Shipped';
  totalPrice?: number;
  shippingFee?: number;
  deliveryMethod?: string;
  items?: OrderItem[];
}

interface AdminProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Admin({ onNavigate, onLogout }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics'>('orders');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live data state
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    notes: '',
    inspiredBy: '',
    description: '',
    category: 'Fresh',
    mainImage: '',
    images: [] as string[],
    tags: [] as string[],
    productType: 'extrait_parfum' as 'extrait_parfum' | 'original_parfum' | 'accessoire',
    genderCategory: 'unisex' as 'unisex' | 'woman' | 'man',
  });

  const [newTag, setNewTag] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // ── Data Fetching ─────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await getFragrances();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  // ── Handlers ──────────────────────────────────────────────
  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      price: '',
      notes: '',
      inspiredBy: '',
      description: '',
      category: 'Fresh',
      mainImage: '',
      images: [],
      tags: [],
      productType: 'extrait_parfum',
      genderCategory: 'unisex',
    });
    setNewTag('');
    setEditingProductId(null);
  };

  const handleEditProduct = (product: ApiProduct) => {
    setEditingProductId(product.id);
    const gallery = product.galleryImages || [];
    const mainImg = product.mainImage || '';

    // Ensure the main image is in the images list for the UI
    const allImages = [...gallery];
    if (mainImg && !allImages.includes(mainImg)) {
      allImages.unshift(mainImg);
    }

    setNewProduct({
      name: product.name || '',
      price: String(product.price || ''),
      notes: Array.isArray(product.notes) ? product.notes.join(', ') : (product.notes || ''),
      inspiredBy: product.inspiredBy || '',
      description: product.description || '',
      category: product.category || 'Fresh',
      mainImage: mainImg,
      images: allImages,
      tags: product.tags || [],
      productType: product.productType || 'extrait_parfum',
      genderCategory: ((product.genderCategory as string)?.toLowerCase() || 'unisex') as 'unisex' | 'woman' | 'man',
    });
    setShowAddProduct(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newProduct.tags.includes(newTag.trim())) {
      setNewProduct({ ...newProduct, tags: [...newProduct.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setNewProduct({ ...newProduct, tags: newProduct.tags.filter((_, i) => i !== index) });
  };

  const handleRemoveImage = (index: number) => {
    const removedUrl = newProduct.images[index];
    const updatedImages = newProduct.images.filter((_, i) => i !== index);

    setNewProduct(prev => {
      const isMain = prev.mainImage === removedUrl;
      return {
        ...prev,
        images: updatedImages,
        mainImage: isMain ? (updatedImages[0] || '') : prev.mainImage,
      };
    });
  };

  // ── Image Upload ──────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // If we are editing, we can tell the backend to update the DB immediately
      if (editingProductId) {
        formData.append('productId', editingProductId);
        // If this is the first image being uploaded for an empty product, mark it as main
        if (!newProduct.mainImage || newProduct.mainImage.includes('placehold.co')) {
          formData.append('isMain', 'true');
        }
      }

      const { data: sessionData } = await (await import('../lib/api')).supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const imageUrl = data.image_url;

      setNewProduct(prev => {
        const updatedImages = prev.images.includes(imageUrl) ? prev.images : [...prev.images, imageUrl];
        return {
          ...prev,
          images: updatedImages,
          mainImage: prev.mainImage && !prev.mainImage.includes('placehold.co') ? prev.mainImage : imageUrl,
        };
      });
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed. You can paste a URL manually instead.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = (url: string) => {
    if (url.trim()) {
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, url.trim()],
        mainImage: prev.mainImage || url.trim(),
      }));
    }
  };

  // ── CRUD ──────────────────────────────────────────────────
  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    setIsSubmitting(true);

    const notesArray = newProduct.notes.split(',').map(n => n.trim()).filter(Boolean);
    const payload = {
      name: newProduct.name,
      price: parseFloat(newProduct.price) || 0,
      notes: notesArray,
      inspiredBy: newProduct.inspiredBy || undefined,
      description: newProduct.description,
      category: newProduct.category,
      brand: 'Hama Fragrance',
      mainImage: newProduct.mainImage && !newProduct.mainImage.includes('placehold.co') ? newProduct.mainImage : null,
      galleryImages: newProduct.images,
      tags: newProduct.tags,
      productType: newProduct.productType,
      genderCategory: newProduct.genderCategory,
    };

    try {
      if (editingProductId) {
        await productsApi.update(editingProductId, payload);
      } else {
        await productsApi.create(payload);
      }
      resetForm();
      setShowAddProduct(false);
      await fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsApi.delete(id);
      await fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setShowAddProduct(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500';
      case 'Confirmed': return 'text-blue-500';
      case 'Shipped': return 'text-green-500';
      default: return 'text-white/70';
    }
  };

  // ── Computed Chart Data ───────────────────────────────────
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped');

  const categoryChartData = (() => {
    const categories = ['Aquatic', 'Citrus', 'Floral', 'Fresh', 'Fruity', 'Musky', 'Oriental', 'Spicy', 'Sweet', 'Woody'];
    const counts: Record<string, number> = {};
    categories.forEach(cat => counts[cat] = 0);

    products.forEach(p => {
      const cat = p.category || 'Fresh';
      // Basic normalization to match our list
      const normalizedCat = categories.find(c => c.toLowerCase() === cat.toLowerCase()) || 'Fresh';
      if (counts[normalizedCat] !== undefined) {
        counts[normalizedCat]++;
      }
    });

    return categories.map(category => ({ category, count: counts[category] }));
  })();

  const pieChartData = (() => {
    let count50ml = 0;
    let count100ml = 0;

    confirmedOrders.forEach(o => {
      // 1. Precise counting using items array (modern orders)
      if (o.items && Array.isArray(o.items) && o.items.length > 0) {
        o.items.forEach((item: any) => {
          const sizeInfo = (item.size || '').toLowerCase();
          const qty = Number(item.quantity) || 1;
          // "Standard" sizing in this store corresponds to the 50ml Signature format
          if (sizeInfo.includes('50ml') || sizeInfo.includes('standard')) {
            count50ml += qty;
          } else if (sizeInfo.includes('100ml')) {
            count100ml += qty;
          }
        });
      } 
      // 2. Fallback to summary string (legacy or summary-only orders)
      else {
        const summary = (o.product || '').toLowerCase();
        const segments = summary.split(', ');
        segments.forEach(segment => {
          // Extract quantity: matches (1 x ... or (1 - ... or just (1
          const qtyMatch = segment.match(/\((\d+)/);
          const qty = qtyMatch ? parseInt(qtyMatch[1]) : (Number(o.quantity) || 1);
          
          if (segment.includes('50ml') || segment.includes('standard')) {
            count50ml += qty;
          } else if (segment.includes('100ml')) {
            count100ml += qty;
          }
        });
      }
    });

    const data = [
      { name: '50ml Signature', value: count50ml },
      { name: '100ml Collector', value: count100ml },
    ].filter(v => v.value > 0);

    return data;
  })();

  const pieColors = ['#d4af37', '#b8962d', '#c5a028', '#8e7421'];

  // ── Image URL Input ──────────────────────────────────────
  const [newImageUrl, setNewImageUrl] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Admin Header */}
      <div className="bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-[#d4af37] mb-1">Hama Fragrance — Admin</h1>
            <p className="text-white/50 text-sm">Dashboard & Management</p>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => onNavigate('home')}>
              Back to Site
            </Button>
            <Button variant="secondary" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 transition-all ${activeTab === 'orders'
                ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                : 'text-white/50 hover:text-white/80'
              }`}
          >
            <ShoppingBag size={20} />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 transition-all ${activeTab === 'products'
                ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                : 'text-white/50 hover:text-white/80'
              }`}
          >
            <Package size={20} />
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 transition-all ${activeTab === 'analytics'
                ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                : 'text-white/50 hover:text-white/80'
              }`}
          >
            <BarChart3 size={20} />
            Analytics
          </button>
        </div>

        {/* ═══════════ Orders Tab ═══════════ */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl text-white mb-6 font-serif">Orders Management</h2>

            {loadingOrders ? (
              <div className="bg-white/5 border border-white/10 rounded-sm p-12 text-center">
                <p className="text-white/50">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-sm p-12 text-center">
                <ShoppingBag size={48} className="mx-auto mb-4 text-white/30" />
                <p className="text-white/50">No orders yet</p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="text-left px-6 py-4 text-white/70 text-sm font-normal">Client Name</th>
                      <th className="text-left px-6 py-4 text-white/70 text-sm font-normal">Details</th>
                      <th className="text-left px-6 py-4 text-white/70 text-sm font-normal">Place</th>
                      <th className="text-left px-6 py-4 text-white/70 text-sm font-normal">Products / Items</th>
                      <th className="text-left px-6 py-4 text-white/70 text-sm font-normal">Total</th>
                      <th className="text-left px-6 py-4 text-white/70 text-sm font-normal">Date</th>
                      <th className="text-left px-6 py-4 text-white/70 text-sm font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors align-top">
                        <td className="px-6 py-4">
                          <div className="text-white font-medium capitalize">{order.clientName}</div>
                          <div className="text-[#d4af37] text-xs mt-1">{order.phoneNumber || 'No Phone'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white/70 text-sm">{order.deliveryMethod || 'Standard'}</div>
                          {order.shippingFee ? <div className="text-white/40 text-xs mt-1">Fee: {order.shippingFee} TND</div> : null}
                        </td>
                        <td className="px-6 py-4 text-white/70 text-sm max-w-[200px] truncate">{order.place}</td>
                        <td className="px-6 py-4">
                          {order.items && order.items.length > 0 ? (
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-xs text-white flex justify-between gap-4">
                                  <span>{item.name || 'Product'} ({item.size})</span>
                                  <span className="text-[#d4af37]">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-white">{order.product} (x{order.quantity})</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#d4af37] font-bold whitespace-nowrap">{(order.totalPrice || 0).toFixed(2)} TND</td>
                        <td className="px-6 py-4 text-white/70 text-sm whitespace-nowrap">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                            className={`bg-transparent border border-white/20 rounded px-3 py-1 text-xs ${getStatusColor(order.status)} focus:outline-none focus:border-[#d4af37]/50`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════ Products Tab ═══════════ */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl text-white font-serif">Products Management</h2>
              <Button
                variant="primary"
                onClick={() => setShowAddProduct(true)}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                Add New Product
              </Button>
            </div>

            {/* Product Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="text"
                  placeholder="Search products by name or inspired scent..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#d4af37]/50 transition-all placeholder:text-white/20 text-sm"
                />
              </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showAddProduct && (
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="bg-[#1a1a1a] border border-white/20 rounded-sm p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl text-white font-serif">
                      {editingProductId ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button onClick={handleCancelEdit} className="text-white/50 hover:text-white transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Product Name *</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50"
                        placeholder="e.g., Bey Mystique"
                      />
                    </div>
                    
                    {/* Product Type */}
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Product Type *</label>
                      <select
                        value={newProduct.productType}
                        onChange={(e) => {
                          const pt = e.target.value as any;
                          setNewProduct({
                            ...newProduct,
                            productType: pt,
                            ...(pt === 'accessoire' ? { category: '', genderCategory: 'unisex' as any } : {})
                          });
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50"
                        required
                      >
                        <option value="extrait_parfum" className="bg-[#1a1a1a]">Extrait de Parfum</option>
                        <option value="original_parfum" className="bg-[#1a1a1a]">Parfum Original</option>
                        <option value="accessoire" className="bg-[#1a1a1a]">Accessoire</option>
                      </select>
                    </div>

                    {/* Notes — perfume only */}
                    {newProduct.productType !== 'accessoire' && (
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Notes / Ingredients (comma-separated)</label>
                        <input
                          type="text"
                          value={newProduct.notes}
                          onChange={(e) => setNewProduct({ ...newProduct, notes: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50"
                          placeholder="e.g., Oud, Leather, Dark Amber"
                        />
                      </div>
                    )}

                    {/* Inspired By — perfume only */}
                    {newProduct.productType !== 'accessoire' && (
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Inspired By (designer fragrance)</label>
                        <input
                          type="text"
                          value={newProduct.inspiredBy}
                          onChange={(e) => setNewProduct({ ...newProduct, inspiredBy: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50"
                          placeholder="e.g., Tom Ford Oud Wood"
                        />
                      </div>
                    )}

                    {/* Price & Category */}
                    <div className={`grid grid-cols-1 gap-4 ${newProduct.productType !== 'accessoire' ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Price (TND) *</label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50"
                          placeholder="e.g., 650"
                        />
                      </div>
                      {/* Category — perfume only */}
                      {newProduct.productType !== 'accessoire' && (
                        <div>
                          <label className="text-white/70 text-sm mb-2 block">Category</label>
                          <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50"
                          >
                            <option value="Aquatic" className="bg-[#1a1a1a]">Aquatic</option>
                            <option value="Citrus" className="bg-[#1a1a1a]">Citrus</option>
                            <option value="Floral" className="bg-[#1a1a1a]">Floral</option>
                            <option value="Fresh" className="bg-[#1a1a1a]">Fresh</option>
                            <option value="Fruity" className="bg-[#1a1a1a]">Fruity</option>
                            <option value="Musky" className="bg-[#1a1a1a]">Musky</option>
                            <option value="Oriental" className="bg-[#1a1a1a]">Oriental</option>
                            <option value="Spicy" className="bg-[#1a1a1a]">Spicy</option>
                            <option value="Sweet" className="bg-[#1a1a1a]">Sweet</option>
                            <option value="Woody" className="bg-[#1a1a1a]">Woody</option>
                          </select>
                        </div>
                      )}
                      {/* Gender — perfume only */}
                      {newProduct.productType !== 'accessoire' && (
                        <div>
                          <label className="text-white/70 text-sm mb-2 block">Gender</label>
                          <select
                            value={newProduct.genderCategory}
                            onChange={(e) => setNewProduct({ ...newProduct, genderCategory: e.target.value as any })}
                            className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50"
                          >
                            <option value="unisex" className="bg-[#1a1a1a]">Unisex</option>
                            <option value="woman" className="bg-[#1a1a1a]">Woman</option>
                            <option value="man" className="bg-[#1a1a1a]">Man</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Description</label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50 resize-none"
                        placeholder="e.g., A sophisticated blend..."
                        rows={3}
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="text-white/70 text-sm mb-3 flex items-center gap-2">
                        <ImageIcon size={16} />
                        Product Images
                      </label>

                      <div className="space-y-3">
                        {/* File Upload */}
                        <div className="flex gap-2">
                          <label className="flex-1 flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-sm cursor-pointer hover:bg-[#d4af37]/20 transition-colors">
                            <Upload size={16} className="text-[#d4af37]" />
                            <span className="text-[#d4af37] text-sm">
                              {uploadingImage ? 'Uploading...' : 'Upload Image File'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileUpload}
                              disabled={uploadingImage}
                            />
                          </label>
                        </div>

                        {/* Or paste URL */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddImageUrl(newImageUrl);
                                setNewImageUrl('');
                              }
                            }}
                            className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
                            placeholder="Or paste image URL"
                          />
                          <button
                            onClick={() => { handleAddImageUrl(newImageUrl); setNewImageUrl(''); }}
                            className="px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] rounded-sm hover:bg-[#d4af37]/30 transition-colors flex items-center gap-2"
                          >
                            <Plus size={16} />
                            Add
                          </button>
                        </div>

                        <p className="text-amber-500/80 text-[10px] bg-amber-500/10 p-2 rounded border border-amber-500/20">
                          ⚠️ <strong>Note:</strong> Some URLs (Pinterest, Facebook, etc.) block "hotlinking" and won't show on your site. Use <strong>Unsplash</strong> URLs or the <strong>Upload</strong> button above for best results.
                        </p>

                        {/* Image Preview Grid */}
                        {newProduct.images.length > 0 && (
                          <div>
                            <p className="text-white/50 text-xs mb-2">Click on an image to set it as main display image</p>
                            <div className="grid grid-cols-2 gap-3">
                              {newProduct.images.map((image, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className={`relative group bg-white/5 border rounded-sm p-3 hover:border-[#d4af37]/30 transition-all cursor-pointer ${newProduct.mainImage === image
                                      ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30'
                                      : 'border-white/10'
                                    }`}
                                  onClick={() => setNewProduct({ ...newProduct, mainImage: image })}
                                >
                                  {newProduct.mainImage === image && (
                                    <div className="absolute top-1 left-1 z-10 bg-[#d4af37] text-black text-xs px-2 py-0.5 rounded-sm font-display">MAIN</div>
                                  )}
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-16 h-16 bg-white/5 rounded-sm flex items-center justify-center overflow-hidden">
                                      {image.startsWith('http') ? (
                                        <img src={image} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <ImageIcon size={24} className="text-white/30" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white/70 text-xs truncate">{image}</p>
                                    </div>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                                      className="absolute top-2 right-2 p-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30 z-20"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {newProduct.images.length === 0 && (
                          <div className="bg-white/5 border border-dashed border-white/10 rounded-sm p-6 text-center">
                            <ImageIcon size={32} className="mx-auto mb-2 text-white/20" />
                            <p className="text-white/40 text-sm">No images added yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-white/70 text-sm mb-3 flex items-center gap-2">
                        <Tag size={16} />
                        Product Tags
                      </label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
                            placeholder="e.g., Oud, Leather, Spicy"
                          />
                          <button
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] rounded-sm hover:bg-[#d4af37]/30 transition-colors flex items-center gap-2"
                          >
                            <Plus size={16} /> Add
                          </button>
                        </div>
                        {newProduct.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {newProduct.tags.map((tag, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group flex items-center gap-2 px-3 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full text-[#d4af37] text-sm"
                              >
                                <span>{tag}</span>
                                <button onClick={() => handleRemoveTag(index)} className="opacity-60 hover:opacity-100 transition-opacity">
                                  <X size={14} />
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button variant="primary" onClick={handleSaveProduct} className="flex-1">
                        {isSubmitting ? 'Saving...' : (editingProductId ? 'Update Product' : 'Add Product')}
                      </Button>
                      <Button variant="secondary" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Products List */}
            {loadingProducts ? (
              <div className="bg-white/5 border border-white/10 rounded-sm p-12 text-center">
                <p className="text-white/50">Loading products...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products
                  .filter(p => {
                    const low = productSearch.toLowerCase().trim();
                    if (!low) return true;
                    return (
                      (p.name || '').toLowerCase().includes(low) ||
                      (p.inspiredBy || '').toLowerCase().includes(low)
                    );
                  })
                  .map((product) => (
                  <div
                    key={product.id}
                    className="bg-white/5 border border-white/10 rounded-sm p-6 hover:border-[#d4af37]/30 transition-colors"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex gap-2">
                        <div className="w-24 h-24 bg-white/5 rounded-sm overflow-hidden flex-shrink-0">
                          <div className="relative group/dbg">
                            <ImageWithFallback
                              src={product.mainImage || (product.galleryImages && product.galleryImages[0]) || DEFAULT_IMAGE}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="hidden group-hover/dbg:block absolute bottom-0 left-0 bg-black/80 text-[8px] text-white/50 p-1 truncate max-w-[200px]">
                              {product.mainImage}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="text-white text-xl font-serif mb-1">{product.name}</h4>
                        {product.inspiredBy && (
                          <p className="text-[#d4af37] text-xs mb-2 italic font-medium">Inspired by: {product.inspiredBy}</p>
                        )}
                        <p className="text-white/50 text-sm mb-3">{product.description}</p>

                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {product.tags.map((tag: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full text-[#d4af37] text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-4 text-sm">
                          <span className="text-[#d4af37]">{product.price} TND</span>
                          <span className="text-white/40">Category: {product.category === 'Premium' ? 'Fresh' : (product.category || 'N/A')}</span>
                          <span className="text-white/40">Notes: {Array.isArray(product.notes) ? product.notes.join(', ') : product.notes}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 items-start">
                        <button onClick={() => handleEditProduct(product)} className="p-2 text-white/50 hover:text-blue-400 transition-colors">
                          <Edit2 size={20} />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-white/50 hover:text-red-400 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════ Analytics Tab ═══════════ */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl text-white mb-8 font-serif">Analytics Dashboard</h2>

            {/* Stats Cards */}
            <AnalyticsStats orders={confirmedOrders} products={products} />

            {/* Gross Revenue Trend */}
            <GrossRevenueChart orders={confirmedOrders} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Distribution Pie Chart */}
              <div className="bg-white/5 border border-white/10 rounded-sm p-6">
                <h3 className="text-xl text-white font-serif mb-4">Fragrance Format Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#d4af37"
                      dataKey="value"
                    >
                      {pieChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37', borderRadius: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Performance */}
              <div className="bg-white/5 border border-white/10 rounded-sm p-6">
                <h3 className="text-xl text-white font-serif mb-4">Products by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryChartData} margin={{ bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis 
                      dataKey="category" 
                      stroke="#fff" 
                      opacity={0.5} 
                      interval={0} 
                      angle={-45} 
                      textAnchor="end"
                      fontSize={10}
                    />
                    <YAxis stroke="#fff" opacity={0.5} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37', borderRadius: '4px' }} />
                    <Legend />
                    <Bar dataKey="count" fill="#d4af37" name="Products" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}