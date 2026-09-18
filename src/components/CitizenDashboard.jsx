import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  History, 
  Bookmark, 
  FileText, 
  User, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  Building2, 
  Printer, 
  ExternalLink, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Trash2
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { getTranslation, supportedLanguages } from '../services/i18n';

export default function CitizenDashboard({
  currentUser,
  activeTab = 'home',
  setActiveTab,
  onStartNewSearch,
  onSelectSavedSearch,
  lang = 'en',
  onLanguageChange
}) {
  const [searches, setSearches] = useState([]);
  const [savedHospitals, setSavedHospitals] = useState([]);
  const [profileName, setProfileName] = useState(currentUser?.fullName || '');
  const [profileState, setProfileState] = useState(currentUser?.state || 'Bihar');
  const [profileCity, setProfileCity] = useState(currentUser?.city || 'Patna');
  const [profileMsg, setProfileMsg] = useState('');

  const userId = currentUser ? currentUser.id : 'guest';

  const loadUserData = () => {
    setSearches(storageService.getSearches(userId));
    setSavedHospitals(storageService.getSavedHospitals(userId));
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const handleClearHistory = () => {
    if (window.confirm('Clear all search history?')) {
      storageService.clearSearches(userId);
      setSearches([]);
    }
  };

  const handleRemoveSavedHospital = (hospitalId) => {
    storageService.toggleSaveHospital(userId, { id: hospitalId });
    setSavedHospitals(storageService.getSavedHospitals(userId));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (currentUser) {
      authService.updateProfile(currentUser.id, {
        fullName: profileName,
        state: profileState,
        city: profileCity
      });
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mb-14">
      {/* Sub Navigation Bar for Citizen Mode (§05) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/10 text-xs font-semibold scrollbar-thin">
        {[
          { id: 'home', label: getTranslation(lang, 'navHome'), icon: Home },
          { id: 'search', label: getTranslation(lang, 'navFindSupport'), icon: Search },
          { id: 'history', label: getTranslation(lang, 'navMySearches'), icon: History, badge: searches.length },
          { id: 'hospitals', label: getTranslation(lang, 'navSavedHospitals'), icon: Bookmark, badge: savedHospitals.length },
          { id: 'documents', label: getTranslation(lang, 'navDocuments'), icon: FileText },
          { id: 'profile', label: getTranslation(lang, 'navProfile'), icon: User },
          { id: 'help', label: getTranslation(lang, 'navHelp'), icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/30 text-emerald-300 font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. HOME TAB */}
      {activeTab === 'home' && (
        <div className="space-y-6 animate-fade-in">
          {/* Welcome Card (§05) */}
          <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-950/80 relative overflow-hidden backdrop-blur-md">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                <Sparkles size={13} />
                <span>Namaste, {currentUser ? currentUser.fullName : 'Citizen'}!</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mb-2 leading-tight">
                {getTranslation(lang, 'heroHeadline')}
              </h2>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                {getTranslation(lang, 'heroDesc')}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Search size={16} />
                  <span>Tell HaqDaar What You Need</span>
                </button>
                <a
                  href="tel:14555"
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <PhoneCall size={16} className="text-emerald-400" />
                  <span>Toll-Free Helpline: 14555</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setActiveTab('search');
                onStartNewSearch('Which government health scheme provides free treatment in Bihar or Karnataka?');
              }}
              className="p-5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/70 hover:border-emerald-500/40 text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <div className="text-sm font-bold text-white mb-1">Find a Scheme</div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Discover Ayushman Bharat PM-JAY, MMJAY Bihar, and Arogya Karnataka.
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('search');
                onStartNewSearch('Find empanelled hospitals for dialysis or heart surgery in Patna or Bengaluru');
              }}
              className="p-5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/70 hover:border-teal-500/40 text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 size={20} />
              </div>
              <div className="text-sm font-bold text-white mb-1">Find a Hospital</div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Locate verified empanelled public & private hospitals with Ayushman Mitra helpdesks.
              </div>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className="p-5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/70 hover:border-amber-500/40 text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <FileText size={20} />
              </div>
              <div className="text-sm font-bold text-white mb-1">Document Checklist</div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Prepare your Aadhaar, Ration Card, and medical prescriptions before admission.
              </div>
            </button>
          </div>

          {/* Emergency Guidance Banner (§09) */}
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div className="text-slate-300">
                <strong className="text-white block sm:inline">In case of life-threatening medical emergency: </strong>
                Call 108 or 112 immediately. Emergency casualty care is prioritized without delay.
              </div>
            </div>
            <a
              href="tel:108"
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs whitespace-nowrap shrink-0 transition-colors"
            >
              Ambulance: 108
            </a>
          </div>
        </div>
      )}

      {/* 2. SEARCH TAB */}
      {activeTab === 'search' && (
        <div className="animate-fade-in">
          {/* Conversational search component is rendered directly in App.jsx */}
          <div className="text-center py-4 text-xs text-slate-400">
            Tell HaqDaar your situation below to run a complete conversational search.
          </div>
        </div>
      )}

      {/* 3. RECENT SEARCHES (HISTORY) TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                {getTranslation(lang, 'navMySearches')}
              </h3>
              <p className="text-xs text-slate-400">
                Your past navigation queries and extracted findings
              </p>
            </div>
            {searches.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {searches.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-white/10 bg-slate-900/40 text-slate-400 text-sm">
              <History size={36} className="mx-auto text-slate-600 mb-3" />
              <p>{getTranslation(lang, 'emptyHistory')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {searches.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-white/10 bg-slate-900/70 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge badge-emerald text-[10px]">
                        {s.condition || 'General'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(s.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">
                      {s.query}
                    </p>
                    <div className="text-xs text-slate-400">
                      Location: {s.district}, {s.state} • Income Category: {s.incomeCategory}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectSavedSearch(s)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <span>Re-open Results</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. SAVED HOSPITALS TAB */}
      {activeTab === 'hospitals' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              {getTranslation(lang, 'navSavedHospitals')}
            </h3>
            <p className="text-xs text-slate-400">
              Empanelled facilities bookmarked for quick contact and admission
            </p>
          </div>

          {savedHospitals.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-white/10 bg-slate-900/40 text-slate-400 text-sm">
              <Bookmark size={36} className="mx-auto text-slate-600 mb-3" />
              <p>{getTranslation(lang, 'emptyHospitals')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedHospitals.map((h) => (
                <div
                  key={h.id}
                  className="p-5 rounded-xl border border-emerald-500/30 bg-slate-900/80 relative"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="badge badge-emerald text-[10px] mb-1">
                        {h.category || 'Empanelled Hospital'}
                      </span>
                      <h4 className="text-base font-bold text-white">{h.name}</h4>
                    </div>
                    <button
                      onClick={() => handleRemoveSavedHospital(h.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">{h.address}</p>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-300 mb-3">
                    <strong className="text-emerald-400">Desk:</strong> {h.pmam_desk}
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                    <a
                      href={`tel:${h.helpline || '14555'}`}
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <PhoneCall size={12} /> {h.helpline || '14555'}
                    </a>
                    <span className="text-slate-400 text-[11px]">{h.distance_est}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Standard Statutory Document Checklist
              </h3>
              <p className="text-xs text-slate-400">
                Documents needed for cashless admission under PM-JAY & State Schemes
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer size={14} />
              <span>Print / Download PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Aadhaar Card (Original + 2 Photocopies)',
                type: 'Mandatory Photo Identity',
                desc: 'Required for patient and family head for biometric e-KYC authentication on the NHA TMS portal.'
              },
              {
                name: 'Ration Card / Ayushman Golden Card',
                type: 'Eligibility Certificate',
                desc: 'BPL / Antyodaya (AAY) / Priority Household (PHH) ration card, or 14-digit PM-JAY Family ID letter.'
              },
              {
                name: 'Doctor Prescription & Diagnostic Lab Reports',
                type: 'Clinical Referral',
                desc: 'Government or registered hospital prescription with clinical findings (e.g. Creatinine for dialysis, Echo for cardiac).'
              },
              {
                name: '2 Passport Size Photographs',
                type: 'Hospital Registration',
                desc: 'Required for indoor bed ticket registration and paper chart maintenance.'
              }
            ].map((doc, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-white/10 bg-slate-900/60 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <span className="badge badge-emerald text-[10px] mb-1">{doc.type}</span>
                  <h4 className="text-sm font-bold text-white mb-1">{doc.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300">
            <strong className="text-emerald-400 block mb-1">Important Admission Rule:</strong>
            Proceed directly to the <strong className="text-white">Pradhan Mantri Arogya Mitra (PMAM) Help Desk</strong> in the hospital lobby before paying any counter fees. All diagnostics, medicines, bed charges, and food are 100% cashless under PM-JAY.
          </div>
        </div>
      )}

      {/* 6. PROFILE & PREFERENCES TAB */}
      {activeTab === 'profile' && (
        <div className="max-w-xl space-y-4 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              Citizen Profile & Preferences
            </h3>
            <p className="text-xs text-slate-400">
              Manage your personal location and language settings
            </p>
          </div>

          {profileMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{profileMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="glass-panel p-5 space-y-4 border-white/10">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                <select
                  value={profileState}
                  onChange={(e) => {
                    setProfileState(e.target.value);
                    setProfileCity(e.target.value === 'Bihar' ? 'Patna' : 'Bengaluru Urban');
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Bihar">Bihar</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City / District</label>
                <select
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  {profileState === 'Bihar' ? (
                    <>
                      <option value="Patna">Patna</option>
                      <option value="Gaya">Gaya</option>
                      <option value="Muzaffarpur">Muzaffarpur</option>
                    </>
                  ) : (
                    <>
                      <option value="Bengaluru Urban">Bengaluru Urban</option>
                      <option value="Mysuru">Mysuru</option>
                      <option value="Hubballi">Hubballi</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Response Language</label>
              <select
                value={lang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label} ({l.native})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Save Profile Preferences
            </button>
          </form>
        </div>
      )}

      {/* 7. HELP & TRUST TAB */}
      {activeTab === 'help' && (
        <div className="space-y-4 animate-fade-in max-w-3xl">
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              Help, Trust & Safety Guidelines
            </h3>
            <p className="text-xs text-slate-400">
              Understanding HaqDaar's navigational role and official verification safeguards
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-slate-900/80">
              <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                What is HaqDaar?
              </h4>
              <p>
                HaqDaar is an agentic AI navigational assistant that helps citizens identify which government health schemes they might qualify for, which empanelled hospitals treat their condition, and what documents they need to prepare.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-slate-900/80">
              <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-400" />
                Important Disclaimers (§02 & §08)
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li>HaqDaar does <strong>not</strong> provide medical diagnoses, treatment plans, or drug prescriptions.</li>
                <li>HaqDaar does <strong>not</strong> make official eligibility or cashless authorization decisions.</li>
                <li>All scheme benefits require biometric e-KYC and clinical approval at the hospital Ayushman Mitra desk.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-slate-900/80">
              <h4 className="font-bold text-white text-sm mb-1">Official National Helplines</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div className="p-2.5 rounded bg-slate-950 border border-white/5">
                  <div className="text-[11px] text-slate-400">Ayushman Bharat (PM-JAY)</div>
                  <a href="tel:14555" className="text-emerald-400 font-bold text-sm">14555 (Toll-Free 24x7)</a>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-white/5">
                  <div className="text-[11px] text-slate-400">National Ambulance Emergency</div>
                  <a href="tel:108" className="text-red-400 font-bold text-sm">108 (24x7)</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
