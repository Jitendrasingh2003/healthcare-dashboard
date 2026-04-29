"use client";
import { useState } from "react";
import { FlaskConical, Search, CheckCircle, Clock, AlertCircle, Eye, X, Plus } from "lucide-react";

const statusStyles: Record<string, string> = {
  Reviewed: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
  Pending: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
  Critical: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
};

const resultColor: Record<string, string> = {
  Normal: "text-green-600 dark:text-green-400 font-bold",
  Borderline: "text-yellow-600 dark:text-yellow-400 font-bold",
  Abnormal: "text-red-600 dark:text-red-400 font-bold",
};

const initialReports = [
  {
    id: 1, patient: "Priya Sharma", age: 62, dept: "Neurology", doctor: "Dr. Verma",
    date: "2026-04-28", testName: "MRI Brain", category: "Imaging",
    result: "Abnormal", findings: "Hyperintense lesion in right parietal lobe, suggestive of ischemic event. Size ~1.2cm.",
    status: "Critical", notes: "", reviewedAt: "",
  },
  {
    id: 2, patient: "Rahul Agarwal", age: 45, dept: "Cardiology", doctor: "Dr. Mehta",
    date: "2026-04-27", testName: "Lipid Profile", category: "Blood Test",
    result: "Borderline", findings: "Total Cholesterol: 220 mg/dL, LDL: 140 mg/dL, HDL: 42 mg/dL, Triglycerides: 185 mg/dL.",
    status: "Pending", notes: "", reviewedAt: "",
  },
  {
    id: 3, patient: "Rahul Agarwal", age: 45, dept: "Cardiology", doctor: "Dr. Mehta",
    date: "2026-04-27", testName: "ECG", category: "Cardiac",
    result: "Abnormal", findings: "Mild LVH changes noted. PR interval 0.22s (borderline first-degree AV block). QTc 440ms.",
    status: "Pending", notes: "", reviewedAt: "",
  },
  {
    id: 4, patient: "Vikas Gupta", age: 28, dept: "Cardiology", doctor: "Dr. Mehta",
    date: "2026-04-26", testName: "Troponin I", category: "Blood Test",
    result: "Normal", findings: "Troponin I: 0.01 ng/mL (< 0.04 reference). Negative for myocardial injury.",
    status: "Reviewed", notes: "Cardiac markers negative. Chest pain likely non-cardiac in origin.", reviewedAt: "2026-04-26",
  },
  {
    id: 5, patient: "Ravi Sharma", age: 50, dept: "Cardiology", doctor: "Dr. Mehta",
    date: "2026-04-26", testName: "Stress Test", category: "Cardiac",
    result: "Abnormal", findings: "Positive at 60% max HR. 1.5mm ST depression in leads V4-V6. Symptoms: mild chest tightness.",
    status: "Reviewed", notes: "Referred for coronary angiography. Started on Nitroglycerin PRN.", reviewedAt: "2026-04-27",
  },
  {
    id: 6, patient: "Ravi Sharma", age: 50, dept: "Cardiology", doctor: "Dr. Mehta",
    date: "2026-04-27", testName: "Echocardiogram", category: "Imaging",
    result: "Borderline", findings: "EF 55% (normal). Mild diastolic dysfunction (Grade I). No significant valvular disease.",
    status: "Reviewed", notes: "Echo acceptable. Continue monitoring.", reviewedAt: "2026-04-28",
  },
];

type Report = typeof initialReports[0];

export default function LabReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewItem, setViewItem] = useState<Report | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  const filtered = reports.filter(r => {
    const matchSearch =
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.testName.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const markReviewed = (id: number, note: string) => {
    setReports(prev =>
      prev.map(r => r.id === id ? { ...r, status: "Reviewed", notes: note, reviewedAt: new Date().toISOString().split("T")[0] } : r)
    );
    setViewItem(null);
    setReviewNote("");
  };

  const counts = {
    total: reports.length,
    pending: reports.filter(r => r.status === "Pending").length,
    critical: reports.filter(r => r.status === "Critical").length,
    reviewed: reports.filter(r => r.status === "Reviewed").length,
  };

  const categoryIcon: Record<string, string> = {
    "Blood Test": "🩸",
    "Imaging": "🧠",
    "Cardiac": "❤️",
    "Pathology": "🔬",
    "Urine": "💧",
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Lab Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage patient lab results</p>
        </div>
        {counts.critical > 0 && (
          <div className="flex items-center gap-2 text-xs bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-full font-semibold border border-red-200 dark:border-red-800/50 animate-pulse">
            <AlertCircle size={13} /> {counts.critical} Critical report{counts.critical > 1 ? "s" : ""} need attention
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-1">
        {[
          { label: "Total Reports", value: counts.total, icon: FlaskConical, color: "from-teal-400 to-teal-600", shadow: "shadow-teal-500/20" },
          { label: "Pending Review", value: counts.pending, icon: Clock, color: "from-yellow-400 to-yellow-600", shadow: "shadow-yellow-500/20" },
          { label: "Critical", value: counts.critical, icon: AlertCircle, color: "from-red-400 to-red-600", shadow: "shadow-red-500/20" },
          { label: "Reviewed", value: counts.reviewed, icon: CheckCircle, color: "from-green-400 to-green-600", shadow: "shadow-green-500/20" },
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
            placeholder="Search by patient, test name or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 backdrop-blur-sm transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Critical", "Reviewed"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 whitespace-nowrap ${filter === s ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30" : "glass text-gray-600 dark:text-gray-300 hover:text-teal-600"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="glass-card overflow-hidden animate-fade-in-up stagger-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30">
                {["Patient", "Test", "Category", "Date", "Result", "Status", "Action"].map(h => (
                  <th key={h} className="text-left py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className={`border-b border-gray-100/50 dark:border-gray-800/50 last:border-0 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors ${r.status === "Critical" ? "bg-red-50/30 dark:bg-red-900/10" : ""}`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {r.patient.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">{r.patient}</p>
                        <p className="text-[10px] text-gray-400">{r.dept} · Age {r.age}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">{r.testName}</td>
                  <td className="py-4 px-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {categoryIcon[r.category] || "🔬"} {r.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{r.date}</td>
                  <td className="py-4 px-4">
                    <span className={`text-xs ${resultColor[r.result] || "text-gray-600"}`}>{r.result}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide whitespace-nowrap ${statusStyles[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => { setViewItem(r); setReviewNote(r.notes); }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/40 active:scale-95 transition-all whitespace-nowrap"
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <FlaskConical size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="font-semibold text-gray-500">No reports found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search or filter</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg animate-pop-in max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{viewItem.testName}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{viewItem.category} · {viewItem.date}</p>
                </div>
                <button onClick={() => setViewItem(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Patient Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Patient</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{viewItem.patient}</p>
                    <p className="text-[11px] text-gray-400">{viewItem.dept} · Age {viewItem.age}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Status</p>
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide mt-1.5 inline-block ${statusStyles[viewItem.status]}`}>
                      {viewItem.status}
                    </span>
                  </div>
                </div>

                {/* Result */}
                <div className={`rounded-xl p-4 border ${viewItem.result === "Abnormal" ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30" : viewItem.result === "Borderline" ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800/30" : "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Result</p>
                    <span className={`text-sm font-bold ${resultColor[viewItem.result]}`}>{viewItem.result}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{viewItem.findings}</p>
                </div>

                {/* Doctor Note / Review */}
                {viewItem.status === "Reviewed" ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle size={13} className="text-green-500" />
                      <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Reviewed on {viewItem.reviewedAt}</p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{viewItem.notes || "No notes added."}</p>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Doctor's Review Note
                    </label>
                    <textarea rows={3} value={reviewNote} onChange={e => setReviewNote(e.target.value)}
                      placeholder="Add your clinical assessment and notes..."
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setViewItem(null)} className="btn-secondary flex-1">Close</button>
                {viewItem.status !== "Reviewed" && (
                  <button onClick={() => markReviewed(viewItem.id, reviewNote)} className="btn-primary flex-1 gap-2">
                    <CheckCircle size={14} /> Mark as Reviewed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
