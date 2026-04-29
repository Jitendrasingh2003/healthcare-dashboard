"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, BedDouble, Stethoscope, AlertCircle, TrendingUp, Activity, ArrowRight, Calendar, FlaskConical, UserPlus, Bell } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, ReferenceLine, Defs, LinearGradient, Stop
} from "recharts";
import { useRole } from "./hooks/useRole";

const admissions = [
  { month: "Jan", admitted: 210, discharged: 195 },
  { month: "Feb", admitted: 185, discharged: 170 },
  { month: "Mar", admitted: 230, discharged: 215 },
  { month: "Apr", admitted: 260, discharged: 240 },
  { month: "May", admitted: 245, discharged: 230 },
  { month: "Jun", admitted: 280, discharged: 265 },
  { month: "Jul", admitted: 295, discharged: 278 },
  { month: "Aug", admitted: 310, discharged: 290 },
];

const departments = [
  { name: "Cardiology", value: 28 },
  { name: "Orthopedics", value: 22 },
  { name: "Neurology", value: 18 },
  { name: "Pediatrics", value: 15 },
  { name: "Others", value: 17 },
];

const bedTrend = [
  { day: "Mon", occ: 70, target: 80 },
  { day: "Tue", occ: 74, target: 80 },
  { day: "Wed", occ: 80, target: 80 },
  { day: "Thu", occ: 82, target: 80 },
  { day: "Fri", occ: 78, target: 80 },
  { day: "Sat", occ: 75, target: 80 },
  { day: "Sun", occ: 78, target: 80 },
];

const recoveryTrend = [
  { month: "Jan", rate: 87 },
  { month: "Feb", rate: 88 },
  { month: "Mar", rate: 89 },
  { month: "Apr", rate: 90 },
  { month: "May", rate: 91 },
  { month: "Jun", rate: 91 },
  { month: "Jul", rate: 93 },
  { month: "Aug", rate: 94 },
];

const COLORS = ["#0d9488", "#3b82f6", "#ef4444", "#f59e0b", "#64748b"];
const DEPT_COLORS = [
  { main: "#0d9488", light: "#99f6e4" },
  { main: "#3b82f6", light: "#bfdbfe" },
  { main: "#a855f7", light: "#e9d5ff" },
  { main: "#f59e0b", light: "#fde68a" },
  { main: "#64748b", light: "#cbd5e1" },
];

const patientsList = [
  { name: "Rahul Agarwal", age: 45, dept: "Cardiology", doctor: "Dr. Mehta", status: "Stable", date: "Apr 19" },
  { name: "Priya Sharma", age: 62, dept: "Neurology", doctor: "Dr. Verma", status: "Critical", date: "Apr 20" },
  { name: "Arjun Kumar", age: 34, dept: "Orthopedics", doctor: "Dr. Singh", status: "Observation", date: "Apr 18" },
  { name: "Sunita Mishra", age: 55, dept: "Pediatrics", doctor: "Dr. Joshi", status: "Discharged", date: "Apr 15" },
  { name: "Vikas Gupta", age: 28, dept: "Cardiology", doctor: "Dr. Mehta", status: "Stable", date: "Apr 21" },
];

const statusStyles: Record<string, string> = {
  Stable: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
  Critical: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
  Observation: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
  Discharged: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
};

const colorMap: Record<string, string> = {
  teal: "bg-gradient-to-br from-teal-400 to-teal-600 text-white",
  blue: "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
  green: "bg-gradient-to-br from-green-400 to-green-600 text-white",
  red: "bg-gradient-to-br from-red-400 to-red-600 text-white",
  purple: "bg-gradient-to-br from-purple-400 to-purple-600 text-white",
  orange: "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
};

export default function Home() {
  const role = useRole();
  const [patientCount, setPatientCount] = useState(1284);
  const [doctorCount, setDoctorCount] = useState(94);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchLive = async () => {
    try {
      const [pRes, dRes] = await Promise.all([fetch("/api/patients"), fetch("/api/doctors")]);
      const pts = await pRes.json();
      const docs = await dRes.json();
      if (Array.isArray(pts)) setPatientCount(pts.length);
      if (Array.isArray(docs)) setDoctorCount(docs.length);
      setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    } catch {}
  };

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 30000);
    return () => clearInterval(interval);
  }, []);

  const adminKpis = [
    { label: "Total Patients", value: patientCount.toLocaleString(), delta: "+38 this week", up: true, icon: Users, color: "teal", shadow: "shadow-teal-500/20" },
    { label: "Bed Occupancy", value: "78%", delta: "-4% vs last week", up: false, icon: BedDouble, color: "blue", shadow: "shadow-blue-500/20" },
    { label: "Active Doctors", value: String(doctorCount), delta: "+2 on duty today", up: true, icon: Stethoscope, color: "green", shadow: "shadow-green-500/20" },
    { label: "Critical Cases", value: "17", delta: "+3 since yesterday", up: false, icon: AlertCircle, color: "red", shadow: "shadow-red-500/20" },
    { label: "Avg Stay (days)", value: "4.2", delta: "-0.3 improved", up: true, icon: TrendingUp, color: "purple", shadow: "shadow-purple-500/20" },
    { label: "Recovery Rate", value: "91%", delta: "+1.2% this month", up: true, icon: Activity, color: "orange", shadow: "shadow-orange-500/20" },
  ];

  const doctorKpis = [
    { label: "My Patients", value: "24", delta: "+2 today", up: true, icon: Users, color: "teal", shadow: "shadow-teal-500/20" },
    { label: "Appointments Today", value: "8", delta: "3 pending", up: false, icon: Calendar, color: "blue", shadow: "shadow-blue-500/20" },
    { label: "Lab Reports to Review", value: "5", delta: "1 critical", up: false, icon: FlaskConical, color: "orange", shadow: "shadow-orange-500/20" },
  ];

  const nurseKpis = [
    { label: "Ward Bed Occupancy", value: "85%", delta: "2 beds available", up: false, icon: BedDouble, color: "blue", shadow: "shadow-blue-500/20" },
    { label: "Patients to Medicate", value: "12", delta: "Next round at 2 PM", up: true, icon: Activity, color: "purple", shadow: "shadow-purple-500/20" },
    { label: "Critical Monitoring", value: "4", delta: "Check vitals every hr", up: false, icon: AlertCircle, color: "red", shadow: "shadow-red-500/20" },
    { label: "New Admissions", value: "3", delta: "Pending triage", up: true, icon: UserPlus, color: "teal", shadow: "shadow-teal-500/20" },
  ];

  const renderKPIs = (kpiList: any[]) => (
    <div className={`grid grid-cols-2 md:grid-cols-3 ${kpiList.length > 4 ? 'lg:grid-cols-6' : 'lg:grid-cols-3'} gap-5 mb-8`}>
      {kpiList.map((k, index) => {
        const Icon = k.icon;
        const staggerClass = `stagger-${(index % 5) + 1}`;
        return (
          <div key={k.label} className={`glass-card p-5 animate-fade-in-up ${staggerClass} group`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colorMap[k.color]} shadow-lg ${k.shadow} group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={18} />
            </div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">{k.value}</p>
            <p className={`text-xs mt-2 font-medium ${k.up ? "text-emerald-500" : "text-rose-500"}`}>{k.delta}</p>
          </div>
        );
      })}
    </div>
  );

  const renderPatientTable = (title: string, showViewAll: boolean = true, data: any[] = patientsList) => (
    <div className="glass-card p-6 animate-fade-in-up stagger-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
        {showViewAll && (
          <Link href="/patients" className="btn-primary group">
            View All Patients <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200/50 dark:border-gray-700/50 text-gray-400 text-[11px] uppercase tracking-wider">
              <th className="text-left py-4 font-semibold px-2">Patient</th>
              <th className="text-left py-4 font-semibold px-2">Age</th>
              <th className="text-left py-4 font-semibold px-2">Department</th>
              <th className="text-left py-4 font-semibold px-2">Doctor</th>
              <th className="text-left py-4 font-semibold px-2">Status</th>
              <th className="text-left py-4 font-semibold px-2">Admitted</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.name} className="border-b border-gray-100/50 dark:border-gray-800/50 last:border-0 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors group">
                <td className="py-4 px-2 font-medium text-gray-800 dark:text-gray-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{p.name}</td>
                <td className="py-4 px-2 text-gray-500 dark:text-gray-400">{p.age}</td>
                <td className="py-4 px-2 text-gray-500 dark:text-gray-400">{p.dept}</td>
                <td className="py-4 px-2 text-gray-500 dark:text-gray-400">{p.doctor}</td>
                <td className="py-4 px-2">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${statusStyles[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-4 px-2 text-gray-500 dark:text-gray-400">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 animate-fade-in">

      {/* Page Title */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
            {role === "Admin" ? "Overview" : role === "Doctor" ? "Doctor Dashboard" : "Nursing Station"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {role === "Admin" ? "Hospital-wide real-time metrics" : role === "Doctor" ? "Welcome back! Here's your schedule." : "Ward status and active patients"}
          </p>
        </div>
        <span className="flex items-center gap-2 text-xs bg-teal-100/80 text-teal-700 px-4 py-1.5 rounded-full font-semibold border border-teal-200/50 shadow-sm backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> Live
        </span>
      </div>

      {role === "Admin" && (
        <>
          {renderKPIs(adminKpis)}

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Monthly Admissions - Enhanced Bar Chart */}
            <div className="glass-card p-6 animate-fade-in-up stagger-3">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Monthly Admissions</h2>
                <span className="text-[10px] bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2.5 py-1 rounded-full font-semibold">Jan – Aug 2026</span>
              </div>
              <p className="text-xs text-gray-400 mb-5">Admitted vs discharged patients per month</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={admissions} barCategoryGap="30%" barGap={4}>
                  <defs>
                    <linearGradient id="admitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity={1} />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="dischargeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(200,200,200,0.08)", radius: 8 }}
                    contentStyle={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "#fff", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", padding: "12px 16px" }}
                    labelStyle={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
                    formatter={(val) => <span style={{ color: "#9ca3af", fontWeight: 600 }}>{val}</span>}
                  />
                  <Bar dataKey="admitted" fill="url(#admitGrad)" radius={[6, 6, 0, 0]} name="Admitted" animationBegin={200} animationDuration={1200} />
                  <Bar dataKey="discharged" fill="url(#dischargeGrad)" radius={[6, 6, 0, 0]} name="Discharged" animationBegin={400} animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Department Load - Enhanced Donut */}
            <div className="glass-card p-6 animate-fade-in-up stagger-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Department Load</h2>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full font-semibold">Live</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">Current patient distribution by department</p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={220}>
                  <PieChart>
                    <defs>
                      {DEPT_COLORS.map((c, i) => (
                        <radialGradient key={i} id={`deptGrad${i}`} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor={c.light} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={c.main} stopOpacity={1} />
                        </radialGradient>
                      ))}
                    </defs>
                    <Pie data={departments} cx="50%" cy="50%" innerRadius={58} outerRadius={88} dataKey="value" stroke="none" paddingAngle={3} animationBegin={300} animationDuration={1400}>
                      {departments.map((_, i) => (
                        <Cell key={i} fill={`url(#deptGrad${i})`} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "#fff", padding: "10px 14px" }}
                      formatter={(v) => [`${v}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2.5 flex-1">
                  {departments.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: DEPT_COLORS[i].main }} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">{d.name}</span>
                          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">{d.value}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.value}%`, background: DEPT_COLORS[i].main }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Bed Occupancy - Area Chart */}
            <div className="glass-card p-6 animate-fade-in-up stagger-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Bed Occupancy Trend</h2>
                <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2.5 py-1 rounded-full font-semibold">This Week</span>
              </div>
              <p className="text-xs text-gray-400 mb-5">Daily occupancy % vs 80% target</p>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={bedTrend}>
                  <defs>
                    <linearGradient id="bedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "#fff", padding: "10px 14px" }}
                    formatter={(v) => [`${v}%`]}
                  />
                  <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 4" strokeWidth={2} label={{ value: "Target 80%", fill: "#f59e0b", fontSize: 10, position: "insideTopRight" }} />
                  <Area type="monotone" dataKey="occ" stroke="#0d9488" strokeWidth={3} fill="url(#bedAreaGrad)" dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#0d9488" }} activeDot={{ r: 7, fill: "#0d9488" }} name="Occupancy" animationBegin={200} animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recovery Rate - Area Chart */}
            <div className="glass-card p-6 animate-fade-in-up stagger-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recovery Rate</h2>
                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full font-semibold">↑ Improving</span>
              </div>
              <p className="text-xs text-gray-400 mb-5">Monthly patient recovery rate (%)</p>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={recoveryTrend}>
                  <defs>
                    <linearGradient id="recoveryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[84, 96]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "#fff", padding: "10px 14px" }}
                    formatter={(v) => [`${v}%`, "Recovery Rate"]}
                  />
                  <Area type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={3} fill="url(#recoveryGrad)" dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#22c55e" }} activeDot={{ r: 7, fill: "#22c55e" }} animationBegin={300} animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {renderPatientTable("Recent Admissions", true)}
        </>
      )}

      {role === "Doctor" && (
        <>
          {renderKPIs(doctorKpis)}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="glass-card p-6 animate-fade-in-up stagger-3">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" /> Today's Appointments
              </h2>
              <div className="space-y-4">
                {[
                  { time: "09:00 AM", name: "Ramesh Singh", type: "Follow-up", status: "Waiting" },
                  { time: "10:30 AM", name: "Pooja Verma", type: "New Patient", status: "In Progress" },
                  { time: "11:45 AM", name: "Anil Kapoor", type: "Consultation", status: "Scheduled" },
                ].map((apt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 text-center text-xs font-bold text-teal-600 dark:text-teal-400">{apt.time}</div>
                      <div>
                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{apt.name}</p>
                        <p className="text-[10px] text-gray-500">{apt.type}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${apt.status === "Waiting" ? "bg-orange-100 text-orange-700" : apt.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 animate-fade-in-up stagger-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Bell size={18} className="text-red-500" /> Urgent Items
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500 rounded-r-xl">
                  <p className="text-sm font-bold text-red-700 dark:text-red-400">Review Lab Results</p>
                  <p className="text-xs text-red-600/80 dark:text-red-300">Priya Sharma's MRI reports are abnormal. Requires immediate attention.</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-2 border-yellow-500 rounded-r-xl">
                  <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400">Prescription Renewal</p>
                  <p className="text-xs text-yellow-600/80 dark:text-yellow-300">3 patients have requested prescription renewals for chronic medications.</p>
                </div>
              </div>
            </div>
          </div>

          {renderPatientTable("My Assigned Patients", false, patientsList.filter(p => p.doctor === "Dr. Mehta"))}
        </>
      )}

      {role === "Nurse" && (
        <>
          {renderKPIs(nurseKpis)}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="glass-card p-6 lg:col-span-2 animate-fade-in-up stagger-3">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Ward Bed Occupancy</h2>
              <p className="text-xs text-gray-500 mb-6">Last 7 days</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={bedTrend}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(30, 41, 59, 0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} formatter={(v) => `${v}%`} />
                  <Line type="monotone" dataKey="occ" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6, fill: "#3b82f6" }} animationBegin={200} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="glass-card p-6 animate-fade-in-up stagger-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-semibold text-sm hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors">
                    + Log Vitals
                  </button>
                  <button className="w-full text-left p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-semibold text-sm hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                    + Administer Medication
                  </button>
                  <button className="w-full text-left p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                    Update Bed Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          {renderPatientTable("Active Ward Patients", true, patientsList.filter(p => p.status === "Observation" || p.status === "Critical"))}
        </>
      )}

    </div>
  );
}