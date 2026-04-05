import { motion } from 'motion/react';
import { Truck, Clock, MapPin, Package, AlertCircle } from 'lucide-react';
import { Navigation } from './ui/Navigation';
import { Footer } from './ui/Footer';

interface PageProps {
  onNavigate?: (page: any) => void;
  cartItemsCount?: number;
  onCartOpen?: () => void;
  currentUser?: { id: string; name: string; email: string } | null;
  onLoginClick?: () => void;
  onAccountClick?: () => void;
  onAdminClick?: () => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

const shippingZones = [
  { zone: 'Grand Tunis', time: '1 – 3 days', fee: '7 TND', free: 'Free over 200 TND' },
  { zone: 'North Tunisia', time: '1 – 3 days', fee: '7 TND', free: 'Free over 200 TND' },
  { zone: 'Central Tunisia', time: '1 – 3 days', fee: '7 TND', free: 'Free over 200 TND' },
  { zone: 'South Tunisia', time: '1 – 3 days', fee: '7 TND', free: 'Free over 200 TND' },
];

export default function ShippingInfo({ onNavigate, cartItemsCount, onCartOpen, currentUser, onLoginClick, onAccountClick, onAdminClick, isAdmin, onLogout }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation
        onNavigate={onNavigate}
        currentPage="shipping"
        cartItemsCount={cartItemsCount}
        onCartOpen={onCartOpen}
        currentUser={currentUser}
        onLoginClick={onLoginClick}
        onAccountClick={onAccountClick}
        onAdminClick={onAdminClick}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />

      <div className="pt-20">
        {/* Hero */}
        <motion.div
          className="relative py-20 text-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 to-transparent" />
          <div className="relative z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Truck size={48} className="text-[#d4af37] mx-auto mb-6" />
              <h1 className="font-serif text-5xl lg:text-6xl text-white mb-4">Shipping Information</h1>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
                We deliver across Tunisia with care and discretion, ensuring your order arrives safely.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

          {/* Delivery Zones Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl text-white mb-8 flex items-center gap-3">
              <MapPin size={28} className="text-[#d4af37]" />
              Delivery Zones & Rates
            </h2>
            <div className="border border-white/10 rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#d4af37]/10 border-b border-white/10">
                    <th className="text-left px-6 py-4 text-[#d4af37] font-medium tracking-wide text-sm">Zone</th>
                    <th className="text-left px-6 py-4 text-[#d4af37] font-medium tracking-wide text-sm">Delivery Time</th>
                    <th className="text-left px-6 py-4 text-[#d4af37] font-medium tracking-wide text-sm">Fee</th>
                    <th className="text-left px-6 py-4 text-[#d4af37] font-medium tracking-wide text-sm">Free Shipping</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingZones.map((row, i) => (
                    <tr key={row.zone} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                      <td className="px-6 py-4 text-white font-medium">{row.zone}</td>
                      <td className="px-6 py-4 text-white/70">{row.time}</td>
                      <td className="px-6 py-4 text-white/70">{row.fee}</td>
                      <td className="px-6 py-4 text-[#d4af37]/80 text-sm">{row.free}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Package, title: 'Order Placed', desc: 'Your order is confirmed and prepared with care in our secure facility.' },
              { icon: Truck, title: 'Dispatched', desc: 'Shipped within 24 hours on business days, packaged in our signature black box.' },
              { icon: Clock, title: 'Delivered', desc: 'You receive a confirmation once your package arrives at your door.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/[0.03] border border-white/10 rounded-sm p-6 text-center">
                <Icon size={32} className="text-[#d4af37] mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="border-l-2 border-[#d4af37] pl-8 space-y-4"
          >
            <h2 className="font-serif text-2xl text-white mb-4">Important Notes</h2>
            {[
              'Orders placed after 3:00 PM will be processed the following business day.',
              'Delivery times are estimates and may vary during national holidays or peak periods.',
              'A phone number is required for delivery — our courier will contact you before arrival.',
              'All packages are sealed and discreet with no visible pricing.',
              'For bulk or corporate orders, contact us directly at contact@hamafragrance.tn for a custom shipping quote.',
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-3">
                <AlertCircle size={16} className="text-[#d4af37] mt-1 shrink-0" />
                <p className="text-white/70 leading-relaxed">{note}</p>
              </div>
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 rounded-sm p-8 text-center"
          >
            <p className="text-white/80 text-lg mb-2">Still have questions about your delivery?</p>
            <p className="text-white/50 mb-6">Our team is available 7 days a week to assist you.</p>
            <a
              href="mailto:contact@hamafragrance.tn"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black font-medium tracking-wide hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </motion.div>

        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
