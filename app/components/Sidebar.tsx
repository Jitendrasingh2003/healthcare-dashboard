"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
    LayoutDashboard, Users, Stethoscope, Activity,
    Settings, LogOut, Heart, Sun, Moon, Building2,
    Calendar, UserCheck, Receipt, FlaskConical,
    FileText, Pill, BedDouble, ClipboardList, Syringe, Sparkles
} from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import AIRiskNotificationBell from "./AIRiskNotificationBell";

import { useRole } from "../hooks/useRole";

// Admin nav — full hospital management
const adminNavItems = [
    { label: "Hospital", href: "/hospital", icon: Building2 },
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Appointments", href: "/appointments", icon: Calendar },
    { label: "Patients", href: "/patients", icon: Users },
    { label: "Doctors", href: "/doctors", icon: Stethoscope },
    { label: "Staff", href: "/staff", icon: UserCheck },
    { label: "Billing", href: "/billing", icon: Receipt },
    { label: "Operations", href: "/operations", icon: Activity },
    { label: "AI Triage", href: "/triage", icon: Sparkles },
    { label: "Symptom Mapper", href: "/ai/symptom-mapper", icon: Sparkles },
];

// Doctor nav — patient care focused
const doctorNavItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "My Patients", href: "/patients", icon: Users },
    { label: "Appointments", href: "/appointments", icon: Calendar },
    { label: "Lab Reports", href: "/lab-reports", icon: FlaskConical },
    { label: "Prescriptions", href: "/prescriptions", icon: Pill },
    { label: "Medical Records", href: "/medical-records", icon: FileText },
    { label: "AI Triage", href: "/triage", icon: Sparkles },
    { label: "Symptom Mapper", href: "/ai/symptom-mapper", icon: Sparkles },
];

// Nurse nav — ward & care focused
const nurseNavItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Ward Patients", href: "/patients", icon: Users },
    { label: "Appointments", href: "/appointments", icon: Calendar },
    { label: "Lab Reports", href: "/lab-reports", icon: FlaskConical },
    { label: "Vitals Log", href: "/vitals", icon: Activity },
    { label: "Medication", href: "/medication", icon: Syringe },
    { label: "Bed Management", href: "/beds", icon: BedDouble },
    { label: "Handover Notes", href: "/handover", icon: ClipboardList },
];


export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const role = useRole();

    // Pick nav items based on role
    const navItems =
        role === "Doctor" ? doctorNavItems :
        role === "Nurse" ? nurseNavItems :
        adminNavItems;

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
            console.error("Logout failed:", error);
        }
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("role");
        router.push("/login");
    };


    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass border-r-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-40 animate-slide-in-right">

            {/* Logo + Bell */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <Heart size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-white text-sm">HealthCare</p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">City General</p>
                    </div>
                </div>
                <AIRiskNotificationBell />
            </div>

            {/* Global Search */}
            <div className="px-3 py-3 border-b border-gray-200/50 dark:border-gray-800/50">
                <GlobalSearch />
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="text-[10px] text-gray-400 font-semibold px-3 mb-3 uppercase tracking-widest">Main Menu</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all active:scale-95 ${isActive
                                    ? "bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 font-medium shadow-sm border border-gray-100 dark:border-gray-700"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-white"
                                }`}
                        >
                            <Icon size={17} className={isActive ? "text-teal-600 dark:text-teal-400" : "text-gray-400"} />
                            {item.label}
                            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shadow-[0_0_8px_rgba(13,148,136,0.8)]" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-gray-200/50 dark:border-gray-800/50 space-y-1">
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 active:scale-95 transition-all"
                    >
                        {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-400" />}
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </button>
                )}

                <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 active:scale-95 transition-all">
                    <Settings size={18} className="text-gray-400" />
                    Settings
                </Link>

                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-all">
                    <LogOut size={18} />
                    Logout
                </button>

                {/* User */}
                <div className="flex items-center gap-3 px-3 py-3 mt-2 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                        {role.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-medium text-gray-800 dark:text-white">{role} User</p>
                        <p className="text-[10px] text-gray-400">{role.toLowerCase()}@hospital.com</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        role === "Admin" ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400" :
                        role === "Doctor" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" :
                        "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400"}`}>
                        {role}
                    </span>
                </div>
            </div>

        </aside>
    );
}