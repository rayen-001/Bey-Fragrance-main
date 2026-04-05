import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { authApi } from '../lib/api';

interface ResetPasswordProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ResetPassword({ onSuccess, onCancel }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check password strength
  useEffect(() => {
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (newPassword.match(/[a-z]/) && newPassword.match(/[A-Z]/)) strength++;
    if (newPassword.match(/[0-9]/)) strength++;
    if (newPassword.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newPassword || !confirmPassword) {
      setStatus('error');
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setStatus('error');
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const result = await authApi.updatePassword(newPassword);
      
      if (result.success) {
        setStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to reset password');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-amber-200/50"
      >
        {/* Success State */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-3xl font-serif text-stone-800 mb-3">
                Password Reset!
              </h2>
              <p className="text-stone-600 mb-6">
                Your password has been successfully updated.
                <br />
                You can now login with your new password.
              </p>

              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-serif text-stone-800 mb-2">
                  Reset Password
                </h2>
                <p className="text-stone-600 text-sm">
                  Enter your new password below
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-stone-700 font-medium mb-2 text-sm">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= passwordStrength ? strengthColor[passwordStrength] : 'bg-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${passwordStrength >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
                        Password strength: {strengthText[passwordStrength]}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-stone-700 font-medium mb-2 text-sm">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Match Indicator */}
                  {confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-xs mt-1 ${
                        newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </motion.p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-stone-700">
                  <p className="font-semibold mb-2">Password must contain:</p>
                  <ul className="space-y-1">
                    <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                      {newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                    </li>
                    <li className={newPassword.match(/[a-z]/) && newPassword.match(/[A-Z]/) ? 'text-green-600' : ''}>
                      {newPassword.match(/[a-z]/) && newPassword.match(/[A-Z]/) ? '✓' : '○'} Uppercase & lowercase letters
                    </li>
                    <li className={newPassword.match(/[0-9]/) ? 'text-green-600' : ''}>
                      {newPassword.match(/[0-9]/) ? '✓' : '○'} At least one number
                    </li>
                  </ul>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 py-3 rounded-lg transition-all duration-300 font-medium"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || newPassword !== confirmPassword || passwordStrength < 2}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Updating...
                      </span>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
