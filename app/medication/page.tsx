"use client";
import { useState } from "react";
import { Syringe, Clock, CheckCircle, AlertCircle, Search, X } from "lucide-react";

const initialSchedule = [
  { id: 1, patient: "Priya Sharma", bed: "A-201", medicine: "Levetiracetam", dose: "500mg", route: "IV", time: "08:00 AM", status: "Pending", note: "Administer slowly over 15 min" },
  { id: 2, patient: "Priya Sharma", bed: "A-201", medicine: "Mannitol", dose: "100ml", route: "IV", time: "10:00 AM", status: "Pending", note: "Check BP before and after" },
  { id: 3, patient: "Arjun Kumar", bed: "B-105", medicine: "Tramadol", dose: "50mg", route: "Oral", time: "08:00 AM", status: "Given", note: "" },
  { id: 4, patient: "Arjun Kumar", bed: "B-105", medicine: "Ibuprofen", dose: "400mg", route: "Oral", time: "02:00 PM", status: "Pending", note: "Give after food" },
  { id: 5, patient: "Rahul Agarwal", bed: "C-302", medicine: "Amlodipine", dose: "5mg", route: "Oral", time: "08:00 AM", status: "Given", note: "" },
  { id: 6, patient: "Rahul Agarwal", bed: "C-302", medicine: "Aspirin", dose: "75mg", route: "Oral", time: "08:00 AM", status: "Given", note: "Give with water" },
  { id: 7, patient: "Ravi Sharma", bed: "C-304", medicine: "Metoprolol", dose: "25mg", route: "Oral", time: "08:00 AM", status: "Skipped", note: "Patient refused" },
  { id: 8, patient: "Ravi Sharma", bed: "C-304", medicine: "Nitroglycerin", dose: "0.5mg", route: "Sublingual", time: "PRN", status: "PRN", note: "Only if chest pain" },
];

const statusStyles: Record<string, string> = {
  Given: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
  Pending: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
  Skipped: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
  PRN: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
};

const routeColor: Record<string, string> = {
  IV: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Oral: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Sublingual: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  IM: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function MedicationPage() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [skipReason, setSkipReason] = useState("");

  const filtered = schedule.filter(m => {
    const matchSearch = m.patient.toLowerCase().includes(search.toLowerCase()) || m.medicine.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const markGiven = (id: number) => {
    setSchedule(prev => prev.map(m => m.id === id ? { ...m, status: "Given" } : m));
    setConfirmId(null);
  };

  const markSkipped = (id: number) => {
    setSchedule(prev => prev.map(m => m.id === id ? { ...m, status: "Skipped", note: skipReason || "Skipped by nurse" } : m));
    setConfirmId(null);
    setSkipReason("");
  };

  const counts = {
    total: schedule.filter(m => m.status !== "PRN").length,
    pending: schedule.filter(m => m.status === "Pending").length,
    given: schedule.filter(m => m.status === "Given").length,
    skipped: schedule.filter(m => m.status === "Skipped").length,
  };

  const progress = counts.total > 0 ? Math.round((counts.given / counts.total) * 100) : 0;

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Medication Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Track and administer medications for this shift</p>
        </div>
        <div className="glass-card px-5 py-3 min-w-[180px]">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-gray-500">Shift Progress</p>
            <p className="text-sm font-bold text-teal-600 dark:text-teal-400">{progress}%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{counts.given} of {counts.total} doses given</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-1">
        {[
          { label: "Total Doses", value: counts.total, icon: Syringe, color: "from-teal-400 to-teal-600" },
          { label: "Pending", value: counts.pending, icon: Clock, color: "from-yellow-400 to-yellow-600" },
          { label: "Given", value: counts.given, icon: CheckCircle, color: "from-green-400 to-green-600" },
          { label: "Skipped", value: counts.skipped, icon: AlertCircle, color: "from-red-400 to-red-600" },
        ].map(s => (
          <div key={s.label} className="glass-card p-5 group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.value}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up stagger-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or medicine..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30 backdrop-blur-sm transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Given", "Skipped", "PRN"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 whitespace-nowrap ${filter === s ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30" : "glass text-gray-600 dark:text-gray-300 hover:text-teal-600"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fade-in-up stagger-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30">
                {["Patient / Bed", "Medicine", "Dose", "Route", "Time", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className={`border-b border-gray-100/50 dark:border-gray-800/50 last:border-0 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors ${m.status === "Skipped" ? "opacity-60" : ""}`}>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{m.patient}</p>
                    <p className="text-[10px] text-gray-400">Bed {m.bed}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{m.medicine}</p>
                    {m.note && <p className="text-[10px] text-gray-400 italic mt-0.5">{m.note}</p>}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 font-semibold">{m.dose}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${routeColor[m.route] || "bg-gray-100 text-gray-600"}`}>{m.route}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">{m.time}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${statusStyles[m.status]}`}>{m.status}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {m.status === "Pending" && (
                      <button onClick={() => setConfirmId(m.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 hover:bg-teal-100 active:scale-95 transition-all whitespace-nowrap">
                        Administer
                      </button>
                    )}
                    {m.status === "Given" && <span className="text-xs text-green-500 font-semibold">✓ Done</span>}
                    {m.status === "Skipped" && <span className="text-xs text-red-400 font-semibold">Skipped</span>}
                    {m.status === "PRN" && <span className="text-xs text-blue-400 font-semibold">As Needed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-14 text-center">
            <Syringe size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-semibold">No medications found</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmId && (() => {
        const med = schedule.find(m => m.id === confirmId)!;
        return (
          <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-sm animate-pop-in">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">Confirm Administration</h2>
                  <button onClick={() => setConfirmId(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all"><X size={15} /></button>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 mb-4 border border-teal-100 dark:border-teal-800/30">
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{med.medicine} {med.dose}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{med.patient} · Bed {med.bed} · {med.route} · {med.time}</p>
                  {med.note && <p className="text-xs text-teal-600 dark:text-teal-400 mt-2 font-medium">⚠️ {med.note}</p>}
                </div>
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Skip Reason (if skipping)</label>
                  <input value={skipReason} onChange={e => setSkipReason(e.target.value)} placeholder="Optional reason..."
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => markSkipped(confirmId)} className="text-sm font-semibold py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 active:scale-95 transition-all">Skip Dose</button>
                  <button onClick={() => markGiven(confirmId)} className="btn-primary">✓ Mark Given</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
