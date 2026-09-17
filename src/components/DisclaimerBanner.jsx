import React from 'react';
import { AlertCircle, PhoneCall } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <aside aria-label="Official Disclaimer" className="disclaimer-banner">
      <AlertCircle size={16} className="text-amber-400 shrink-0" />
      <span>
        <strong>Informational guidance only.</strong> HaqDaar does not provide medical advice or confirm eligibility. Always verify with the hospital or the scheme helpline (<strong>PM-JAY: 14555</strong>) before acting.
      </span>
      <a
        href="tel:14555"
        className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold ml-2 transition-colors"
      >
        <PhoneCall size={12} />
        Call 14555
      </a>
    </aside>
  );
}
