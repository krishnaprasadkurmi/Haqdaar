import React, { useState } from 'react';
import { X, CheckSquare, Square, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

const INITIAL_CHECKLIST = [
  { id: 'repo-public', section: 'Repository', label: 'Repo is Public and opens cleanly in an incognito window' },
  { id: 'repo-date', section: 'Repository', label: 'First commit is dated on or after 17 Sept 2026 (No pre-event history)' },
  { id: 'repo-members', section: 'Repository', label: 'All four members appear in the contributor history' },
  { id: 'repo-license', section: 'Repository', label: 'MIT LICENSE file present, zero secrets/AWS keys in git history' },
  { id: 'repo-readme', section: 'Repository', label: 'README.md explains local setup, links live URL and demo video' },
  
  { id: 'video-runtime', section: 'Demo Video', label: 'Runtime strictly under 3:00 (Aimed for ~2:40)' },
  { id: 'video-platform', section: 'Demo Video', label: 'Uploaded to YouTube as Public or Unlisted (NOT Private)' },
  { id: 'video-aws', section: 'Demo Video', label: 'AWS Console, DynamoDB tables, & CloudWatch logs visibly shown on screen' },
  { id: 'video-features', section: 'Demo Video', label: 'Every feature claimed in the writeup appears on screen' },

  { id: 'writeup-aws', section: 'Writeup', label: 'Problem, build, and Where AWS Fits all explicitly detailed' },
  { id: 'writeup-ai', section: 'Writeup', label: 'AI coding tools listed (Cursor, Claude Code, Copilot, Gemini/Antigravity)' },
  { id: 'writeup-sources', section: 'Writeup', label: 'DATA_SOURCES.md and third-party licenses completed per §03' },
  { id: 'writeup-grad', section: 'Writeup', label: 'Team graduation years (2027/2028) included for Amazon interview fast-track' }
];

export default function PreSubmitModal({ isOpen, onClose }) {
  const [checkedItems, setCheckedItems] = useState({});

  if (!isOpen) return null;

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const total = INITIAL_CHECKLIST.length;
  const completed = Object.values(checkedItems).filter(Boolean).length;
  const percent = Math.round((completed / total) * 100);

  const sections = ['Repository', 'Demo Video', 'Writeup'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-slide-down">
      <div className="w-full max-w-2xl bg-slate-950 border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckSquare size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Pre-Submit Verification Checklist
              </h2>
              <p className="text-xs text-slate-400">
                Rulebook §07 — Run this out loud before the leader touches the form
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-slate-900/40 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Readiness Score</span>
              <span>{completed} / {total} Passed ({percent}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Checklist Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {sections.map((section) => (
            <div key={section}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 font-mono">
                {section} Requirements
              </h3>
              <div className="space-y-2">
                {INITIAL_CHECKLIST.filter((item) => item.section === section).map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-slate-900/40 hover:bg-slate-800/40 border-white/5 text-slate-300'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare size={18} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Square size={18} className="text-slate-500 shrink-0" />
                      )}
                      <span className="text-xs font-medium leading-tight">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-900 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Hard freeze at submission deadline minus 6 hours.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
