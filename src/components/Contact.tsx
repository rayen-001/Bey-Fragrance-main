import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Navigation } from './ui/Navigation';
import { Footer } from './ui/Footer';
import { Button } from './ui/button';

interface ContactProps {
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

export default function Contact({
  onNavigate,
  cartItemsCount,
  onCartOpen,
  currentUser,
  onLoginClick,
  onAccountClick,
  onAdminClick,
  isAdmin,
  onLogout
}: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Console log the data to verify state management prior to connecting a real backend endpoint.
    console.log("Contact Form Submitted:", formData);
    
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation 
        onNavigate={onNavigate}
        currentPage="contact"
        cartItemsCount={cartItemsCount}
        onCartOpen={onCartOpen}
        currentUser={currentUser}
        onLoginClick={onLoginClick}
        onAccountClick={onAccountClick}
        onAdminClick={onAdminClick}
        onLogout={onLogout}
        isAdmin={isAdmin}
      />
      
      <div className="pt-24 pb-16 px-6 lg:px-12 max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl text-white mb-4">Contact Us</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Have a question about our fragrances or an existing order? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          className="bg-white/5 border border-white/10 rounded-sm p-8 lg:p-12 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {isSuccess ? (
            <div className="text-center py-12">
              <h2 className="font-serif text-3xl text-[#d4af37] mb-4">Message Sent</h2>
              <p className="text-white/70">Thank you for reaching out. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-white/70">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-white/70">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm text-white/70">Subject</label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-white/70">Message</label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50 transition-colors resize-none"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full mt-8">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
