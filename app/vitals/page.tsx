"use client";
import { useState } from "react";
import { Activity, Plus, Search, TrendingUp, TrendingDown, Minus, X, Check } from "lucide-react";

const patients = [
  { id: 1, name: "Priya Sharma", age: 62, bed: "A-201", dept: "Neurology", doctor: "Dr. Verma", status: "Critical" },
  { id: 2, name: "Arjun Kumar", age: 34, bed: "B-105", dept: "Orthopedics", doctor: "Dr. Singh", status: "Observation" },
  { id: 3, name: "Rahul Agarwal", age: 45, bed: "C-302", dept: "Cardiology", doctor: "Dr. Mehta", status: "Stable" },
  { id: 4, name: "Ravi Sharma", age: 50, bed: "C-304", dept: "Cardiology", doctor: "Dr. Mehta", status: "Observation" },
];

const statusStyles: Record<string, string> = {
  Critical: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
  Observation: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
  Stable: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
};

const initialVitals: Record<number, { time: string; bp: string; pulse: string; temp: string; spo2: string; rr: string; note: string }[]> = {
  1: [
    { time: "08:00 AM", bp: "158/98", pulse: "94", temp: "99.2°F", spo2: "93%", rr: "22", note: "Patient restless" },
    { time: "12:00 PM", bp: "152/94", pulse: "90", temp: "99.0°F", spo2: "94%", rr: "20", note: "" },
  ],
  2: [
    { time: "08:00 AM", bp: "118/76", pulse: "72", temp: "98.4°F", spo2: "98%", rr: "16", note: "" },
  ],
  3: [
    { time: "08:00 AM", bp: "138/88", pulse: "80", temp: "98.6°F", spo2: "97%", rr: "17", note: "" },
    { time: "12:00 PM", bp: "135/86", pulse: "78", temp: "98.5°F", spo2: "97%", rr: "16", note: "BP improving" },
  ],
  4: [
    { time: "08:00 AM", bp: "132/84", pulse: "76", temp: "98.6°F", spo2: "96%", rr: "18", note: "" },
  ],
};

const emptyForm = { bp: "", pulse: "", temp: "", spo2: "", rr: "", note: "" };

export default function VitalsPage() {
  const [vitals, setVitals] = useState(initialVitals);
  const [search, setSearch] = useState("");
  const [logFor, setLogFor] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.bed.toLowerCase().includes(search.toLowerCase())
  );

  const handleLog = (pid: number) => {
    if (!form.bp || !form.pulse) return;
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setVitals(prev => ({ ...prev, [pid]: [{ time: now, ...form }, ...(prev[pid] || [])] }));
    setLogFor(null);
    setForm(emptyForm);
  };

  const spo2Color = (v: string) => {
    const n = parseInt(v);
    return n >= 97 ? "text-green-600" : n >= 94 ? "text-yellow-600" : "text-red-600 font-bold animate-pulse";
  };

  const bpTrend = (logs: typeof initialVitals[1]) => {
    if (logs.length < 2) return null;
    const latest = parseInt(logs[0].bp.split("/")[0]);
    const prev = parseInt(logs[1].bp.split("/")[0]);
    if (latest < prev) return <TrendingDown size={14} className="text-green-500" />;
    if (latest > prev) return <TrendingUp size={14} className="text-red-500" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Vitals Log</h1>
          <p className="text-sm text-gray-500 mt-1">Record and monitor patient vitals by shift</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-teal-100/80 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-4 py-1.5 rounded-full font-semibold border border-teal-200/50">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" /> Morning Shift Active
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-1">
        {[
          { label: "Total Patients", value: patients.length, color: "from-teal-400 to-teal-600" },
          { label: "Critical", value: patients.filter(p => p.status === "Critical").length, color: "from-red-400 to-red-600" },
          { label: "Observation", value: patients.filter(p => p.status === "Observation").length, color: "from-yellow-400 to-yellow-600" },
          { label: "Stable", value: patients.filter(p => p.status === "Stable").length, color: "from-green-400 to-green-600" },
        ].map(s => (
          <div key={s.label} className="glass-card p-5 group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Activity size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.value}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md animate-fade-in-up stagger-2">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or bed number..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30 backdrop-blur-sm transition-all" />
      </div>

      {/* Patient Vitals Cards */}
      <div className="space-y-4 animate-fade-in-up stagger-3">
        {filtered.map(p => {
          const logs = vitals[p.id] || [];
          const latest = logs[0];
          return (
            <div key={p.id} className={`glass-card overflow-hidden ${p.status === "Critical" ? "border-l-4 border-l-red-500" : p.status === "Observation" ? "border-l-4 border-l-yellow-500" : "border-l-4 border-l-green-500"}`}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0 ${p.status === "Critical" ? "bg-gradient-to-br from-red-400 to-red-600" : p.status === "Observation" ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : "bg-gradient-to-br from-teal-400 to-teal-600"}`}>
                      {p.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">{p.name}</p>
                      <p className="text-[11px] text-gray-400">Bed {p.bed} · {p.dept} · {p.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${statusStyles[p.status]}`}>{p.status}</span>
                    <button onClick={() => setLogFor(p.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 hover:bg-teal-100 active:scale-95 transition-all">
                      <Plus size={13} /> Log Vitals
                    </button>
                  </div>
                </div>

                {latest ? (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      { label: "BP", value: latest.bp, extra: bpTrend(logs) },
                      { label: "Pulse", value: `${latest.pulse} bpm`, extra: null },
                      { label: "Temp", value: latest.temp, extra: null },
                      { label: "SpO₂", value: latest.spo2, extra: null, cls: spo2Color(latest.spo2) },
                      { label: "RR", value: `${latest.rr}/min`, extra: null },
                      { label: "Time", value: latest.time, extra: null },
                    ].map(v => (
                      <div key={v.label} className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-2.5 text-center border border-gray-100 dark:border-gray-700/50">
                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1">{v.label}</p>
                        <div className="flex items-center justify-center gap-1">
                          <p className={`text-sm font-bold ${v.cls || "text-gray-800 dark:text-white"}`}>{v.value}</p>
                          {v.extra}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No vitals logged yet for this shift.</p>
                )}

                {logs.length > 1 && (
                  <details className="mt-3">
                    <summary className="text-xs text-teal-600 dark:text-teal-400 font-semibold cursor-pointer hover:text-teal-700 w-fit">View {logs.length - 1} earlier reading{logs.length > 2 ? "s" : ""}</summary>
                    <div className="mt-2 space-y-2">
                      {logs.slice(1).map((l, i) => (
                        <div key={i} className="grid grid-cols-6 gap-2 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-lg px-3 py-1.5">
                          <span>{l.time}</span><span>BP: {l.bp}</span><span>P: {l.pulse}</span><span>T: {l.temp}</span><span>SpO₂: {l.spo2}</span><span className="text-gray-400 italic">{l.note}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Vitals Modal */}
      {logFor && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-md animate-pop-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Log Vitals</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{patients.find(p => p.id === logFor)?.name} · Bed {patients.find(p => p.id === logFor)?.bed}</p>
                </div>
                <button onClick={() => setLogFor(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Blood Pressure", key: "bp", ph: "e.g. 120/80" },
                  { label: "Pulse (bpm)", key: "pulse", ph: "e.g. 72" },
                  { label: "Temperature", key: "temp", ph: "e.g. 98.6°F" },
                  { label: "SpO₂ (%)", key: "spo2", ph: "e.g. 98%" },
                  { label: "Respiratory Rate", key: "rr", ph: "breaths/min" },
                ].map(f => (
                  <div key={f.key} className={f.key === "rr" ? "col-span-2" : ""}>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Note (optional)</label>
                  <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Any observation..."
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setLogFor(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => handleLog(logFor)} className="btn-primary flex-1 gap-2"><Check size={14} /> Save Vitals</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
