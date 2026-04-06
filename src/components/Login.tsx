import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { authApi } from '../lib/api';

interface LoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onSwitchToSignUp: () => void;
  onAdminLogin?: () => void;
  onForgotPassword?: () => void;
}

export default function Login({ onClose, onLoginSuccess, onSwitchToSignUp, onAdminLogin, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🔐 Login Attempt:', { email });

    try {
      // Sign in with Supabase
      const result = await authApi.signIn(email, password);
      
      if (!result.success) {
        console.log('❌ Login failed:', result.error);
        setError(result.error || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      console.log('✅ User authenticated successfully!');

      // Check if user is admin
      const adminCheck = await authApi.isAdmin();
      
      if (adminCheck.isAdmin) {
        console.log('👑 Admin detected! Role:', adminCheck.user?.role);
        
        // Store admin session marker for persistence (matches AdminLogin.tsx)
        localStorage.setItem('hama_fragrance_admin_session', JSON.stringify({
          email: email,
          loginTime: new Date().toISOString(),
        }));

        if (onAdminLogin) {
          onAdminLogin();
          onClose();
        }
      } else {
        console.log('✅ Regular user login successful!');
        onLoginSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
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
        className="relative w-full max-w-md bg-gradient-to-b from-[#1a1510] to-[#0a0a0a] border border-[#d4af37]/20 rounded-sm p-8 shadow-2xl"
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
            <LogIn size={28} className="text-black" />
          </div>
          <h2 className="font-serif text-3xl text-white mb-2">Welcome Back</h2>
          <p className="text-white/60">Sign in to your account</p>
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
          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
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

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-[#d4af37] text-sm hover:underline"
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
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

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-white/60 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-[#d4af37] hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />
      </motion.div>
    </div>
  );
}