import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';
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

const faqs = [
  {
    category: 'About Our Fragrances',
    items: [
      {
        q: 'What does "inspired by" mean?',
        a: 'Our fragrances are creative interpretations of iconic designer and niche perfumes. We craft our own formulas using similar accords and notes to evoke the same spirit and character — without copying the original. You get the essence at a fraction of the price.',
      },
      {
        q: 'Are your fragrances long-lasting?',
        a: 'Yes. All Hama Fragrance products are Extrait de Parfum concentration (20–30% fragrance oil), giving you exceptional longevity — typically 8 to 12 hours on skin and even longer on fabric.',
      },
      {
        q: 'Are your ingredients safe and tested?',
        a: 'Absolutely. We use cosmetic-grade, dermatologically tested ingredients. Our formulas comply with IFRA guidelines. If you have specific allergies, feel free to contact us before ordering.',
      },
      {
        q: 'What sizes do you offer?',
        a: 'Each fragrance is available in 50ml and 100ml. Both come in our signature dark glass bottle with a gold cap.',
      },
    ],
  },
  {
    category: 'Orders & Payment',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse our Shop, select a fragrance, choose your size, and click "Buy Now" or add to cart. Fill in your delivery details and confirm — it\'s that simple.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We currently accept cash on delivery (COD) across Tunisia. Online payment options are coming soon.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 2 hours of placement. After that, they are already being prepared. Contact us immediately at contact@hamafragrance.tn if you need changes.',
      },
      {
        q: 'Do you offer gift wrapping?',
        a: 'Yes! All our orders come in our signature black luxury box. Mention "gift" in your order notes and we\'ll add a handwritten card at no extra charge.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'How fast will I receive my order?',
        a: 'Orders in Grand Tunis are delivered in 24–48 hours. Other regions take 2–5 days depending on location. See our full Shipping Info page for details.',
      },
      {
        q: 'Do you deliver across all of Tunisia?',
        a: 'Yes, we deliver to all governorates in Tunisia via trusted local couriers.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order ships, our courier will contact you directly by phone to arrange delivery. You can also reach us anytime for a status update.',
      },
    ],
  },
  {
    category: 'Returns & Issues',
    items: [
      {
        q: 'What if I receive the wrong item?',
        a: 'Contact us within 24 hours with a photo of the item received. We will arrange an immediate exchange at no cost to you.',
      },
      {
        q: 'Can I return a fragrance if I don\'t like the scent?',
        a: 'Unfortunately, we cannot accept returns based on personal scent preference for opened bottles. We recommend visiting our shop page and reading the full fragrance description before ordering. If you\'re unsure, contact us — we\'re happy to help you choose.',
      },
      {
        q: 'What if my bottle arrives damaged?',
        a: 'Take a photo of the damage immediately upon receipt and contact us within 24 hours. We will send a replacement at no charge.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-white group-hover:text-[#d4af37] transition-colors font-medium leading-snug">{q}</span>
        <ChevronDown
          size={20}
          className={`text-[#d4af37] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-white/60 leading-relaxed pb-5 pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ({ onNavigate, cartItemsCount, onCartOpen, currentUser, onLoginClick, onAccountClick, onAdminClick, isAdmin, onLogout }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation
        onNavigate={onNavigate}
        currentPage="faq"
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
              <HelpCircle size={48} className="text-[#d4af37] mx-auto mb-6" />
              <h1 className="font-serif text-5xl lg:text-6xl text-white mb-4">Frequently Asked Questions</h1>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
                Everything you need to know about Hama Fragrance, orders, and delivery.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
        </motion.div>

        <div className="max-w-3xl mx-auto px-6 py-16 space-y-14">
          {faqs.map((section, i) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
            >
              <h2 className="font-serif text-2xl text-[#d4af37] mb-6 pb-3 border-b border-[#d4af37]/20">
                {section.category}
              </h2>
              <div>
                {section.items.map(item => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          ))}

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 rounded-sm p-8 text-center"
          >
            <p className="font-serif text-2xl text-white mb-3">Still have a question?</p>
            <p className="text-white/50 mb-6">Our team responds within a few hours, every day of the week.</p>
            <a
              href="mailto:contact@hamafragrance.tn"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black font-medium tracking-wide hover:opacity-90 transition-opacity"
            >
              Ask Us Directly
            </a>
          </motion.div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
