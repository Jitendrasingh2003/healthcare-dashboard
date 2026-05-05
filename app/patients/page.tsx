"use client";
import { useState, useEffect } from "react";
import { Search, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const statusStyles: Record<string, string> = {
    Stable: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
    Critical: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
    Observation: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
    Discharged: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
};

const depts = ["All", "Cardiology", "Neurology", "Orthopedics", "Pediatrics"];
const statuses = ["All", "Stable", "Critical", "Observation", "Discharged"];

export default function PatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "", age: "", gender: "Male", blood: "B+",
        phone: "", email: "", dept: "Cardiology", doctor: "Dr. Mehta", status: "Stable",
    });
    const [saving, setSaving] = useState(false);
    const [triggeringCron, setTriggeringCron] = useState(false);

    const handleTriggerCron = async () => {
        setTriggeringCron(true);
        try {
            const res = await fetch("/api/cron/send-reminders");
            const data = await res.json();
            alert(data.message || data.error);
        } catch (e) {
            console.error(e);
            alert("Failed to trigger cron.");
        }
        setTriggeringCron(false);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        const res = await fetch("/api/patients");
        const data = await res.json();
        setPatients(data);
        setLoading(false);
    };

    const handleAdmit = async () => {
        setSaving(true);
        await fetch("/api/patients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setSaving(false);
        setShowForm(false);
        fetchPatients();
    };

    const filtered = patients.filter((p) => {
        const matchName = p.name.toLowerCase().includes(search.toLowerCase());
        const matchDept = deptFilter === "All" || p.dept === deptFilter;
        const matchStatus = statusFilter === "All" || p.status === statusFilter;
        return matchName && matchDept && matchStatus;
    });

    return (
        <div className="min-h-screen p-6 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-fade-in-up gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full glass hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95 text-gray-500">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Patients</h1>
                        <p className="text-sm text-gray-500 mt-1">{filtered.length} patients found</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleTriggerCron}
                        disabled={triggeringCron}
                        className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-60"
                        title="Simulate daily cron job to send reminders"
                    >
                        {triggeringCron ? "Sending..." : "🔔 Send Reminders (Cron)"}
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary"
                    >
                        <Plus size={16} /> Admit Patient
                    </button>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-wrap gap-3 mb-8 animate-fade-in-up stagger-2">
                <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl flex-1 min-w-48 group focus-within:ring-2 focus-within:ring-teal-500/50 transition-all">
                    <Search size={16} className="text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search patient name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-sm outline-none w-full text-gray-700 dark:text-gray-200 bg-transparent placeholder:text-gray-400"
                    />
                </div>
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="text-sm glass px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none cursor-pointer">
                    {depts.map((d) => <option key={d}>{d}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm glass px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none cursor-pointer">
                    {statuses.map((s) => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20 animate-fade-in">
                    <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin shadow-lg" />
                </div>
            )}

            {/* Patient Cards */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                    {filtered.map((p, index) => (
                        <Link href={`/patients/${p.id}`} key={p.id} className={`block animate-fade-in-up stagger-${(index % 5) + 1}`}>
                            <div className="glass-card p-5 group relative">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                                            {p.name.split(" ").map((n: string) => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white text-base group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{p.name}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{p.gender} • {p.age} yrs • {p.blood}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${statusStyles[p.status]}`}>
                                        {p.status}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 grid grid-cols-2 gap-3 text-xs bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 mt-4 shadow-inner">
                                    <div><span className="text-[10px] uppercase tracking-wider text-gray-500">Dept</span><p className="text-gray-800 dark:text-gray-200 font-semibold mt-0.5">{p.dept}</p></div>
                                    <div><span className="text-[10px] uppercase tracking-wider text-gray-500">Doctor</span><p className="text-gray-800 dark:text-gray-200 font-semibold mt-0.5">{p.doctor}</p></div>
                                    <div><span className="text-[10px] uppercase tracking-wider text-gray-500">Admitted</span><p className="text-gray-800 dark:text-gray-200 font-semibold mt-0.5">{new Date(p.admittedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p></div>
                                    <div><span className="text-[10px] uppercase tracking-wider text-gray-500">Phone</span><p className="text-gray-800 dark:text-gray-200 font-semibold mt-0.5">{p.phone}</p></div>
                                </div>
                                
                                {p.status !== "Discharged" && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.location.href = `/discharge/${p.id}`;
                                            }}
                                            className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                                        >
                                            Discharge Wizard →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Admit Patient Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl p-6 w-full max-w-md mx-4 animate-pop-in">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admit New Patient</h2>
                            <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all">✕</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
                                <input type="text" placeholder="Patient name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Age</label>
                                <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Gender</label>
                                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all appearance-none">
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Blood Group</label>
                                <select value={form.blood} onChange={(e) => setForm({ ...form, blood: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all appearance-none">
                                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(b => <option key={b}>{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Phone</label>
                                <input type="text" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
                                <input type="email" placeholder="Email address (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Department</label>
                                <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all appearance-none">
                                    {["Cardiology", "Neurology", "Orthopedics", "Pediatrics"].map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Doctor</label>
                                <select value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all appearance-none">
                                    {["Dr. Mehta", "Dr. Verma", "Dr. Singh", "Dr. Joshi"].map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={handleAdmit} disabled={saving} className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed">
                                {saving ? "Saving..." : "Admit Patient"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}