"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
    Heart, Phone, ArrowRight, Shield, Award, Users, Stethoscope,
    Activity, Star, CheckCircle, MapPin, Clock, ChevronRight, Menu, X
} from "lucide-react";

const stats = [
    { value: "1M+", label: "Patients Served" },
    { value: "120+", label: "Expert Doctors" },
    { value: "500+", label: "Beds Available" },
    { value: "25+", label: "Years of Care" },
];

const services = [
    { icon: Heart, name: "Cardiology", desc: "Advanced heart & vascular care", color: "bg-red-50 dark:bg-red-900/20 text-red-500" },
    { icon: Activity, name: "Neurology", desc: "Brain & nervous system specialists", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-500" },
    { icon: Shield, name: "Orthopedics", desc: "Bone, joint & sports medicine", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-500" },
    { icon: Stethoscope, name: "General Medicine", desc: "Comprehensive primary care", color: "bg-teal-50 dark:bg-teal-900/20 text-teal-500" },
    { icon: Star, name: "Pediatrics", desc: "Expert child & adolescent care", color: "bg-orange-50 dark:bg-orange-900/20 text-orange-500" },
    { icon: Users, name: "Gynecology", desc: "Women's health & maternity", color: "bg-pink-50 dark:bg-pink-900/20 text-pink-500" },
];

const testimonials = [
    { name: "Rahul A.", dept: "Cardiology Patient", text: "The care I received was exceptional. Doctors were attentive and the staff was warm and professional.", rating: 5 },
    { name: "Priya M.", dept: "Neurology Patient", text: "World-class facilities and experienced doctors. I felt safe and cared for throughout my treatment.", rating: 5 },
    { name: "Suresh K.", dept: "Family of Patient", text: "City General Hospital gave my father a second chance at life. We are forever grateful.", rating: 5 },
];

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #eff6ff 100%)" }}>

            {/* ── Navbar ────────────────────────────────────── */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg shadow-black/5" : "bg-transparent"}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                            <Heart size={20} className="text-white fill-white/60" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">City General Hospital</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Est. 1999</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <a href="#about" className="hover:text-teal-600 transition-colors">About</a>
                        <a href="#services" className="hover:text-teal-600 transition-colors">Services</a>
                        <a href="#testimonials" className="hover:text-teal-600 transition-colors">Testimonials</a>
                        <a href="#contact" className="hover:text-teal-600 transition-colors">Contact</a>
                        <Link href="/login" className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-2 rounded-xl hover:shadow-lg hover:shadow-teal-500/30 active:scale-95 transition-all font-semibold">
                            Staff Login
                        </Link>
                    </nav>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl glass">
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                {menuOpen && (
                    <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 px-6 py-4 space-y-3 animate-fade-in-up">
                        {["About", "Services", "Testimonials", "Contact"].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-teal-600 py-2 border-b border-gray-50 dark:border-gray-800">{item}</a>
                        ))}
                        <Link href="/login" className="btn-primary w-full justify-center mt-2">Staff Login</Link>
                    </div>
                )}
            </header>

            {/* ── Hero ──────────────────────────────────────── */}
            <section className="min-h-screen flex items-center pt-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-teal-100/60 blur-3xl" />
                    <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-blue-100/60 blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" /> NABH Accredited • Est. 1999
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Your Health,<br /><span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Our Mission.</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                            Compassionate, world-class healthcare for our community for over 25 years. Expert doctors, modern facilities, and care that puts you first.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="#contact" className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-7 py-3.5 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-teal-500/30 active:scale-95 transition-all">
                                Book Appointment <ArrowRight size={16} />
                            </a>
                            <a href="tel:+911800001234" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-7 py-3.5 rounded-2xl font-bold text-sm hover:shadow-md active:scale-95 transition-all">
                                <Phone size={16} className="text-teal-600" /> Emergency
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-8">
                            {["24/7 Emergency", "Free OPD Saturdays", "Cashless Treatment", "Home Care"].map(b => (
                                <div key={b} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                                    <CheckCircle size={14} className="text-teal-500" /> {b}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:block animate-fade-in-up stagger-2">
                        <div className="relative">
                            <div className="w-full h-96 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center relative overflow-hidden shadow-2xl shadow-teal-500/30">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                                <Heart size={100} className="text-white fill-white/30" />
                                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
                                    <p className="text-white text-xs font-bold">Patients Today</p>
                                    <p className="text-white text-2xl font-bold mt-1">142</p>
                                </div>
                                <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
                                    <p className="text-white text-xs font-bold">Doctors On Duty</p>
                                    <p className="text-white text-2xl font-bold mt-1">28</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats ─────────────────────────────────────── */}
            <section className="py-16 px-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={s.label} className={`text-center glass-card p-6 animate-fade-in-up stagger-${(i % 5) + 1}`}>
                            <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">{s.value}</p>
                            <p className="text-sm font-semibold text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── About ─────────────────────────────────────── */}
            <section id="about" className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-fade-in-up">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why City General?</h2>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Founded in 1999, City General Hospital is a 500-bed multi-specialty tertiary care centre. We are NABH & NABL certified, with over 120 experienced doctors and 400+ paramedical staff committed to your care.
                        </p>
                        {["ISO 9001:2015 Certified", "NABH & NABL Accredited", "Advanced Diagnostic Imaging", "Robotic Surgery Suite", "24/7 ICU & Emergency Services"].map(f => (
                            <div key={f} className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800">
                                <CheckCircle size={16} className="text-teal-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 animate-fade-in-up stagger-2">
                        {[
                            { icon: Award, label: "Accreditations", value: "NABH, NABL, ISO", color: "from-teal-400 to-teal-600" },
                            { icon: Users, label: "Staff", value: "500+ members", color: "from-blue-400 to-blue-600" },
                            { icon: Activity, label: "Specialties", value: "12 departments", color: "from-purple-400 to-purple-600" },
                            { icon: Clock, label: "Emergency", value: "24/7 open", color: "from-orange-400 to-orange-600" },
                        ].map((c, i) => {
                            const Icon = c.icon;
                            return (
                                <div key={c.label} className={`glass-card p-5 group animate-fade-in-up stagger-${(i % 4) + 1}`}>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={18} />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{c.label}</p>
                                    <p className="font-bold text-gray-800 dark:text-white text-sm">{c.value}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Services ──────────────────────────────────── */}
            <section id="services" className="py-20 px-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">Our Specialties</h2>
                        <p className="text-gray-500 max-w-lg mx-auto">Comprehensive care across all major medical disciplines, delivered by India's top specialists.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={s.name} className={`glass-card p-6 group cursor-pointer animate-fade-in-up stagger-${(i % 5) + 1}`}>
                                    <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-1 group-hover:text-teal-600 transition-colors">{s.name}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                                    <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
                                        Learn more <ChevronRight size={14} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ──────────────────────────────── */}
            <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">What Patients Say</h2>
                    <p className="text-gray-500">Real stories from real patients</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={t.name} className={`glass-card p-6 animate-fade-in-up stagger-${(i % 3) + 1}`}>
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic mb-5">"{t.text}"</p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white text-xs font-bold flex items-center justify-center">{t.name[0]}</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white text-sm">{t.name}</p>
                                    <p className="text-[10px] text-gray-400">{t.dept}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Contact / CTA ─────────────────────────────── */}
            <section id="contact" className="py-20 px-6 bg-gradient-to-br from-teal-600 to-cyan-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h2 className="text-3xl font-bold text-white mb-3">Ready to Get Care?</h2>
                    <p className="text-white/80 mb-8 max-w-lg mx-auto">Book an appointment today or call our helpline. We're here 24/7 for your health needs.</p>
                    <div className="flex flex-wrap gap-4 justify-center mb-10">
                        <a href="tel:+911800001234" className="flex items-center gap-2 bg-white text-teal-700 font-bold px-7 py-3.5 rounded-2xl hover:shadow-xl active:scale-95 transition-all">
                            <Phone size={16} /> 1800-001-234 (Free)
                        </a>
                        <Link href="/login" className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-white/30 active:scale-95 transition-all">
                            Staff Portal <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        {[
                            { icon: MapPin, text: "12, Medical Colony, City Centre" },
                            { icon: Phone, text: "+91 98765-43210 (Appointments)" },
                            { icon: Clock, text: "OPD: Mon–Sat 8AM – 8PM" },
                        ].map(c => {
                            const Icon = c.icon;
                            return (
                                <div key={c.text} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-xs font-medium">
                                    <Icon size={14} className="flex-shrink-0 text-white/80" /> {c.text}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────── */}
            <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-xs">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart size={14} className="text-teal-500" />
                    <span className="font-semibold text-gray-300">City General Hospital</span>
                </div>
                <p>© 2026 City General Hospital. All rights reserved. NABH Accredited. ISO 9001:2015 Certified.</p>
                <Link href="/login" className="inline-block mt-3 text-teal-400 hover:text-teal-300 font-semibold hover:underline">Staff Login →</Link>
            </footer>
        </div>
    );
}
