import React from 'react';
import { ShieldCheck, Cloud, CheckSquare, Sparkles, PhoneCall } from 'lucide-react';

export default function Navbar({ onOpenAwsModal, onOpenChecklistModal }) {
  return (
    <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-[41px] z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
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
            <p className="text-xs text-slate-400 font-medium">
              Haq Se Sehat Tak • Government Health Scheme Navigator
            </p>
          </div>
        </div>

        {/* Team & Tour Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
            <span className="text-slate-500">Team:</span> <strong className="text-white">NEXBYTE</strong>
            <span className="mx-1.5 text-slate-600">|</span>
            <span className="text-slate-500">Code:</span> <span className="font-mono text-amber-400 font-semibold">FJS4C4</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
            Bharat Builds Tour 2026
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAwsModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all shadow-sm shadow-indigo-500/10"
            title="Inspect Bedrock Agent, DynamoDB tables, and live CloudWatch logs"
          >
            <Cloud size={15} className="text-indigo-400" />
            <span>AWS Console & Proof</span>
          </button>

          <button
            onClick={onOpenChecklistModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-all"
            title="Pre-Submit Checklist per §07"
          >
            <CheckSquare size={14} className="text-emerald-400" />
            <span className="hidden md:inline">Submission Checklist</span>
          </button>

          <a
            href="tel:14555"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <PhoneCall size={14} />
            <span>14555</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
