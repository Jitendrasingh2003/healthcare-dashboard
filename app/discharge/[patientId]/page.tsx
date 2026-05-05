"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, Receipt, CheckCircle, ArrowRight, ArrowLeft, Loader2, HeartPulse, CreditCard, Sparkles } from "lucide-react";

export default function DischargeWizard() {
    const params = useParams();
    const router = useRouter();
    const patientId = params.patientId as string;

    const [step, setStep] = useState(1);
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // AI Summary State
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [aiSummary, setAiSummary] = useState("");

    // Billing State
    const [generatingBill, setGeneratingBill] = useState(false);
    const [invoiceData, setInvoiceData] = useState<any>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                // Fetch patients and find the one (since we don't have a single patient API, we can fetch all and filter or create one)
                // Actually, let's create a quick API for single patient or use the existing ones if possible.
                // Wait, /api/patients returns all patients. We can filter.
                const res = await fetch("/api/patients");
                const data = await res.json();
                const p = data.find((x: any) => x.id === patientId);
                setPatient(p);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [patientId]);

    const handleGenerateSummary = async () => {
        setGeneratingSummary(true);
        try {
            const res = await fetch("/api/ai/discharge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientId })
            });
            const data = await res.json();
            if (data.summary) {
                setAiSummary(data.summary);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setGeneratingSummary(false);
        }
    };

    const handleFinalizeDischarge = async () => {
        setGeneratingBill(true);
        try {
            const res = await fetch("/api/billing/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientId, aiSummary })
            });
            const data = await res.json();
            if (res.ok) {
                setInvoiceData(data);
                setStep(4); // Move to final success step
            } else {
                alert("Error: " + data.error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setGeneratingBill(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-500 w-10 h-10" /></div>;
    }

    if (!patient) {
        return <div className="min-h-screen flex items-center justify-center">Patient not found</div>;
    }

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="min-h-screen p-8 bg-gray-50/50 dark:bg-[#0B1120] animate-fade-in">
            {/* Header & Progress Bar */}
            <div className="max-w-4xl mx-auto mb-8">
                <button onClick={() => router.push("/patients")} className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white flex items-center gap-2 mb-4 transition-colors">
                    <ArrowLeft size={16} /> Back to Patients
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    Patient Discharge Wizard
                </h1>
                
                <div className="flex items-center mt-8 gap-4">
                    {[
                        { num: 1, label: "Review Details", icon: HeartPulse },
                        { num: 2, label: "Clinical Summary", icon: FileText },
                        { num: 3, label: "Billing & Finalize", icon: Receipt },
                        { num: 4, label: "Done", icon: CheckCircle }
                    ].map((s, i) => (
                        <div key={s.num} className="flex-1">
                            <div className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-500 ${step === s.num ? "bg-white dark:bg-gray-800 shadow-md border border-teal-100 dark:border-teal-900/50" : step > s.num ? "opacity-60" : "opacity-40 grayscale"}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${step >= s.num ? "bg-gradient-to-br from-teal-400 to-teal-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}>
                                    <s.icon size={18} />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Step {s.num}</p>
                                    <p className={`text-sm font-bold ${step >= s.num ? "text-gray-800 dark:text-white" : "text-gray-500"}`}>{s.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 rounded-3xl p-8 shadow-xl backdrop-blur-xl animate-fade-in-up">
                    
                    {/* STEP 1: REVIEW */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{patient.name}</h2>
                                    <p className="text-sm text-gray-500">ID: {patient.id}</p>
                                </div>
                                <span className="bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full font-bold text-sm">
                                    Ready for Discharge
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                    <p className="text-xs text-gray-400 mb-1">Admitted Date</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{new Date(patient.admittedDate).toLocaleDateString()}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                    <p className="text-xs text-gray-400 mb-1">Department</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{patient.dept}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                    <p className="text-xs text-gray-400 mb-1">Doctor</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{patient.doctor}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                    <p className="text-xs text-gray-400 mb-1">Diagnosis</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{patient.diagnosis || "N/A"}</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <button onClick={nextStep} className="btn-primary flex items-center gap-2">
                                    Continue to Clinical Summary <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: AI SUMMARY */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Sparkles className="text-amber-500" /> AI Clinical Summary
                                </h2>
                                {!aiSummary && !generatingSummary && (
                                    <button onClick={handleGenerateSummary} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform flex items-center gap-2">
                                        <Sparkles size={16} /> Generate Summary
                                    </button>
                                )}
                            </div>

                            {generatingSummary ? (
                                <div className="p-8 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/20 border border-gray-200 dark:border-gray-700 animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                                    <p className="text-center text-sm text-gray-400 font-medium mt-8 pt-4 flex items-center justify-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-purple-500" /> Gemini is analyzing patient records...
                                    </p>
                                </div>
                            ) : aiSummary ? (
                                <div className="space-y-4">
                                    <textarea 
                                        value={aiSummary} 
                                        onChange={(e) => setAiSummary(e.target.value)}
                                        className="w-full h-80 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-mono text-sm leading-relaxed outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                                    />
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <Sparkles size={12} className="text-amber-500" /> AI-generated content. Please review and edit if necessary before finalizing.
                                    </p>
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <FileText size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-500">Click Generate Summary to let AI analyze the records.</p>
                                </div>
                            )}

                            <div className="flex justify-between pt-4">
                                <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Back
                                </button>
                                <button onClick={nextStep} disabled={!aiSummary} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                                    Continue to Billing <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: BILLING */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <CreditCard className="text-blue-500" /> Billing Overview
                            </h2>
                            <p className="text-sm text-gray-500">Review the auto-generated charges based on the patient's stay.</p>

                            <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-gray-800/80 dark:to-gray-800/30 border border-blue-100 dark:border-gray-700 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                                
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Room Charges (Auto-calculated)</span>
                                        <span className="text-gray-800 dark:text-gray-200 font-semibold">Will be calculated upon finalize</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Doctor Consultation</span>
                                        <span className="text-gray-800 dark:text-gray-200 font-semibold">Standard Rates Apply</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Lab & Pharmacy</span>
                                        <span className="text-gray-800 dark:text-gray-200 font-semibold">Flat Fee Appended</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex justify-between items-center">
                                        <span className="text-base font-bold text-gray-800 dark:text-white">Estimated Total</span>
                                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">Processing...</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button onClick={prevStep} disabled={generatingBill} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Back
                                </button>
                                <button onClick={handleFinalizeDischarge} disabled={generatingBill} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:scale-105 transition-transform flex items-center gap-2">
                                    {generatingBill ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />} 
                                    {generatingBill ? "Processing..." : "Finalize & Discharge"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: DONE */}
                    {step === 4 && invoiceData && (
                        <div className="text-center py-10 animate-fade-in-up">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                                <CheckCircle size={48} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">Discharge Complete!</h2>
                            <p className="text-gray-500 mb-8">The patient has been successfully discharged and the bed is now available.</p>

                            <div className="max-w-sm mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-left shadow-lg mb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Final Invoice Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Days Admitted</span><span className="font-semibold text-gray-800 dark:text-gray-200">{invoiceData.breakdown.daysAdmitted} Days</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Room Charges</span><span className="font-semibold text-gray-800 dark:text-gray-200">₹{invoiceData.breakdown.roomCharges.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Doctor Fees</span><span className="font-semibold text-gray-800 dark:text-gray-200">₹{invoiceData.breakdown.doctorCharges.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Taxes (18%)</span><span className="font-semibold text-gray-800 dark:text-gray-200">₹{invoiceData.breakdown.tax.toLocaleString()}</span></div>
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2 flex justify-between">
                                        <span className="font-bold text-gray-800 dark:text-gray-200">Total Amount</span>
                                        <span className="font-black text-teal-600 dark:text-teal-400 text-lg">₹{invoiceData.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => router.push("/patients")} className="btn-primary px-8">
                                Return to Patients
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
