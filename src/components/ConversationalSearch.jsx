import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  SlidersHorizontal, 
  CheckCircle2, 
  Edit3, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw,
  MapPin,
  HeartPulse,
  Wallet,
  Users,
  Clock,
  ChevronDown
} from 'lucide-react';
import { extractEntitiesFromQuery, checkForEmergency } from '../agent/agentRunner';
import { getTranslation } from '../services/i18n';

export default function ConversationalSearch({
  query,
  setQuery,
  selectedParams,
  setSelectedParams,
  onExecuteSearch,
  isLoading,
  traces = [],
  lang = 'en'
}) {
  // Conversational step: 'input' | 'confirm' | 'running'
  const [step, setStep] = useState('input');
  const [extractedState, setExtractedState] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Setup Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang, setQuery]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      // Graceful fallback simulation if speech recognition is not supported in current browser
      if (!isListening) {
        setIsListening(true);
        setTimeout(() => {
          setQuery('My mother needs heart bypass surgery in Bengaluru with BPL card');
          setIsListening(false);
        }, 2200);
      } else {
        setIsListening(false);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleStartReview = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    // Step 1 -> Step 2: Extract entities for user review
    const extracted = extractEntitiesFromQuery(query);
    setExtractedState(extracted);
    setSelectedParams({
      state: extracted.state,
      district: extracted.district,
      condition: extracted.condition,
      incomeCategory: extracted.incomeCategory
    });
    setStep('confirm');
  };

  const handleConfirmAndRun = () => {
    setStep('running');
    onExecuteSearch(query, {
      ...selectedParams,
      patientRelation: extractedState?.patientRelation || 'Self',
      urgency: extractedState?.urgency || 'Routine'
    });
  };

  // Reset to input when loading finishes
  useEffect(() => {
    if (!isLoading && step === 'running') {
      setStep('input');
    }
  }, [isLoading, step]);

  const examplePrompts = [
    {
      title: 'Dialysis in Patna (BPL)',
      text: 'My father needs regular dialysis in Patna, Bihar. We hold a BPL ration card. Where is it cashless and what papers do we carry?'
    },
    {
      title: 'Cardiac Surgery in Bengaluru',
      text: 'Patient in Bengaluru needs heart bypass surgery. We have a BPL card. Does Arogya Karnataka / PM-JAY cover Jayadeva Institute?'
    },
    {
      title: 'Maternity in Gaya',
      text: 'Emergency C-section delivery needed in Gaya, Bihar. Family has a state ration card. Where is the nearest empanelled hospital?'
    },
    {
      title: 'Cancer Chemo in Bengaluru',
      text: 'Family member requires chemotherapy in Bengaluru. Is Kidwai empanelled for free oncology under PM-JAY and what papers do we carry?'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 mb-10">
      {/* SCREEN 1: TELL HAQDAAR (Input Box) */}
      {step === 'input' && (
        <div className="glass-panel p-5 sm:p-7 shadow-2xl border-white/15 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/90">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
                {getTranslation(lang, 'tellHaqDaarTitle')}
              </h2>
              <p className="text-xs text-slate-400">
                {getTranslation(lang, 'tellHaqDaarDesc')}
              </p>
            </div>
          </div>

          <form onSubmit={handleStartReview} className="space-y-4">
            <div className="relative">
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={getTranslation(lang, 'chatPlaceholder')}
                className="w-full bg-slate-950/80 border border-white/20 rounded-xl p-4 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors resize-none leading-relaxed"
              />

              {/* Voice input button indicator */}
              <div className="absolute right-3 bottom-3.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  title={isListening ? getTranslation(lang, 'voiceStop') : getTranslation(lang, 'voiceStart')}
                  className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                    isListening
                      ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/40'
                      : 'bg-white/10 text-slate-300 hover:text-white border-white/15 hover:bg-white/15'
                  }`}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                  <span className="hidden sm:inline">
                    {isListening ? getTranslation(lang, 'voiceListening') : 'Voice'}
                  </span>
                </button>
              </div>
            </div>

            {/* Example Prompt Chips */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                💡 Common citizen requests (Click to try):
              </span>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(p.text)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-xs text-slate-300 hover:text-emerald-300 transition-colors text-left"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="text-[11px] text-slate-400">
                🔒 Private & secure • No medical records stored
              </div>

              <button
                type="submit"
                disabled={!query.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Review & Extract Details</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SCREEN 2: WHAT I UNDERSTOOD (Review & Confirm Screen per §06) */}
      {step === 'confirm' && extractedState && (
        <div className="glass-panel p-5 sm:p-7 shadow-2xl border-emerald-500/40 relative overflow-hidden bg-slate-900/95 animate-slide-down">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
                  {getTranslation(lang, 'understoodTitle')}
                </h2>
                <p className="text-xs text-slate-400">
                  {getTranslation(lang, 'understoodSubtitle')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Edit3 size={14} className="text-emerald-400" />
              <span>{isEditing ? 'Done Editing' : getTranslation(lang, 'btnEditDetails')}</span>
            </button>
          </div>

          {/* Extracted Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {/* 1. Patient Relation */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Users size={14} className="text-emerald-400" />
                <span>{getTranslation(lang, 'labelPatientRelation')}</span>
              </div>
              {isEditing ? (
                <select
                  value={extractedState.patientRelation}
                  onChange={(e) => setExtractedState({ ...extractedState, patientRelation: e.target.value })}
                  className="w-full bg-slate-900 border border-white/20 rounded px-2 py-1 text-xs text-white"
                >
                  <option value="Self">Self</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Family Member">Family Member</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-white">{extractedState.patientRelation}</div>
              )}
            </div>

            {/* 2. Medical Specialty / Condition */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <HeartPulse size={14} className="text-emerald-400" />
                <span>{getTranslation(lang, 'labelCondition')}</span>
              </div>
              {isEditing ? (
                <select
                  value={selectedParams.condition}
                  onChange={(e) => {
                    setSelectedParams({ ...selectedParams, condition: e.target.value });
                    setExtractedState({ ...extractedState, condition: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-white/20 rounded px-2 py-1 text-xs text-white"
                >
                  <option value="Dialysis">Dialysis (Nephrology)</option>
                  <option value="Cardiac">Cardiac Surgery (Heart)</option>
                  <option value="Maternity">Maternity & Delivery (Obs/Gyn)</option>
                  <option value="Oncology">Oncology (Cancer Care)</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-white">{selectedParams.condition}</div>
              )}
            </div>

            {/* 3. Location (State & District) */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <MapPin size={14} className="text-emerald-400" />
                <span>Location</span>
              </div>
              {isEditing ? (
                <div className="space-y-1.5">
                  <select
                    value={selectedParams.state}
                    onChange={(e) => {
                      const st = e.target.value;
                      const dist = st === 'Bihar' ? 'Patna' : 'Bengaluru Urban';
                      setSelectedParams({ ...selectedParams, state: st, district: dist });
                      setExtractedState({ ...extractedState, state: st, district: dist });
                    }}
                    className="w-full bg-slate-900 border border-white/20 rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="Bihar">Bihar</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                  <select
                    value={selectedParams.district}
                    onChange={(e) => {
                      setSelectedParams({ ...selectedParams, district: e.target.value });
                      setExtractedState({ ...extractedState, district: e.target.value });
                    }}
                    className="w-full bg-slate-900 border border-white/20 rounded px-2 py-1 text-xs text-white"
                  >
                    {selectedParams.state === 'Bihar' ? (
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
              ) : (
                <div className="text-sm font-bold text-white">
                  {selectedParams.district}, {selectedParams.state}
                </div>
              )}
            </div>

            {/* 4. Income / Ration Category */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Wallet size={14} className="text-emerald-400" />
                <span>{getTranslation(lang, 'labelIncome')}</span>
              </div>
              {isEditing ? (
                <select
                  value={selectedParams.incomeCategory}
                  onChange={(e) => {
                    setSelectedParams({ ...selectedParams, incomeCategory: e.target.value });
                    setExtractedState({ ...extractedState, incomeCategory: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-white/20 rounded px-2 py-1 text-xs text-white"
                >
                  <option value="BPL">BPL (Below Poverty Line)</option>
                  <option value="AAY">Antyodaya (AAY)</option>
                  <option value="PHH">Priority Household (PHH)</option>
                  <option value="General">General / APL</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-white">{selectedParams.incomeCategory}</div>
              )}
            </div>

            {/* 5. Urgency Level */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 sm:col-span-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Clock size={14} className="text-amber-400" />
                <span>{getTranslation(lang, 'labelUrgency')}</span>
              </div>
              <div className="text-sm font-bold text-amber-300">
                {extractedState.urgency}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {extractedState.urgency.includes('Emergency')
                  ? '⚠️ Emergency symptoms detected. Immediate clinical resuscitation takes priority.'
                  : 'Routine navigation for elective or ongoing maintenance treatment.'}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStep('input')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              ← Back to Edit Prompt
            </button>

            <button
              type="button"
              onClick={handleConfirmAndRun}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
            >
              <CheckCircle2 size={16} />
              <span>{getTranslation(lang, 'btnConfirmSearch')}</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: AGENTIC PROCESSING TRACE per §06 */}
      {step === 'running' && (
        <div className="glass-panel p-6 sm:p-8 shadow-2xl border-emerald-500/30 bg-slate-950/95 animate-pulse-subtle">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <RefreshCw size={22} className="animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                HaqDaar Agentic Loop Executing...
              </h3>
              <p className="text-xs text-slate-400">
                Querying verified government scheme tables, empanelled hospitals, and document registries.
              </p>
            </div>
          </div>

          {/* Progressive Step Sequence */}
          <div className="space-y-3">
            {[
              { step: 1, title: 'Understand Request', desc: 'Validating navigational bounds & patient context' },
              { step: 2, title: 'Search Schemes', desc: 'Querying NHA PM-JAY & State Health tables' },
              { step: 3, title: 'Find Hospitals', desc: 'Filtering empanelled facilities with Ayushman Mitra desks' },
              { step: 4, title: 'Prepare Checklist', desc: 'Retrieving required statutory photo identity & referral papers' },
              { step: 5, title: 'Generate Explanation', desc: 'Synthesizing verified dossier with safety safeguards' }
            ].map((item) => {
              const traceStep = traces.find(t => t.step === item.step);
              const isCompleted = !!traceStep;
              const isCurrent = traces.length === item.step - 1;

              return (
                <div
                  key={item.step}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : isCurrent
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : isCurrent ? (
                      <RefreshCw size={16} className="animate-spin text-amber-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                        {item.step}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{item.title}</span>
                      {isCompleted && <span className="text-[10px] text-emerald-400 font-mono">DONE</span>}
                    </div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
