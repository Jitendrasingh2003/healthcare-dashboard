"use client";
import { useState } from "react";
import { BedDouble, Search, UserPlus, UserMinus, Sparkles, X } from "lucide-react";

type BedStatus = "Occupied" | "Available" | "Reserved" | "Maintenance";

const initialBeds: { id: string; ward: string; type: string; status: BedStatus; patient: string; since: string; doctor: string }[] = [
  { id: "A-101", ward: "Neurology", type: "General", status: "Occupied", patient: "Priya Sharma", since: "Apr 20", doctor: "Dr. Verma" },
  { id: "A-102", ward: "Neurology", type: "General", status: "Available", patient: "", since: "", doctor: "" },
  { id: "A-103", ward: "Neurology", type: "ICU", status: "Occupied", patient: "Dev Kapoor", since: "Apr 22", doctor: "Dr. Verma" },
  { id: "A-104", ward: "Neurology", type: "ICU", status: "Maintenance", patient: "", since: "", doctor: "" },
  { id: "B-101", ward: "Orthopedics", type: "General", status: "Occupied", patient: "Arjun Kumar", since: "Apr 18", doctor: "Dr. Singh" },
  { id: "B-102", ward: "Orthopedics", type: "General", status: "Available", patient: "", since: "", doctor: "" },
  { id: "B-103", ward: "Orthopedics", type: "Private", status: "Reserved", patient: "Ramesh Joshi", since: "", doctor: "Dr. Singh" },
  { id: "B-104", ward: "Orthopedics", type: "Private", status: "Available", patient: "", since: "", doctor: "" },
  { id: "C-301", ward: "Cardiology", type: "General", status: "Occupied", patient: "Rahul Agarwal", since: "Apr 19", doctor: "Dr. Mehta" },
  { id: "C-302", ward: "Cardiology", type: "General", status: "Occupied", patient: "Vikas Gupta", since: "Apr 21", doctor: "Dr. Mehta" },
  { id: "C-303", ward: "Cardiology", type: "ICU", status: "Available", patient: "", since: "", doctor: "" },
  { id: "C-304", ward: "Cardiology", type: "General", status: "Occupied", patient: "Ravi Sharma", since: "Apr 25", doctor: "Dr. Mehta" },
];

const statusStyles: Record<BedStatus, string> = {
  Occupied: "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50",
  Available: "border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800/50",
  Reserved: "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800/50",
  Maintenance: "border-gray-300 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700",
};

const statusBadge: Record<BedStatus, string> = {
  Occupied: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
  Available: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
  Reserved: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
  Maintenance: "bg-gray-100/80 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700",
};

const typeColor: Record<string, string> = {
  "General": "text-blue-500",
  "ICU": "text-red-500 font-bold",
  "Private": "text-purple-500",
};

const wards = ["All", "Neurology", "Orthopedics", "Cardiology"];

export default function BedsPage() {
  const [beds, setBeds] = useState(initialBeds);
  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dischargeId, setDischargeId] = useState<string | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [predicting, setPredicting] = useState(false);

  const predictBeds = async () => {
    setShowPrediction(true);
    if (prediction) return;
    setPredicting(true);
    try {
      const res = await fetch('/api/ai/bed-predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beds }),
      });
      const data = await res.json();
      if (res.ok) setPrediction(data.prediction);
      else setPrediction(`<p class="text-red-500">Error: ${data.error}</p>`);
    } catch (e: any) {
      setPrediction(`<p class="text-red-500">Failed to connect: ${e.message}</p>`);
    } finally {
      setPredicting(false);
    }
  };

  const filtered = beds.filter(b => {
    const matchSearch = b.id.toLowerCase().includes(search.toLowerCase()) || b.patient.toLowerCase().includes(search.toLowerCase());
    const matchWard = ward === "All" || b.ward === ward;
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    return matchSearch && matchWard && matchStatus;
  });

  const discharge = (id: string) => {
    setBeds(prev => prev.map(b => b.id === id ? { ...b, status: "Available", patient: "", since: "", doctor: "" } : b));
    setDischargeId(null);
  };

  const counts = {
    total: beds.length,
    occupied: beds.filter(b => b.status === "Occupied").length,
    available: beds.filter(b => b.status === "Available").length,
    reserved: beds.filter(b => b.status === "Reserved").length,
  };

  const occupancy = Math.round((counts.occupied / counts.total) * 100);

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Bed Management</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time ward bed status and occupancy</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={predictBeds}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/30"
          >
            <Sparkles size={15} /> AI Bed Forecast
          </button>
          <div className="glass-card px-5 py-3 min-w-[200px]">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-gray-500">Overall Occupancy</p>
            <p className={`text-sm font-bold ${occupancy >= 85 ? "text-red-500" : occupancy >= 70 ? "text-yellow-500" : "text-green-500"}`}>{occupancy}%</p>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${occupancy >= 85 ? "bg-gradient-to-r from-red-400 to-red-600" : occupancy >= 70 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : "bg-gradient-to-r from-green-400 to-green-600"}`}
              style={{ width: `${occupancy}%` }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{counts.occupied} occupied / {counts.total} total beds</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-1">
        {[
          { label: "Total Beds", value: counts.total, color: "from-teal-400 to-teal-600" },
          { label: "Occupied", value: counts.occupied, color: "from-red-400 to-red-600" },
          { label: "Available", value: counts.available, color: "from-green-400 to-green-600" },
          { label: "Reserved", value: counts.reserved, color: "from-yellow-400 to-yellow-600" },
        ].map(s => (
          <div key={s.label} className="glass-card p-5 group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <BedDouble size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.value}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up stagger-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bed ID or patient..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30 backdrop-blur-sm transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {wards.map(w => (
            <button key={w} onClick={() => setWard(w)}
              className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 whitespace-nowrap ${ward === w ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30" : "glass text-gray-600 dark:text-gray-300 hover:text-teal-600"}`}>
              {w}
            </button>
          ))}
          {["All", "Occupied", "Available", "Reserved", "Maintenance"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-xs font-semibold px-3 py-2.5 rounded-xl transition-all active:scale-95 whitespace-nowrap ${statusFilter === s ? "bg-gray-700 text-white" : "glass text-gray-500 dark:text-gray-400"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in-up stagger-3">
        {filtered.map(b => (
          <div key={b.id} className={`rounded-2xl border-2 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${statusStyles[b.status]}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-gray-800 dark:text-white text-base">{b.id}</p>
                <p className={`text-[11px] font-semibold ${typeColor[b.type] || "text-gray-500"}`}>{b.type} · {b.ward}</p>
              </div>
              <BedDouble size={20} className={b.status === "Occupied" ? "text-red-400" : b.status === "Available" ? "text-green-400" : b.status === "Reserved" ? "text-yellow-400" : "text-gray-400"} />
            </div>

            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${statusBadge[b.status]}`}>{b.status}</span>

            {b.patient && (
              <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{b.patient}</p>
                <p className="text-[10px] text-gray-400">{b.doctor}</p>
                <p className="text-[10px] text-gray-400">Since {b.since}</p>
              </div>
            )}

            {b.status === "Occupied" && (
              <button onClick={() => setDischargeId(b.id)}
                className="w-full mt-3 text-xs font-semibold py-1.5 rounded-lg bg-white/70 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                <UserMinus size={12} /> Discharge
              </button>
            )}
            {b.status === "Available" && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-green-600 dark:text-green-400 font-semibold">
                <UserPlus size={12} /> Ready to admit
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Discharge Confirm */}
      {dischargeId && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-sm animate-pop-in p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Confirm Discharge</h2>
            <p className="text-sm text-gray-500 mb-6">
              This will mark bed <strong>{dischargeId}</strong> ({beds.find(b => b.id === dischargeId)?.patient}) as available.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDischargeId(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => discharge(dischargeId)} className="flex-1 text-sm font-semibold py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white active:scale-95 transition-all">Confirm Discharge</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Bed Prediction Modal */}
      {showPrediction && (
        <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-2xl animate-pop-in flex flex-col" style={{ maxHeight: '90vh' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-3xl flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-white" />
                <div>
                  <p className="text-white font-bold">AI Bed Availability Forecast</p>
                  <p className="text-indigo-200 text-xs">{counts.occupied}/{counts.total} beds occupied · Next 24-48 hours prediction</p>
                </div>
              </div>
              <button onClick={() => setShowPrediction(false)} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-6">
              {predicting ? (
                <div className="space-y-3 animate-pulse">
                  {[90, 70, 100, 60, 85, 75, 95, 65].map((w, i) => (
                    <div key={i} className="h-3 bg-indigo-100 dark:bg-indigo-900/30 rounded" style={{ width: `${w}%` }} />
                  ))}
                  <p className="text-center text-sm text-indigo-400 mt-4 font-medium">✨ Analyzing bed occupancy patterns...</p>
                </div>
              ) : (
                <div
                  className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 [&>h3]:text-indigo-800 [&>h3]:dark:text-indigo-300 [&>h3]:font-bold [&>h3]:text-sm [&>h3]:uppercase [&>h3]:tracking-wider [&>h3]:mt-5 [&>h3]:mb-2 [&>h3]:pb-1 [&>h3]:border-b [&>h3]:border-indigo-100 [&>h3]:dark:border-indigo-800/30 [&>p]:text-sm [&>p]:leading-relaxed [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ul]:text-sm"
                  dangerouslySetInnerHTML={{ __html: prediction || '' }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 flex-shrink-0">
              <button onClick={() => setShowPrediction(false)} className="btn-secondary flex-1">Close</button>
              <button
                onClick={() => { setPrediction(null); setTimeout(() => predictBeds(), 100); }}
                className="flex items-center justify-center gap-2 flex-1 text-sm font-semibold py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 active:scale-95 transition-all"
              >
                <Sparkles size={14} /> Refresh Forecast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
