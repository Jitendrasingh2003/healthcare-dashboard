"use client";
import { useState, useEffect } from "react";
import { Bell, X, AlertCircle, CheckCircle, Info, UserPlus } from "lucide-react";

const initialNotifs = [
    { id: 1, type: "critical", title: "Critical Patient Alert", message: "Priya Sharma — BP critically high in ICU Bed 3", time: "2 min ago", read: false },
    { id: 2, type: "admission", title: "New Admission", message: "Vikas Gupta admitted to Cardiology ward", time: "15 min ago", read: false },
    { id: 3, type: "info", title: "Appointment Reminder", message: "Dr. Mehta has 5 appointments today at 10 AM", time: "1 hr ago", read: false },
    { id: 4, type: "success", title: "Patient Discharged", message: "Arjun Kumar successfully discharged from Orthopedics", time: "2 hrs ago", read: true },
    { id: 5, type: "info", title: "Lab Report Ready", message: "MRI report for Rahul Agarwal is ready for review", time: "3 hrs ago", read: true },
];

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    critical: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    admission: { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    info: { icon: Info, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20" },
    success: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
};

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState(initialNotifs);
    const unread = notifs.filter(n => !n.read).length;

    const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));
    const dismiss = (id: number) => setNotifs(notifs.filter(n => n.id !== id));

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("#notification-panel")) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    return (
        <div id="notification-panel" className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl glass hover:bg-white/80 dark:hover:bg-gray-800/80 active:scale-95 transition-all"
            >
                <Bell size={17} className="text-gray-600 dark:text-gray-300" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        {unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute left-0 top-12 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-2xl shadow-2xl z-50 animate-pop-in overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <p className="font-bold text-gray-800 dark:text-white text-sm">Notifications</p>
                            <p className="text-[10px] text-gray-400">{unread} unread</p>
                        </div>
                        {unread > 0 && (
                            <button onClick={markAllRead} className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 hover:underline px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all">
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifs.length === 0 ? (
                            <div className="py-10 text-center text-gray-400 text-sm">No notifications</div>
                        ) : notifs.map(n => {
                            const cfg = typeConfig[n.type];
                            const Icon = cfg.icon;
                            return (
                                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 ${!n.read ? "bg-teal-50/30 dark:bg-teal-900/10" : ""}`}>
                                    <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                        <Icon size={14} className={cfg.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-1">
                                            <p className={`text-xs font-bold ${!n.read ? "text-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>{n.title}</p>
                                            <button onClick={() => dismiss(n.id)} className="text-gray-300 hover:text-gray-500 flex-shrink-0">
                                                <X size={12} />
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                                    </div>
                                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0 mt-2" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
