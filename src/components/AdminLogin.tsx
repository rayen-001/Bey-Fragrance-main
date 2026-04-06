import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { authApi } from '../lib/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBack }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authApi.signIn(formData.email, formData.password);

      if (!result.success) {
        setError(result.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Verify admin role from Supabase user_metadata
      const user = result.user;
      const role = user?.user_metadata?.role;

      if (role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        await authApi.signOut();
        setIsLoading(false);
        return;
      }

      // Store admin session marker
      localStorage.setItem('hama_fragrance_admin_session', JSON.stringify({
        email: formData.email,
        loginTime: new Date().toISOString(),
      }));

      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1510] to-[#000000] flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Card */}
        <div className="bg-gradient-to-b from-[#1a1510] to-[#0a0a0a] border border-[#d4af37]/20 rounded-sm p-8 shadow-2xl">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f0c952] flex items-center justify-center">
              <Shield size={36} className="text-black" />
            </div>
            <h1 className="font-serif text-3xl text-white mb-2">Admin Access</h1>
            <p className="text-white/60">Hama Fragrance Dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm"
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-white/70 text-sm mb-3">
                <User size={16} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@hamafragrance.com"
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-white/70 text-sm mb-3">
                <Lock size={16} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter admin password"
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm p-4">
              <p className="text-white/60 text-xs leading-relaxed">
                <span className="text-[#d4af37] font-medium">🔒 Secure Access:</span> This area is restricted to authorized administrators only. Authentication is powered by Supabase.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              {isLoading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-white/50 hover:text-white/70 transition-colors text-sm"
            >
              ← Back to Website
            </button>
          </div>

          {/* Decorative Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />
        </div>

        {/* Info Box */}
        <motion.div
          className="mt-6 bg-white/5 border border-white/10 rounded-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/40 text-xs text-center">
            Session expires after 24 hours of inactivity
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}