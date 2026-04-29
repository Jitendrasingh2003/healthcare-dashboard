"use client";
import { useState } from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle, Plus } from "lucide-react";

const statusStyles: Record<string, string> = {
    Paid: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
    Pending: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
    Overdue: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
};

const initialBills = [
    { id: "INV-001", patient: "Rahul Agarwal", dept: "Cardiology", amount: 12500, date: "2026-04-20", status: "Paid", items: "Consultation, ECG, Medicine" },
    { id: "INV-002", patient: "Priya Sharma", dept: "Neurology", amount: 28000, date: "2026-04-21", status: "Pending", items: "MRI Scan, Consultation" },
    { id: "INV-003", patient: "Arjun Kumar", dept: "Orthopedics", amount: 55000, date: "2026-04-18", status: "Paid", items: "Surgery, ICU, Medicine" },
    { id: "INV-004", patient: "Sunita Mishra", dept: "Pediatrics", amount: 4500, date: "2026-04-15", status: "Overdue", items: "Consultation, Vaccine" },
    { id: "INV-005", patient: "Vikas Gupta", dept: "Cardiology", amount: 8200, date: "2026-04-22", status: "Pending", items: "Echo, Medicine" },
    { id: "INV-006", patient: "Meena Iyer", dept: "Neurology", amount: 15000, date: "2026-04-23", status: "Paid", items: "EEG, Consultation" },
];

export default function BillingPage() {
    const [bills, setBills] = useState(initialBills);
    const [filter, setFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ patient: "", dept: "Cardiology", amount: "", items: "" });

    const filtered = filter === "All" ? bills : bills.filter(b => b.status === filter);
    const markPaid = (id: string) => setBills(bills.map(b => b.id === id ? { ...b, status: "Paid" } : b));

    const totalRevenue = bills.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0);
    const pendingAmount = bills.filter(b => b.status === "Pending").reduce((s, b) => s + b.amount, 0);
    const overdueAmount = bills.filter(b => b.status === "Overdue").reduce((s, b) => s + b.amount, 0);

    const handleAdd = () => {
        if (!form.patient || !form.amount) return;
        const id = `INV-${String(bills.length + 1).padStart(3, "0")}`;
        setBills([{ id, patient: form.patient, dept: form.dept, amount: Number(form.amount), date: new Date().toISOString().split("T")[0], status: "Pending", items: form.items }, ...bills]);
        setShowForm(false);
        setForm({ patient: "", dept: "Cardiology", amount: "", items: "" });
    };

    return (
        <div className="min-h-screen p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Billing</h1>
                    <p className="text-sm text-gray-500 mt-1">Patient invoices and payment management</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> New Invoice</button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in-up stagger-1">
                {[
                    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "from-teal-400 to-teal-600" },
                    { label: "Pending Amount", value: `₹${pendingAmount.toLocaleString("en-IN")}`, icon: Clock, color: "from-yellow-400 to-yellow-600" },
                    { label: "Overdue", value: `₹${overdueAmount.toLocaleString("en-IN")}`, icon: DollarSign, color: "from-red-400 to-red-600" },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="glass-card p-5 group">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={18} />
                            </div>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">{s.value}</p>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6 flex-wrap animate-fade-in-up stagger-2">
                {["All", "Paid", "Pending", "Overdue"].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 ${filter === s ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30" : "glass text-gray-600 dark:text-gray-300 hover:text-teal-600"}`}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="glass-card p-0 overflow-hidden animate-fade-in-up stagger-3">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30">
                                {["Invoice", "Patient", "Department", "Items", "Amount", "Date", "Status", "Action"].map(h => (
                                    <th key={h} className="text-left py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(b => (
                                <tr key={b.id} className="border-b border-gray-100/50 dark:border-gray-800/50 last:border-0 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors">
                                    <td className="py-4 px-4 font-mono text-xs font-bold text-teal-600 dark:text-teal-400">{b.id}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                                {b.patient.split(" ").map((n: string) => n[0]).join("")}
                                            </div>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">{b.patient}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{b.dept}</td>
                                    <td className="py-4 px-4 text-gray-500 text-xs max-w-36">{b.items}</td>
                                    <td className="py-4 px-4 font-bold text-gray-800 dark:text-white whitespace-nowrap">₹{b.amount.toLocaleString("en-IN")}</td>
                                    <td className="py-4 px-4 text-gray-500 text-xs whitespace-nowrap">{b.date}</td>
                                    <td className="py-4 px-4">
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap ${statusStyles[b.status]}`}>{b.status}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {b.status !== "Paid" && (
                                            <button onClick={() => markPaid(b.id)} className="text-[10px] px-3 py-1 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 active:scale-95 transition-all font-bold whitespace-nowrap">Mark Paid</button>
                                        )}
                                        {b.status === "Paid" && <CheckCircle size={16} className="text-green-500" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl p-6 w-full max-w-md mx-4 animate-pop-in">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">New Invoice</h2>
                            <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all">✕</button>
                        </div>
                        <div className="space-y-3">
                            {[{ label: "Patient Name", key: "patient", ph: "Full name" }, { label: "Amount (₹)", key: "amount", ph: "e.g. 12500" }, { label: "Items / Services", key: "items", ph: "e.g. Consultation, Medicine" }].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                                    <input placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Department</label>
                                <select value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General"].map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={handleAdd} className="btn-primary flex-1">Create Invoice</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
