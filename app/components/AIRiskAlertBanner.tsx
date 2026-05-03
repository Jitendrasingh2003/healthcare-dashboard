"use client";
import { useState, useEffect } from "react";
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";

interface RiskAlert {
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  riskScore: number;
  primaryAlert: string;
  keyFindings: string[];
  immediateActions: string[];
  monitoringRequired: string;
  estimatedStabilityTime: string;
}

const riskConfig = {
  CRITICAL: {
    bg: "bg-gradient-to-r from-red-500 to-rose-600",
    lightBg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800/50",
    text: "text-red-700 dark:text-red-300",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    icon: AlertCircle,
    label: "🚨 CRITICAL RISK",
    barColor: "bg-red-500",
  },
  HIGH: {
    bg: "bg-gradient-to-r from-orange-500 to-amber-500",
    lightBg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800/50",
    text: "text-orange-700 dark:text-orange-300",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
    icon: AlertTriangle,
    label: "⚠️ HIGH RISK",
    barColor: "bg-orange-500",
  },
  MODERATE: {
    bg: "bg-gradient-to-r from-yellow-500 to-amber-400",
    lightBg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800/50",
    text: "text-yellow-700 dark:text-yellow-300",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    icon: AlertTriangle,
    label: "⚡ MODERATE RISK",
    barColor: "bg-yellow-500",
  },
  LOW: {
    bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
    lightBg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800/50",
    text: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    icon: Info,
    label: "ℹ️ LOW RISK",
    barColor: "bg-blue-500",
  },
};

interface Props {
  patient: any;
  reports: any[];
}

export default function AIRiskAlertBanner({ patient, reports }: Props) {
  const [alert, setAlert] = useState<RiskAlert | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patient && !dismissed) {
      generateRiskAlert();
    }
  }, [patient?.id, reports?.length]);

  const generateRiskAlert = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/risk-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient, reports }),
      });
      const data = await res.json();
      if (res.ok && data.alert) {
        setAlert(data.alert);
      } else {
        setError(data.error || "Failed to generate alert");
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  if (dismissed) return null;

  const cfg = alert ? riskConfig[alert.riskLevel] : null;
  const Icon = cfg?.icon || Sparkles;

  return (
    <div className="mb-6 animate-fade-in-up">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-200 dark:border-teal-800/50 rounded-2xl">
          <div className="w-8 h-8 border-3 border-teal-500/30 border-t-teal-500 rounded-full animate-spin flex-shrink-0" style={{ borderWidth: "3px" }} />
          <div>
            <p className="text-sm font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
              <Sparkles size={14} /> AI is analyzing patient risk...
            </p>
            <p className="text-xs text-teal-600/70 dark:text-teal-400/70">Reviewing vitals, lab reports & diagnosis</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl">
          <p className="text-xs text-gray-400">🤖 AI Risk Alert unavailable — {error}</p>
          <button onClick={generateRiskAlert} className="text-xs text-teal-500 font-semibold ml-auto hover:text-teal-600">Retry</button>
        </div>
      )}

      {/* Alert Card */}
      {!loading && alert && cfg && (
        <div className={`rounded-2xl border ${cfg.border} overflow-hidden shadow-lg`}>
          {/* Header Bar */}
          <div className={`${cfg.bg} px-5 py-3 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold text-sm">{cfg.label}</p>
                  <span className="text-white/80 text-xs font-bold">Score: {alert.riskScore}/100</span>
                </div>
                <p className="text-white/80 text-xs">🤖 AI Patient Risk Assessment</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setExpanded(!expanded)} className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                {expanded ? <ChevronUp size={14} className="text-white" /> : <ChevronDown size={14} className="text-white" />}
              </button>
              <button onClick={() => setDismissed(true)} className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <X size={14} className="text-white" />
              </button>
            </div>
          </div>

          {/* Risk Score Bar */}
          <div className={`${cfg.lightBg} px-5 pt-3 pb-1`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Risk Score</span>
              <span className={`text-xs font-bold ${cfg.text}`}>{alert.riskScore}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${cfg.barColor} rounded-full transition-all duration-1000`}
                style={{ width: `${alert.riskScore}%` }}
              />
            </div>
          </div>

          {/* Primary Alert */}
          <div className={`${cfg.lightBg} px-5 py-3`}>
            <p className={`text-sm font-bold ${cfg.text}`}>{alert.primaryAlert}</p>
          </div>

          {/* Expanded Details */}
          {expanded && (
            <div className={`${cfg.lightBg} px-5 pb-5 border-t ${cfg.border} space-y-4`}>

              {/* Key Findings */}
              {alert.keyFindings?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 mt-3">🔍 Key Findings</p>
                  <div className="space-y-1.5">
                    {alert.keyFindings.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${cfg.barColor} mt-1.5 flex-shrink-0`} />
                        <p className={`text-xs ${cfg.text} leading-snug`}>{f}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Immediate Actions */}
              {alert.immediateActions?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">⚡ Immediate Actions</p>
                  <div className="space-y-1.5">
                    {alert.immediateActions.map((a, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-2 ${cfg.badge} rounded-lg text-xs font-semibold`}>
                        <span className="text-base">{i === 0 ? "1️⃣" : i === 1 ? "2️⃣" : "3️⃣"}</span>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Monitoring + Stability */}
              <div className="grid grid-cols-2 gap-3">
                {alert.monitoringRequired && (
                  <div className={`p-3 bg-white/60 dark:bg-gray-800/60 border ${cfg.border} rounded-xl`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Monitor</p>
                    <p className={`text-xs font-semibold ${cfg.text}`}>{alert.monitoringRequired}</p>
                  </div>
                )}
                {alert.estimatedStabilityTime && (
                  <div className={`p-3 bg-white/60 dark:bg-gray-800/60 border ${cfg.border} rounded-xl`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stability ETA</p>
                    <p className={`text-xs font-semibold ${cfg.text}`}>{alert.estimatedStabilityTime}</p>
                  </div>
                )}
              </div>

              {/* Refresh */}
              <button
                onClick={generateRiskAlert}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <Sparkles size={12} /> Refresh AI Analysis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
