"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users, Stethoscope, Activity, Clock, LogIn, UserPlus,
    Phone, Mail, Building2, Calendar, Shield, RefreshCw
} from "lucide-react";

interface ActivityLog {
    id: string;
    action: string;
    role: string;
    ipAddress: string;
    createdAt: string;
}

interface StaffUser {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    department?: string;
    createdAt: string;
    activities: ActivityLog[];
}

export default function StaffRegistryPage() {
    const router = useRouter();
    const [users, setUsers] = useState<StaffUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"All" | "Doctor" | "Nurse">("All");
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/auth/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "Admin") {
            router.push("/");
            return;
        }
        fetchUsers();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const filtered = filter === "All" ? users : users.filter(u => u.role === filter);
    const doctors = users.filter(u => u.role === "Doctor").length;
    const nurses = users.filter(u => u.role === "Nurse").length;

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    const getActionBadge = (action: string) => {
        if (action === "REGISTER") return { label: "Registered", color: "bg-emerald-100 text-emerald-700", icon: UserPlus };
        if (action === "LOGIN") return { label: "Logged In", color: "bg-blue-100 text-blue-700", icon: LogIn };
        return { label: action, color: "bg-gray-100 text-gray-600", icon: Clock };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                            <Users size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Staff Registry</h1>
                            <p className="text-sm text-gray-500 mt-0.5">All registered doctors & nurses with login activity</p>
                        </div>
                    </div>
                    <button onClick={handleRefresh} disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-teal-300 hover:text-teal-600 transition-all shadow-sm disabled:opacity-60">
                        <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                        { label: "Total Registered", value: users.length, icon: Users, color: "from-teal-500 to-teal-600", shadow: "shadow-teal-500/20" },
                        { label: "Doctors", value: doctors, icon: Stethoscope, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
                        { label: "Nurses", value: nurses, icon: Activity, color: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/20" },
                    ].map(stat => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.shadow}`}>
                                    <Icon size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 bg-white border border-gray-100 p-1.5 rounded-2xl w-fit shadow-sm">
                {(["All", "Doctor", "Nurse"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? "bg-teal-500 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}>
                        {f}{f !== "All" ? "s" : ""}
                    </button>
                ))}
            </div>

            {/* User Cards */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Users size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium">No staff registered yet</p>
                    <p className="text-sm mt-1">Registered doctors and nurses will appear here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filtered.map(user => (
                        <div key={user.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all overflow-hidden">
                            {/* User Header */}
                            <div className="p-5 border-b border-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${user.role === "Doctor" ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20" : "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/20"}`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{user.name}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user.role === "Doctor" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                                                    {user.role === "Doctor" ? "🩺" : "💉"} {user.role}
                                                </span>
                                                {user.department && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                                        {user.department}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                                            <Calendar size={11} /> Joined
                                        </p>
                                        <p className="text-xs font-semibold text-gray-600 mt-0.5">{formatDate(user.createdAt)}</p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Mail size={12} className="text-gray-400" />
                                        {user.email}
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Phone size={12} className="text-gray-400" />
                                            {user.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Activity Log */}
                            <div className="p-4">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <Clock size={11} /> Recent Activity ({user.activities.length})
                                </p>
                                {user.activities.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic">No activity recorded yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {user.activities.map(act => {
                                            const badge = getActionBadge(act.action);
                                            const Icon = badge.icon;
                                            return (
                                                <div key={act.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-all">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${badge.color}`}>
                                                            <Icon size={10} /> {badge.label}
                                                        </span>
                                                        {act.ipAddress !== "Unknown" && (
                                                            <span className="text-xs text-gray-400">IP: {act.ipAddress}</span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-400">{formatDate(act.createdAt)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
