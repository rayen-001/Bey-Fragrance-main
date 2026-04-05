import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Navigation } from './ui/Navigation';
import { Footer } from './ui/Footer';
import { 
  User, 
  MapPin, 
  Package, 
  Heart, 
  Settings, 
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from './ui/button';
import { getCurrentUser, logout, updateUserProfile, addAddress, deleteAddress, type User as UserType, type Address } from '../lib/auth';
import { type Product } from '../lib/products';

interface AccountProps {
  onNavigate: (page: 'home' | 'story' | 'shop' | 'admin') => void;
  onLogout: () => void;
  cartItemsCount: number;
  onCartOpen: () => void;
  products: Product[];
  wishlistItems: Product[];
  orders: any[];
  currentUser: { name: string; email: string; id: string } | null;
  onLoginClick: () => void;
  onAccountClick: () => void;
  isAdmin: boolean;
  onAdminClick: () => void;
}

type Tab = 'profile' | 'addresses' | 'orders' | 'wishlist';

export default function Account({ 
  onNavigate, 
  onLogout, 
  cartItemsCount, 
  onCartOpen, 
  products, 
  wishlistItems, 
  orders, 
  currentUser, 
  onLoginClick, 
  onAccountClick, 
  isAdmin, 
  onAdminClick 
}: AccountProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '' });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setEditData({ name: currentUser.name, phone: currentUser.phone || '' });
    }
  }, []);

  const handleLogout = () => {
    logout();
    onLogout();
    onNavigate('home');
  };

  const handleUpdateProfile = () => {
    if (user) {
      const updated = updateUserProfile(user.id, editData);
      if (updated) {
        setUser(updated);
        setIsEditing(false);
      }
    }
  };

  const handleAddAddress = () => {
    if (user) {
      const updated = addAddress(user.id, { ...newAddress, isDefault: user.addresses.length === 0 });
      if (updated) {
        setUser(updated);
        setShowAddAddress(false);
        setNewAddress({
          name: '',
          street: '',
          city: '',
          postalCode: '',
          phone: '',
        });
      }
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    if (user) {
      const updated = deleteAddress(user.id, addressId);
      if (updated) {
        setUser(updated);
      }
    }
  };

  const wishlistProducts = wishlistItems;
  const userOrders = orders;

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'addresses' as Tab, label: 'Addresses', icon: MapPin },
    { id: 'orders' as Tab, label: 'Orders', icon: Package },
    { id: 'wishlist' as Tab, label: 'Wishlist', icon: Heart },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <User size={64} className="mx-auto mb-4 text-white/20" />
          <p className="text-white/50 mb-4">Please log in to view your account</p>
          <Button variant="primary" onClick={() => onNavigate('home')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation 
        onNavigate={onNavigate} 
        currentPage="shop"
        cartItemsCount={cartItemsCount}
        onCartOpen={onCartOpen}
        currentUser={currentUser}
        onLoginClick={onLoginClick}
        onAccountClick={onAccountClick}
        onAdminClick={onAdminClick}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />
      
      <div className="pt-20 px-6 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-5xl text-white mb-2">My Account</h1>
            <p className="text-white/60">Welcome back, {user.name}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-sm p-6 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#d4af37] text-black'
                        : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span>{tab.label}</span>
                    {tab.id === 'wishlist' && user.wishlist.length > 0 && (
                      <span className="ml-auto text-xs bg-white/10 px-2 py-1 rounded-full">
                        {user.wishlist.length}
                      </span>
                    )}
                    {tab.id === 'orders' && userOrders.length > 0 && (
                      <span className="ml-auto text-xs bg-white/10 px-2 py-1 rounded-full">
                        {userOrders.length}
                      </span>
                    )}
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-red-400 hover:bg-red-500/10 transition-all mt-4"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-sm p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif text-white">Profile Information</h2>
                    {!isEditing && (
                      <Button variant="secondary" onClick={() => setIsEditing(true)}>
                        <Edit2 size={16} /> Edit
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Full Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Email</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white/50 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Phone</label>
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button variant="primary" onClick={handleUpdateProfile}>
                          Save Changes
                        </Button>
                        <Button variant="secondary" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-white/50 text-sm">Full Name</p>
                        <p className="text-white text-lg">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Email</p>
                        <p className="text-white text-lg">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Phone</p>
                        <p className="text-white text-lg">{user.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Member Since</p>
                        <p className="text-white text-lg">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif text-white">Saved Addresses</h2>
                    <Button variant="primary" onClick={() => setShowAddAddress(!showAddAddress)}>
                      <Plus size={16} /> Add Address
                    </Button>
                  </div>

                  {showAddAddress && (
                    <div className="bg-white/5 border border-white/10 rounded-sm p-6 space-y-4">
                      <h3 className="text-white font-medium mb-4">New Address</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          className="bg-white/5 border border-white/10 rounded-sm px-4 py-2 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="bg-white/5 border border-white/10 rounded-sm px-4 py-2 text-white"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2 text-white"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="bg-white/5 border border-white/10 rounded-sm px-4 py-2 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Postal Code"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          className="bg-white/5 border border-white/10 rounded-sm px-4 py-2 text-white"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button variant="primary" onClick={handleAddAddress}>
                          Save Address
                        </Button>
                        <Button variant="secondary" onClick={() => setShowAddAddress(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="bg-white/5 border border-white/10 rounded-sm p-6 relative"
                      >
                        {address.isDefault && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded-full">
                            <Check size={12} />
                            Default
                          </div>
                        )}
                        <h4 className="text-white font-medium mb-2">{address.name}</h4>
                        <p className="text-white/60 text-sm mb-1">{address.street}</p>
                        <p className="text-white/60 text-sm mb-1">
                          {address.city}, {address.postalCode}
                        </p>
                        <p className="text-white/60 text-sm mb-4">{address.phone}</p>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  {user.addresses.length === 0 && !showAddAddress && (
                    <div className="text-center py-12 bg-white/5 border border-white/10 rounded-sm">
                      <MapPin size={48} className="mx-auto mb-4 text-white/20" />
                      <p className="text-white/50 mb-4">No saved addresses yet</p>
                      <Button variant="primary" onClick={() => setShowAddAddress(true)}>
                        Add Your First Address
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-serif text-white">Order History</h2>

                  {userOrders.length > 0 ? (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white/5 border border-white/10 rounded-sm p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-white font-medium">Order #{order.id}</p>
                              <p className="text-white/50 text-sm">{order.date}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs ${
                              order.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.status}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-white/70">{order.product}</p>
                            <p className="text-white/50 text-sm">Quantity: {order.quantity}</p>
                            <p className="text-white/50 text-sm">Delivery: {order.place}</p>
                            {order.totalPrice && (
                              <p className="text-[#d4af37] font-medium mt-2">
                                Total: {order.totalPrice} TND
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/5 border border-white/10 rounded-sm">
                      <Package size={48} className="mx-auto mb-4 text-white/20" />
                      <p className="text-white/50 mb-4">No orders yet</p>
                      <Button variant="primary" onClick={() => onNavigate('shop')}>
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-serif text-white">My Wishlist</h2>

                  {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:border-[#d4af37]/30 transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="text-white font-serif mb-1">{product.name}</h4>
                            <p className="text-white/50 text-sm mb-2">{product.notes}</p>
                            <p className="text-[#d4af37] mb-3">{product.price}</p>
                            <Button 
                              variant="primary" 
                              className="w-full text-sm py-2"
                              onClick={() => onNavigate('shop')}
                            >
                              View Product
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/5 border border-white/10 rounded-sm">
                      <Heart size={48} className="mx-auto mb-4 text-white/20" />
                      <p className="text-white/50 mb-4">Your wishlist is empty</p>
                      <Button variant="primary" onClick={() => onNavigate('shop')}>
                        Discover Fragrances
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
