import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Sparkles, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { dbService } from '../../lib/supabase';
import { useSettings } from '../../context/SettingsContext';

export default function AdminLoginPage() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const brandName = settings?.business_name || 'Lotus Luxe Spa';

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await dbService.resetAdminPassword(forgotEmail.trim());
      setForgotSuccess(true);
    } catch (err) {
      alert(err.message || 'Failed to dispatch password recovery email.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await dbService.loginAdmin(email.trim(), password);
      const redirectPath = location.state?.from?.pathname || '/admin';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@lotusluxespa.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-stone-100 selection:bg-gold-500 selection:text-black">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Back to website button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-gold-300 transition-colors bg-stone-900/80 px-3.5 py-2 rounded-full border border-stone-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Live Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Inscription */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 border border-gold-500/40 text-gold-400 mx-auto flex items-center justify-center shadow-gold mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
            {brandName}
          </h2>
          <p className="text-xs uppercase tracking-widest text-gold-400/90 font-semibold mt-1">
            Commercial Management Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#0e121c] border border-gold-500/30 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@spa.com"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl pl-10 pr-3.5 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSuccess(false);
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl pl-10 pr-3.5 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-stone-950 font-semibold text-sm shadow-gold hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-stone-800 text-center">
            <span className="text-[11px] text-stone-500 block mb-2">
              Evaluating or Testing as Buyer?
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 underline"
            >
              Autofill Demo Admin Credentials (admin@lotusluxespa.com / admin123)
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-stone-500 font-light flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Role-Based Access Control • Supabase Auth Guarded</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e121c] border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gold-400" />
              <span>Reset Admin Password</span>
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Enter the administrator email associated with your spa account. When Supabase Authentication is connected, a secure password recovery token will be delivered to your inbox.
            </p>

            {forgotSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Password Reset Instructions Dispatched</span>
                </div>
                <p className="text-stone-300 font-light">
                  If an admin account exists for <strong>{forgotEmail}</strong>, an authentication reset link will arrive shortly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold text-xs hover:bg-emerald-500/30"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@lotusluxespa.com"
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-semibold text-xs shadow-gold hover:brightness-105 disabled:opacity-50"
                  >
                    {forgotLoading ? 'Processing...' : 'Send Recovery Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

