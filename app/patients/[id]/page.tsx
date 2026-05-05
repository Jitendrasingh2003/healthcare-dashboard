"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, FileText, User, Printer, Download, FlaskConical, Plus, Sparkles, X, Check, Calendar, Clock } from "lucide-react";
import { useRole, rolePermissions } from "../../hooks/useRole";
import { printPatientCard } from "../../utils/printUtils";
import EmptyState from "../../components/EmptyState";
import { SkeletonText } from "../../components/SkeletonCard";
import { useParams } from "next/navigation";
import AIRiskAlertBanner from "../../components/AIRiskAlertBanner";


const statusStyle: Record<string, string> = {
    Stable: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
    Critical: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
    Observation: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
    Discharged: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
};

export default function PatientDetail() {
    const params = useParams();
    const id = params?.id as string;
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const role = useRole();
    const perms = rolePermissions[role];
    const [reports, setReports] = useState<any[]>([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportForm, setReportForm] = useState({ testName: "", result: "", status: "Pending", notes: "", date: "" });
    const [savingReport, setSavingReport] = useState(false);
    const [showDischargeSummary, setShowDischargeSummary] = useState(false);
    const [dischargeSummary, setDischargeSummary] = useState<string | null>(null);
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [showCoPilot, setShowCoPilot] = useState(false);
    const [coPilotSuggestions, setCoPilotSuggestions] = useState<string | null>(null);
    const [generatingCoPilot, setGeneratingCoPilot] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [followUps, setFollowUps] = useState<any[]>([]);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [followUpDays, setFollowUpDays] = useState(10);
    const [followUpNotes, setFollowUpNotes] = useState("");
    const [schedulingFollowUp, setSchedulingFollowUp] = useState(false);

    const generateCoPilotSuggestions = async () => {
        setShowCoPilot(true);
        if (coPilotSuggestions) return;
        setGeneratingCoPilot(true);
        try {
            const res = await fetch('/api/ai/co-pilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patient, reports }),
            });
            const data = await res.json();
            if (res.ok) setCoPilotSuggestions(data.suggestions);
            else setCoPilotSuggestions(`<p class="text-red-500">Error: ${data.error}</p>`);
        } catch (e: any) {
            setCoPilotSuggestions(`<p class="text-red-500">Failed to connect: ${e.message}</p>`);
        } finally {
            setGeneratingCoPilot(false);
        }
    };

    const generateDischargeSummary = async () => {
        setShowDischargeSummary(true);
        if (dischargeSummary) return; // already generated
        setGeneratingSummary(true);
        try {
            const res = await fetch('/api/ai/discharge-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patient, reports }),
            });
            const data = await res.json();
            if (res.ok) setDischargeSummary(data.summary);
            else setDischargeSummary(`<p class="text-red-500">Error: ${data.error}</p>`);
        } catch (e: any) {
            setDischargeSummary(`<p class="text-red-500">Failed to connect: ${e.message}</p>`);
        } finally {
            setGeneratingSummary(false);
        }
    };

    const fetchFollowUps = async (patientId: string) => {
        try {
            const res = await fetch(`/api/follow-ups?patientId=${patientId}`);
            const data = await res.json();
            if (Array.isArray(data)) setFollowUps(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleScheduleFollowUp = async () => {
        setSchedulingFollowUp(true);
        try {
            const date = new Date();
            date.setDate(date.getDate() + Number(followUpDays));
            
            const payload = {
                patientId: patient.id,
                patientName: patient.name,
                patientPhone: patient.phone || "Not Provided",
                patientEmail: patient.email || null,
                doctorId: patient.doctor,
                doctorName: patient.doctor,
                followUpDate: date.toISOString(),
                notes: followUpNotes
            };

            const res = await fetch("/api/follow-ups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            
            if (res.ok) {
                // Specific requirement: Update patient's notes with the follow-up mention
                const noteAddition = `\n[Follow-up reminder scheduled for ${date.toLocaleDateString("en-IN")}: ${followUpNotes}]`;
                const updatedNotes = patient.notes ? patient.notes + noteAddition : noteAddition.trim();
                
                await fetch(`/api/patients/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notes: updatedNotes }),
                });
                
                setPatient({ ...patient, notes: updatedNotes });

                setShowFollowUpModal(false);
                setFollowUpNotes("");
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
                fetchFollowUps(patient.id);
            } else {
                alert("Failed to schedule: " + (data.error || "Unknown error"));
            }
        } catch (e: any) {
            console.error(e);
            alert("An error occurred: " + e.message);
        }
        setSchedulingFollowUp(false);
    };

    useEffect(() => { if (id) fetchPatient(); }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/patients/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                const updated = await res.json();
                setPatient(updated);
                setShowEdit(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const fetchPatient = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/patients/${id}`);
            if (res.status === 404) { setNotFound(true); setLoading(false); return; }
            const data = await res.json();
            
            if (!res.ok) {
                console.error("Failed to fetch patient data:", data);
                alert("Failed to load patient: " + (data.error || "Unknown error"));
                setLoading(false);
                return;
            }

            setPatient(data);
            setEditForm({
                name: data.name, age: data.age, gender: data.gender, blood: data.blood,
                phone: data.phone, email: data.email || "", address: data.address || "",
                dept: data.dept, doctor: data.doctor, status: data.status,
                bedNo: data.bedNo || "", diagnosis: data.diagnosis || "", notes: data.notes || "",
            });
            fetchReports();
            fetchFollowUps(id);
        } catch (e: any) {
            console.error("fetchPatient error:", e);
            alert("Error loading patient: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = async () => {
        setReportsLoading(true);
        try {
            const res = await fetch(`/api/lab-reports?patientId=${id}`);
            const data = await res.json();
            if (Array.isArray(data)) setReports(data);
        } catch {}
        setReportsLoading(false);
    };

    const handleAddReport = async () => {
        if (!reportForm.testName) return;
        setSavingReport(true);
        try {
            const res = await fetch("/api/lab-reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...reportForm, patientId: id, patientName: patient?.name }),
            });
            const newReport = await res.json();
            setReports([newReport, ...reports]);
            setShowReportForm(false);
            setReportForm({ testName: "", result: "", status: "Pending", notes: "", date: "" });
        } catch {}
        setSavingReport(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center animate-fade-in">
            <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin shadow-lg" />
        </div>
    );

    if (notFound || !patient) return (
        <div className="min-h-screen flex items-center justify-center animate-fade-in">
            <div className="glass-card p-10 text-center">
                <p className="text-gray-500 text-lg mb-6 font-medium">Patient not found!</p>
                <Link href="/patients" className="btn-secondary">← Back to Patients</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-6 animate-fade-in">
            {/* Success Toast */}
            {saved && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-2xl shadow-xl animate-pop-in">
                    <Check size={16} /> Patient updated successfully!
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                <div className="flex items-center gap-4">
                    <Link href="/patients" className="w-8 h-8 flex items-center justify-center rounded-full glass hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95 text-gray-500">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Patient Detail</h1>
                        <p className="text-sm text-gray-500 mt-1">Full medical record</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Role Badge */}
                    <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 uppercase tracking-wider">
                        {role}
                    </span>
                    {/* Edit Profile */}
                    {(role === "Admin" || role === "Doctor") && (
                        <button
                            onClick={() => setShowEdit(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 active:scale-95 transition-all shadow-lg shadow-teal-500/30"
                        >
                            ✏️ Edit
                        </button>
                    )}
                    {/* Follow-up: Only Doctor can schedule */}
                    {role === "Doctor" && (
                        <button
                            onClick={() => setShowFollowUpModal(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-orange-500/30"
                        >
                            <Calendar size={14} /> Follow-up
                        </button>
                    )}
                    {/* AI Discharge Summary */}
                    {(role === "Admin" || role === "Doctor") && (
                        <>
                            <button
                                onClick={generateCoPilotSuggestions}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-teal-500/30"
                            >
                                <Sparkles size={14} /> AI Co-pilot
                            </button>
                            <button
                                onClick={generateDischargeSummary}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/30"
                            >
                                <Sparkles size={14} /> AI Summary
                            </button>
                        </>
                    )}
                    {/* Print Button */}
                    <button
                        onClick={() => printPatientCard(patient)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 glass rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 active:scale-95 transition-all text-gray-600 dark:text-gray-300"
                    >
                        <Printer size={14} /> Print
                    </button>
                    {/* PDF Export */}
                    <button
                        onClick={() => printPatientCard(patient)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 active:scale-95 transition-all shadow-lg shadow-teal-500/30"
                    >
                        <Download size={14} /> Export PDF
                    </button>
                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${statusStyle[patient.status]}`}>
                        {patient.status}
                    </span>
                </div>
            </div>

            {/* AI Risk Alert Banner */}
            {patient && <AIRiskAlertBanner patient={patient} reports={reports} />}

            {/* Profile Card */}
            <div className="glass-card p-6 mb-6 animate-fade-in-up stagger-1">
                <div className="flex items-start gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-teal-500/20">
                        {patient.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{patient.name}</h2>
                        <p className="text-sm font-medium text-gray-500">{patient.gender} • {patient.age} years • Blood: <span className="text-red-500 font-bold">{patient.blood}</span></p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50"><Phone size={14} className="text-teal-600" /> {patient.phone}</span>
                            {patient.email && <span className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50"><Mail size={14} className="text-teal-600" /> {patient.email}</span>}
                            {patient.address && <span className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50"><MapPin size={14} className="text-teal-600" /> {patient.address}</span>}
                        </div>
                    </div>
                    <div className="text-right text-sm bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bed No.</p>
                        <p className="font-bold text-gray-800 dark:text-white text-lg">{patient.bedNo || "N/A"}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-3">Admitted</p>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                            {new Date(patient.admittedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
                {[
                    { label: "Department", value: patient.dept },
                    { label: "Doctor", value: patient.doctor },
                    { label: "Weight", value: patient.weight || "N/A" },
                    { label: "Height", value: patient.height || "N/A" },
                ].map((v, i) => (
                    <div key={v.label} className={`glass-card p-5 text-center animate-fade-in-up stagger-${(i % 4) + 1}`}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{v.label}</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-white">{v.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Diagnosis */}
                <div className="glass-card p-6 animate-fade-in-up stagger-3">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-teal-600" /> Diagnosis
                    </h3>
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl text-gray-600 dark:text-gray-300 text-sm leading-relaxed shadow-inner">
                        {patient.diagnosis || "No diagnosis recorded yet."}
                    </div>
                </div>

                {/* Notes — only Admin & Doctor can see/edit */}
                <div className="glass-card p-6 animate-fade-in-up stagger-4">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <User size={18} className="text-teal-600" /> Doctor's Notes
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-4 rounded-xl shadow-inner mb-5">
                        {patient.notes || "No notes recorded yet."}
                    </p>
                    {/* Only Admin and Doctor can update notes or discharge */}
                    {(role === "Admin" || role === "Doctor") ? (
                        <div className="flex gap-3">
                            <button onClick={() => setShowEdit(true)} className="btn-primary flex-1">Update Notes</button>
                            {perms.canDischargePatient && <button className="btn-secondary flex-1">Discharge</button>}
                        </div>
                    ) : (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-xl text-xs font-semibold text-yellow-700 dark:text-yellow-400 text-center">
                            🔒 View only — Nurses cannot modify patient records
                        </div>
                    )}
                </div>

            </div>

            {/* ── Lab Reports Section ── */}
            <div className="mt-6 glass-card p-6 animate-fade-in-up stagger-5">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <FlaskConical size={18} className="text-purple-500" /> Lab Reports
                    </h3>
                    {(role === "Admin" || role === "Doctor") && (
                        <button onClick={() => setShowReportForm(!showReportForm)} className="btn-primary">
                            <Plus size={14} /> Add Report
                        </button>
                    )}
                </div>

                {/* Add Report Form */}
                {showReportForm && (
                    <div className="mb-5 p-4 bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-2xl animate-pop-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            {[{ label: "Test Name", key: "testName", ph: "e.g. Blood CBC, MRI, ECG" }, { label: "Result", key: "result", ph: "e.g. Normal / Abnormal" }, { label: "Notes", key: "notes", ph: "Additional observations" }].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                                    <input placeholder={f.ph} value={(reportForm as any)[f.key]} onChange={e => setReportForm({ ...reportForm, [f.key]: e.target.value })}
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Status</label>
                                <select value={reportForm.status} onChange={e => setReportForm({ ...reportForm, status: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none">
                                    {["Pending", "Normal", "Abnormal", "Critical"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowReportForm(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleAddReport} disabled={savingReport} className="btn-primary disabled:opacity-60">
                                {savingReport ? "Saving..." : "Save Report"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Reports List */}
                {reportsLoading ? (
                    <div className="space-y-3">
                        {[1, 2].map(i => <SkeletonText key={i} lines={2} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50" />)}
                    </div>
                ) : reports.length === 0 ? (
                    <EmptyState icon="reports" title="No lab reports yet" subtitle="Add the first lab report for this patient" />
                ) : (
                    <div className="space-y-3">
                        {reports.map(r => {
                            const statusColor: Record<string, string> = {
                                Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                                Normal: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                                Abnormal: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                                Critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                            };
                            return (
                                <div key={r.id} className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors">
                                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                                        <FlaskConical size={16} className="text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-bold text-gray-800 dark:text-white text-sm">{r.testName}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColor[r.status] || "bg-gray-100 text-gray-500"}`}>{r.status}</span>
                                        </div>
                                        {r.result && <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Result: <span className="font-semibold">{r.result}</span></p>}
                                        {r.notes && <p className="text-xs text-gray-500 mt-0.5">{r.notes}</p>}
                                    </div>
                                    <p className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Follow-Up Reminders Section ── */}
            <div className="mt-6 glass-card p-6 animate-fade-in-up stagger-6">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-5">
                    <Calendar size={18} className="text-orange-500" /> Follow-Up Reminders
                </h3>
                {followUps.length === 0 ? (
                    <EmptyState icon="calendar" title="No follow-ups scheduled" subtitle="Schedule a follow-up appointment for this patient" />
                ) : (
                    <div className="space-y-3">
                        {followUps.map(f => (
                            <div key={f.id} className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors">
                                <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                                    <Clock size={16} className="text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-bold text-gray-800 dark:text-white text-sm">Follow-up with {f.doctorName}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${f.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                            {f.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Date: <span className="font-semibold">{new Date(f.followUpDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></p>
                                    {f.notes && <p className="text-xs text-gray-500 mt-0.5 italic">"{f.notes}"</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Discharge Summary Modal */}
            {showDischargeSummary && (
                <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-2xl animate-pop-in flex flex-col" style={{ maxHeight: '90vh' }}>
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-3xl flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <Sparkles size={20} className="text-white" />
                                <div>
                                    <p className="text-white font-bold">AI Discharge Summary</p>
                                    <p className="text-indigo-200 text-xs">{patient.name} · {patient.dept}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDischargeSummary(false)} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <X size={16} className="text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto flex-1 p-6">
                            {generatingSummary ? (
                                <div className="space-y-3 animate-pulse">
                                    {[80, 100, 60, 90, 75, 100, 85, 70].map((w, i) => (
                                        <div key={i} className={`h-3 bg-indigo-100 dark:bg-indigo-900/30 rounded`} style={{ width: `${w}%` }} />
                                    ))}
                                    <p className="text-center text-sm text-indigo-400 mt-4 font-medium">✨ Generating clinical summary...</p>
                                </div>
                            ) : (
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 [&>h3]:text-indigo-800 [&>h3]:dark:text-indigo-300 [&>h3]:font-bold [&>h3]:text-sm [&>h3]:uppercase [&>h3]:tracking-wider [&>h3]:mt-5 [&>h3]:mb-2 [&>h3]:pb-1 [&>h3]:border-b [&>h3]:border-indigo-100 [&>h3]:dark:border-indigo-800/30 [&>p]:text-sm [&>p]:leading-relaxed [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ul]:text-sm"
                                    dangerouslySetInnerHTML={{ __html: dischargeSummary || '' }}
                                />
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 flex-shrink-0">
                            <button onClick={() => setShowDischargeSummary(false)} className="btn-secondary flex-1">Close</button>
                            <button
                                onClick={() => {
                                    setDischargeSummary(null);
                                    setGeneratingSummary(false);
                                    setTimeout(() => generateDischargeSummary(), 100);
                                }}
                                className="flex items-center justify-center gap-2 flex-1 text-sm font-semibold py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 active:scale-95 transition-all"
                            >
                                <Sparkles size={14} /> Regenerate
                            </button>
                        </div>
                    </div>
                </div>
            )}
                
            {/* AI Co-pilot Modal */}
            {showCoPilot && (
                <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-2xl animate-pop-in flex flex-col" style={{ maxHeight: '90vh' }}>
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-4 rounded-t-3xl flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <Sparkles size={20} className="text-white" />
                                <div>
                                    <p className="text-white font-bold">AI Doctor's Co-pilot</p>
                                    <p className="text-teal-100 text-xs">Clinical Decision Support · {patient.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCoPilot(false)} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <X size={16} className="text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto flex-1 p-6">
                            {generatingCoPilot ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-teal-100 dark:bg-teal-900/30 rounded w-1/3 mb-4" />
                                    {[100, 90, 80, 100, 70, 95].map((w, i) => (
                                        <div key={i} className={`h-3 bg-gray-100 dark:bg-gray-800 rounded`} style={{ width: `${w}%` }} />
                                    ))}
                                    <div className="h-4 bg-blue-100 dark:bg-blue-900/30 rounded w-1/4 mt-6 mb-4" />
                                    {[85, 100, 60, 90].map((w, i) => (
                                        <div key={i} className={`h-3 bg-gray-100 dark:bg-gray-800 rounded`} style={{ width: `${w}%` }} />
                                    ))}
                                    <p className="text-center text-sm text-teal-500 mt-8 font-medium">🔬 Analyzing medical history & lab results...</p>
                                </div>
                            ) : (
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 [&>h3]:text-teal-700 [&>h3]:dark:text-teal-400 [&>h3]:font-bold [&>h3]:text-sm [&>h3]:uppercase [&>h3]:tracking-wider [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:pb-1 [&>h3]:border-b [&>h3]:border-teal-100 [&>h3]:dark:border-teal-800/30 [&>p]:text-sm [&>p]:leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:text-sm [&>strong]:text-gray-800 [&>strong]:dark:text-white"
                                    dangerouslySetInnerHTML={{ __html: coPilotSuggestions || '' }}
                                />
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 flex-shrink-0">
                            <button onClick={() => setShowCoPilot(false)} className="btn-secondary flex-1">Close Co-pilot</button>
                            <button
                                onClick={() => {
                                    setCoPilotSuggestions(null);
                                    setGeneratingCoPilot(false);
                                    setTimeout(() => generateCoPilotSuggestions(), 100);
                                }}
                                className="flex items-center justify-center gap-2 flex-1 text-sm font-semibold py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-teal-500/20"
                            >
                                <Sparkles size={14} /> Refresh Analysis
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit Patient Modal ── */}
            {showEdit && (
                <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg animate-pop-in flex flex-col" style={{ maxHeight: "90vh" }}>
                        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-4 rounded-t-3xl flex items-center justify-between flex-shrink-0">
                            <div>
                                <p className="text-white font-bold">Edit Patient Profile</p>
                                <p className="text-teal-100 text-xs">{patient.name}</p>
                            </div>
                            <button onClick={() => setShowEdit(false)} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <X size={16} className="text-white" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            {[
                                { label: "Full Name", key: "name", ph: "Patient name" },
                                { label: "Age", key: "age", ph: "Age" },
                                { label: "Phone", key: "phone", ph: "Phone number" },
                                { label: "Email", key: "email", ph: "Email address" },
                                { label: "Address", key: "address", ph: "Address" },
                                { label: "Doctor", key: "doctor", ph: "Assigned doctor" },
                                { label: "Bed No.", key: "bedNo", ph: "Bed number" },
                                { label: "Diagnosis", key: "diagnosis", ph: "Diagnosis" },
                                { label: "Notes", key: "notes", ph: "Doctor notes" },
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
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Status</label>
                                <select value={editForm.status || ""} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Stable", "Critical", "Observation", "Discharged"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Gender</label>
                                <select value={editForm.gender || ""} onChange={e => setEditForm({ ...editForm, gender: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none">
                                    {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
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
            {/* ── Schedule Follow-up Modal ── */}
            {showFollowUpModal && (
                <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg animate-pop-in flex flex-col">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 rounded-t-3xl flex items-center justify-between flex-shrink-0">
                            <div>
                                <p className="text-white font-bold">Schedule Follow-up Reminder</p>
                                <p className="text-orange-100 text-xs">{patient.name}</p>
                            </div>
                            <button onClick={() => setShowFollowUpModal(false)} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <X size={16} className="text-white" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Follow-up in (Days)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={followUpDays}
                                    onChange={e => setFollowUpDays(Number(e.target.value))}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Notes / Instructions</label>
                                <textarea
                                    placeholder="e.g., Bring latest blood report"
                                    value={followUpNotes}
                                    onChange={e => setFollowUpNotes(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all min-h-[80px]"
                                />
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex gap-3 flex-shrink-0">
                            <button onClick={() => setShowFollowUpModal(false)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={handleScheduleFollowUp} disabled={schedulingFollowUp} className="flex items-center justify-center gap-2 flex-1 text-sm font-semibold py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-60">
                                {schedulingFollowUp ? "Scheduling..." : "Schedule Reminder"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}