import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { navigate } = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your email or username.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login({ email: email.trim(), password });
      setSuccess(data.message || 'Authenticated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal bg-grid-pattern text-ivory flex flex-col justify-between py-10 px-6 sm:px-8 relative overflow-hidden selection:bg-bronze selection:text-charcoal-dark">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-warm-radial pointer-events-none" />

      {/* Top Header / Back Nav */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between z-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-ivory-dim hover:text-bronze transition-colors py-2 px-3 rounded-lg bg-warmblack/60 border border-warmblack-border hover:border-bronze/40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-olive-light animate-pulse" />
          <span className="text-[11px] font-mono text-olive-light">Flask Auth Active</span>
        </div>
      </div>

      {/* Central Login Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 pt-4 pb-8">
        <div className="rounded-2xl bg-warmblack/90 border border-warmblack-border p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative">
          {/* Subtle bronze top accent bar */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-bronze to-transparent opacity-60" />

          {/* Brand Emblem */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-charcoal border border-bronze/40 flex items-center justify-center text-bronze shadow-lg shadow-bronze/10 mb-3.5">
              <svg
                className="w-6 h-6 text-bronze"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-tight">
              Sign In to PriceOptima
            </h2>
            <p className="text-xs sm:text-sm text-ivory-dim mt-1.5 font-light">
              Enter your credentials to access your multi-tenant pricing catalog.
            </p>
          </div>

          {/* Alert Banners */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-warmblack-dark border border-red-900/50 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-warmblack-dark border border-olive/60 text-olive-light text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-olive-light" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username Input */}
            <div>
              <label className="block text-xs font-mono text-ivory-muted uppercase tracking-wider mb-1.5">
                Email Address or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ivory-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com or username"
                  className="w-full bg-charcoal border border-warmblack-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ivory placeholder-ivory-muted/40 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/30 transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-ivory-muted uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-ivory-muted/60 font-mono">
                  PBKDF2 Secured
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ivory-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-charcoal border border-warmblack-border rounded-xl pl-10 pr-11 py-2.5 text-sm text-ivory placeholder-ivory-muted/40 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/30 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ivory-muted hover:text-bronze transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-bronze text-charcoal font-semibold text-sm hover:bg-bronze-light transition-all shadow-lg hover:shadow-bronze/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Catalog</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-warmblack-border/60 text-center text-xs text-ivory-dim font-light">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-bronze hover:text-bronze-light font-medium underline underline-offset-4 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] font-mono text-ivory-muted/60 z-10 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
        <span>Multi-Tenant MySQL Database Isolation &bull; PBKDF2 Hashed</span>
      </div>
    </div>
  );
}

