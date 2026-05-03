"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Clock, Shield, Stethoscope, FlaskConical, Users, Calendar, Activity, Printer, Download, X, Check } from "lucide-react";
import { useParams } from "next/navigation";

const roleColors: Record<string, string> = {
    Nurse: "from-pink-400 to-pink-600",
    Admin: "from-blue-400 to-blue-600",
    "Lab Technician": "from-purple-400 to-purple-600",
    Pharmacist: "from-orange-400 to-orange-600",
    Receptionist: "from-teal-400 to-teal-600",
};

const statusStyle: Record<string, string> = {
    Active: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
    "On Leave": "bg-orange-100/80 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50",
};

export default function StaffDetail() {
    const params = useParams();
    const id = params?.id as string;

    const [staff, setStaff] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchStaff();
    }, [id]);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/staff/${id}`);
            if (res.status === 404) { setNotFound(true); setLoading(false); return; }
            const data = await res.json();
            setStaff(data);
            setEditForm({ name: data.name, role: data.role, dept: data.dept, shift: data.shift, phone: data.phone, status: data.status });
        } catch { setNotFound(true); }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/staff/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                const updated = await res.json();
                setStaff(updated);
                setShowEdit(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center animate-fade-in">
            <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin shadow-lg" />
        </div>
    );

    if (notFound || !staff || !staff.name) return (
        <div className="min-h-screen flex items-center justify-center animate-fade-in">
            <div className="glass-card p-10 text-center">
                <p className="text-gray-500 text-lg mb-6 font-medium">Staff member not found!</p>
                <Link href="/staff" className="btn-secondary">← Back to Staff</Link>
            </div>
        </div>
    );

    const grad = roleColors[staff.role] || "from-gray-400 to-gray-600";
    const initials = staff.name.split(" ").map((n: string) => n[0]).join("");

    return (
        <div className="min-h-screen p-6 animate-fade-in">
            {/* Success Toast */}
            {saved && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-2xl shadow-xl animate-pop-in">
                    <Check size={16} /> Profile updated successfully!
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8 animate-fade-in-up flex-wrap gap-3">
                <div className="flex items-center gap-4">
                    <Link href="/staff" className="w-8 h-8 flex items-center justify-center rounded-full glass hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95 text-gray-500">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Staff Detail</h1>
                        <p className="text-sm text-gray-500 mt-1">Full profile & info</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setShowEdit(true)} className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 active:scale-95 transition-all shadow-lg shadow-teal-500/30">
                        ✏️ Edit Profile
                    </button>
                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${statusStyle[staff.status] || "bg-gray-100/80 text-gray-500"}`}>
                        {staff.status}
                    </span>
                </div>
            </div>

            {/* Profile Card */}
            <div className="glass-card p-6 mb-6 animate-fade-in-up stagger-1">
                <div className="flex items-start gap-5 flex-wrap">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${grad} text-white flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0`}>
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{staff.name}</h2>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400 border border-teal-100 dark:border-teal-800/30">
                                {staff.role}
                            </span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 mb-3">{staff.dept} Department</p>
                        <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                <Phone size={14} className="text-teal-600" /> {staff.phone}
                            </span>
                            <span className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                <Clock size={14} className="text-teal-600" /> {staff.shift} Shift
                            </span>
                        </div>
                    </div>
                    <div className="text-right text-sm bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 flex-shrink-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joined</p>
                        <p className="font-bold text-gray-800 dark:text-white">
                            {new Date(staff.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-3">Staff ID</p>
                        <p className="font-bold text-gray-800 dark:text-white text-sm uppercase">STF-{staff.id.slice(-6)}</p>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="glass-card p-6 animate-fade-in-up stagger-2">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                        <Activity size={18} className="text-teal-600" /> Employment Details
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: "Full Name", value: staff.name },
                            { label: "Role", value: staff.role },
                            { label: "Department", value: staff.dept },
                            { label: "Shift Timing", value: staff.shift === "Morning" ? "8:00 AM – 4:00 PM" : staff.shift === "Day" ? "10:00 AM – 6:00 PM" : staff.shift === "Evening" ? "4:00 PM – 12:00 AM" : "12:00 AM – 8:00 AM" },
                            { label: "Contact", value: staff.phone },
                            { label: "Status", value: staff.status },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</span>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6 animate-fade-in-up stagger-3">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                        <Calendar size={18} className="text-teal-600" /> Weekly Schedule
                    </h3>
                    <div className="space-y-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, i) => {
                            const isOff = day === "Saturday" || day === "Sunday";
                            return (
                                <div key={i} className="flex items-center justify-between px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl">
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{day}</p>
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${isOff ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                                        {isOff ? "Off" : staff.shift}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Edit Modal ── */}
            {showEdit && (
                <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-md animate-pop-in">
                        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-4 rounded-t-3xl flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold">Edit Staff Profile</p>
                                <p className="text-teal-100 text-xs">{staff.name}</p>
                            </div>
                            <button onClick={() => setShowEdit(false)} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <X size={16} className="text-white" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { label: "Full Name", key: "name", type: "text", ph: "Staff name" },
                                { label: "Department", key: "dept", type: "text", ph: "e.g. Cardiology" },
                                { label: "Phone", key: "phone", type: "text", ph: "Phone number" },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                                    <input
                                        type={f.type}
                                        placeholder={f.ph}
                                        value={editForm[f.key] || ""}
                                        onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Role</label>
                                <select value={editForm.role || ""} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Nurse", "Admin", "Lab Technician", "Pharmacist", "Receptionist"].map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Shift</label>
                                <select value={editForm.shift || ""} onChange={e => setEditForm({ ...editForm, shift: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Morning", "Day", "Evening", "Night"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Status</label>
                                <select value={editForm.status || ""} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Active", "On Leave"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex gap-3">
                            <button onClick={() => setShowEdit(false)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
