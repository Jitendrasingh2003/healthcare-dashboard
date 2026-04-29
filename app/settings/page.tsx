"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Bell, Shield, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    const router = useRouter();
    const [role, setRole] = useState("Admin");
    const [activeTab, setActiveTab] = useState("Profile");
    const [saved, setSaved] = useState(false);

    const [profile, setProfile] = useState({
        name: "Admin User",
        email: "admin@hospital.com",
        phone: "9876543210",
        hospital: "City General Hospital",
        dept: "Administration",
    });

    const [passwords, setPasswords] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        criticalAlerts: true,
        dischargeAlerts: false,
        reportAlerts: true,
        smsAlerts: false,
    });

    useEffect(() => {
        const savedRole = localStorage.getItem("role") || "Admin";
        setRole(savedRole);
        setProfile(prev => ({
            ...prev,
            name: `${savedRole} User`,
            email: `${savedRole.toLowerCase()}@hospital.com`,
        }));
    }, []);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { label: "Profile", icon: User },
        { label: "Password", icon: Lock },
        { label: "Notifications", icon: Bell },
        { label: "Security", icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-gray-400 hover:text-gray-600 transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Settings</h1>
                        <p className="text-sm text-gray-500">Manage your account preferences</p>
                    </div>
                </div>
                {saved && (
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium animate-pulse">
                        ✓ Saved successfully!
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Sidebar Tabs */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-3">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.label}
                                    onClick={() => setActiveTab(tab.label)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all mb-1 ${activeTab === tab.label
                                            ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* User Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mt-4 text-center">
                        <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-400 flex items-center justify-center text-lg font-bold mx-auto mb-3">
                            {role.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{role} User</p>
                        <p className="text-xs text-gray-400">{role.toLowerCase()}@hospital.com</p>
                        <span className="inline-block mt-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                            {role}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="md:col-span-3">

                    {/* Profile Tab */}
                    {activeTab === "Profile" && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                                <User size={18} className="text-teal-600" /> Profile Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">Phone Number</label>
                                    <input
                                        type="text"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">Hospital</label>
                                    <input
                                        type="text"
                                        value={profile.hospital}
                                        onChange={(e) => setProfile({ ...profile, hospital: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">Department</label>
                                    <select
                                        value={profile.dept}
                                        onChange={(e) => setProfile({ ...profile, dept: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                                    >
                                        {["Administration", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Emergency"].map(d => (
                                            <option key={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleSave}
                                className="mt-6 flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-700 transition"
                            >
                                <Save size={15} /> Save Changes
                            </button>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === "Password" && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                                <Lock size={18} className="text-teal-600" /> Change Password
                            </h2>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter current password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={passwords.newPass}
                                        onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 transition"
                                    />
                                </div>
                                {passwords.newPass && passwords.confirm && passwords.newPass !== passwords.confirm && (
                                    <p className="text-xs text-red-500">⚠️ Passwords do not match!</p>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={!passwords.current || !passwords.newPass || passwords.newPass !== passwords.confirm}
                                    className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-700 transition disabled:opacity-50"
                                >
                                    <Save size={15} /> Update Password
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === "Notifications" && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                                <Bell size={18} className="text-teal-600" /> Notification Preferences
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { key: "emailAlerts", label: "Email Alerts", desc: "Receive alerts via email" },
                                    { key: "criticalAlerts", label: "Critical Case Alerts", desc: "Get notified for critical patients" },
                                    { key: "dischargeAlerts", label: "Discharge Alerts", desc: "Notify when patient is discharged" },
                                    { key: "reportAlerts", label: "Report Alerts", desc: "Get lab report notifications" },
                                    { key: "smsAlerts", label: "SMS Alerts", desc: "Receive SMS notifications" },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">{item.label}</p>
                                            <p className="text-xs text-gray-400">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                            className={`w-11 h-6 rounded-full transition-all relative ${notifications[item.key as keyof typeof notifications]
                                                    ? "bg-teal-600"
                                                    : "bg-gray-300 dark:bg-gray-600"
                                                }`}
                                        >
                                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notifications[item.key as keyof typeof notifications] ? "left-5" : "left-0.5"
                                                }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleSave}
                                className="mt-6 flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-700 transition"
                            >
                                <Save size={15} /> Save Preferences
                            </button>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "Security" && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                                <Shield size={18} className="text-teal-600" /> Security Settings
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { label: "Two Factor Authentication", desc: "Add extra layer of security to your account", enabled: false },
                                    { label: "Login Notifications", desc: "Get notified on new login attempts", enabled: true },
                                    { label: "Session Timeout", desc: "Auto logout after 30 minutes of inactivity", enabled: true },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">{item.label}</p>
                                            <p className="text-xs text-gray-400">{item.desc}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {item.enabled ? "Enabled" : "Disabled"}
                                        </span>
                                    </div>
                                ))}

                                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                                    <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Danger Zone</p>
                                    <p className="text-xs text-red-500 mb-3">These actions are irreversible. Please be careful.</p>
                                    <button className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}