import { motion } from 'motion/react';
import { FileText } from 'lucide-react';
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
    title: '1. Acceptance of Terms',
    content: `By accessing the Hama Fragrance website or placing an order, you confirm that you have read, understood, and agreed to these Terms of Service. If you do not agree, please do not use our website or services.

We reserve the right to update these terms at any time. Continued use of our services after updates constitutes your acceptance of the revised terms.`,
  },
  {
    title: '2. Products & Descriptions',
    content: `All Hama Fragrance products are creative fragrance interpretations. We clearly state which designer or niche fragrance each product is inspired by. These are our own independent formulations — not counterfeit or replica products.

We make every effort to accurately describe our products, including notes, concentration, and presentation. However, fragrance perception is subjective and may vary between individuals.`,
  },
  {
    title: '3. Pricing',
    content: `All prices are listed in Tunisian Dinars (TND) and are inclusive of any applicable taxes. Shipping fees are calculated at checkout based on your delivery location.

We reserve the right to change prices at any time without prior notice. However, orders placed before a price change will be honored at the price displayed at the time of ordering.`,
  },
  {
    title: '4. Orders & Payment',
    content: `By placing an order, you are making a binding offer to purchase the selected products. Your order is confirmed once you receive a confirmation message from our team.

Currently, we accept Cash on Delivery (COD) only. The total amount displayed at checkout — including shipping — is the amount you pay upon delivery.

We reserve the right to cancel or refuse an order at our discretion, including cases of suspected fraud, incomplete information, or out-of-stock items. You will be notified promptly in such cases.`,
  },
  {
    title: '5. Delivery',
    content: `Delivery times are estimates and not guaranteed. Hama Fragrance is not liable for delays caused by third-party couriers, force majeure events, or incorrect address information provided by the customer.

It is the customer's responsibility to ensure someone is available to receive the package at the provided address. Unclaimed packages may incur additional fees.`,
  },
  {
    title: '6. Returns & Refunds',
    content: `Returns are accepted within 7 days for sealed, unused products. Please refer to our Returns & Exchanges page for the full policy and procedure.

Refunds, when approved, are issued within 5 business days of receiving and inspecting the returned item. We reserve the right to refuse returns that do not meet our stated conditions.`,
  },
  {
    title: '7. Intellectual Property',
    content: `All content on the Hama Fragrance website — including text, images, logos, and design — is the exclusive property of Hama Fragrance. You may not copy, reproduce, distribute, or use any content without prior written permission.

The names of designer fragrances referenced as inspirations are trademarks of their respective owners. Hama Fragrance has no affiliation with those brands.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `Hama Fragrance shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability in any case shall not exceed the value of the specific order in question.

We are not responsible for allergic reactions to fragrance ingredients. Customers with known sensitivities should review ingredient information or contact us before purchasing.`,
  },
  {
    title: '9. Governing Law',
    content: `These Terms of Service are governed by the laws of Tunisia. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of Tunisian courts.`,
  },
  {
    title: '10. Contact',
    content: `For any questions regarding these Terms of Service, contact us at:

Email: contact@hamafragrance.tn
Phone: +216 22 592 856

Last updated: April 2026`,
  },
];

export default function TermsOfService({ onNavigate, cartItemsCount, onCartOpen, currentUser, onLoginClick, onAccountClick, onAdminClick, isAdmin, onLogout }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation
        onNavigate={onNavigate}
        currentPage="terms"
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
              <FileText size={48} className="text-[#d4af37] mx-auto mb-6" />
              <h1 className="font-serif text-5xl lg:text-6xl text-white mb-4">Terms of Service</h1>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
                Please read these terms carefully before using Hama Fragrance services.
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
            These Terms of Service ("Terms") govern your use of the <span className="text-[#d4af37]">Hama Fragrance</span> website
            and all purchases made through it. These terms apply to all visitors, users, and customers.
          </motion.p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05, duration: 0.7 }}
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
            <p className="text-white/70 mb-2">Questions about our terms?</p>
            <p className="text-white/40 text-sm mb-5">We're happy to clarify anything.</p>
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
