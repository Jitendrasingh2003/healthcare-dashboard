"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Clock, Star, Users, Calendar, Activity, Printer, Download, X, Check } from "lucide-react";
import { useRole, rolePermissions } from "../../hooks/useRole";
import { printDoctorCard } from "../../utils/printUtils";
import { useParams } from "next/navigation";

const statusStyle: Record<string, string> = {
    "On Duty": "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
    "Off Duty": "bg-gray-100/80 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50",
};

const scheduleStyle: Record<string, string> = {
    Available: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Off: "bg-gray-100/80 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400",
};

const deptColor: Record<string, string> = {
    Cardiology: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800/30",
    Neurology: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-100 dark:border-purple-800/30",
    Orthopedics: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30",
    Pediatrics: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-100 dark:border-orange-800/30",
};

const defaultSchedule = [
    { day: "Monday", time: "9:00 AM - 2:00 PM", status: "Available" },
    { day: "Tuesday", time: "9:00 AM - 2:00 PM", status: "Available" },
    { day: "Wednesday", time: "Off", status: "Off" },
    { day: "Thursday", time: "9:00 AM - 2:00 PM", status: "Available" },
    { day: "Friday", time: "9:00 AM - 2:00 PM", status: "Available" },
    { day: "Saturday", time: "10:00 AM - 1:00 PM", status: "Available" },
    { day: "Sunday", time: "Off", status: "Off" },
];

export default function DoctorDetail() {
    const params = useParams();
    const id = params?.id as string;
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const role = useRole();
    const perms = rolePermissions[role];

    useEffect(() => {
        if (!id) return;
        fetchDoctor();
    }, [id]);

    const fetchDoctor = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/doctors/${id}`);
            if (res.status === 404) { setNotFound(true); setLoading(false); return; }
            const data = await res.json();
            setDoctor(data);
            setEditForm({
                name: data.name, dept: data.dept, exp: data.exp,
                phone: data.phone, email: data.email, shift: data.shift,
                rating: data.rating, education: data.education || "", status: data.status
            });
        } catch { setNotFound(true); }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/doctors/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...editForm, rating: parseFloat(editForm.rating) }),
            });
            if (res.ok) {
                const updated = await res.json();
                setDoctor(updated);
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

    if (notFound || !doctor) return (
        <div className="min-h-screen flex items-center justify-center animate-fade-in">
            <div className="glass-card p-10 text-center">
                <p className="text-gray-500 text-lg mb-6 font-medium">Doctor not found!</p>
                <Link href="/doctors" className="btn-secondary">← Back to Doctors</Link>
            </div>
        </div>
    );

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
                    <Link href="/doctors" className="w-8 h-8 flex items-center justify-center rounded-full glass hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95 text-gray-500">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Doctor Detail</h1>
                        <p className="text-sm text-gray-500 mt-1">Full profile & schedule</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 uppercase tracking-wider">{role}</span>
                    {perms.canAddDoctor && (
                        <button onClick={() => setShowEdit(true)} className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 active:scale-95 transition-all shadow-lg shadow-teal-500/30">
                            ✏️ Edit Profile
                        </button>
                    )}
                    <button onClick={() => printDoctorCard(doctor)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 glass rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 active:scale-95 transition-all text-gray-600 dark:text-gray-300">
                        <Printer size={14} /> Print
                    </button>
                    <button onClick={() => printDoctorCard(doctor)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 active:scale-95 transition-all shadow-lg shadow-teal-500/30">
                        <Download size={14} /> Export PDF
                    </button>
                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${statusStyle[doctor.status] || "bg-gray-100/80 text-gray-500"}`}>
                        {doctor.status}
                    </span>
                </div>
            </div>

            {/* Profile Card */}
            <div className="glass-card p-6 mb-6 animate-fade-in-up stagger-1">
                <div className="flex items-start gap-5 flex-wrap">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-teal-500/20 flex-shrink-0">
                        {doctor.name.split(" ").slice(1).map((n: string) => n[0]).join("") || doctor.name[0]}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{doctor.name}</h2>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${deptColor[doctor.dept] || "bg-gray-100 text-gray-600"}`}>
                                {doctor.dept}
                            </span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 mb-3">{doctor.education || "Education not specified"}</p>
                        <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50"><Phone size={14} className="text-teal-600" /> {doctor.phone}</span>
                            <span className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50"><Mail size={14} className="text-teal-600" /> {doctor.email}</span>
                            <span className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50"><Clock size={14} className="text-teal-600" /> {doctor.shift} Shift</span>
                        </div>
                    </div>
                    <div className="text-right text-sm bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Experience</p>
                        <p className="font-bold text-gray-800 dark:text-white text-lg">{doctor.exp}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-3">Rating</p>
                        <p className="font-bold text-gray-800 dark:text-white flex items-center justify-end gap-1 mt-0.5">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" /> {doctor.rating}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
                {[
                    { label: "Total Patients", value: doctor.patients, icon: Users, color: "bg-blue-50 dark:bg-blue-900/30 text-blue-600", shadow: "shadow-blue-500/20" },
                    { label: "Recovered", value: Math.floor(doctor.patients * 0.8), icon: Activity, color: "bg-green-50 dark:bg-green-900/30 text-green-600", shadow: "shadow-green-500/20" },
                    { label: "Critical", value: Math.floor(doctor.patients * 0.1), icon: Activity, color: "bg-red-50 dark:bg-red-900/30 text-red-600", shadow: "shadow-red-500/20" },
                    { label: "Avg Rating", value: doctor.rating, icon: Star, color: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600", shadow: "shadow-yellow-500/20" },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className={`glass-card p-5 animate-fade-in-up stagger-${(i % 4) + 1} group`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color} shadow-lg ${s.shadow} group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={18} />
                            </div>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">{s.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Schedule */}
                <div className="glass-card p-6 animate-fade-in-up stagger-3">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                        <Calendar size={18} className="text-teal-600" /> Weekly Schedule
                    </h3>
                    <div className="space-y-3">
                        {defaultSchedule.map((s: any, i: number) => (
                            <div key={i} className="flex items-center justify-between py-2.5 px-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 w-24">{s.day}</p>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex-1 text-center">{s.time}</p>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${scheduleStyle[s.status]}`}>{s.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assigned Patients */}
                <div className="glass-card p-6 animate-fade-in-up stagger-4">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                        <Users size={18} className="text-teal-600" /> Assigned Patients
                    </h3>
                    <div className="p-8 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl text-sm font-medium text-gray-400 text-center flex flex-col items-center justify-center mb-6">
                        <Users size={24} className="mb-2 text-gray-300 dark:text-gray-600" />
                        No patients currently assigned.
                    </div>
                    <div className="flex gap-3">
                        {perms.canAddDoctor && (
                            <button onClick={() => setShowEdit(true)} className="btn-primary flex-1">Edit Profile</button>
                        )}
                        <Link href="/patients" className="btn-secondary flex-1">View All Patients</Link>
                    </div>
                    {!perms.canAddDoctor && (
                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-xl text-xs font-semibold text-yellow-700 dark:text-yellow-400 text-center">
                            🔒 Only Admins can edit doctor profiles
                        </div>
                    )}
                </div>
            </div>

            {/* ── Edit Modal ── */}
            {showEdit && (
                <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg animate-pop-in flex flex-col" style={{ maxHeight: "90vh" }}>
                        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-4 rounded-t-3xl flex items-center justify-between flex-shrink-0">
                            <div>
                                <p className="text-white font-bold">Edit Doctor Profile</p>
                                <p className="text-teal-100 text-xs">{doctor.name}</p>
                            </div>
                            <button onClick={() => setShowEdit(false)} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <X size={16} className="text-white" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            {[
                                { label: "Full Name", key: "name", ph: "Doctor's full name" },
                                { label: "Phone", key: "phone", ph: "Phone number" },
                                { label: "Email", key: "email", ph: "Email address" },
                                { label: "Experience", key: "exp", ph: "e.g. 10 Years" },
                                { label: "Education", key: "education", ph: "e.g. MBBS, MD" },
                                { label: "Rating", key: "rating", ph: "e.g. 4.8" },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                                    <input
                                        placeholder={f.ph}
                                        value={editForm[f.key] || ""}
                                        onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Department</label>
                                <select value={editForm.dept || ""} onChange={e => setEditForm({ ...editForm, dept: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Surgery", "Emergency"].map(d => <option key={d}>{d}</option>)}
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
                                    {["On Duty", "Off Duty"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex gap-3 flex-shrink-0">
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