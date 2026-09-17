import React, { useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, Send, RefreshCw, MapPin, Building, Activity, Wallet } from 'lucide-react';

export default function QueryBar({
  query,
  setQuery,
  selectedParams,
  setSelectedParams,
  onRunQuery,
  isLoading
}) {
  const [showFilters, setShowFilters] = useState(false);

  const districtsByState = {
    Bihar: ['Patna', 'Gaya', 'Muzaffarpur'],
    Karnataka: ['Bengaluru Urban', 'Mysuru', 'Hubballi']
  };

  const handleStateChange = (state) => {
    setSelectedParams((prev) => ({
      ...prev,
      state,
      district: districtsByState[state][0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() && !selectedParams.condition) return;
    onRunQuery();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-8">
      <form onSubmit={handleSubmit} className="glass-panel p-3 sm:p-4 shadow-xl border-white/10 relative">
        {/* Top input bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-emerald-400 pl-2">
            <Sparkles size={20} className="animate-pulse" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask in plain language: e.g. My father needs dialysis in Patna with a BPL card..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base px-2 py-2.5 focus:outline-none"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 sm:px-3 sm:py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showFilters
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
            title="Toggle guided filters"
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Filters'}</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || (!query.trim() && !selectedParams.condition)}
            className="px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span className="hidden sm:inline">Invoking Agent...</span>
              </>
            ) : (
              <>
                <span>Run Agent</span>
                <Send size={15} />
              </>
            )}
          </button>
        </div>

        {/* Guided Dropdown Selectors */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-slide-down">
            {/* State */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <MapPin size={12} className="text-emerald-400" /> State
              </label>
              <select
                value={selectedParams.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-400"
              >
                <option value="Bihar">Bihar (Patna, Gaya, etc.)</option>
                <option value="Karnataka">Karnataka (Bengaluru, Mysuru)</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Building size={12} className="text-amber-400" /> District / City
              </label>
              <select
                value={selectedParams.district}
                onChange={(e) => setSelectedParams({ ...selectedParams, district: e.target.value })}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-400"
              >
                {districtsByState[selectedParams.state]?.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Medical Specialty / Condition */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Activity size={12} className="text-sky-400" /> Condition (In Scope)
              </label>
              <select
                value={selectedParams.condition}
                onChange={(e) => setSelectedParams({ ...selectedParams, condition: e.target.value })}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-400"
              >
                <option value="Dialysis">Dialysis (Nephrology)</option>
                <option value="Cardiac">Cardiac (Cardiology & Surgery)</option>
                <option value="Maternity">Maternity (Institutional Delivery)</option>
                <option value="Oncology">Oncology (Cancer Treatment)</option>
              </select>
            </div>

            {/* Income / Ration Card */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Wallet size={12} className="text-indigo-400" /> Income / Ration Card
              </label>
              <select
                value={selectedParams.incomeCategory}
                onChange={(e) => setSelectedParams({ ...selectedParams, incomeCategory: e.target.value })}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-400"
              >
                <option value="BPL">BPL / Yellow Card (Below Poverty)</option>
                <option value="AAY">Antyodaya Anna Yojana (AAY)</option>
                <option value="PHH">Priority Household (PHH / NFSA)</option>
                <option value="General">General / APL (Above Poverty)</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
