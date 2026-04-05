import { motion } from 'motion/react';
import { Droplets } from 'lucide-react';
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

export default function SizeGuide({ onNavigate, cartItemsCount, onCartOpen, currentUser, onLoginClick, onAccountClick, onAdminClick, isAdmin, onLogout }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation
        onNavigate={onNavigate}
        currentPage="size-guide"
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
              <Droplets size={48} className="text-[#d4af37] mx-auto mb-6" />
              <h1 className="font-serif text-5xl lg:text-6xl text-white mb-4">Size Guide</h1>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
                Not sure which size to choose? We'll help you find the perfect fit for your lifestyle.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

          {/* Size comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* 50ml */}
            <div className="border border-[#d4af37]/30 rounded-sm p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
              <div className="w-16 h-24 bg-gradient-to-b from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 rounded-sm mx-auto mb-6 flex items-end justify-center pb-2">
                <span className="text-[#d4af37] text-xs tracking-widest">50ml</span>
              </div>
              <h3 className="font-serif text-2xl text-white mb-2">50 ml</h3>
              <p className="text-[#d4af37] font-medium mb-4">Starting Price</p>
              <ul className="text-white/60 text-sm space-y-2 text-left">
                <li className="flex items-center gap-2"><span className="text-[#d4af37]">→</span> Approx. 500–700 sprays</li>
                <li className="flex items-center gap-2"><span className="text-[#d4af37]">→</span> 3–6 months of daily use</li>
                <li className="flex items-center gap-2"><span className="text-[#d4af37]">→</span> Perfect for trying a new scent</li>
                <li className="flex items-center gap-2"><span className="text-[#d4af37]">→</span> Travel-friendly size</li>
                <li className="flex items-center gap-2"><span className="text-[#d4af37]">→</span> Ideal as a gift</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-white/40 text-xs">Best for: First-time buyers, gifting, or rotating scents</p>
              </div>
            </div>

            {/* 100ml */}
            <div className="border border-[#d4af37]/30 rounded-sm p-8 text-center relative overflow-hidden bg-[#d4af37]/[0.03]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <div className="absolute top-4 right-4 text-xs text-[#d4af37] border border-[#d4af37]/40 px-2 py-1 tracking-wider">BEST VALUE</div>
              <div className="w-20 h-32 bg-gradient-to-b from-[#d4af37]/30 to-[#d4af37]/5 border border-[#d4af37]/40 rounded-sm mx-auto mb-6 flex items-end justify-center pb-2">
                <span className="text-[#d4af37] text-xs tracking-widest">100ml</span>
              </div>
              <h3 className="font-serif text-2xl text-white mb-2">100 ml</h3>
              <p className="text-[#d4af37] font-medium mb-4">Best Value</p>
              <ul className="text-white/60 text-sm space-y-2 text-left">
                <li className="flex items-center gap-2"><span className="text-[#d4af37]">→</span> Approx. 1000–1400 sprays</li>
                <li className="flex items-center gap-2"><span className="text-[#d4af37]">→</span> 6–12 months of daily use</li>
                <li className="flex items-center gap-2"><span className="text-[#d4af37]">→</span> Best price per ml</li>
                <li className="flex items-center gap-2"><span className="text-[#d4af37]">→</span> Your signature everyday scent</li>
                <li className="flex items-center gap-2"><span className="text-[#d4af37]">→</span> Premium shelf statement</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-white/40 text-xs">Best for: A fragrance you already love and wear daily</p>
              </div>
            </div>
          </motion.div>

          {/* How to apply */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl text-white mb-8 border-l-2 border-[#d4af37] pl-6">
              How to Apply for Maximum Longevity
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { tip: 'Apply on pulse points', detail: 'Wrists, neck, behind the ears, and inner elbows — where body heat amplifies the scent.' },
                { tip: 'Don\'t rub after spraying', detail: 'Rubbing breaks the fragrance molecules and dulls the top notes prematurely.' },
                { tip: 'Spray on moisturised skin', detail: 'Hydrated skin holds fragrance longer. Apply after a shower or over unscented lotion.' },
                { tip: 'Layer strategically', detail: 'For an all-day scent trail, spray once on clothing and once on skin.' },
                { tip: '2–3 sprays is enough', detail: 'Extrait concentration is powerful. Less is more — you will still leave a lasting impression.' },
                { tip: 'Store away from light', detail: 'Keep your bottle in a cool, dark place to preserve the formula and extend shelf life.' },
              ].map(({ tip, detail }) => (
                <div key={tip} className="bg-white/[0.03] border border-white/10 rounded-sm p-5">
                  <h4 className="text-[#d4af37] font-medium mb-1 text-sm tracking-wide">{tip}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Concentration guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="border-l-2 border-[#d4af37] pl-8"
          >
            <h2 className="font-serif text-3xl text-white mb-6">Our Concentration: Extrait de Parfum</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              All Hama Fragrance products are Extrait de Parfum — the highest concentration available,
              typically containing 20–40% pure fragrance oil. This is above Eau de Parfum (EDP) and Eau de Toilette (EDT),
              meaning every bottle delivers deeper, richer, longer-lasting performance.
            </p>
            <div className="mt-6 border border-white/10 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#d4af37]/10 border-b border-white/10">
                    <th className="text-left px-5 py-3 text-[#d4af37]">Type</th>
                    <th className="text-left px-5 py-3 text-[#d4af37]">Oil Concentration</th>
                    <th className="text-left px-5 py-3 text-[#d4af37]">Longevity</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Extrait de Parfum', conc: '20–40%', longevity: '8–12+ hours', highlight: true },
                    { type: 'Eau de Parfum (EDP)', conc: '15–20%', longevity: '5–8 hours', highlight: false },
                    { type: 'Eau de Toilette (EDT)', conc: '8–15%', longevity: '3–5 hours', highlight: false },
                    { type: 'Eau de Cologne (EDC)', conc: '2–5%', longevity: '1–3 hours', highlight: false },
                  ].map(row => (
                    <tr key={row.type} className={`border-b border-white/5 ${row.highlight ? 'bg-[#d4af37]/5' : ''}`}>
                      <td className={`px-5 py-3 ${row.highlight ? 'text-[#d4af37] font-medium' : 'text-white/70'}`}>
                        {row.type} {row.highlight && '← We use this'}
                      </td>
                      <td className="px-5 py-3 text-white/60">{row.conc}</td>
                      <td className="px-5 py-3 text-white/60">{row.longevity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
