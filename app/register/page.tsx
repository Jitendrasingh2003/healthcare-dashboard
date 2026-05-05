"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Eye, EyeOff, Lock, Mail, User, Stethoscope, Activity, Phone, Building2 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [role, setRole] = useState("Doctor");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const roleIcons: Record<string, any> = { Doctor: Stethoscope, Nurse: Activity };

    const departments = [
        "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
        "Oncology", "Radiology", "Emergency", "General Surgery",
        "Gynecology", "ICU", "General"
    ];

    useEffect(() => {
        const queryRole = searchParams.get("role");
        if (queryRole === "Doctor" || queryRole === "Nurse") {
            setRole(queryRole);
        }
    }, [searchParams]);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError("Name, email and password are required");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role, phone, department }),
            });

            const data = await res.json();

            if (res.ok) {
                // Auto login after successful registration
                const loginRes = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (loginRes.ok) {
                    const loginData = await loginRes.json();
                    localStorage.setItem("loggedIn", "true");
                    localStorage.setItem("role", loginData.user.role);
                    localStorage.setItem("userName", loginData.user.name);
                    
                    // Redirect based on role
                    if (loginData.user.role === "Doctor") {
                        router.push("/patients");
                    } else if (loginData.user.role === "Nurse") {
                        router.push("/vitals");
                    } else {
                        router.push("/");
                    }
                } else {
                    router.push("/login");
                }
            } else {
                setError(data.error || "Failed to register account.");
                setLoading(false);
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)" }}>

            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10" />
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                        <Heart size={24} className="text-white fill-white/60" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">City General Hospital</p>
                        <p className="text-white/70 text-xs">Healthcare Analytics Platform</p>
                    </div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                        Join our medical<br />team today.
                    </h1>
                    <p className="text-white/80 text-base leading-relaxed mb-8">
                        Sign up to access patient records, manage appointments, and track your ward seamlessly.
                    </p>
                </div>

                <p className="relative z-10 text-white/50 text-xs">© 2026 City General Hospital • Staff Portal</p>
            </div>

            {/* Right Panel — Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">

                    <div className="lg:hidden text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-teal-500/30">
                            <Heart size={24} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">City General</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Create an account</h2>
                        <p className="text-gray-500 text-sm mt-1">Join the hospital staff portal</p>
                    </div>

                    {/* Role Tabs (No Admin) */}
                    <div className="flex gap-2 mb-6 bg-gray-100/80 p-1.5 rounded-2xl">
                        {["Doctor", "Nurse"].map(r => {
                            const Icon = roleIcons[r];
                            return (
                                <button key={r} onClick={() => { setRole(r); setError(""); }}
                                    className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2.5 rounded-xl transition-all font-semibold active:scale-95 ${role === r ? "bg-white text-teal-700 shadow-md" : "text-gray-500 hover:text-gray-700"}`}>
                                    <Icon size={14} />
                                    {r}
                                </button>
                            );
                        })}
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                        <label className="text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wider">Full Name</label>
                        <div className="flex items-center gap-3 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:border-teal-400 focus-within:shadow-lg focus-within:shadow-teal-500/10 transition-all">
                            <User size={16} className="text-gray-400" />
                            <input type="text" placeholder={role === "Doctor" ? "Dr. John Doe" : "Nurse Jane Smith"} value={name}
                                onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRegister()}
                                className="text-sm outline-none w-full text-gray-700 bg-transparent" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wider">Email Address</label>
                        <div className="flex items-center gap-3 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:border-teal-400 focus-within:shadow-lg focus-within:shadow-teal-500/10 transition-all">
                            <Mail size={16} className="text-gray-400" />
                            <input type="email" placeholder="you@hospital.com" value={email}
                                onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRegister()}
                                className="text-sm outline-none w-full text-gray-700 bg-transparent" />
                        </div>
                    </div>

                    {/* Phone + Department Row */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wider">Phone</label>
                            <div className="flex items-center gap-2 bg-white border-2 border-gray-100 rounded-xl px-3 py-3 focus-within:border-teal-400 transition-all">
                                <Phone size={14} className="text-gray-400 shrink-0" />
                                <input type="tel" placeholder="9876543210" value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="text-sm outline-none w-full text-gray-700 bg-transparent" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wider">Department</label>
                            <div className="flex items-center gap-2 bg-white border-2 border-gray-100 rounded-xl px-3 py-3 focus-within:border-teal-400 transition-all">
                                <Building2 size={14} className="text-gray-400 shrink-0" />
                                <select value={department} onChange={e => setDepartment(e.target.value)}
                                    className="text-sm outline-none w-full text-gray-700 bg-transparent">
                                    <option value="">Select...</option>
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wider">Password</label>
                        <div className="flex items-center gap-3 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:border-teal-400 focus-within:shadow-lg focus-within:shadow-teal-500/10 transition-all">
                            <Lock size={16} className="text-gray-400" />
                            <input type={showPass ? "text" : "password"} placeholder="Create a secure password" value={password}
                                onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRegister()}
                                className="text-sm outline-none w-full text-gray-700 bg-transparent" />
                            <button onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>


                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Register Button */}
                    <button onClick={handleRegister} disabled={loading}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3.5 rounded-xl text-sm font-bold hover:from-teal-600 hover:to-teal-700 hover:shadow-xl hover:shadow-teal-500/30 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                        {loading ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Account...</>
                        ) : `Sign up as ${role}`}
                    </button>

                    <div className="mt-5 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account? <Link href="/login" className="text-teal-600 font-bold hover:underline">Sign in</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
