"use client";
import { useState } from "react";
import { ClipboardList, Plus, ChevronDown, ChevronUp, X, Clock, AlertCircle, CheckCircle } from "lucide-react";

const priorities: Record<string, string> = {
  High: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
  Medium: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
  Low: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
};

const initialNotes = [
  {
    id: 1, shift: "Morning (06:00 – 14:00)", date: "2026-04-29", nurseFrom: "Anita Sharma",
    nurseTo: "Pooja Rani", status: "Completed",
    items: [
      { patient: "Priya Sharma", bed: "A-201", priority: "High", note: "Seizure at 07:30 AM. Doctor informed. Levetiracetam IV given. Monitor every 30 min. BP elevated 158/98.", done: true },
      { patient: "Ravi Sharma", bed: "C-304", priority: "Medium", note: "Refused morning medication. Document in chart. Inform Dr. Mehta on next round.", done: true },
      { patient: "Arjun Kumar", bed: "B-105", priority: "Low", note: "Physiotherapy session at 11 AM. Assisted. Post-session vitals stable.", done: true },
    ],
  },
  {
    id: 2, shift: "Afternoon (14:00 – 22:00)", date: "2026-04-29", nurseFrom: "Pooja Rani",
    nurseTo: "Kavita Singh", status: "Active",
    items: [
      { patient: "Priya Sharma", bed: "A-201", priority: "High", note: "Continue neuro monitoring every 30 min. ICU team reviewing at 18:00. Watch for raised ICP signs.", done: false },
      { patient: "Rahul Agarwal", bed: "C-302", priority: "Medium", note: "Afternoon medication at 14:00 due. BP recheck at 16:00. Cardiologist visit expected.", done: false },
      { patient: "Ravi Sharma", bed: "C-304", priority: "Medium", note: "Convince patient about medication. If still refusing, escalate to Dr. Mehta.", done: false },
    ],
  },
];

export default function HandoverPage() {
  const [notes, setNotes] = useState(initialNotes);
  const [expanded, setExpanded] = useState<number | null>(2);
  const [showForm, setShowForm] = useState(false);
  const [itemDone, setItemDone] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ nurseTo: "", items: [{ patient: "", bed: "", priority: "Medium", note: "" }] });

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { patient: "", bed: "", priority: "Medium", note: "" }] }));
  const removeItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i: number, field: string, val: string) =>
    setForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [field]: val } : it) }));

  const handleSubmit = () => {
    if (!form.nurseTo || form.items[0].patient === "") return;
    const now = new Date();
    setNotes([{
      id: Date.now(), shift: "Night (22:00 – 06:00)",
      date: now.toISOString().split("T")[0],
      nurseFrom: "Kavita Singh", nurseTo: form.nurseTo,
      status: "Active",
      items: form.items.map(it => ({ ...it, done: false })),
    }, ...notes]);
    setShowForm(false);
    setForm({ nurseTo: "", items: [{ patient: "", bed: "", priority: "Medium", note: "" }] });
  };

  const toggleDone = (noteId: number, idx: number) => {
    const key = `${noteId}-${idx}`;
    setItemDone(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Handover Notes</h1>
          <p className="text-sm text-gray-500 mt-1">Shift-to-shift patient care communication</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> New Handover Note
        </button>
      </div>

      {/* Active shift banner */}
      {notes.find(n => n.status === "Active") && (() => {
        const active = notes.find(n => n.status === "Active")!;
        const pending = active.items.filter((it, idx) => !itemDone[`${active.id}-${idx}`] && !it.done).length;
        return (
          <div className="glass-card p-4 mb-6 border-l-4 border-l-teal-500 animate-fade-in-up stagger-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">Active: {active.shift}</p>
                <p className="text-xs text-gray-500">Nurse: {active.nurseFrom} → {active.nurseTo}</p>
              </div>
            </div>
            {pending > 0 ? (
              <div className="flex items-center gap-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full font-semibold border border-yellow-200 dark:border-yellow-800/50">
                <AlertCircle size={12} /> {pending} pending task{pending > 1 ? "s" : ""}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full font-semibold border border-green-200 dark:border-green-800/50">
                <CheckCircle size={12} /> All tasks done
              </div>
            )}
          </div>
        );
      })()}

      {/* Notes */}
      <div className="space-y-4 animate-fade-in-up stagger-2">
        {notes.map(note => (
          <div key={note.id} className="glass-card overflow-hidden">
            <button onClick={() => setExpanded(expanded === note.id ? null : note.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${note.status === "Active" ? "bg-gradient-to-br from-teal-400 to-teal-600" : "bg-gradient-to-br from-gray-300 to-gray-400"}`}>
                  <ClipboardList size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800 dark:text-white">{note.shift}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${note.status === "Active" ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                      {note.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">{note.date} · {note.nurseFrom} → {note.nurseTo} · {note.items.length} patient{note.items.length > 1 ? "s" : ""}</p>
                </div>
              </div>
              {expanded === note.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>

            {expanded === note.id && (
              <div className="border-t border-gray-100 dark:border-gray-700/50 px-5 pb-5 pt-4 space-y-3 animate-fade-in">
                {note.items.map((it, idx) => {
                  const key = `${note.id}-${idx}`;
                  const done = it.done || itemDone[key];
                  return (
                    <div key={idx} className={`p-4 rounded-xl border transition-all ${done ? "opacity-50 bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700" : "bg-white/60 dark:bg-gray-800/60 border-gray-100 dark:border-gray-700/50"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <p className={`text-sm font-bold ${done ? "line-through text-gray-400" : "text-gray-800 dark:text-white"}`}>{it.patient}</p>
                            <span className="text-[10px] text-gray-400">Bed {it.bed}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${priorities[it.priority]}`}>{it.priority}</span>
                          </div>
                          <p className={`text-sm leading-relaxed ${done ? "line-through text-gray-400" : "text-gray-600 dark:text-gray-300"}`}>{it.note}</p>
                        </div>
                        {note.status === "Active" && (
                          <button onClick={() => toggleDone(note.id, idx)}
                            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all active:scale-95 ${done ? "bg-green-500 border-green-500 text-white" : "border-gray-300 dark:border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-400"}`}>
                            {done && <CheckCircle size={16} />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Note Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg animate-pop-in max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">New Handover Note</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all"><X size={16} /></button>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Handing Over To</label>
                <input value={form.nurseTo} onChange={e => setForm({ ...form, nurseTo: e.target.value })} placeholder="Nurse name"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Tasks</label>
                  <button onClick={addItem} className="text-xs text-teal-600 font-semibold flex items-center gap-1 hover:text-teal-700 active:scale-95"><Plus size={12} /> Add Patient</button>
                </div>
                {form.items.map((it, i) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input value={it.patient} onChange={e => updateItem(i, "patient", e.target.value)} placeholder="Patient name"
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-500/50" />
                      <input value={it.bed} onChange={e => updateItem(i, "bed", e.target.value)} placeholder="Bed (e.g. A-201)"
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-500/50" />
                    </div>
                    <div className="flex gap-2">
                      <select value={it.priority} onChange={e => updateItem(i, "priority", e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-500/50">
                        {["High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}
                      </select>
                      {form.items.length > 1 && (
                        <button onClick={() => removeItem(i)} className="px-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 active:scale-95 transition-all"><X size={12} /></button>
                      )}
                    </div>
                    <textarea value={it.note} onChange={e => updateItem(i, "note", e.target.value)} rows={2} placeholder="Task note / instruction..."
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-500/50 resize-none" />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSubmit} className="btn-primary flex-1">Submit Handover</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
