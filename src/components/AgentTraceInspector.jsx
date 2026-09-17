import React, { useState } from 'react';
import { Terminal, CheckCircle2, ChevronRight, ChevronDown, Cpu, Database, FileText, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export default function AgentTraceInspector({ traces, isRunning }) {
  const [expandedStep, setExpandedStep] = useState(null);

  if (!traces || traces.length === 0) return null;

  const toggleExpand = (stepIndex) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mb-8">
      <div className="rounded-2xl border border-indigo-500/30 bg-slate-950/90 overflow-hidden shadow-2xl shadow-indigo-950/40">
        {/* Trace Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <Terminal size={15} className="text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">
                  Bedrock Agentic Loop Trace
                </span>
                <span className="badge badge-aws text-[10px] py-0 px-2 font-mono">
                  Strands SDK / Claude 3.5 Sonnet
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Visible tool execution graph verifying non-prompt agentic reasoning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRunning ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                <span>Executing Tools...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium">
                <CheckCircle2 size={13} />
                <span>Agent Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* Trace Steps Timeline */}
        <div className="p-4 sm:p-5 space-y-3 font-mono text-xs">
          {traces.map((trace, idx) => {
            const isExpanded = expandedStep === idx;

            let icon = <Cpu size={14} className="text-indigo-400" />;
            let badgeClass = 'badge-aws';
            let badgeText = 'REASONING';

            if (trace.type === 'tool_call') {
              if (trace.tool === 'find_schemes') {
                icon = <Database size={14} className="text-amber-400" />;
                badgeClass = 'badge-saffron';
                badgeText = 'TOOL: find_schemes()';
              } else if (trace.tool === 'find_hospitals') {
                icon = <Layers size={14} className="text-emerald-400" />;
                badgeClass = 'badge-emerald';
                badgeText = 'TOOL: find_hospitals()';
              } else if (trace.tool === 'list_documents') {
                icon = <FileText size={14} className="text-sky-400" />;
                badgeClass = 'badge-blue';
                badgeText = 'TOOL: list_documents()';
              }
            } else if (trace.type === 'synthesis') {
              icon = <Sparkles size={14} className="text-purple-400" />;
              badgeClass = 'badge-aws';
              badgeText = 'SYNTHESIS';
            } else if (trace.type === 'guardrail') {
              icon = <ShieldAlert size={14} className="text-red-400" />;
              badgeClass = 'badge-saffron';
              badgeText = 'GUARDRAIL';
            }

            return (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-slate-900/70 hover:bg-slate-900 transition-all overflow-hidden"
              >
                <div
                  onClick={() => toggleExpand(idx)}
                  className="p-3 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`badge ${badgeClass} text-[10px] py-0 px-1.5`}>
                          {badgeText}
                        </span>
                        <span className="text-white font-semibold">{trace.title}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] font-sans">
                        {trace.description || trace.content}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-[10px] text-slate-500 hidden sm:inline">
                      {isExpanded ? 'Hide Payload' : 'Inspect JSON'}
                    </span>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </div>

                {/* Expandable JSON Payload */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-black/50 p-3.5 text-[11px] text-slate-300 font-mono space-y-2 animate-slide-down">
                    {trace.input && (
                      <div>
                        <div className="text-slate-500 uppercase text-[10px] tracking-wider mb-1 font-bold">
                          Input Arguments:
                        </div>
                        <pre className="p-2 rounded bg-slate-950 border border-white/5 text-amber-300 overflow-x-auto">
                          {JSON.stringify(trace.input, null, 2)}
                        </pre>
                      </div>
                    )}

                    {trace.output && (
                      <div>
                        <div className="text-slate-500 uppercase text-[10px] tracking-wider mb-1 font-bold">
                          Tool Return Data (DynamoDB):
                        </div>
                        <pre className="p-2 rounded bg-slate-950 border border-white/5 text-emerald-300 overflow-x-auto max-h-48">
                          {JSON.stringify(trace.output, null, 2)}
                        </pre>
                      </div>
                    )}

                    {trace.payload && (
                      <div>
                        <div className="text-slate-500 uppercase text-[10px] tracking-wider mb-1 font-bold">
                          Execution Metadata:
                        </div>
                        <pre className="p-2 rounded bg-slate-950 border border-white/5 text-indigo-300 overflow-x-auto">
                          {JSON.stringify(trace.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
