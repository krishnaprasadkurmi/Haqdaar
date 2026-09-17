import React, { useState } from 'react';
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
  HeartHandshake
} from 'lucide-react';

export default function ResultsView({ result }) {
  const [checkedDocs, setCheckedDocs] = useState({});
  const [copySuccess, setCopySuccess] = useState(false);

  if (!result) return null;

  // Handle Guardrail Interception
  if (result.status === 'GUARDRAIL_INTERCEPTED') {
    return (
      <div className="max-w-4xl mx-auto px-4 mb-12">
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

  const { schemes, hospitals, documents, instructions, params } = result;

  const toggleDoc = (id) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyChecklistToClipboard = () => {
    const text = documents
      .map((d, i) => `${i + 1}. ${d.name} (${d.type}): ${d.purpose}`)
      .join('\n');
    navigator.clipboard.writeText(
      `HaqDaar Health Scheme Checklist for ${params.condition || 'Treatment'} in ${params.state}:\n\n${text}\n\nScheme Helpline: 14555 (Toll-Free)`
    );
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const completedDocCount = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto px-4 mb-16 space-y-8 animate-slide-down">
      {/* 1. Matched Scheme Card */}
      <section aria-labelledby="matched-schemes-title">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={22} />
            <h2 id="matched-schemes-title" className="text-xl sm:text-2xl font-bold text-white font-heading">
              1. Qualifying Health Schemes
            </h2>
          </div>
          <span className="badge badge-emerald">
            {schemes?.length} Eligible Scheme{schemes?.length > 1 ? 's' : ''} Identified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes?.map((scheme, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 sm:p-6 border-emerald-500/30 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/90"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="badge badge-emerald text-xs font-bold">
                  {scheme.coverage_limit}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {scheme.type}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white mb-2 font-heading">
                {scheme.name}
              </h3>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 mb-4 leading-relaxed">
                <strong>Why you qualify:</strong> {scheme.eligibility_reason}
              </div>

              {scheme.package_info && (
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Benefit Package: {scheme.package_info.specialty} (HBP: {scheme.package_info.hbp_code})</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-3 border-l border-white/10">
                    {scheme.package_info.package_details}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Sponsor: {scheme.sponsor}</span>
                <a
                  href={scheme.official_portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                >
                  Portal <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Empanelled Hospitals Card */}
      <section aria-labelledby="matched-hospitals-title">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-sky-400" size={22} />
            <h2 id="matched-hospitals-title" className="text-xl sm:text-2xl font-bold text-white font-heading">
              2. Empanelled Hospitals Treating {params.condition || 'Your Condition'}
            </h2>
          </div>
          <span className="badge badge-blue">
            Top {hospitals?.length} Verified Centers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hospitals?.map((hosp, idx) => (
            <div
              key={idx}
              className="glass-panel-interactive p-5 flex flex-col justify-between border-white/10"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`badge ${hosp.hospital_type.includes('Public') ? 'badge-blue' : 'badge-saffron'} text-[10px]`}>
                    {hosp.hospital_type}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    ★ {hosp.rating}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
                  {hosp.name}
                </h3>

                <div className="flex items-start gap-1.5 text-xs text-slate-400 mb-3">
                  <MapPin size={14} className="text-slate-500 shrink-0 mt-0.5" />
                  <span>{hosp.address}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mb-3 px-2 py-0.5 rounded bg-emerald-500/10">
                  <Clock size={12} />
                  <span>Est. Distance: {hosp.distance_est}</span>
                </div>

                {/* Desk Instructions */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-white/10 text-[11px] text-slate-300 mb-3">
                  <span className="text-amber-400 font-bold block mb-0.5">
                    Ayushman Mitra (PMAM) Desk:
                  </span>
                  {hosp.pmam_desk}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Beds: {hosp.beds}</span>
                <a
                  href={`tel:${hosp.helpline}`}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall size={12} />
                  {hosp.helpline}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Mandatory Document Checklist */}
      <section aria-labelledby="document-checklist-title">
        <div className="glass-panel p-6 sm:p-8 border-indigo-500/30 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <FileCheck className="text-indigo-400" size={24} />
              <div>
                <h2 id="document-checklist-title" className="text-xl sm:text-2xl font-bold text-white font-heading">
                  3. Exact Documents to Carry
                </h2>
                <p className="text-xs text-slate-400">
                  Carry these to the Ayushman Mitra desk for 100% cashless treatment
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
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer size={13} />
                <span>Print Slip</span>
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
              <HeartHandshake size={14} /> At The Hospital:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4 leading-relaxed">
              {instructions?.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Actionable Next Step Callout */}
      <section aria-label="Actionable Steps and Helplines" className="glass-panel p-6 border-amber-500/30 bg-amber-950/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-saffron">Immediate Next Step</span>
            <span className="text-xs text-slate-400">Toll-free 24x7 Assistance</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Have questions before leaving? Call Scheme Helpline 14555
          </h3>
          <p className="text-xs text-slate-300">
            Verify active empanelment and check your family's PM-JAY 14-digit ID in 2 minutes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:14555"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <PhoneCall size={16} />
            <span>Call 14555 (Free)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
