import { motion } from 'motion/react';
import { Navigation } from './ui/Navigation';
import { Button } from './ui/button';
import { Footer } from './ui/Footer';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface StoryProps {
  onNavigate: (page: 'home' | 'story' | 'shop' | 'admin') => void;
  cartItemsCount?: number;
  onCartOpen?: () => void;
  currentUser?: { id: string; name: string; email: string } | null;
  onLoginClick?: () => void;
  onAccountClick?: () => void;
  onAdminClick?: () => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export default function Story({ onNavigate, cartItemsCount, onCartOpen, currentUser, onLoginClick, onAccountClick, onAdminClick, isAdmin, onLogout }: StoryProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation
        onNavigate={onNavigate}
        currentPage="story"
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
        {/* Hero Section */}
        <motion.div
          className="relative h-[60vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a] z-10" />
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBwb3J0cmFpdCUyMGZhc2hpb258ZW58MXx8fHwxNzcwMTE5ODY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Founder Portrait"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <motion.h1
              className="font-serif text-5xl lg:text-7xl text-white text-center px-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              The Story Behind Hama Fragrance
            </motion.h1>
          </div>
        </motion.div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Section 1 */}
            <div className="border-l-2 border-[#d4af37] pl-8">
              <h2 className="font-serif text-3xl text-white mb-6">
                Born from Passion, Built on Scent
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                Hama Fragrance was born from a deep love for perfumery and the belief that every person
                deserves a signature scent — one that tells their story before they speak a word.
                What started as a personal obsession with rare oils and fine accords grew into something
                much bigger: a luxury fragrance house rooted in authenticity.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                Every bottle carries a piece of that original passion — the restless search for the perfect
                balance between boldness and elegance, between the familiar and the unforgettable.
              </p>
            </div>

            {/* Section 2 */}
            <div className="border-l-2 border-[#d4af37] pl-8">
              <h2 className="font-serif text-3xl text-white mb-6">
                Inspired by the Maghreb and the World
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                Our roots run deep in North African culture — the warm amber of a desert evening, the
                spiced souks of Algiers, the sweet smoke of oud rising through old medina alleyways.
                These are not just memories; they are raw materials.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                Blended with influences from Paris, Istanbul, Dubai, and beyond, every Hama fragrance
                bridges worlds — connecting the richness of the East with the refinement of the West
                into something entirely its own.
              </p>
            </div>

            {/* Section 3 */}
            <div className="border-l-2 border-[#d4af37] pl-8">
              <h2 className="font-serif text-3xl text-white mb-6">
                Craftsmanship Without Compromise
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                At Hama Fragrance, we do not cut corners. Every formula is hand-selected from the finest
                ingredients — raw materials sourced with integrity, blended with precision, and bottled
                with care. We offer inspired-by interpretations of the world's most iconic fragrances,
                making luxury accessible without sacrificing quality.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                This is not imitation — it is interpretation. Each scent is our own take on a classic,
                reimagined through the lens of Hama's identity and values.
              </p>
            </div>

            {/* Section 4 — Quote */}
            <div className="bg-gradient-to-br from-[#d4af37]/10 to-transparent p-10 rounded-sm border border-[#d4af37]/20">
              <p className="font-serif text-2xl text-white/90 mb-6 italic leading-relaxed">
                "A great fragrance is not worn — it is lived in. It follows you, speaks for you,
                and stays long after you have gone. That is what we create at Hama Fragrance."
              </p>
              <p className="text-[#d4af37] tracking-wider">— Founder, Hama Fragrance</p>
            </div>

            {/* CTA */}
            <div className="text-center pt-12">
              <Button variant="primary" onClick={() => onNavigate('shop')}>
                Explore Our Collection
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}