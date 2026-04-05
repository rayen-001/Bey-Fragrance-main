import { motion } from 'motion/react';
import { RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
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

export default function Returns({ onNavigate, cartItemsCount, onCartOpen, currentUser, onLoginClick, onAccountClick, onAdminClick, isAdmin, onLogout }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation
        onNavigate={onNavigate}
        currentPage="returns"
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
              <RotateCcw size={48} className="text-[#d4af37] mx-auto mb-6" />
              <h1 className="font-serif text-5xl lg:text-6xl text-white mb-4">Returns & Exchanges</h1>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
                Your satisfaction is our priority. We stand behind every product we send.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

          {/* Policy Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Clock, label: '7-Day Window', desc: 'You have 7 days from delivery date to request a return or exchange.' },
              { icon: CheckCircle, label: 'Sealed Items Only', desc: 'Products must be unopened, unused, and in their original packaging.' },
              { icon: RotateCcw, label: 'Exchange Priority', desc: 'We prioritize exchanges over refunds to get you the right scent.' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/[0.03] border border-white/10 rounded-sm p-6 text-center">
                <Icon size={32} className="text-[#d4af37] mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">{label}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Eligible vs Non-Eligible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="border border-green-500/20 rounded-sm p-6 bg-green-500/[0.03]">
              <h3 className="font-serif text-xl text-white mb-5 flex items-center gap-2">
                <CheckCircle size={20} className="text-green-400" />
                Eligible for Return
              </h3>
              <ul className="space-y-3">
                {[
                  'Unopened, sealed bottle in original box',
                  'Wrong item delivered to you',
                  'Damaged or defective product upon arrival',
                  'Order never received after 10 business days',
                ].map(item => (
                  <li key={item} className="text-white/70 text-sm flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-red-500/20 rounded-sm p-6 bg-red-500/[0.03]">
              <h3 className="font-serif text-xl text-white mb-5 flex items-center gap-2">
                <XCircle size={20} className="text-red-400" />
                Not Eligible for Return
              </h3>
              <ul className="space-y-3">
                {[
                  'Opened or used bottles (due to hygiene)',
                  'Products returned after 7 days of delivery',
                  'Items without original packaging',
                  'Returns requested due to personal scent preference',
                ].map(item => (
                  <li key={item} className="text-white/70 text-sm flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* How to Return */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl text-white mb-8">How to Request a Return</h2>
            <div className="space-y-4">
              {[
                { step: '01', title: 'Contact Us', desc: 'Send an email to contact@hamafragrance.tn with your order number, reason for return, and a photo of the product.' },
                { step: '02', title: 'Approval', desc: 'Our team will review your request within 48 hours and confirm whether it qualifies.' },
                { step: '03', title: 'Ship the Item', desc: 'If approved, we will arrange pickup or provide you with the return address. Items must be securely packed.' },
                { step: '04', title: 'Refund or Exchange', desc: 'Once we receive and inspect the item, your refund will be processed within 5 business days, or your exchange shipped immediately.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-6 items-start border-b border-white/5 pb-6">
                  <span className="font-serif text-3xl text-[#d4af37]/40 w-12 shrink-0">{step}</span>
                  <div>
                    <h4 className="text-white font-medium mb-1">{title}</h4>
                    <p className="text-white/60 leading-relaxed text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 rounded-sm p-8 text-center"
          >
            <p className="text-white/80 text-lg mb-2">Need help with a return?</p>
            <p className="text-white/50 mb-6">Our support team is here Monday – Sunday, 9AM to 9PM.</p>
            <a
              href="mailto:contact@hamafragrance.tn"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black font-medium tracking-wide hover:opacity-90 transition-opacity"
            >
              Start a Return Request
            </a>
          </motion.div>

        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
