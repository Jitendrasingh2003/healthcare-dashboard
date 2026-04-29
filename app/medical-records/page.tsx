"use client";
import { useState } from "react";
import { FileText, Search, ChevronDown, ChevronUp, Activity, Pill, FlaskConical, X, Plus, Clock } from "lucide-react";

const statusStyles: Record<string, string> = {
  Stable: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
  Critical: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
  Observation: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
  Discharged: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
};

const records = [
  {
    id: 1, patient: "Rahul Agarwal", age: 45, gender: "Male", blood: "B+", dept: "Cardiology", phone: "9876543210",
    status: "Stable", admittedDate: "2026-04-19", doctor: "Dr. Mehta",
    diagnosis: "Hypertension Stage 2",
    vitals: [
      { date: "2026-04-29", bp: "138/90", pulse: "82", temp: "98.6°F", spo2: "97%" },
      { date: "2026-04-28", bp: "142/92", pulse: "85", temp: "98.8°F", spo2: "96%" },
      { date: "2026-04-27", bp: "150/95", pulse: "88", temp: "99°F", spo2: "95%" },
    ],
    labs: [
      { test: "CBC", date: "2026-04-20", result: "WBC 9.2, RBC 4.8, Hb 14.1", status: "Normal" },
      { test: "Lipid Profile", date: "2026-04-20", result: "Total Cholesterol 220 mg/dL", status: "Borderline" },
      { test: "ECG", date: "2026-04-21", result: "Mild LVH changes noted", status: "Abnormal" },
    ],
    medications: ["Amlodipine 5mg OD", "Aspirin 75mg OD", "Atorvastatin 10mg HS"],
    notes: "Patient responding well to antihypertensive therapy. BP trending down. Continue current regimen.",
    history: "No prior cardiac events. Family history of hypertension.",
  },
  {
    id: 2, patient: "Vikas Gupta", age: 28, gender: "Male", blood: "O+", dept: "Cardiology", phone: "9812345678",
    status: "Stable", admittedDate: "2026-04-21", doctor: "Dr. Mehta",
    diagnosis: "Non-Cardiac Chest Pain",
    vitals: [
      { date: "2026-04-29", bp: "118/76", pulse: "74", temp: "98.4°F", spo2: "99%" },
      { date: "2026-04-28", bp: "120/78", pulse: "76", temp: "98.6°F", spo2: "99%" },
    ],
    labs: [
      { test: "Troponin", date: "2026-04-22", result: "0.01 ng/mL (negative)", status: "Normal" },
      { test: "ECG", date: "2026-04-22", result: "Normal sinus rhythm", status: "Normal" },
    ],
    medications: ["Pantoprazole 40mg BD", "Antacid 10ml after meals"],
    notes: "Chest pain likely GERD-related. Cardiac workup negative. Advised lifestyle changes.",
    history: "No significant past medical history. Smoker (occasional).",
  },
  {
    id: 3, patient: "Ravi Sharma", age: 50, gender: "Male", blood: "A+", dept: "Cardiology", phone: "9843210987",
    status: "Observation", admittedDate: "2026-04-25", doctor: "Dr. Mehta",
    diagnosis: "Stable Angina",
    vitals: [
      { date: "2026-04-29", bp: "132/84", pulse: "78", temp: "98.6°F", spo2: "96%" },
      { date: "2026-04-28", bp: "136/86", pulse: "80", temp: "98.8°F", spo2: "95%" },
    ],
    labs: [
      { test: "Stress Test", date: "2026-04-26", result: "Positive at moderate workload", status: "Abnormal" },
      { test: "Echo", date: "2026-04-27", result: "EF 55%, mild LV diastolic dysfunction", status: "Borderline" },
    ],
    medications: ["Nitroglycerin 0.5mg PRN", "Atorvastatin 20mg HS", "Metoprolol 25mg BD"],
    notes: "Stress test positive. Cardiology referral for possible angiography. Restrict heavy physical activity.",
    history: "Diabetes Type 2 (10 years). On Metformin.",
  },
];

type RecordType = typeof records[0];

export default function MedicalRecordsPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<Record<number, string>>({});
  const [addNote, setAddNote] = useState<{ id: number | null; text: string }>({ id: null, text: "" });

  const filtered = records.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  const getTab = (id: number) => activeTab[id] || "vitals";
  const setTab = (id: number, tab: string) => setActiveTab(prev => ({ ...prev, [id]: tab }));

  const labStatusColor: Record<string, string> = {
    Normal: "text-green-600 dark:text-green-400",
    Abnormal: "text-red-600 dark:text-red-400",
    Borderline: "text-yellow-600 dark:text-yellow-400",
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Medical Records</h1>
          <p className="text-sm text-gray-500 mt-1">Patient history, vitals, labs & treatment notes</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-1.5 rounded-full font-semibold border border-blue-200/50 dark:border-blue-800/50">
          <FileText size={13} /> {records.length} patients on record
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-xl animate-fade-in-up stagger-1">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by patient name or diagnosis..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 backdrop-blur-sm transition-all"
        />
      </div>

      {/* Records */}
      <div className="space-y-4 animate-fade-in-up stagger-2">
        {filtered.map(r => (
          <div key={r.id} className="glass-card overflow-hidden transition-all duration-300">
            {/* Patient Header Row */}
            <button
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-teal-500/20 flex-shrink-0">
                  {r.patient.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800 dark:text-white">{r.patient}</p>
                  <p className="text-[11px] text-gray-400">{r.dept} · Age {r.age} · {r.gender} · {r.blood} · Admitted {r.admittedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${statusStyles[r.status]}`}>{r.status}</span>
                {expanded === r.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </div>
            </button>

            {/* Expanded Content */}
            {expanded === r.id && (
              <div className="border-t border-gray-100 dark:border-gray-700/50 px-5 pb-5 pt-4 animate-fade-in">
                {/* Diagnosis Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Primary Diagnosis</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{r.diagnosis}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Attending Doctor</p>
                    <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">{r.doctor}</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-4 bg-gray-100/60 dark:bg-gray-800/60 p-1 rounded-xl w-fit">
                  {[
                    { key: "vitals", label: "Vitals", icon: Activity },
                    { key: "labs", label: "Lab Reports", icon: FlaskConical },
                    { key: "meds", label: "Medications", icon: Pill },
                    { key: "notes", label: "Notes", icon: FileText },
                  ].map(t => (
                    <button key={t.key} onClick={() => setTab(r.id, t.key)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95 ${getTab(r.id) === t.key ? "bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                      <t.icon size={12} /> {t.label}
                    </button>
                  ))}
                </div>

                {/* Vitals Tab */}
                {getTab(r.id) === "vitals" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-[11px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700/50">
                          {["Date", "BP", "Pulse", "Temp", "SpO₂"].map(h => (
                            <th key={h} className="text-left py-2 px-3 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {r.vitals.map((v, i) => (
                          <tr key={i} className={`border-b border-gray-50 dark:border-gray-800/50 last:border-0 ${i === 0 ? "bg-teal-50/50 dark:bg-teal-900/10" : ""}`}>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />}
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{v.date}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-xs font-bold text-gray-700 dark:text-gray-300">{v.bp}</td>
                            <td className="py-2.5 px-3 text-xs text-gray-600 dark:text-gray-400">{v.pulse} bpm</td>
                            <td className="py-2.5 px-3 text-xs text-gray-600 dark:text-gray-400">{v.temp}</td>
                            <td className="py-2.5 px-3">
                              <span className={`text-xs font-bold ${parseInt(v.spo2) >= 97 ? "text-green-600" : parseInt(v.spo2) >= 94 ? "text-yellow-600" : "text-red-600"}`}>{v.spo2}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Lab Reports Tab */}
                {getTab(r.id) === "labs" && (
                  <div className="space-y-2">
                    {r.labs.map((l, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <FlaskConical size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 dark:text-white">{l.test}</p>
                            <p className="text-[11px] text-gray-400">{l.date} · {l.result}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${labStatusColor[l.status]}`}>{l.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Medications Tab */}
                {getTab(r.id) === "meds" && (
                  <div className="space-y-2">
                    {r.medications.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-teal-50/60 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800/30">
                        <Pill size={14} className="text-teal-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{m}</span>
                      </div>
                    ))}
                    <p className="text-[11px] text-gray-400 mt-2 italic">Past history: {r.history}</p>
                  </div>
                )}

                {/* Notes Tab */}
                {getTab(r.id) === "notes" && (
                  <div className="space-y-3">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={12} className="text-yellow-500" />
                        <p className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider">Latest Note — {r.admittedDate}</p>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{r.notes}</p>
                    </div>

                    {addNote.id === r.id ? (
                      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                        <textarea rows={3} value={addNote.text} onChange={e => setAddNote({ ...addNote, text: e.target.value })}
                          placeholder="Write a new clinical note..."
                          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 resize-none mb-2" />
                        <div className="flex gap-2">
                          <button onClick={() => setAddNote({ id: null, text: "" })} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
                          <button onClick={() => setAddNote({ id: null, text: "" })} className="btn-primary text-xs py-1.5 px-3">Save Note</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setAddNote({ id: r.id, text: "" })}
                        className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 active:scale-95 transition-all">
                        <Plus size={13} /> Add Clinical Note
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center mt-6">
          <FileText size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="font-semibold text-gray-500">No records found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search</p>
        </div>
      )}
    </div>
  );
}
