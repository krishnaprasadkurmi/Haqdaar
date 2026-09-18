import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  FileCheck, 
  PhoneCall, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Printer, 
  Clock, 
  HelpCircle,
  AlertTriangle,
  HeartHandshake,
  Bookmark,
  BookmarkCheck,
  Check,
  Info,
  Calendar
} from 'lucide-react';
import { storageService } from '../services/storageService';

export default function ResultsView({ result, currentUser }) {
  const [checkedDocs, setCheckedDocs] = useState({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [savedHospitalsMap, setSavedHospitalsMap] = useState({});

  const userId = currentUser ? currentUser.id : 'guest';

  useEffect(() => {
    if (result && result.params) {
      const savedChecks = storageService.getChecklistState(userId, result.params.condition || 'default');
      setCheckedDocs(savedChecks);

      // Refresh saved hospitals status
      const savedList = storageService.getSavedHospitals(userId);
      const map = {};
      savedList.forEach(h => { map[h.id] = true; });
      setSavedHospitalsMap(map);
    }
  }, [result, userId]);

  if (!result) return null;

  // 1. Handle Emergency Intercept (§09)
  if (result.status === 'EMERGENCY_INTERCEPTED') {
    return (
      <div className="max-w-4xl mx-auto px-4 mb-12 animate-fade-in">
        <div className="rounded-2xl border-2 border-red-500/80 bg-red-950/30 p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-red-500/20">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-red-600 text-white shrink-0 shadow-lg shadow-red-600/30 animate-pulse">
              <AlertTriangle size={32} />
            </div>
            <div>
              <span className="badge badge-saffron bg-red-500/20 text-red-300 border-red-500/40 mb-2">
                Emergency Priority Intercept (§09)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 font-heading">
                Life-Threatening Medical Emergency Detected
              </h3>
              <p className="text-slate-200 text-sm mb-4 leading-relaxed">
                {result.message}
              </p>

              {/* Emergency instructions card */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-red-500/30 text-red-200 text-xs leading-relaxed mb-5 whitespace-pre-line font-medium">
                {result.emergency_guidance}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="tel:108"
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm flex items-center gap-2 transition-all shadow-lg shadow-red-600/30"
                >
                  <PhoneCall size={16} />
                  <span>Call National Ambulance: 108</span>
                </a>
                <a
                  href="tel:112"
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center gap-2 border border-white/20 transition-all"
                >
                  <PhoneCall size={16} />
                  <span>Emergency Helpline: 112</span>
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-400">
                Notice: HaqDaar is an informational navigator, not an emergency service. Do not wait for scheme paperwork during active medical resuscitation.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Handle Medical Advice / Diagnosis Guardrail Intercept (§02)
  if (result.status === 'GUARDRAIL_INTERCEPTED') {
    return (
      <div className="max-w-4xl mx-auto px-4 mb-12 animate-fade-in">
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <AlertTriangle size={28} />
            </div>
            <div>
              <span className="badge badge-saffron mb-2">Navigational Boundary Enforced</span>
              <h3 className="text-xl font-bold text-white mb-2 font-heading">
                Medical Advice Guardrail Triggered
              </h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {result.message}
              </p>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-amber-200 text-xs leading-relaxed mb-4">
                <strong>Emergency Protocol:</strong> {result.emergency_guidance}
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:108"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall size={14} />
                  Emergency Ambulance: 108
                </a>
                <a
                  href="tel:14555"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall size={14} />
                  PM-JAY Scheme Helpline: 14555
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { schemes, hospitals, documents, instructions, params, verification } = result;

  const toggleDoc = (id) => {
    const updated = {
      ...checkedDocs,
      [id]: !checkedDocs[id]
    };
    setCheckedDocs(updated);
    storageService.saveChecklistState(userId, params?.condition || 'default', updated);
  };

  const toggleBookmark = (hosp) => {
    const isNowSaved = storageService.toggleSaveHospital(userId, hosp);
    setSavedHospitalsMap(prev => ({
      ...prev,
      [hosp.id]: isNowSaved
    }));
  };

  const copyChecklistToClipboard = () => {
    const text = documents
      .map((d, i) => `${i + 1}. ${d.name} (${d.type}): ${d.purpose}`)
      .join('\n');
    navigator.clipboard.writeText(
      `HaqDaar Health Scheme Checklist for ${params?.condition || 'Treatment'} in ${params?.state}:\n\n${text}\n\nScheme Helpline: 14555 (Toll-Free)`
    );
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mb-16 space-y-8 animate-slide-down print:space-y-4 print:text-black">
      {/* 1. Matched Scheme Card (§07 & §08) */}
      <section aria-labelledby="matched-schemes-title">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={22} />
            <h2 id="matched-schemes-title" className="text-xl sm:text-2xl font-bold text-white font-heading">
              1. Potentially Relevant Government Schemes
            </h2>
          </div>
          <span className="badge badge-emerald">
            {schemes?.length} Scheme{schemes?.length > 1 ? 's' : ''} Identified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes?.map((scheme, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 sm:p-6 border-emerald-500/30 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/90"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="badge badge-emerald text-xs font-bold">
                  {scheme.coverage_limit} Cashless
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {scheme.type}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white mb-2 font-heading">
                {scheme.name}
              </h3>

              {/* Explainable Reasoning (§08) */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 mb-3 leading-relaxed">
                <strong className="block text-emerald-400 mb-0.5">Why this appeared:</strong>
                {scheme.why_surfaced || scheme.eligibility_reason}
              </div>

              {/* Clinical Package Details */}
              {scheme.package_info && (
                <div className="space-y-1.5 mb-4 p-3 rounded-lg bg-slate-950/60 border border-white/10 text-xs">
                  <div className="font-semibold text-slate-300 flex items-center justify-between">
                    <span>Mapped Specialty: {scheme.package_info.specialty}</span>
                    <span className="text-[10px] text-amber-400 font-mono">Code: {scheme.package_info.package_code}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {scheme.package_info.package_details}
                  </p>
                </div>
              )}

              {/* Source & Freshness Badges (§08) */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Info size={12} className="text-slate-500" />
                  <span>Source: {scheme.source || 'NHA PM-JAY Registry'}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <Calendar size={11} />
                  <span>{scheme.freshness || 'Verified Active'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Empanelled Hospitals Card (§07 & §08) */}
      <section aria-labelledby="matched-hospitals-title">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-sky-400" size={22} />
            <h2 id="matched-hospitals-title" className="text-xl sm:text-2xl font-bold text-white font-heading">
              2. Empanelled Hospitals with Ayushman Mitra Desks
            </h2>
          </div>
          <span className="badge badge-blue">
            Top {hospitals?.length} Verified Facilities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hospitals?.map((hosp) => {
            const isSaved = !!savedHospitalsMap[hosp.id];
            return (
              <div
                key={hosp.id}
                className="glass-panel-interactive p-5 flex flex-col justify-between border-white/10 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`badge ${hosp.category?.includes('Public') ? 'badge-blue' : 'badge-saffron'} text-[10px]`}>
                      {hosp.category || hosp.hospital_type}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(hosp)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isSaved
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                      title={isSaved ? 'Saved to bookmarks' : 'Save hospital'}
                    >
                      {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 line-clamp-2 font-heading">
                    {hosp.name}
                  </h3>

                  <div className="flex items-start gap-1.5 text-xs text-slate-400 mb-2">
                    <MapPin size={13} className="text-slate-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{hosp.address}</span>
                  </div>

                  {/* Why surfaced */}
                  <p className="text-[11px] text-slate-300 mb-3 bg-white/5 p-2 rounded-lg leading-snug">
                    {hosp.why_surfaced}
                  </p>

                  {/* Ayushman Mitra (PMAM) Desk Details */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/20 text-[11px] text-slate-300 mb-3">
                    <span className="text-emerald-400 font-bold block mb-0.5 flex items-center gap-1">
                      <ShieldCheck size={12} /> Ayushman Mitra Help Desk:
                    </span>
                    {hosp.pmam_desk}
                  </div>
                </div>

                <div>
                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-400">{hosp.distance_est}</span>
                    <a
                      href={`tel:${hosp.helpline}`}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <PhoneCall size={12} />
                      {hosp.helpline}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Mandatory Document Checklist (§07 & §10) */}
      <section aria-labelledby="document-checklist-title">
        <div className="glass-panel p-6 sm:p-8 border-indigo-500/30 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <FileCheck className="text-indigo-400" size={24} />
              <div>
                <h2 id="document-checklist-title" className="text-xl sm:text-2xl font-bold text-white font-heading">
                  3. Personalized Document Checklist
                </h2>
                <p className="text-xs text-slate-400">
                  Carry these documents to the Ayushman Mitra desk before admission
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyChecklistToClipboard}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Copy size={13} />
                <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy Checklist'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer size={13} />
                <span>Print / Download PDF</span>
              </button>
            </div>
          </div>

          {/* Checklist items */}
          <div className="space-y-3 mb-6">
            {documents?.map((doc) => {
              const isDone = !!checkedDocs[doc.id];
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900/60 hover:bg-slate-800/60 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-white/30"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-sm font-bold ${isDone ? 'text-white line-through opacity-80' : 'text-white'}`}>
                        {doc.name}
                      </span>
                      <span className="badge badge-aws text-[10px] py-0">
                        {doc.type}
                      </span>
                      {doc.critical && (
                        <span className="badge badge-saffron text-[10px] py-0">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {doc.purpose}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Point of Care Instructions */}
          <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <HeartHandshake size={14} /> At The Hospital Entrance:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4 leading-relaxed">
              {instructions?.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Verification Safeguards & Next Steps (§08 & §11) */}
      <section aria-label="Actionable Steps and Helplines" className="glass-panel p-6 border-amber-500/30 bg-amber-950/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-saffron">Safe Next Step</span>
            <span className="text-xs text-slate-400">Official Verification Required (§08)</span>
          </div>
          <h3 className="text-lg font-bold text-white font-heading">
            Verify details with PM-JAY Helpline 14555 before visiting
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            HaqDaar maps publicly available rules and hospital directories. Final admission and cashless pre-authorization are granted strictly by hospital authorities after physical biometric e-KYC.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:14555"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <PhoneCall size={16} />
            <span>Call 14555 (Free 24x7)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
