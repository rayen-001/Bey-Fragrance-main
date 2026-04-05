import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
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

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you place an order or create an account with Hama Fragrance, we collect the following information:

• Full name and contact details (phone number, email address)
• Delivery address
• Order history and preferences
• Device and browser information (for improving your browsing experience)

We do not collect payment card information. All transactions using future online payment integrations will be handled by certified third-party payment processors.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `Your information is used solely to:

• Process and fulfill your orders
• Contact you regarding delivery or order updates
• Improve our website and services
• Send occasional promotions (only if you opted in)

We will never sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: '3. Data Storage & Security',
    content: `Your data is stored securely using Supabase, a trusted cloud database provider. We apply industry-standard encryption and access controls to protect your information from unauthorized access, disclosure, or loss.

Access to personal data is restricted to authorized Hama Fragrance team members who require it to fulfill your orders.`,
  },
  {
    title: '4. Cookies',
    content: `Our website uses essential cookies to maintain your session (login state, cart contents) and improve performance. We do not use tracking or advertising cookies.

You can disable cookies in your browser settings, but some website features may not work correctly as a result.`,
  },
  {
    title: '5. Your Rights',
    content: `You have the right to:

• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your account and associated data
• Withdraw consent for marketing communications at any time

To exercise any of these rights, contact us at contact@hamafragrance.tn.`,
  },
  {
    title: '6. Third-Party Services',
    content: `Our website may use third-party services for analytics and delivery coordination. These providers have their own privacy policies and we encourage you to review them. We only share the minimum information necessary for service fulfillment.`,
  },
  {
    title: '7. Children\'s Privacy',
    content: `Hama Fragrance services are not directed to individuals under the age of 16. We do not knowingly collect personal information from minors. If you believe a minor has submitted information to us, please contact us and we will delete it promptly.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated version will always be available on this page with the revision date noted below.

Last updated: April 2026`,
  },
];

export default function PrivacyPolicy({ onNavigate, cartItemsCount, onCartOpen, currentUser, onLoginClick, onAccountClick, onAdminClick, isAdmin, onLogout }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation
        onNavigate={onNavigate}
        currentPage="privacy"
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
              <Shield size={48} className="text-[#d4af37] mx-auto mb-6" />
              <h1 className="font-serif text-5xl lg:text-6xl text-white mb-4">Privacy Policy</h1>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
                Your privacy matters to us. Here is how we collect, use, and protect your data.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
        </motion.div>

        <div className="max-w-3xl mx-auto px-6 py-16">
          <motion.p
            className="text-white/50 text-sm mb-12 border border-white/10 rounded-sm p-4 bg-white/[0.02]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            This Privacy Policy applies to all services provided by <span className="text-[#d4af37]">Hama Fragrance</span> through our website.
            By using our website or placing an order, you agree to the terms outlined in this policy.
          </motion.p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.7 }}
                className="border-l-2 border-[#d4af37]/30 pl-6"
              >
                <h2 className="font-serif text-xl text-white mb-4">{section.title}</h2>
                <p className="text-white/60 leading-relaxed whitespace-pre-line text-sm">{section.content}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-16 bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 rounded-sm p-8 text-center"
          >
            <p className="text-white/70 mb-2">Questions about your privacy?</p>
            <p className="text-white/40 text-sm mb-5">We are here to help and answer any concerns.</p>
            <a
              href="mailto:contact@hamafragrance.tn"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black font-medium tracking-wide hover:opacity-90 transition-opacity"
            >
              contact@hamafragrance.tn
            </a>
          </motion.div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
