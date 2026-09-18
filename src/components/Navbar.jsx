import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cloud, 
  CheckSquare, 
  Sparkles, 
  PhoneCall, 
  User, 
  LogIn, 
  LogOut, 
  Globe, 
  Sliders,
  ChevronDown
} from 'lucide-react';
import { supportedLanguages, getTranslation } from '../services/i18n';

export default function Navbar({
  mode = 'citizen', // 'citizen' | 'demo'
  onToggleMode,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenAwsModal,
  onOpenChecklistModal,
  lang = 'en',
  onLanguageChange
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <nav className="border-b border-white/10 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-heading">
                HaqDaar
              </span>
              <span className="badge badge-emerald text-[11px] py-0.5">
                <Sparkles size={11} /> Agentic AI
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
              {getTranslation(lang, 'tagline')} • {getTranslation(lang, 'brandSubtitle')}
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (§13) */}
        <div className="flex items-center bg-slate-900 border border-white/15 p-1 rounded-xl">
          <button
            onClick={() => onToggleMode('citizen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'citizen'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User size={13} />
            <span>Citizen Mode</span>
          </button>
          <button
            onClick={() => onToggleMode('demo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'demo'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders size={13} />
            <span>Judge / Demo Mode</span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Selector Dropdown (§10) */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
              title="Change language"
            >
              <Globe size={14} className="text-emerald-400" />
              <span className="uppercase font-mono font-bold text-[11px]">{lang}</span>
              <ChevronDown size={12} />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-slate-900 border border-white/15 rounded-xl shadow-2xl py-1 z-50 animate-slide-down">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 ${
                      lang === l.code ? 'text-emerald-400 font-bold bg-white/5' : 'text-slate-300'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] text-slate-500">{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Demo/Judge Proof buttons */}
          {mode === 'demo' && (
            <>
              <button
                onClick={onOpenAwsModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all shadow-sm shadow-indigo-500/10"
                title="Inspect Bedrock Agent, DynamoDB tables, and live CloudWatch logs"
              >
                <Cloud size={14} className="text-indigo-400" />
                <span className="hidden md:inline">AWS Console & Proof</span>
              </button>

              <button
                onClick={onOpenChecklistModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-all"
                title="Pre-Submit Checklist per §07"
              >
                <CheckSquare size={14} className="text-emerald-400" />
                <span className="hidden lg:inline">Pre-Submit Checklist</span>
              </button>
            </>
          )}

          {/* Authentication Badge / Button (§03 & §04) */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-white/15">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <User size={13} />
                <span className="hidden sm:inline">{currentUser.fullName.split(' ')[0]}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                title={getTranslation(lang, 'btnSignOut')}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-1 border-l border-white/15">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
              >
                <LogIn size={13} />
                <span>{getTranslation(lang, 'btnSignIn')}</span>
              </button>
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-sm transition-all hidden sm:inline-block"
              >
                {getTranslation(lang, 'btnGetStarted')}
              </button>
            </div>
          )}

          {/* Emergency Helpline */}
          <a
            href="tel:14555"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            title="PM-JAY Toll-free Helpline"
          >
            <PhoneCall size={13} />
            <span>14555</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
