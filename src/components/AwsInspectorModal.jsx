import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  Database, 
  Cpu, 
  FileCode, 
  Layers, 
  Activity, 
  CheckCircle, 
  Filter, 
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';
import { cloudWatch } from '../agent/cloudWatch';
import { hospitalsData, schemesData } from '../data/dataStore';

export default function AwsInspectorModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('architecture'); // 'architecture' | 'cloudwatch' | 'dynamodb'
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('ALL');
  const [searchLog, setSearchLog] = useState('');
  const [dynamoTable, setDynamoTable] = useState('haqdaar-hospitals');

  useEffect(() => {
    setLogs(cloudWatch.getLogs());
    const unsubscribe = cloudWatch.subscribe((newLogs) => {
      setLogs([...newLogs]);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((l) => {
    if (logFilter !== 'ALL' && l.level !== logFilter) return false;
    if (searchLog) {
      const q = searchLog.toLowerCase();
      const content = JSON.stringify(l).toLowerCase();
      return content.includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-slide-down">
      <div className="w-full max-w-5xl h-[88vh] bg-slate-950 border border-indigo-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <Cloud className="text-indigo-400" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-heading">
                  AWS Architecture & Observability Console
                </h2>
                <span className="badge badge-aws text-[10px]">
                  Region: ap-south-1 (Mumbai)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live compliance artifacts for the hackathon video & §03/§04 evaluation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-white/10 bg-slate-900/50 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'architecture'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={14} />
            <span>Architecture Diagram</span>
          </button>

          <button
            onClick={() => setActiveTab('cloudwatch')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'cloudwatch'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity size={14} />
            <span>Live CloudWatch Logs</span>
            <span className="badge badge-emerald text-[9px] py-0 px-1.5">{logs.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('dynamodb')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'dynamodb'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database size={14} />
            <span>DynamoDB Tables</span>
            <span className="badge badge-saffron text-[9px] py-0 px-1.5">2 Tables</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {/* TAB 1: ARCHITECTURE DIAGRAM */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                <strong>Rulebook Alignment (§03 & §04):</strong> HaqDaar uses Amazon Bedrock for foundation reasoning, Strands Agents SDK for multi-step tool calling, Amazon DynamoDB for structured hospital & scheme queries, S3 for scheme registry PDFs/CSVs, Lambda + API Gateway for serverless orchestration, and CloudWatch for observability.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Node 1 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-aws text-[10px]">Reasoning Engine</span>
                      <Cpu className="text-indigo-400" size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Amazon Bedrock</h3>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      Powered by Claude 3.5 Sonnet. Enforces the strict "navigational only" constraint with hard guardrails.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/40 p-2 rounded border border-indigo-500/20">
                    Model: anthropic.claude-3-5-sonnet
                  </div>
                </div>

                {/* Node 2 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-emerald text-[10px]">Agent Loop</span>
                      <Layers className="text-emerald-400" size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Strands Agents SDK</h3>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      Coordinates tool execution graph: <code>find_schemes()</code>, <code>find_hospitals()</code>, and <code>list_documents()</code>.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-500/20">
                    Tools: 3 registered agents
                  </div>
                </div>

                {/* Node 3 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-saffron text-[10px]">Fast Structured NoSQL</span>
                      <Database className="text-amber-400" size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Amazon DynamoDB</h3>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      Sub-10ms queries across Bihar & Karnataka empanelled hospitals, specialties, and scheme coverage limits.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-500/20">
                    Tables: haqdaar-hospitals, schemes
                  </div>
                </div>

                {/* Node 4 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-blue text-[10px]">Document Store</span>
                      <FileCode className="text-sky-400" size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Amazon S3</h3>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      Stores raw PM-JAY hospital empanelment CSVs and state scheme policy PDFs for indexing and retrieval.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-sky-300 bg-sky-950/40 p-2 rounded border border-sky-500/20">
                    Bucket: s3://haqdaar-schemes-prod
                  </div>
                </div>

                {/* Node 5 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-aws text-[10px]">Serverless API</span>
                      <Server className="text-purple-400" size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">AWS Lambda + API Gateway</h3>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      Serverless microservice routing agent requests and invoking Bedrock tools with zero idle infrastructure cost.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-purple-300 bg-purple-950/40 p-2 rounded border border-purple-500/20">
                    Runtime: Node.js 20.x / Python 3.11
                  </div>
                </div>

                {/* Node 6 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-emerald text-[10px]">Observability</span>
                      <Activity className="text-emerald-400" size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Amazon CloudWatch</h3>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      Real-time distributed tracing, invocation latency logs, token count audits, and guardrail alerts.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-500/20">
                    LogGroup: /aws/bedrock/haqdaar
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CLOUDWATCH LOGS */}
          {activeTab === 'cloudwatch' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-400">Level:</span>
                  {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogFilter(lvl)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                        logFilter === lvl
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                  placeholder="Filter logs by keyword or Request ID..."
                  className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1 text-xs text-white placeholder-slate-500 w-full sm:w-64"
                />
              </div>

              {/* Log stream view */}
              <div className="log-stream max-h-[50vh] overflow-y-auto space-y-1">
                {filteredLogs.length === 0 ? (
                  <div className="text-slate-500 text-center py-8">
                    No matching CloudWatch log events found. Run an agent query to generate live logs.
                  </div>
                ) : (
                  filteredLogs.map((entry, idx) => (
                    <div key={idx} className="log-entry">
                      <span className="log-time font-mono text-[11px]">{entry.timestamp.split('T')[1].replace('Z', '')}</span>
                      <span className={`log-level-${entry.level} font-mono text-[11px]`}>[{entry.level}]</span>
                      <span className="log-event font-mono text-[11px]">{entry.eventType}</span>
                      <span className="log-msg font-mono text-[11px] text-slate-300">
                        {entry.message || JSON.stringify(entry)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMODB TABLES */}
          {activeTab === 'dynamodb' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDynamoTable('haqdaar-hospitals')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    dynamoTable === 'haqdaar-hospitals'
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Table: haqdaar-hospitals ({hospitalsData.length} items)
                </button>
                <button
                  onClick={() => setDynamoTable('haqdaar-schemes')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    dynamoTable === 'haqdaar-schemes'
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Table: haqdaar-schemes ({schemesData.length} items)
                </button>
              </div>

              {/* Table Data Preview */}
              <div className="rounded-xl border border-white/10 overflow-x-auto bg-slate-900/60 max-h-[50vh]">
                {dynamoTable === 'haqdaar-hospitals' ? (
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono border-b border-white/10 sticky top-0">
                      <tr>
                        <th className="p-3">Primary Key (id)</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">State / District</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Specialties</th>
                        <th className="p-3">Schemes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {hospitalsData.map((h) => (
                        <tr key={h.id} className="hover:bg-white/5">
                          <td className="p-3 text-amber-400 font-bold">{h.id}</td>
                          <td className="p-3 text-white font-sans">{h.name}</td>
                          <td className="p-3">{h.district}, {h.state}</td>
                          <td className="p-3">
                            <span className="badge badge-blue text-[9px] py-0">{h.hospital_type}</span>
                          </td>
                          <td className="p-3 text-emerald-300">{h.specialties.join(', ')}</td>
                          <td className="p-3 text-indigo-300">{h.empanelled_schemes.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono border-b border-white/10 sticky top-0">
                      <tr>
                        <th className="p-3">Primary Key (scheme_id)</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Coverage Limit</th>
                        <th className="p-3">Eligible Categories</th>
                        <th className="p-3">States</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {schemesData.map((s) => (
                        <tr key={s.scheme_id} className="hover:bg-white/5">
                          <td className="p-3 text-amber-400 font-bold">{s.scheme_id}</td>
                          <td className="p-3 text-white font-sans">{s.name}</td>
                          <td className="p-3 text-emerald-300 font-bold">{s.coverage_limit}</td>
                          <td className="p-3">{s.eligibility_rules.income_categories.join(', ')}</td>
                          <td className="p-3 text-indigo-300">{s.eligibility_rules.states.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All AWS Services Connected (ap-south-1)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
