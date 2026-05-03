"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, X, AlertTriangle, AlertCircle, Info, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  patientId: string;
  patientName: string;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  riskScore: number;
  primaryAlert: string;
  dept: string;
  doctor: string;
  timestamp: Date;
  read: boolean;
}

const riskConfig = {
  CRITICAL: {
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800/40",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertCircle,
    dot: "bg-red-500",
    pulse: true,
  },
  HIGH: {
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800/40",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: AlertTriangle,
    dot: "bg-orange-500",
    pulse: false,
  },
  MODERATE: {
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800/40",
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: AlertTriangle,
    dot: "bg-yellow-500",
    pulse: false,
  },
  LOW: {
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800/40",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Info,
    dot: "bg-blue-500",
    pulse: false,
  },
};

export default function AIRiskNotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.riskLevel === "CRITICAL").length;

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-fetch alerts on mount and every 5 minutes
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // Fetch all critical/observation patients
      const res = await fetch("/api/patients");
      const patients = await res.json();
      if (!Array.isArray(patients)) return;

      const atRiskPatients = patients.filter(
        (p: any) => p.status === "Critical" || p.status === "Observation"
      );

      // Generate quick alerts without calling Gemini (for speed)
      // Use rule-based risk for the bell, Gemini for detailed view
      const newNotifications: Notification[] = atRiskPatients.map((p: any) => ({
        id: p.id,
        patientId: p.id,
        patientName: p.name,
        riskLevel: p.status === "Critical" ? "CRITICAL" : "MODERATE",
        riskScore: p.status === "Critical" ? 85 : 55,
        primaryAlert: p.status === "Critical"
          ? `${p.name} is in critical condition — immediate attention required`
          : `${p.name} is under observation in ${p.dept}`,
        dept: p.dept,
        doctor: p.doctor,
        timestamp: new Date(),
        read: notifications.find(n => n.id === p.id)?.read || false,
      }));

      setNotifications(newNotifications);
      setLastChecked(new Date());
    } catch (e) {
      console.error("Failed to fetch alerts:", e);
    }
    setLoading(false);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissAll = () => setNotifications([]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl glass hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all active:scale-95"
        title="AI Risk Alerts"
      >
        <Bell size={18} className={`${criticalCount > 0 ? "text-red-500" : "text-gray-500 dark:text-gray-400"} transition-colors`} />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1 ${criticalCount > 0 ? "bg-red-500 animate-pulse" : "bg-orange-500"}`}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {open && (
        <div className="absolute left-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 animate-pop-in overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-white" />
              <div>
                <p className="text-white font-bold text-sm">🤖 AI Risk Alerts</p>
                <p className="text-red-100 text-xs">
                  {lastChecked ? `Updated ${lastChecked.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Checking..."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchAlerts}
                className="text-white/70 hover:text-white text-xs font-semibold transition-colors"
                disabled={loading}
              >
                {loading ? "⟳" : "↻ Refresh"}
              </button>
              <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X size={12} className="text-white" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between px-5 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  🔴 {notifications.filter(n => n.riskLevel === "CRITICAL").length} Critical
                </span>
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  🟠 {notifications.filter(n => n.riskLevel === "MODERATE").length} Moderate
                </span>
              </div>
              <button onClick={dismissAll} className="text-[10px] text-gray-400 hover:text-red-500 font-semibold transition-colors">
                Clear all
              </button>
            </div>
          )}

          {/* Notification List */}
          <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
            {loading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-3" />
                <p className="text-xs text-gray-400">Analyzing patient risks...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <CheckCircle size={32} className="text-green-400 mb-3" />
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">All patients stable</p>
                <p className="text-xs text-gray-400 mt-1">No active risk alerts</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notif) => {
                  const cfg = riskConfig[notif.riskLevel];
                  const Icon = cfg.icon;
                  return (
                    <Link
                      href={`/patients/${notif.patientId}`}
                      key={notif.id}
                      onClick={() => { markRead(notif.id); setOpen(false); }}
                      className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group ${!notif.read ? cfg.bg : ""}`}
                    >
                      <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                        <Icon size={16} className={cfg.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{notif.patientName}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0 ${cfg.badge}`}>
                            {notif.riskLevel}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">{notif.primaryAlert}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{notif.dept} • {notif.doctor}</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 mt-1 flex-shrink-0 group-hover:text-teal-500 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
              <Link
                href="/patients"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
              >
                View All Patients <ChevronRight size={12} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
