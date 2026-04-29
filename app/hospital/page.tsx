"use client";
import Link from "next/link";
import {
    Heart, Phone, Mail, MapPin, Clock, Award, Users, Stethoscope,
    Activity, Shield, Star, ArrowRight, ChevronRight, Building2
} from "lucide-react";

const stats = [
    { label: "Years of Service", value: "25+", icon: Award, color: "from-teal-400 to-teal-600" },
    { label: "Beds Available", value: "500+", icon: Building2, color: "from-blue-400 to-blue-600" },
    { label: "Expert Doctors", value: "120+", icon: Stethoscope, color: "from-purple-400 to-purple-600" },
    { label: "Patients Served", value: "1M+", icon: Users, color: "from-orange-400 to-orange-600" },
];

const departments = [
    { name: "Cardiology", desc: "Advanced heart care with state-of-the-art cath labs and cardiac ICU.", icon: Heart, color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400", border: "border-red-100 dark:border-red-800/30" },
    { name: "Neurology", desc: "Comprehensive brain and spine treatment with neuro-imaging labs.", icon: Activity, color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-800/30" },
    { name: "Orthopedics", desc: "Joint replacements, sports injuries, and bone health specialists.", icon: Shield, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-800/30" },
    { name: "Pediatrics", desc: "Dedicated children's care from newborns to adolescents.", icon: Star, color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400", border: "border-orange-100 dark:border-orange-800/30" },
    { name: "Emergency", desc: "24/7 trauma and emergency services with rapid response teams.", icon: Activity, color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400", border: "border-rose-100 dark:border-rose-800/30" },
    { name: "General Surgery", desc: "Minimally invasive laparoscopic and robotic-assisted surgeries.", icon: Stethoscope, color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400", border: "border-teal-100 dark:border-teal-800/30" },
];

const team = [
    { name: "Dr. Anjali Mehta", role: "Chief Medical Officer", dept: "Cardiology", exp: "22 yrs", initials: "AM" },
    { name: "Dr. Rajiv Verma", role: "Head of Neurology", dept: "Neurology", exp: "18 yrs", initials: "RV" },
    { name: "Dr. Priya Singh", role: "Head of Pediatrics", dept: "Pediatrics", exp: "15 yrs", initials: "PS" },
    { name: "Dr. Suresh Joshi", role: "Chief Surgeon", dept: "General Surgery", exp: "20 yrs", initials: "SJ" },
];

const facilities = [
    "ICU & Critical Care Unit",
    "Advanced Diagnostic Imaging (MRI, CT, PET)",
    "Robotic Surgery Suite",
    "Blood Bank & Pathology Lab",
    "Pharmacy (24/7)",
    "Ambulance Services",
    "Cafeteria & Patient Lounges",
    "Free Parking & Wheelchair Access",
];

export default function HospitalPage() {
    return (
        <div className="min-h-screen animate-fade-in">

            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl mx-6 mt-6 mb-8 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-400 p-8 md:p-12 animate-fade-in-up">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                        <Heart size={12} className="fill-white" /> Est. 1999 • Accredited Hospital
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                        City General Hospital
                    </h1>
                    <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
                        Providing compassionate, world-class healthcare to our community for over 25 years. Your health, our mission.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a href="tel:+911800001234" className="flex items-center gap-2 bg-white text-teal-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg transition-all active:scale-95">
                            <Phone size={15} /> Emergency: 1800-001-234
                        </a>
                        <Link href="/patients" className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all active:scale-95">
                            Book Appointment <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
                {/* Decorative circle */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-48 h-48 rounded-full bg-white/10 border border-white/20">
                    <div className="flex items-center justify-center w-32 h-32 rounded-full bg-white/15 border border-white/25">
                        <Heart size={48} className="text-white fill-white/40" />
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-8 pb-10">

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className="glass-card p-5 text-center group">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={22} />
                                </div>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.value}</p>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* About Section */}
                <div className="glass-card p-6 md:p-8 animate-fade-in-up stagger-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center">
                            <Building2 size={18} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">About Us</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                City General Hospital, founded in 1999, is a 500-bed multi-specialty tertiary care hospital located in the heart of the city. We are committed to delivering patient-centered healthcare through a team of over 120 experienced doctors and 400+ paramedical staff.
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Accredited by NABH and NABL, we consistently uphold international standards in clinical care, patient safety, and hospital management. Our vision is a healthier community — one patient at a time.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {["NABH Accredited", "ISO 9001:2015", "24/7 Emergency", "Cashless Treatment", "NABL Certified Lab", "Free OPD Saturdays"].map((badge) => (
                                <div key={badge} className="flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30 rounded-xl px-3 py-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                                    <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">{badge}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Departments */}
                <div className="animate-fade-in-up stagger-3">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Our Departments</h2>
                        <Link href="/doctors" className="flex items-center gap-1 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:gap-2 transition-all">
                            View All Doctors <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {departments.map((dept, i) => {
                            const Icon = dept.icon;
                            return (
                                <div key={dept.name} className={`glass-card p-5 group cursor-pointer animate-fade-in-up stagger-${(i % 5) + 1}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${dept.color} ${dept.border} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={18} />
                                    </div>
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{dept.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{dept.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leadership Team */}
                <div className="animate-fade-in-up stagger-4">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Leadership Team</h2>
                        <Link href="/doctors" className="flex items-center gap-1 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:gap-2 transition-all">
                            All Doctors <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {team.map((member, i) => (
                            <div key={member.name} className={`glass-card p-5 text-center group animate-fade-in-up stagger-${(i % 4) + 1}`}>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                                    {member.initials}
                                </div>
                                <p className="font-bold text-gray-800 dark:text-white text-sm">{member.name}</p>
                                <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-0.5">{member.role}</p>
                                <div className="flex items-center justify-center gap-3 mt-3">
                                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">{member.dept}</span>
                                    <span className="text-[10px] text-gray-500">{member.exp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Facilities */}
                <div className="glass-card p-6 md:p-8 animate-fade-in-up stagger-5">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                        <Shield size={20} className="text-teal-600" /> Facilities & Infrastructure
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {facilities.map((f) => (
                            <div key={f} className="flex items-center gap-3 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl px-4 py-3">
                                <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact & Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up stagger-5">

                    {/* Contact */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                            <Phone size={18} className="text-teal-600" /> Contact Us
                        </h2>
                        <div className="space-y-4">
                            {[
                                { icon: Phone, label: "Emergency / OPD", value: "+91 1800-001-234", color: "text-red-500" },
                                { icon: Phone, label: "Appointment", value: "+91 98765-43210", color: "text-teal-500" },
                                { icon: Mail, label: "Email", value: "info@citygeneralhospital.in", color: "text-blue-500" },
                                { icon: MapPin, label: "Address", value: "12, Medical Colony, City Centre, State — 110001", color: "text-orange-500" },
                            ].map((c) => {
                                const Icon = c.icon;
                                return (
                                    <div key={c.label} className="flex items-start gap-3 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-3 rounded-xl">
                                        <div className={`mt-0.5 ${c.color}`}><Icon size={16} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.label}</p>
                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{c.value}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                            <Clock size={18} className="text-teal-600" /> Working Hours
                        </h2>
                        <div className="space-y-3">
                            {[
                                { day: "Monday – Friday", time: "8:00 AM – 8:00 PM", open: true },
                                { day: "Saturday", time: "8:00 AM – 6:00 PM (Free OPD)", open: true },
                                { day: "Sunday", time: "10:00 AM – 2:00 PM", open: true },
                                { day: "Emergency / ICU", time: "24 Hours, 7 Days", open: true, highlight: true },
                            ].map((h) => (
                                <div key={h.day} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${h.highlight ? "bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800/30" : "bg-white/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50"}`}>
                                    <p className={`text-sm font-semibold ${h.highlight ? "text-teal-700 dark:text-teal-300" : "text-gray-700 dark:text-gray-300"}`}>{h.day}</p>
                                    <p className={`text-xs font-bold ${h.highlight ? "text-teal-600 dark:text-teal-400" : "text-gray-500"}`}>{h.time}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl">
                            <p className="text-xs font-bold text-red-600 dark:text-red-400 text-center">🚨 Emergency Line: 1800-001-234 (Toll Free)</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
