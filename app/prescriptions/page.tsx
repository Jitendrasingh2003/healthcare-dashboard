"use client";
import { useState } from "react";
import { Plus, Pill, Printer, Search, X, CheckCircle, Clock, AlertCircle } from "lucide-react";

const statusStyles: Record<string, string> = {
  Active: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
  Completed: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
  Cancelled: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
};

const initialPrescriptions = [
  { id: 1, patient: "Rahul Agarwal", age: 45, dept: "Cardiology", date: "2026-04-21", diagnosis: "Hypertension", medicines: [{ name: "Amlodipine", dose: "5mg", freq: "Once daily", duration: "30 days" }, { name: "Aspirin", dose: "75mg", freq: "Once daily", duration: "30 days" }], status: "Active", notes: "Check BP weekly. Avoid high-sodium diet." },
  { id: 2, patient: "Vikas Gupta", age: 28, dept: "Cardiology", date: "2026-04-19", diagnosis: "Chest Pain (non-cardiac)", medicines: [{ name: "Pantoprazole", dose: "40mg", freq: "Twice daily", duration: "14 days" }, { name: "Antacid", dose: "10ml", freq: "After meals", duration: "14 days" }], status: "Active", notes: "Return if pain worsens. Avoid spicy food." },
  { id: 3, patient: "Sunita Mishra", age: 55, dept: "Cardiology", date: "2026-04-15", diagnosis: "Palpitations", medicines: [{ name: "Metoprolol", dose: "25mg", freq: "Twice daily", duration: "7 days" }], status: "Completed", notes: "Follow-up in 1 week. ECG done." },
  { id: 4, patient: "Ravi Sharma", age: 50, dept: "Cardiology", date: "2026-04-10", diagnosis: "Angina", medicines: [{ name: "Nitroglycerin", dose: "0.5mg", freq: "As needed", duration: "On demand" }, { name: "Atorvastatin", dose: "20mg", freq: "Once at night", duration: "Ongoing" }], status: "Active", notes: "Avoid strenuous activity. Review in 2 weeks." },
];

type Medicine = { name: string; dose: string; freq: string; duration: string };

const emptyMed: Medicine = { name: "", dose: "", freq: "Once daily", duration: "7 days" };

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState<typeof initialPrescriptions[0] | null>(null);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ patient: "", age: "", dept: "Cardiology", diagnosis: "", notes: "", medicines: [{ ...emptyMed }] });

  const filtered = prescriptions.filter(p => {
    const matchSearch = p.patient.toLowerCase().includes(search.toLowerCase()) || p.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const addMedicine = () => setForm(f => ({ ...f, medicines: [...f.medicines, { ...emptyMed }] }));
  const removeMedicine = (i: number) => setForm(f => ({ ...f, medicines: f.medicines.filter((_, idx) => idx !== i) }));
  const updateMed = (i: number, field: keyof Medicine, val: string) =>
    setForm(f => ({ ...f, medicines: f.medicines.map((m, idx) => idx === i ? { ...m, [field]: val } : m) }));

  const handleSubmit = () => {
    if (!form.patient || !form.diagnosis || form.medicines[0].name === "") return;
    setPrescriptions([{
      id: Date.now(), patient: form.patient, age: parseInt(form.age) || 0,
      dept: form.dept, date: new Date().toISOString().split("T")[0],
      diagnosis: form.diagnosis, medicines: form.medicines,
      status: "Active", notes: form.notes,
    }, ...prescriptions]);
    setShowForm(false);
    setForm({ patient: "", age: "", dept: "Cardiology", diagnosis: "", notes: "", medicines: [{ ...emptyMed }] });
  };

  const counts = {
    total: prescriptions.length,
    active: prescriptions.filter(p => p.status === "Active").length,
    completed: prescriptions.filter(p => p.status === "Completed").length,
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Prescriptions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and issue patient prescriptions</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> New Prescription
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up stagger-1">
        {[
          { label: "Total", value: counts.total, icon: Pill, color: "from-teal-400 to-teal-600", shadow: "shadow-teal-500/20" },
          { label: "Active", value: counts.active, icon: CheckCircle, color: "from-green-400 to-green-600", shadow: "shadow-green-500/20" },
          { label: "Completed", value: counts.completed, icon: Clock, color: "from-blue-400 to-blue-600", shadow: "shadow-blue-500/20" },
        ].map(s => (
          <div key={s.label} className="glass-card p-5 group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3 shadow-lg ${s.shadow} group-hover:scale-110 transition-transform duration-300`}>
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
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient or diagnosis..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 backdrop-blur-sm transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Active", "Completed", "Cancelled"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 ${filter === s ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30" : "glass text-gray-600 dark:text-gray-300 hover:text-teal-600"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Prescription Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up stagger-3">
        {filtered.map(p => (
          <div key={p.id} className="glass-card p-5 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 flex-shrink-0">
                  {p.patient.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white text-sm">{p.patient}</p>
                  <p className="text-[11px] text-gray-400">{p.dept} · Age {p.age} · {p.date}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${statusStyles[p.status]}`}>{p.status}</span>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl px-4 py-2.5 mb-3">
              <p className="text-[10px] text-blue-500 uppercase font-bold tracking-wider mb-0.5">Diagnosis</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{p.diagnosis}</p>
            </div>

            <div className="space-y-2 mb-3">
              {p.medicines.map((m, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700/50">
                  <Pill size={13} className="text-teal-500 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-gray-800 dark:text-white">{m.name}</span>
                    <span className="text-[10px] text-gray-500 ml-1.5">{m.dose} · {m.freq} · {m.duration}</span>
                  </div>
                </div>
              ))}
            </div>

            {p.notes && (
              <p className="text-[11px] text-gray-400 italic border-t border-gray-100 dark:border-gray-700/50 pt-2.5 mb-3">📝 {p.notes}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={() => setViewItem(p)} className="flex-1 text-xs font-semibold py-2 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors active:scale-95">
                View Full
              </button>
              <button className="flex-1 text-xs font-semibold py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-95 flex items-center justify-center gap-1.5">
                <Printer size={12} /> Print
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center mt-6">
          <Pill size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="font-semibold text-gray-500">No prescriptions found</p>
          <p className="text-sm text-gray-400 mt-1">Try different search terms or add a new prescription</p>
        </div>
      )}

      {/* View Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg animate-pop-in max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Prescription</h2>
                  <p className="text-xs text-gray-400 mt-0.5">City General Hospital · Dr. Mehta</p>
                </div>
                <button onClick={() => setViewItem(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Patient</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{viewItem.patient}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Date</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{viewItem.date}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Age / Dept</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{viewItem.age} yrs · {viewItem.dept}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                    <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">Diagnosis</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{viewItem.diagnosis}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Medicines</p>
                  <div className="space-y-2">
                    {viewItem.medicines.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800/30">
                        <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center flex-shrink-0">
                          <Pill size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-white">{m.name} — {m.dose}</p>
                          <p className="text-[11px] text-gray-500">{m.freq} for {m.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {viewItem.notes && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-xl p-3">
                    <p className="text-[10px] text-yellow-600 uppercase font-bold tracking-wider mb-1">Doctor's Notes</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{viewItem.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setViewItem(null)} className="btn-secondary flex-1">Close</button>
                <button className="btn-primary flex-1 gap-2"><Printer size={14} /> Print Prescription</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Prescription Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg animate-pop-in max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">New Prescription</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Patient Name</label>
                    <input value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} placeholder="Full name"
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Age</label>
                    <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Years"
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Diagnosis</label>
                  <input value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} placeholder="Primary diagnosis"
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Medicines</label>
                    <button onClick={addMedicine} className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1 active:scale-95">
                      <Plus size={12} /> Add Medicine
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.medicines.map((m, i) => (
                      <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input value={m.name} onChange={e => updateMed(i, "name", e.target.value)} placeholder="Medicine name"
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-500/50" />
                          <input value={m.dose} onChange={e => updateMed(i, "dose", e.target.value)} placeholder="Dose e.g. 10mg"
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-500/50" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select value={m.freq} onChange={e => updateMed(i, "freq", e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-500/50">
                            {["Once daily", "Twice daily", "Thrice daily", "After meals", "Before meals", "At bedtime", "As needed"].map(f => <option key={f}>{f}</option>)}
                          </select>
                          <div className="flex gap-1">
                            <input value={m.duration} onChange={e => updateMed(i, "duration", e.target.value)} placeholder="Duration"
                              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-500/50" />
                            {form.medicines.length > 1 && (
                              <button onClick={() => removeMedicine(i)} className="w-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 active:scale-95 transition-all">
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Notes (optional)</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Doctor's notes, dietary advice..."
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all resize-none" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSubmit} className="btn-primary flex-1">Issue Prescription</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
