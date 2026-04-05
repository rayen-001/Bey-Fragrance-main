import { Menu, X, ShoppingBag, User, LogOut, UserCircle, Shield } from 'lucide-react';
import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

interface NavigationProps {
  onNavigate?: (page: any) => void;
  currentPage?: string;
  cartItemsCount?: number;
  onCartOpen?: () => void;
  currentUser?: { id: string; name: string; email: string } | null;
  isAdmin?: boolean; // Add this
  onLoginClick?: () => void;
  onAccountClick?: () => void;
  onAdminClick?: () => void; // Add this
  onLogout?: () => void;
}

export function Navigation({ 
  onNavigate, 
  cartItemsCount = 0, 
  onCartOpen,
  currentUser,
  isAdmin, // Add this
  onLoginClick,
  onAccountClick,
  onAdminClick, // Add this
  onLogout
}: NavigationProps) {
  console.log('Nav isAdmin:', isAdmin); // Debug prop drilling
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Transform path to match page keys
  const currentPagePath = location.pathname;
  let currentPage = 'home';
  if (currentPagePath.includes('shop')) currentPage = 'shop';
  if (currentPagePath.includes('story')) currentPage = 'story';
  if (currentPagePath.includes('contact')) currentPage = 'contact';
  if (currentPagePath.includes('account')) currentPage = 'account';

  const navItems = [
    { label: 'Home', page: 'home' as const, path: '/' },
    { label: 'Story', page: 'story' as const, path: '/story' },
    { label: 'Shop', page: 'shop' as const, path: '/shop' },
    { label: 'Contact', page: 'contact' as const, path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/"
            className="font-serif text-xl text-[#d4af37] tracking-wider hover:text-[#f0c952] transition-colors"
          >
            Hama Fragrance
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`text-sm tracking-wider transition-colors ${
                  currentPage === item.page
                    ? 'text-[#d4af37]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Cart Icon */}
            {onCartOpen && (
              <button
                onClick={onCartOpen}
                className="relative p-2 text-white/70 hover:text-[#d4af37] transition-colors"
              >
                <ShoppingBag size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] text-black text-xs rounded-full flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}
            
            {/* Admin Dashboard Button */}
            {isAdmin && (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
              >
                <Shield size={16} />
                Dashboard
              </button>
            )}
            
            {/* User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 text-white/70 hover:text-[#d4af37] transition-colors"
                >
                  <UserCircle size={22} />
                  <span className="text-sm">{currentUser.name.split(' ')[0]}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1510] border border-white/10 rounded-sm shadow-xl overflow-hidden">
                    {/* Extra Admin Dashboard link in menu */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          onAdminClick?.();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-[#d4af37] hover:bg-white/5 transition-colors flex items-center gap-2 border-b border-white/5"
                      >
                        <Shield size={16} />
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onAccountClick?.();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white/70 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <User size={16} />
                      My Account
                    </button>
                    <button
                      onClick={() => {
                        onLogout?.();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Cart Icon */}
            {onCartOpen && (
              <button
                onClick={onCartOpen}
                className="relative p-2 text-white/70 hover:text-[#d4af37] transition-colors"
              >
                <ShoppingBag size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] text-black text-xs rounded-full flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}
            
            {/* Mobile User Icon */}
            {currentUser ? (
              <button
                onClick={onAccountClick}
                className="p-2 text-white/70 hover:text-[#d4af37] transition-colors"
              >
                <UserCircle size={22} />
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="p-2 text-white/70 hover:text-[#d4af37] transition-colors"
              >
                <User size={22} />
              </button>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {isAdmin && (
              <button
                onClick={() => {
                  onAdminClick?.();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-[#d4af37] bg-white/5 rounded-sm transition-colors flex items-center gap-3 font-medium"
              >
                <Shield size={18} />
                Admin Dashboard
              </button>
            )}
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left text-sm tracking-wider text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {currentUser && (
              <button
                onClick={() => {
                  onLogout?.();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-sm tracking-wider text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
