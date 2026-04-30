"use client";
import { useState } from "react";
import { Sparkles, AlertTriangle, Clock, Building2, Activity, ShieldAlert, FileText, ArrowRight, RotateCcw, User } from "lucide-react";

type TriageResult = {
  urgencyLevel: "EMERGENCY" | "URGENT" | "MODERATE" | "ROUTINE";
  urgencyReason: string;
  possibleDiagnoses: string[];
  recommendedDepartment: string;
  immediateActions: string[];
  redFlags: string[];
  estimatedWaitTime: string;
  clinicalNote: string;
};

const urgencyConfig = {
  EMERGENCY: {
    color: "from-red-500 to-red-700",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800/40",
    text: "text-red-700 dark:text-red-400",
    badge: "bg-red-600",
    icon: "🚨",
    label: "EMERGENCY",
  },
  URGENT: {
    color: "from-orange-500 to-orange-700",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800/40",
    text: "text-orange-700 dark:text-orange-400",
    badge: "bg-orange-500",
    icon: "⚠️",
    label: "URGENT",
  },
  MODERATE: {
    color: "from-yellow-500 to-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800/40",
    text: "text-yellow-700 dark:text-yellow-400",
    badge: "bg-yellow-500",
    icon: "🟡",
    label: "MODERATE",
  },
  ROUTINE: {
    color: "from-green-500 to-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800/40",
    text: "text-green-700 dark:text-green-400",
    badge: "bg-green-500",
    icon: "✅",
    label: "ROUTINE",
  },
};

export default function TriagePage() {
  const [form, setForm] = useState({ symptoms: "", age: "", gender: "Male", vitals: "" });
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!form.symptoms.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/ai/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Analysis failed.");
    } catch (e: any) {
      setError(e.message || "Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError("");
    setForm({ symptoms: "", age: "", gender: "Male", vitals: "" });
  };

  const cfg = result ? urgencyConfig[result.urgencyLevel] : null;

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">AI Triage Assistant</h1>
            <p className="text-sm text-gray-500 mt-0.5">Enter patient symptoms for instant AI-powered triage assessment</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-5 animate-fade-in-up stagger-1">
          <div className="glass-card p-6">
            <h2 className="font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
              <User size={16} className="text-indigo-500" /> Patient Information
            </h2>

            <div className="space-y-4">
              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Age</label>
                  <input
                    type="number" placeholder="e.g. 45"
                    value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Gender</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Chief Complaints / Symptoms <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4} placeholder="Describe all symptoms in detail...&#10;e.g. Severe chest pain radiating to left arm, started 30 mins ago, sweating, shortness of breath"
                  value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Vitals */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Vitals <span className="text-gray-400 font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="text" placeholder="e.g. BP 90/60, HR 120, Temp 103°F, SpO2 94%"
                  value={form.vitals} onChange={e => setForm({ ...form, vitals: e.target.value })}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-1">
                {result && (
                  <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold glass text-gray-600 dark:text-gray-300 hover:bg-gray-50 active:scale-95 transition-all">
                    <RotateCcw size={14} /> Reset
                  </button>
                )}
                <button
                  onClick={analyze} disabled={!form.symptoms.trim() || loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles size={15} /> Run AI Triage <ArrowRight size={14} /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Example Scenarios */}
          {!result && !loading && (
            <div className="glass-card p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Try Example Scenarios</p>
              <div className="space-y-2">
                {[
                  { label: "🚨 Chest Pain", text: "Severe crushing chest pain radiating to left arm, sweating, nausea, started 20 mins ago", age: "58", gender: "Male" },
                  { label: "⚠️ High Fever Child", text: "Child with high fever 104°F, stiff neck, sensitivity to light, rash appearing on body", age: "8", gender: "Female" },
                  { label: "🟡 Abdominal Pain", text: "Lower right abdominal pain for past 6 hours, worsening, mild nausea, no vomiting", age: "25", gender: "Male" },
                  { label: "✅ Minor Laceration", text: "Small cut on hand from kitchen knife, bleeding controlled, no numbness", age: "35", gender: "Female" },
                ].map(ex => (
                  <button key={ex.label} onClick={() => setForm({ symptoms: ex.text, age: ex.age, gender: ex.gender, vitals: "" })}
                    className="w-full text-left text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 px-3 py-2 rounded-xl border border-gray-100 dark:border-gray-700/50 transition-all">
                    <span className="font-semibold">{ex.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="animate-fade-in-up stagger-2">
          {!result && !loading && !error && (
            <div className="glass-card p-10 h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
                <Sparkles size={36} className="text-indigo-400" />
              </div>
              <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">AI Triage Ready</h3>
              <p className="text-sm text-gray-400 max-w-xs">Enter patient symptoms and click "Run AI Triage" to get an instant clinical assessment</p>
            </div>
          )}

          {loading && (
            <div className="glass-card p-10 h-full flex flex-col items-center justify-center text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="w-full h-full border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-500 rounded-full animate-spin" />
                <Sparkles size={24} className="absolute inset-0 m-auto text-indigo-500" />
              </div>
              <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">AI Analyzing Symptoms...</h3>
              <p className="text-sm text-gray-400">Applying clinical triage protocols</p>
              <div className="flex gap-1.5 mt-4">
                {["Evaluating vitals", "Checking red flags", "Assessing urgency", "Recommending actions"].map((step, i) => (
                  <div key={step} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="glass-card p-6 border border-red-200 dark:border-red-800/40 bg-red-50/50 dark:bg-red-900/10">
              <p className="text-red-600 dark:text-red-400 font-semibold text-sm">⚠️ Error: {error}</p>
            </div>
          )}

          {result && cfg && (
            <div className="space-y-4 animate-fade-in">
              {/* Urgency Banner */}
              <div className={`rounded-2xl p-5 bg-gradient-to-r ${cfg.color} text-white shadow-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1">Triage Level</p>
                    <h2 className="text-3xl font-black tracking-tight">{cfg.icon} {cfg.label}</h2>
                    <p className="text-white/80 text-sm mt-1">{result.urgencyReason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Est. Wait</p>
                    <div className="text-right">
                      <Clock size={16} className="text-white/80 ml-auto mb-1" />
                      <p className="text-white font-bold text-sm">{result.estimatedWaitTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className={`glass-card p-4 flex items-center gap-4 border ${cfg.border}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                  <Building2 size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Recommended Department</p>
                  <p className={`font-bold text-lg ${cfg.text}`}>{result.recommendedDepartment}</p>
                </div>
              </div>

              {/* Possible Diagnoses */}
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={15} className="text-indigo-500" />
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Possible Diagnoses</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.possibleDiagnoses.map((d, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/30">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Red Flags */}
              {result.redFlags.length > 0 && (
                <div className="glass-card p-4 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert size={15} className="text-red-500" />
                    <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Red Flag Symptoms</p>
                  </div>
                  <ul className="space-y-1">
                    {result.redFlags.map((f, i) => (
                      <li key={i} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Immediate Actions */}
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={15} className="text-orange-500" />
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Immediate Actions</p>
                </div>
                <ol className="space-y-2">
                  {result.immediateActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${cfg.color} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>{i + 1}</span>
                      {action}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Clinical Note */}
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={15} className="text-teal-500" />
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Clinical Assessment Note</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">{result.clinicalNote}</p>
              </div>

              <p className="text-[10px] text-gray-400 text-center">⚠️ AI triage is a decision support tool. Always apply clinical judgment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
