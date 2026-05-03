"use client";
import { useState, useEffect } from "react";
import { Plus, Users, Stethoscope, Shield, FlaskConical } from "lucide-react";
import Link from "next/link";

const roleColors: Record<string, string> = {
    Nurse: "from-pink-400 to-pink-600",
    Admin: "from-blue-400 to-blue-600",
    "Lab Technician": "from-purple-400 to-purple-600",
    Pharmacist: "from-orange-400 to-orange-600",
    Receptionist: "from-teal-400 to-teal-600",
};

const roleIcons: Record<string, any> = {
    Nurse: Stethoscope,
    Admin: Shield,
    "Lab Technician": FlaskConical,
    Pharmacist: Plus,
    Receptionist: Users,
};

export default function StaffPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [roleFilter, setRoleFilter] = useState("All");
    const [form, setForm] = useState({ name: "", role: "Nurse", dept: "", shift: "Morning", phone: "" });

    const roles = ["All", "Nurse", "Admin", "Lab Technician", "Pharmacist", "Receptionist"];

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/staff");
            const data = await res.json();
            if (Array.isArray(data)) setStaff(data);
        } catch (error) {
            console.error("Failed to fetch staff:", error);
        }
        setLoading(false);
    };

    const filtered = roleFilter === "All" ? staff : staff.filter(s => s.role === roleFilter);

    const handleAdd = async () => {
        if (!form.name || !form.dept) return;
        try {
            const res = await fetch("/api/staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const newStaff = await res.json();
                setStaff([newStaff, ...staff]);
                setShowForm(false);
                setForm({ name: "", role: "Nurse", dept: "", shift: "Morning", phone: "" });
            }
        } catch (error) {
            console.error("Failed to add staff:", error);
        }
    };

    const counts: Record<string, number> = { 
        Total: staff.length, 
        Active: staff.filter(s => s.status === "Active").length, 
        "On Leave": staff.filter(s => s.status === "On Leave").length 
    };

    return (
        <div className="min-h-screen p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Staff Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage hospital staff and their schedules</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> Add Staff</button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up stagger-1">
                {Object.entries(counts).map(([label, value], i) => (
                    <div key={label} className="glass-card p-5 group">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${i === 0 ? "from-teal-400 to-teal-600" : i === 1 ? "from-green-400 to-green-600" : "from-orange-400 to-orange-600"} text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Users size={18} />
                        </div>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                    </div>
                ))}
            </div>

            {/* Role Filter */}
            <div className="flex gap-2 mb-6 flex-wrap animate-fade-in-up stagger-2">
                {roles.map(r => (
                    <button key={r} onClick={() => setRoleFilter(r)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 ${roleFilter === r ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30" : "glass text-gray-600 dark:text-gray-300 hover:text-teal-600"}`}>
                        {r}
                    </button>
                ))}
            </div>

            {/* Staff Cards */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin shadow-lg" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 glass-card p-10 text-center">
                    <Users size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No staff members found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up stagger-3">
                    {filtered.map((s, i) => {
                        const Icon = roleIcons[s.role] || Users;
                        const grad = roleColors[s.role] || "from-gray-400 to-gray-600";
                        return (
                            <Link href={`/staff/${s.id}`} key={s.id} className={`glass-card p-5 group animate-fade-in-up stagger-${(i % 5) + 1} hover:border-teal-500/50 transition-all active:scale-[0.98]`}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                                        {s.name.split(" ").map((n: string) => n[0]).join("")}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">{s.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{s.role} • {s.dept}</p>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider flex-shrink-0 ${s.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"}`}>
                                        {s.status}
                                    </span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50">
                                    <div><span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Shift</span><p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-0.5">{s.shift}</p></div>
                                    <div><span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Phone</span><p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-0.5">{s.phone}</p></div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Add Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl p-6 w-full max-w-md mx-4 animate-pop-in">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add Staff Member</h2>
                            <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all">✕</button>
                        </div>
                        <div className="space-y-3">
                            {[{ label: "Full Name", key: "name", type: "text", ph: "Staff member name" }, { label: "Department", key: "dept", type: "text", ph: "e.g. Cardiology, OPD" }, { label: "Phone", key: "phone", type: "text", ph: "Phone number" }].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                                    <input type={f.type} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Role</label>
                                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Nurse", "Admin", "Lab Technician", "Pharmacist", "Receptionist"].map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Shift</label>
                                <select value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Morning", "Day", "Evening", "Night"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={handleAdd} className="btn-primary flex-1">Add Staff</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
