import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <aside aria-label="Official Regulatory Guidance" className="max-w-6xl mx-auto px-4 mb-6">
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shadow-sm">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck size={16} />
          </div>
          <p className="leading-relaxed">
            <strong className="text-slate-200">Informational guidance only.</strong> HaqDaar does not provide medical advice or confirm eligibility. Always verify with the hospital or the scheme helpline (<strong>PM-JAY: 14555</strong>) before acting.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <a
            href="tel:14555"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold transition-colors"
          >
            <PhoneCall size={12} />
            <span>14555</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
