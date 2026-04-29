"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Eye, EyeOff, Lock, Mail, Shield, Users, Stethoscope, Activity } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [role, setRole] = useState("Admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const credentials: Record<string, { email: string; password: string }> = {
        Admin: { email: "admin@hospital.com", password: "admin123" },
        Doctor: { email: "doctor@hospital.com", password: "doctor123" },
        Nurse: { email: "nurse@hospital.com", password: "nurse123" },
    };

    const roleIcons: Record<string, any> = { Admin: Shield, Doctor: Stethoscope, Nurse: Activity };

    const handleLogin = () => {
        setError("");
        setLoading(true);
        setTimeout(() => {
            const valid = credentials[role];
            if (email === valid.email && password === valid.password) {
                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("role", role);
                router.push("/");
            } else {
                setError("Invalid email or password. Try demo credentials below.");
                setLoading(false);
            }
        }, 1000);
    };

    const fillDemo = () => {
        setEmail(credentials[role].email);
        setPassword(credentials[role].password);
    };

    return (
        <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)" }}>

            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 flex-col justify-between p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10" />
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                        <Heart size={24} className="text-white fill-white/60" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">City General Hospital</p>
                        <p className="text-white/70 text-xs">Healthcare Analytics Platform</p>
                    </div>
                </div>

                {/* Center Content */}
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                        Your health,<br />our mission.
                    </h1>
                    <p className="text-white/80 text-base leading-relaxed mb-8">
                        Manage patients, doctors, appointments, and hospital operations — all in one place.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Patients Served", value: "1M+" },
                            { label: "Expert Doctors", value: "120+" },
                            { label: "Years of Service", value: "25+" },
                            { label: "Beds Available", value: "500+" },
                        ].map(s => (
                            <div key={s.label} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                                <p className="text-2xl font-bold text-white">{s.value}</p>
                                <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="relative z-10 text-white/50 text-xs">© 2026 City General Hospital • NABH Accredited</p>
            </div>

            {/* Right Panel — Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">

                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-teal-500/30">
                            <Heart size={24} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">City General Hospital</h1>
                        <p className="text-sm text-gray-500">Healthcare Analytics</p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Welcome back 👋</h2>
                        <p className="text-gray-500 text-sm mt-1">Sign in to access the dashboard</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="flex gap-2 mb-6 bg-gray-100/80 p-1.5 rounded-2xl">
                        {["Admin", "Doctor", "Nurse"].map(r => {
                            const Icon = roleIcons[r];
                            return (
                                <button key={r} onClick={() => { setRole(r); setEmail(""); setPassword(""); setError(""); }}
                                    className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2.5 rounded-xl transition-all font-semibold active:scale-95 ${role === r ? "bg-white text-teal-700 shadow-md" : "text-gray-500 hover:text-gray-700"}`}>
                                    <Icon size={14} />
                                    {r}
                                </button>
                            );
                        })}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wider">Email Address</label>
                        <div className="flex items-center gap-3 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:border-teal-400 focus-within:shadow-lg focus-within:shadow-teal-500/10 transition-all">
                            <Mail size={16} className="text-gray-400" />
                            <input type="email" placeholder={credentials[role].email} value={email}
                                onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                                className="text-sm outline-none w-full text-gray-700 bg-transparent" />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-2">
                        <label className="text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wider">Password</label>
                        <div className="flex items-center gap-3 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:border-teal-400 focus-within:shadow-lg focus-within:shadow-teal-500/10 transition-all">
                            <Lock size={16} className="text-gray-400" />
                            <input type={showPass ? "text" : "password"} placeholder="Enter your password" value={password}
                                onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                                className="text-sm outline-none w-full text-gray-700 bg-transparent" />
                            <button onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Demo hint */}
                    <div className="mb-5">
                        <button onClick={fillDemo} className="text-xs text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-all">
                            ✨ Use demo credentials for {role} →
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Login Button */}
                    <button onClick={handleLogin} disabled={loading}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3.5 rounded-xl text-sm font-bold hover:from-teal-600 hover:to-teal-700 hover:shadow-xl hover:shadow-teal-500/30 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                        {loading ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                        ) : `Sign in as ${role}`}
                    </button>

                    {/* Demo Box */}
                    <div className="mt-5 p-4 bg-teal-50 border border-teal-100 rounded-xl">
                        <p className="text-xs font-bold text-teal-700 mb-1">Demo — {role} Credentials</p>
                        <p className="text-xs text-teal-600">📧 {credentials[role].email}</p>
                        <p className="text-xs text-teal-600">🔑 {credentials[role].password}</p>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-6">Healthcare Analytics v1.0 • City General Hospital</p>
                    <div className="text-center mt-2">
                        <Link href="/landing" className="text-xs text-teal-600 hover:underline font-semibold">🏥 Visit Hospital Website →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}