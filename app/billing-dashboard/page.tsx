"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Receipt, IndianRupee, CheckCircle2, Clock, TrendingUp,
  Search, RefreshCw, BadgeCheck, XCircle, ChevronDown
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  totalAmount: number;
  breakdown: string;
  status: string;
  issuedDate: string;
}

export default function BillingDashboard() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Unpaid" | "Paid">("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/billing");
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Admin") { router.push("/"); return; }
    fetchInvoices();
  }, []);

  const handleRefresh = () => { setRefreshing(true); fetchInvoices(); };

  const handleToggleStatus = async (invoice: Invoice) => {
    setUpdatingId(invoice.id);
    const newStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";
    await fetch("/api/billing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: invoice.id, status: newStatus }),
    });
    setInvoices(prev => prev.map(inv => inv.id === invoice.id ? { ...inv, status: newStatus } : inv));
    setUpdatingId(null);
  };

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.patientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalRevenue = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const paidRevenue = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.totalAmount, 0);
  const unpaidRevenue = invoices.filter(i => i.status === "Unpaid").reduce((s, i) => s + i.totalAmount, 0);
  const paidCount = invoices.filter(i => i.status === "Paid").length;
  const unpaidCount = invoices.filter(i => i.status === "Unpaid").length;

  // Build simple revenue chart data by date
  const revenueByDate: Record<string, number> = {};
  invoices.forEach(inv => {
    const d = new Date(inv.issuedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    revenueByDate[d] = (revenueByDate[d] || 0) + inv.totalAmount;
  });
  const chartData = Object.entries(revenueByDate)
    .map(([date, amount]) => ({ date, amount: Math.round(amount) }))
    .slice(-7);

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Receipt size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Billing Dashboard</h1>
            <p className="text-sm text-gray-500">Hospital revenue & invoice management</p>
          </div>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-blue-300 transition-all shadow-sm disabled:opacity-60">
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-2">
        {[
          { label: "Total Billed", value: fmt(totalRevenue), sub: `${invoices.length} invoices`, icon: IndianRupee, color: "from-indigo-500 to-blue-600", shadow: "shadow-blue-500/20" },
          { label: "Collected (Paid)", value: fmt(paidRevenue), sub: `${paidCount} invoices`, icon: CheckCircle2, color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/20" },
          { label: "Outstanding", value: fmt(unpaidRevenue), sub: `${unpaidCount} pending`, icon: Clock, color: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
          { label: "Collection Rate", value: totalRevenue > 0 ? `${Math.round((paidRevenue / totalRevenue) * 100)}%` : "0%", sub: "of total billed", icon: TrendingUp, color: "from-purple-500 to-pink-500", shadow: "shadow-purple-500/20" },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-5 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-800 dark:text-white mt-0.5">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Trend Chart */}
      {chartData.length > 1 && (
        <div className="glass-card p-6 mb-8 animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Revenue Trend</h2>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full font-semibold">Last 7 Days</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">Total invoiced amount per day (₹)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="billingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "#fff", padding: "10px 14px" }}
                formatter={(v: number) => [fmt(v), "Revenue"]}
              />
              <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fill="url(#billingGrad)"
                dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#6366f1" }} activeDot={{ r: 7, fill: "#6366f1" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Invoice List */}
      <div className="glass-card overflow-hidden animate-fade-in-up stagger-4">
        {/* List Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-bold text-gray-800 dark:text-white">All Invoices</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-all">
              <Search size={14} className="text-gray-400" />
              <input type="text" placeholder="Search patient..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-sm outline-none w-32 text-gray-700 dark:text-gray-200 bg-transparent" />
            </div>
            {/* Status filter */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {(["All", "Unpaid", "Paid"] as const).map(f => (
                <button key={f} onClick={() => setStatusFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === f ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Receipt size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No invoices found</p>
            <p className="text-sm mt-1">Discharge patients to generate invoices.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-gray-800/50 text-gray-400 text-[11px] uppercase tracking-wider">
                  <th className="text-left py-3 px-5 font-bold">Patient</th>
                  <th className="text-left py-3 px-4 font-bold">Date Issued</th>
                  <th className="text-left py-3 px-4 font-bold">Days</th>
                  <th className="text-right py-3 px-4 font-bold">Amount</th>
                  <th className="text-center py-3 px-4 font-bold">Status</th>
                  <th className="text-center py-3 px-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map(inv => {
                  const breakdown = JSON.parse(inv.breakdown);
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors group">
                      {/* Patient */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                            {inv.patientName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{inv.patientName}</p>
                            <p className="text-[10px] text-gray-400">ID: {inv.patientId.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      {/* Date */}
                      <td className="py-4 px-4 text-gray-500">
                        {new Date(inv.issuedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      {/* Days */}
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-lg text-xs font-semibold">
                          {breakdown.daysAdmitted}d
                        </span>
                      </td>
                      {/* Amount */}
                      <td className="py-4 px-4 text-right font-black text-gray-800 dark:text-gray-200">
                        {fmt(inv.totalAmount)}
                      </td>
                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span className={`text-[11px] px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5 ${
                          inv.status === "Paid"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        }`}>
                          {inv.status === "Paid" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                          {inv.status}
                        </span>
                      </td>
                      {/* Action */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(inv)}
                          disabled={updatingId === inv.id}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-60 ${
                            inv.status === "Paid"
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                              : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20"
                          }`}>
                          {updatingId === inv.id ? "..." : inv.status === "Paid" ? "Mark Unpaid" : "Mark Paid ✓"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">{filtered.length} invoice{filtered.length !== 1 ? "s" : ""} shown</p>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
              Filtered Total: <span className="text-indigo-600 dark:text-indigo-400">{fmt(filtered.reduce((s, i) => s + i.totalAmount, 0))}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
