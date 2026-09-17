import React from 'react';
import { Compass, Sparkles, MapPin, Activity, HeartPulse, Stethoscope } from 'lucide-react';

export default function HeroSection({ onSelectScenario, activeScenarioId }) {
  const scenarios = [
    {
      id: 'bihar-dialysis-bpl',
      title: 'Dialysis in Bihar (Patna · BPL)',
      tag: 'Video Demo Scenario §05',
      state: 'Bihar',
      district: 'Patna',
      condition: 'Dialysis',
      incomeCategory: 'BPL',
      icon: Activity,
      queryText: 'My father needs maintenance dialysis in Patna, Bihar. We hold a BPL ration card. Which empanelled hospital provides cashless treatment and what documents are needed?'
    },
    {
      id: 'karnataka-cardiac-ark',
      title: 'Cardiac Surgery in Bengaluru (ArK / BPL)',
      tag: 'Karnataka Jayadeva',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      condition: 'Cardiac',
      incomeCategory: 'BPL',
      icon: HeartPulse,
      queryText: 'Patient in Bengaluru needs heart bypass surgery (CABG). We have a BPL card. Does Arogya Karnataka / PM-JAY cover Sri Jayadeva Institute cashless?'
    },
    {
      id: 'bihar-maternity-mmjay',
      title: 'Maternity in Gaya (MMJAY / NFSA)',
      tag: 'High-Risk Delivery',
      state: 'Bihar',
      district: 'Gaya',
      condition: 'Maternity',
      incomeCategory: 'PHH',
      icon: Stethoscope,
      queryText: 'Emergency C-section delivery needed in Gaya, Bihar. Family has a state ration card. Where is the nearest empanelled government medical college?'
    },
    {
      id: 'karnataka-oncology-kidwai',
      title: 'Oncology in Bengaluru (Kidwai / PM-JAY)',
      tag: 'Cancer Chemotherapy',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      condition: 'Oncology',
      incomeCategory: 'BPL',
      icon: Compass,
      queryText: 'Family member requires chemotherapy cycles in Bengaluru. Is Kidwai Memorial Institute empanelled for free oncology under PM-JAY and what papers do we carry?'
    }
  ];

  return (
    <section className="pt-8 pb-4 text-center px-4 max-w-5xl mx-auto">
      {/* Scope Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-4 backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Navigational Assistant Only</span>
        <span className="text-slate-500">•</span>
        <span className="text-emerald-400">Bihar & Karnataka Public Data</span>
        <span className="text-slate-500">•</span>
        <span className="text-amber-400">PM-JAY & State Schemes</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 font-heading">
        Every citizen is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">HaqDaar</span> of free health coverage.
      </h1>

      {/* One-Sentence Rulebook Tagline */}
      <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
        A conversational agent that tells an Indian patient which government health scheme they qualify for, which nearby empanelled hospital treats their condition under it, and exactly what documents to carry — <strong>in one conversation, in plain language.</strong>
      </p>

      {/* Quick-Run Scenario Chips */}
      <div className="mb-2">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          <Sparkles size={14} className="text-amber-400" />
          <span>Select a verified scenario for instant demonstration:</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSelected = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-400/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 hover:bg-slate-800/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-amber-300">
                    {sc.tag}
                  </span>
                  <Icon size={16} className={isSelected ? 'text-emerald-400' : 'text-slate-400'} />
                </div>
                <div className="text-xs font-bold text-white mb-1">{sc.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                  {sc.queryText}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
