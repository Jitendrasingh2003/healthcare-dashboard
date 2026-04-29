"use client";
import { useState, useEffect } from "react";
import { Search, ArrowLeft, Phone, Mail, Clock, Plus, Star } from "lucide-react";
import Link from "next/link";

const depts = ["All", "Cardiology", "Neurology", "Orthopedics", "Pediatrics"];
const shifts = ["All", "Morning", "Evening", "Night"];

const statusStyle: Record<string, string> = {
    "On Duty": "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
    "Off Duty": "bg-gray-100/80 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50",
};

const deptColor: Record<string, string> = {
    Cardiology: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800/30",
    Neurology: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-100 dark:border-purple-800/30",
    Orthopedics: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30",
    Pediatrics: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-100 dark:border-orange-800/30",
};

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");
    const [shiftFilter, setShiftFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "", dept: "Cardiology", exp: "", phone: "",
        email: "", status: "On Duty", shift: "Morning", rating: "4.5",
        patients: "0", education: "", address: "",
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        const res = await fetch("/api/doctors");
        const data = await res.json();
        setDoctors(data);
        setLoading(false);
    };

    const handleAddDoctor = async () => {
        if (!form.name || !form.phone || !form.email || !form.exp) return;
        setSaving(true);
        await fetch("/api/doctors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setSaving(false);
        setShowForm(false);
        setForm({
            name: "", dept: "Cardiology", exp: "", phone: "",
            email: "", status: "On Duty", shift: "Morning", rating: "4.5",
            patients: "0", education: "", address: "",
        });
        fetchDoctors();
    };

    const filtered = doctors.filter((d) => {
        const matchName = d.name.toLowerCase().includes(search.toLowerCase());
        const matchDept = deptFilter === "All" || d.dept === deptFilter;
        const matchShift = shiftFilter === "All" || d.shift === shiftFilter;
        return matchName && matchDept && matchShift;
    });

    const onDuty = doctors.filter(d => d.status === "On Duty").length;

    return (
        <div className="min-h-screen p-6 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-fade-in-up gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full glass hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95 text-gray-500">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Doctors & Staff</h1>
                        <p className="text-sm text-gray-500 mt-1">{onDuty} on duty • {doctors.length} total</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                >
                    <Plus size={16} /> Add Doctor
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: "Total Doctors", value: doctors.length },
                    { label: "On Duty", value: onDuty },
                    { label: "Departments", value: 4 },
                    { label: "Avg Patients", value: doctors.length > 0 ? Math.round(doctors.reduce((a, d) => a + d.patients, 0) / doctors.length) : 0 },
                ].map((s, index) => (
                    <div key={s.label} className={`glass-card p-5 animate-fade-in-up stagger-${(index % 5) + 1}`}>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Search + Filters */}
            <div className="flex flex-wrap gap-3 mb-8 animate-fade-in-up stagger-3">
                <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl flex-1 min-w-48 group focus-within:ring-2 focus-within:ring-teal-500/50 transition-all">
                    <Search size={16} className="text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search doctors by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-sm outline-none w-full text-gray-700 dark:text-gray-200 bg-transparent placeholder:text-gray-400"
                    />
                </div>
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="text-sm glass px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none cursor-pointer">
                    {depts.map((d) => <option key={d}>{d}</option>)}
                </select>
                <select value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} className="text-sm glass px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none cursor-pointer">
                    {shifts.map((s) => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20 animate-fade-in">
                    <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin shadow-lg" />
                </div>
            )}

            {/* Doctor Cards */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((doc, index) => (
                        <Link href={`/doctors/${doc.id}`} key={doc.id} className={`block animate-fade-in-up stagger-${(index % 5) + 1}`}>
                            <div className="glass-card p-5 group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                                            {doc.name.split(" ").slice(1).map((n: string) => n[0]).join("") || doc.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white text-base group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{doc.name}</p>
                                            <span className={`inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${deptColor[doc.dept] || "bg-gray-100 text-gray-500"}`}>
                                                {doc.dept}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${statusStyle[doc.status]}`}>
                                        {doc.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-3 text-center mb-4 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl p-3 shadow-inner backdrop-blur-sm">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500">Exp</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{doc.exp}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500">Patients</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{doc.patients}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500">Rating</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5 flex items-center justify-center gap-1">
                                            <Star size={10} className="text-yellow-500 fill-yellow-500" /> {doc.rating}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 space-y-2">
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"><Clock size={12} /></div>
                                        <span className="font-medium">{doc.shift} Shift</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"><Phone size={12} /></div>
                                        <span className="font-medium">{doc.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"><Mail size={12} /></div>
                                        <span className="font-medium truncate">{doc.email}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Add Doctor Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-pop-in">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Doctor</h2>
                            <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all">✕</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
                                <input type="text" placeholder="Dr. Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Department</label>
                                <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all appearance-none">
                                    {["Cardiology", "Neurology", "Orthopedics", "Pediatrics"].map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Experience</label>
                                <input type="text" placeholder="e.g. 5 yrs" value={form.exp} onChange={(e) => setForm({ ...form, exp: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Phone</label>
                                <input type="text" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
                                <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Shift</label>
                                <select value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all appearance-none">
                                    {["Morning", "Evening", "Night"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all appearance-none">
                                    <option>On Duty</option>
                                    <option>Off Duty</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Rating</label>
                                <input type="number" placeholder="4.5" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Education</label>
                                <input type="text" placeholder="MBBS - AIIMS, MD - PGI" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Address</label>
                                <input type="text" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={handleAddDoctor} disabled={saving} className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed">
                                {saving ? "Saving..." : "Add Doctor"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}