"use client";
import { useState } from "react";
import { Plus, Calendar, CheckCircle, AlertCircle } from "lucide-react";

const statusStyles: Record<string, string> = {
    Pending: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
    Confirmed: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
    Done: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
    Cancelled: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
};

const initial = [
    { id: 1, patient: "Rahul Agarwal", doctor: "Dr. Mehta", dept: "Cardiology", date: "2026-04-28", time: "10:00 AM", status: "Confirmed", reason: "Chest pain follow-up" },
    { id: 2, patient: "Priya Sharma", doctor: "Dr. Verma", dept: "Neurology", date: "2026-04-28", time: "11:30 AM", status: "Pending", reason: "MRI review" },
    { id: 3, patient: "Arjun Kumar", doctor: "Dr. Singh", dept: "Orthopedics", date: "2026-04-29", time: "09:00 AM", status: "Done", reason: "Post-surgery checkup" },
    { id: 4, patient: "Sunita Mishra", doctor: "Dr. Joshi", dept: "Pediatrics", date: "2026-04-29", time: "03:00 PM", status: "Pending", reason: "Routine vaccination" },
    { id: 5, patient: "Vikas Gupta", doctor: "Dr. Mehta", dept: "Cardiology", date: "2026-04-30", time: "02:00 PM", status: "Cancelled", reason: "ECG report review" },
];

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState(initial);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState("All");
    const [form, setForm] = useState({ patient: "", doctor: "Dr. Mehta", dept: "Cardiology", date: "", time: "", reason: "" });

    const filtered = filter === "All" ? appointments : appointments.filter(a => a.status === filter);

    const handleAdd = () => {
        if (!form.patient || !form.date || !form.time) return;
        setAppointments([{ id: Date.now(), ...form, status: "Pending" }, ...appointments]);
        setShowForm(false);
        setForm({ patient: "", doctor: "Dr. Mehta", dept: "Cardiology", date: "", time: "", reason: "" });
    };

    const changeStatus = (id: number, status: string) =>
        setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));

    const counts = { total: appointments.length, pending: appointments.filter(a => a.status === "Pending").length, confirmed: appointments.filter(a => a.status === "Confirmed").length, done: appointments.filter(a => a.status === "Done").length };

    return (
        <div className="min-h-screen p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Appointments</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage patient appointments</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> New Appointment</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-1">
                {[
                    { label: "Total", value: counts.total, color: "from-teal-400 to-teal-600" },
                    { label: "Pending", value: counts.pending, color: "from-yellow-400 to-yellow-600" },
                    { label: "Confirmed", value: counts.confirmed, color: "from-green-400 to-green-600" },
                    { label: "Completed", value: counts.done, color: "from-blue-400 to-blue-600" },
                ].map(s => (
                    <div key={s.label} className="glass-card p-5 group">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Calendar size={18} />
                        </div>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.value}</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mb-6 flex-wrap animate-fade-in-up stagger-2">
                {["All", "Pending", "Confirmed", "Done", "Cancelled"].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 ${filter === s ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30" : "glass text-gray-600 dark:text-gray-300 hover:text-teal-600"}`}>
                        {s}
                    </button>
                ))}
            </div>

            <div className="glass-card p-0 overflow-hidden animate-fade-in-up stagger-3">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30">
                                {["Patient", "Doctor", "Dept", "Date & Time", "Reason", "Status", "Actions"].map(h => (
                                    <th key={h} className="text-left py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => (
                                <tr key={a.id} className="border-b border-gray-100/50 dark:border-gray-800/50 last:border-0 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                                {a.patient.split(" ").map((n: string) => n[0]).join("")}
                                            </div>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">{a.patient}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">{a.doctor}</td>
                                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{a.dept}</td>
                                    <td className="py-4 px-4">
                                        <p className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{a.date}</p>
                                        <p className="text-gray-400 text-[10px]">{a.time}</p>
                                    </td>
                                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400 text-xs">{a.reason}</td>
                                    <td className="py-4 px-4">
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap ${statusStyles[a.status]}`}>{a.status}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-1">
                                            {a.status === "Pending" && <button onClick={() => changeStatus(a.id, "Confirmed")} className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 active:scale-95 transition-all font-semibold">Confirm</button>}
                                            {["Pending", "Confirmed"].includes(a.status) && <button onClick={() => changeStatus(a.id, "Cancelled")} className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 active:scale-95 transition-all font-semibold">Cancel</button>}
                                            {a.status === "Confirmed" && <button onClick={() => changeStatus(a.id, "Done")} className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 active:scale-95 transition-all font-semibold">Done</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl p-6 w-full max-w-md mx-4 animate-pop-in">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">New Appointment</h2>
                            <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all">✕</button>
                        </div>
                        <div className="space-y-3">
                            {[{ label: "Patient Name", key: "patient", type: "text", ph: "Full name" }, { label: "Date", key: "date", type: "date", ph: "" }, { label: "Time", key: "time", type: "time", ph: "" }, { label: "Reason", key: "reason", type: "text", ph: "Reason for visit" }].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                                    <input type={f.type} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Doctor</label>
                                <select value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Dr. Mehta", "Dr. Verma", "Dr. Singh", "Dr. Joshi"].map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Department</label>
                                <select value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Cardiology", "Neurology", "Orthopedics", "Pediatrics"].map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={handleAdd} className="btn-primary flex-1">Book Appointment</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
