import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  ArrowRight,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { authService } from '../services/authService';
import { supportedLanguages } from '../services/i18n';

export default function AuthModal({ isOpen, onClose, initialView = 'login', onAuthSuccess }) {
  const [view, setView] = useState(initialView); // 'login' | 'signup' | 'forgot' | 'reset' | 'profile'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login state
  const [loginIdent, setLoginIdent] = useState('citizen@haqdaar.in');
  const [loginPassword, setLoginPassword] = useState('Citizen@123');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupLang, setSignupLang] = useState('en');
  const [signupState, setSignupState] = useState('Bihar');
  const [signupCity, setSignupCity] = useState('Patna');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Forgot password state
  const [forgotIdent, setForgotIdent] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const user = await authService.login(loginIdent, loginPassword);
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Email/mobile or password is incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (signupPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service & Privacy Notice');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.signup({
        fullName: signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
        preferredLanguage: signupLang,
        state: signupState,
        city: signupCity
      });
      setSuccessMessage('Account created successfully!');
      setTimeout(() => {
        onAuthSuccess(user);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await authService.requestPasswordReset(forgotIdent);
      setSuccessMessage(`Reset code generated for demo: ${res.demoCode}`);
      setView('reset');
    } catch (err) {
      setErrorMessage(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPasswordWithCode(forgotIdent, resetCode, newPassword);
      setSuccessMessage('Password reset successfully! Please log in.');
      setTimeout(() => {
        setView('login');
        setLoginIdent(forgotIdent);
        setLoginPassword(newPassword);
        setSuccessMessage('');
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading">
              {view === 'login' && 'Citizen Sign In'}
              {view === 'signup' && 'Create Citizen Account'}
              {view === 'forgot' && 'Reset Password'}
              {view === 'reset' && 'Enter Verification Code'}
            </h3>
            <p className="text-xs text-slate-400">
              HaqDaar • Haq Se Sehat Tak
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. LOGIN VIEW */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
              💡 <strong>Demo Citizen Credentials Pre-filled:</strong><br />
              Email: <code className="text-white font-mono">citizen@haqdaar.in</code> | Pass: <code className="text-white font-mono">Citizen@123</code>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={loginIdent}
                  onChange={(e) => setLoginIdent(e.target.value)}
                  placeholder="name@example.com or 9876543210"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setView('forgot');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Sign In to Dashboard'}
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setView('signup');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Create one here
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGNUP VIEW */}
        {view === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-white/15 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@email.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-white/15 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-white/15 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  State
                </label>
                <select
                  value={signupState}
                  onChange={(e) => {
                    setSignupState(e.target.value);
                    setSignupCity(e.target.value === 'Bihar' ? 'Patna' : 'Bengaluru Urban');
                  }}
                  className="w-full py-2 px-2.5 bg-slate-950/60 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Bihar">Bihar</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Language
                </label>
                <select
                  value={signupLang}
                  onChange={(e) => setSignupLang(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-950/60 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label} ({l.native})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password * (Min 8 chars)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-3 pr-8 py-2 bg-slate-950/60 border border-white/15 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-3 pr-8 py-2 bg-slate-950/60 border border-white/15 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-slate-950 text-emerald-500 focus:ring-emerald-400"
                />
                <span>
                  I consent to HaqDaar's <strong className="text-white">Terms of Guidance</strong> and understand HaqDaar is an informational navigator, not a medical or official eligibility service.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreeTerms}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              {loading ? <RefreshCw size={15} className="animate-spin" /> : 'Create Citizen Account'}
            </button>

            <div className="text-center pt-1 text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD VIEW */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your registered email or mobile number. We'll send a secure 5-digit verification code to reset your password.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={forgotIdent}
                  onChange={(e) => setForgotIdent(e.target.value)}
                  placeholder="name@example.com or 9876543210"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Send Verification Code'}
            </button>

            <div className="text-center text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-slate-300 hover:text-white underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* 4. RESET PASSWORD VIEW */}
        {view === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              Demo Code: <strong className="font-mono text-white">14555</strong> (simulating SMS/Email OTP)
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Verification Code
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter 14555"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono tracking-wider"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Password (Min 8 characters)
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Reset Password & Log In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
