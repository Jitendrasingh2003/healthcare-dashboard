"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BedDouble, Users, Activity, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const bedData = [
    { ward: "General", total: 100, occupied: 78, available: 22 },
    { ward: "ICU", total: 20, occupied: 18, available: 2 },
    { ward: "Emergency", total: 30, occupied: 24, available: 6 },
    { ward: "Pediatrics", total: 25, occupied: 15, available: 10 },
    { ward: "Maternity", total: 20, occupied: 12, available: 8 },
];

const opdData = [
    { day: "Mon", opd: 120, ipd: 35 },
    { day: "Tue", opd: 145, ipd: 42 },
    { day: "Wed", opd: 132, ipd: 38 },
    { day: "Thu", opd: 160, ipd: 50 },
    { day: "Fri", opd: 148, ipd: 45 },
    { day: "Sat", opd: 90, ipd: 28 },
    { day: "Sun", opd: 60, ipd: 20 },
];

const revenueData = [
    { month: "Jan", revenue: 4200000 },
    { month: "Feb", revenue: 3800000 },
    { month: "Mar", revenue: 5100000 },
    { month: "Apr", revenue: 4700000 },
    { month: "May", revenue: 5400000 },
    { month: "Jun", revenue: 4900000 },
];

const emergencyCases = [
    { id: 1, name: "Rakesh Sharma", issue: "Cardiac Arrest", time: "10:32 AM", severity: "High" },
    { id: 2, name: "Meena Patel", issue: "Fracture", time: "11:15 AM", severity: "Medium" },
    { id: 3, name: "Ajay Verma", issue: "Stroke", time: "12:05 PM", severity: "High" },
    { id: 4, name: "Sonia Gupta", issue: "Appendicitis", time: "01:20 PM", severity: "Medium" },
];

const severityStyle: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
};

export default function OperationsPage() {
    const [activeWard, setActiveWard] = useState("All");

    const totalBeds = bedData.reduce((a, b) => a + b.total, 0);
    const occupiedBeds = bedData.reduce((a, b) => a + b.occupied, 0);
    const availableBeds = bedData.reduce((a, b) => a + b.available, 0);
    const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

    const filtered = activeWard === "All" ? bedData : bedData.filter(b => b.ward === activeWard);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-gray-400 hover:text-gray-600 transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Hospital Operations</h1>
                        <p className="text-sm text-gray-500">Live bed management & stats</p>
                    </div>
                </div>
                <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">Live</span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Total Beds", value: totalBeds, icon: BedDouble, color: "bg-blue-50 dark:bg-blue-900/30 text-blue-600" },
                    { label: "Occupied", value: occupiedBeds, icon: Users, color: "bg-red-50 dark:bg-red-900/30 text-red-600" },
                    { label: "Available", value: availableBeds, icon: Activity, color: "bg-green-50 dark:bg-green-900/30 text-green-600" },
                    { label: "Occupancy Rate", value: `${occupancyRate}%`, icon: AlertCircle, color: "bg-orange-50 dark:bg-orange-900/30 text-orange-600" },
                ].map((k) => {
                    const Icon = k.icon;
                    return (
                        <div key={k.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${k.color}`}>
                                <Icon size={16} />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{k.label}</p>
                            <p className="text-2xl font-semibold text-gray-800 dark:text-white">{k.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Bed Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800 dark:text-white">Bed Management</h2>
                    <div className="flex gap-2 flex-wrap">
                        {["All", ...bedData.map(b => b.ward)].map((w) => (
                            <button
                                key={w}
                                onClick={() => setActiveWard(w)}
                                className={`text-xs px-3 py-1 rounded-full border transition ${activeWard === w
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-teal-300"
                                    }`}
                            >
                                {w}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-3">
                    {filtered.map((ward) => {
                        const pct = Math.round((ward.occupied / ward.total) * 100);
                        return (
                            <div key={ward.ward}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{ward.ward} Ward</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{ward.occupied}/{ward.total} beds • {pct}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-400" : "bg-teal-500"}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <h2 className="font-semibold text-gray-800 dark:text-white mb-1">OPD vs IPD</h2>
                    <p className="text-xs text-gray-400 mb-4">This week's patient flow</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={opdData}>
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                            <Bar dataKey="opd" fill="#1D9E75" radius={[4, 4, 0, 0]} name="OPD" />
                            <Bar dataKey="ipd" fill="#378ADD" radius={[4, 4, 0, 0]} name="IPD" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <h2 className="font-semibold text-gray-800 dark:text-white mb-1">Monthly Revenue</h2>
                    <p className="text-xs text-gray-400 mb-4">Jan – Jun 2026 (in ₹)</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={revenueData}>
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                            <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} formatter={(v: any) => `₹${(v / 100000).toFixed(1)}L`} />
                            <Line type="monotone" dataKey="revenue" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Emergency Cases */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800 dark:text-white">Emergency Cases Today</h2>
                    <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                        {emergencyCases.length} Active
                    </span>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-400 text-xs">
                            <th className="text-left py-3 font-medium">Patient</th>
                            <th className="text-left py-3 font-medium">Issue</th>
                            <th className="text-left py-3 font-medium">Time</th>
                            <th className="text-left py-3 font-medium">Severity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emergencyCases.map((e) => (
                            <tr key={e.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <td className="py-3 font-medium text-gray-800 dark:text-white">{e.name}</td>
                                <td className="py-3 text-gray-500 dark:text-gray-400">{e.issue}</td>
                                <td className="py-3 text-gray-500 dark:text-gray-400">{e.time}</td>
                                <td className="py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${severityStyle[e.severity]}`}>
                                        {e.severity}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}