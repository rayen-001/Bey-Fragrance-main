import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Lock, Eye, EyeOff, User, Phone, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { authApi } from '../lib/api';
import { SignUpData } from '../lib/auth';

interface SignUpProps {
  onClose: () => void;
  onSignUpSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function SignUp({ onClose, onSignUpSuccess, onSwitchToLogin }: SignUpProps) {
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    // Use the real API instead of mock auth
    authApi.signUp(formData.email, formData.password, formData.name)
      .then((result) => {
        if (result.success) {
          onSignUpSuccess();
          onClose();
        } else {
          setError(result.error || 'Sign up failed');
        }
      })
      .catch((err) => {
        setError(err.message || 'Sign up failed');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-md bg-gradient-to-b from-[#1a1510] to-[#0a0a0a] border border-[#d4af37]/20 rounded-sm p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Close Button */}
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClose(); }}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f0c952] flex items-center justify-center">
            <UserPlus size={28} className="text-black" />
          </div>
          <h2 className="font-serif text-3xl text-white mb-2">Create Account</h2>
          <p className="text-white/60">Join our exclusive fragrance community</p>
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
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ahmed Ben Ali"
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
              <Phone size={16} />
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+216 XX XXX XXX"
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
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
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <div>
            <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
              <Lock size={16} />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                required
                placeholder="Confirm your password"
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1"
            />
            <label htmlFor="terms" className="text-white/60 text-sm">
              I agree to the{' '}
              <button type="button" className="text-[#d4af37] hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-[#d4af37] hover:underline">
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-[#0a0a0a] text-white/40">OR</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-white/60 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#d4af37] hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />
      </motion.div>
    </div>
  );
}
