import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import HeroSection from './components/HeroSection';
import QueryBar from './components/QueryBar';
import AgentTraceInspector from './components/AgentTraceInspector';
import ResultsView from './components/ResultsView';
import AwsInspectorModal from './components/AwsInspectorModal';
import PreSubmitModal from './components/PreSubmitModal';
import AuthModal from './components/AuthModal';
import CitizenDashboard from './components/CitizenDashboard';
import ConversationalSearch from './components/ConversationalSearch';
import HaqDaarAILoader from './components/HaqDaarAILoader';
import { runHaqDaarAgent } from './agent/agentRunner';
import { authService } from './services/authService';
import { storageService } from './services/storageService';
import { ShieldCheck, ExternalLink, Sliders } from 'lucide-react';

export default function App() {
  // Mode: 'citizen' (simple, mobile-first, citizen workflow) vs 'demo' (judges, full trace & AWS proof)
  const [mode, setMode] = useState('citizen');
  const [lang, setLang] = useState('en');

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthView, setInitialAuthView] = useState('login');

  // Citizen Dashboard active tab
  const [activeCitizenTab, setActiveCitizenTab] = useState('home');

  // Search State
  const [query, setQuery] = useState(
    'My father needs maintenance dialysis in Patna, Bihar. We hold a BPL ration card. Which empanelled hospital provides cashless treatment and what documents are needed?'
  );
  const [selectedParams, setSelectedParams] = useState({
    state: 'Bihar',
    district: 'Patna',
    condition: 'Dialysis',
    incomeCategory: 'BPL'
  });
  const [activeScenarioId, setActiveScenarioId] = useState('bihar-dialysis-bpl');
  const [isLoading, setIsLoading] = useState(false);
  const [traces, setTraces] = useState([]);
  const [result, setResult] = useState(null);
  
  // Modals
  const [isAwsModalOpen, setIsAwsModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  // Initialize session & load user
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.preferredLanguage) setLang(user.preferredLanguage);
    }
  }, []);

  // Auto-run primary scenario on initial load so demo and results are immediately populated
  useEffect(() => {
    executeAgentRun(query, selectedParams);
  }, []);

  const executeAgentRun = async (currentQuery, paramsToUse) => {
    setIsLoading(true);
    setTraces([]);
    setResult(null);

    try {
      const agentResult = await runHaqDaarAgent({
        query: currentQuery,
        presetParams: paramsToUse,
        onStepUpdate: (updatedTraces) => {
          setTraces(updatedTraces);
        }
      });
      setResult(agentResult);

      // Save to user's search history
      if (agentResult && agentResult.status === 'SUCCESS') {
        const userId = currentUser ? currentUser.id : 'guest';
        storageService.saveSearch(userId, {
          query: currentQuery,
          state: paramsToUse.state,
          district: paramsToUse.district,
          condition: paramsToUse.condition,
          incomeCategory: paramsToUse.incomeCategory
        });
      }
    } catch (error) {
      console.error('Agent execution error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScenarioSelect = (scenario) => {
    setActiveScenarioId(scenario.id);
    setQuery(scenario.queryText);
    const newParams = {
      state: scenario.state,
      district: scenario.district,
      condition: scenario.condition,
      incomeCategory: scenario.incomeCategory
    };
    setSelectedParams(newParams);
    executeAgentRun(scenario.queryText, newParams);
  };

  const handleManualRun = () => {
    setActiveScenarioId(null);
    executeAgentRun(query, selectedParams);
  };

  const handleConversationalSearch = (searchQuery, extractedParams) => {
    setQuery(searchQuery);
    setSelectedParams({
      state: extractedParams.state,
      district: extractedParams.district,
      condition: extractedParams.condition,
      incomeCategory: extractedParams.incomeCategory
    });
    executeAgentRun(searchQuery, extractedParams);
  };

  const handleOpenAuth = (view = 'login') => {
    setInitialAuthView(view);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.preferredLanguage) setLang(user.preferredLanguage);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-slate-100 selection:bg-emerald-500 selection:text-slate-950" style={{position:'relative'}}>
      {/* 1. Top Navigation with Mode Toggle & Language Selector */}
      <Navbar
        mode={mode}
        onToggleMode={(newMode) => setMode(newMode)}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuth}
        onLogout={handleLogout}
        onOpenAwsModal={() => setIsAwsModalOpen(true)}
        onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
        lang={lang}
        onLanguageChange={(newLang) => setLang(newLang)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* CITIZEN MODE WORKFLOW (§05, §06, §07) */}
        {mode === 'citizen' && (
          <div>
            {/* Citizen Dashboard Header Tabs */}
            <CitizenDashboard
              currentUser={currentUser}
              activeTab={activeCitizenTab}
              setActiveTab={setActiveCitizenTab}
              onStartNewSearch={(newQuery) => {
                setQuery(newQuery);
                setActiveCitizenTab('search');
              }}
              onSelectSavedSearch={(searchEntry) => {
                setQuery(searchEntry.query);
                const params = {
                  state: searchEntry.state,
                  district: searchEntry.district,
                  condition: searchEntry.condition,
                  incomeCategory: searchEntry.incomeCategory
                };
                setSelectedParams(params);
                setActiveCitizenTab('search');
                executeAgentRun(searchEntry.query, params);
              }}
              lang={lang}
              onLanguageChange={(newLang) => setLang(newLang)}
            />

            {/* Conversational Search (Visible on Home or Search tab) */}
            {(activeCitizenTab === 'home' || activeCitizenTab === 'search') && (
              <>
                <ConversationalSearch
                  query={query}
                  setQuery={setQuery}
                  selectedParams={selectedParams}
                  setSelectedParams={setSelectedParams}
                  onExecuteSearch={handleConversationalSearch}
                  isLoading={isLoading}
                  traces={traces}
                  lang={lang}
                />

                {/* Structured Output: Schemes, Empanelled Hospitals & Checklist */}
                <ResultsView result={result} currentUser={currentUser} />
              </>
            )}
          </div>
        )}

        {/* JUDGE / DEMO MODE WORKFLOW (§13) */}
        {mode === 'demo' && (
          <div>
            {/* Mode Banner Indicator */}
            <div className="bg-indigo-950/40 border-b border-indigo-500/20 py-2 px-4 text-center text-xs text-indigo-300 flex items-center justify-center gap-2">
              <Sliders size={13} className="text-indigo-400" />
              <span>
                <strong>Judge / Demo Mode Active:</strong> Full agent trace loop, AWS Bedrock status, DynamoDB queries, and evaluation metrics exposed.
              </span>
            </div>

            {/* 3. Hero Pitch & Quick Scenario Selectors */}
            <HeroSection
              onSelectScenario={handleScenarioSelect}
              activeScenarioId={activeScenarioId}
            />

            {/* 4. Query Input & Guided Controls */}
            <QueryBar
              query={query}
              setQuery={setQuery}
              selectedParams={selectedParams}
              setSelectedParams={setSelectedParams}
              onRunQuery={handleManualRun}
              isLoading={isLoading}
            />

            {/* 5. 3D Holographic AI Experience during agent run */}
            {isLoading && (
              <div className="max-w-4xl mx-auto px-4 mb-8">
                <HaqDaarAILoader isLoading={isLoading} traces={traces} lang={lang} />
              </div>
            )}

            {/* Visible Agent Loop Trace Inspector (§03, §04 Proof) */}
            <AgentTraceInspector traces={traces} isRunning={isLoading} />

            {/* 6. Structured Output: Scheme + Hospitals + Checklist */}
            <ResultsView result={result} currentUser={currentUser} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 py-8 px-4 text-xs text-slate-400 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col gap-5">
          {/* Disclaimer inside footer */}
          <DisclaimerBanner />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm mb-1 font-heading">
                <ShieldCheck className="text-emerald-400" size={18} />
                <span>HaqDaar — Haq Se Sehat Tak</span>
              </div>
              <p className="text-slate-400 max-w-md text-[11px]">
                Built for Bharat Builds Tour 2026 by Team NEXBYTE (Leader: Krishna, Code: FJS4C4). MIT Licensed.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
              <button
                onClick={() => setIsAwsModalOpen(true)}
                className="hover:text-white transition-colors"
              >
                AWS Proof Console
              </button>
              <span>•</span>
              <button
                onClick={() => setIsChecklistModalOpen(true)}
                className="hover:text-white transition-colors"
              >
                Pre-Submit Checklist
              </button>
              <span>•</span>
              <a
                href="https://pmjay.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                NHA PM-JAY <ExternalLink size={11} />
              </a>
              <span>•</span>
              <span className="text-emerald-400 font-mono">Status: 200 OK (ap-south-1)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AwsInspectorModal
        isOpen={isAwsModalOpen}
        onClose={() => setIsAwsModalOpen(false)}
      />

      <PreSubmitModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={initialAuthView}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
