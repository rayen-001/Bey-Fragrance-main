import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onNavigate?: (page: any) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const shopLinks = [
    { label: 'All Fragrances', path: '/shop' },
    { label: 'New Arrivals', path: '/shop' },
    { label: 'Best Sellers', path: '/shop' },
    { label: 'Gift Sets', path: '/shop' },
  ];

  const aboutLinks = [
    { label: 'Our Story', path: '/story' },
    { label: 'Craftsmanship', path: '/story' },
    { label: 'Sustainability', path: '/story' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const supportLinks = [
    { label: 'Shipping Info', path: '/shipping' },
    { label: 'Returns', path: '/returns' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Size Guide', path: '/size-guide' },
  ];

  const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com/hamafragrance', letter: 'IG' },
    { label: 'Facebook', href: 'https://facebook.com/hamafragrance', letter: 'FB' },
    { label: 'TikTok', href: 'https://tiktok.com/@hamafragrance', letter: 'TT' },
  ];

  return (
    <footer className="relative z-50 pointer-events-auto bg-gradient-to-b from-black to-[#0a0a0a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="font-serif text-2xl text-[#d4af37] mb-4 tracking-wider block hover:text-[#f0c952] transition-colors"
              onClick={() => console.log('Footer: Navigating to home')}
            >
              Hama Fragrance
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 mt-4">
              Crafting luxury fragrances that tell your unique story.
              Each scent is a masterpiece, blending rare ingredients with timeless elegance.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <MapPin size={16} className="text-[#d4af37]" />
                <span>Tunis, Tunisia</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Phone size={16} className="text-[#d4af37]" />
                <span>+216 22 592 856</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Mail size={16} className="text-[#d4af37]" />
                <span>contact@hamafragrance.tn</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map(({ letter, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-sm text-white/40 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors text-xs font-medium"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white font-medium mb-4 tracking-wide">Shop</h4>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-[#d4af37] transition-colors text-sm block"
                    onClick={() => console.log(`Footer: Navigating to ${link.path}`)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-white font-medium mb-4 tracking-wide">About</h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-[#d4af37] transition-colors text-sm block"
                    onClick={() => console.log(`Footer: Navigating to ${link.path}`)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-medium mb-4 tracking-wide">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-[#d4af37] transition-colors text-sm block"
                    onClick={() => console.log(`Footer: Navigating to ${link.path}`)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-white/40 text-sm">
          <p>© 2026 Hama Fragrance. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link 
              to="/privacy" 
              className="hover:text-white/60 transition-colors"
              onClick={() => console.log('Footer: Navigating to /privacy')}
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="hover:text-white/60 transition-colors"
              onClick={() => console.log('Footer: Navigating to /terms')}
            >
              Terms of Service
            </Link>
            <Link
              to="/admin"
              className="hover:text-[#d4af37] transition-colors opacity-30 hover:opacity-100"
              onClick={() => console.log('Footer: Navigating to /admin')}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
    </footer>
  );
}
