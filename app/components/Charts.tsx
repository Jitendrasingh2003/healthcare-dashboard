"use client";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const admissions = [
    { month: "Jan", admitted: 210, discharged: 195 },
    { month: "Feb", admitted: 185, discharged: 170 },
    { month: "Mar", admitted: 230, discharged: 215 },
    { month: "Apr", admitted: 260, discharged: 240 },
    { month: "May", admitted: 245, discharged: 230 },
    { month: "Jun", admitted: 280, discharged: 265 },
];

const departments = [
    { name: "Cardiology", value: 28 },
    { name: "Orthopedics", value: 22 },
    { name: "Neurology", value: 18 },
    { name: "Pediatrics", value: 15 },
    { name: "Others", value: 17 },
];

const bedTrend = [
    { day: "Mon", occ: 70 },
    { day: "Tue", occ: 74 },
    { day: "Wed", occ: 80 },
    { day: "Thu", occ: 82 },
    { day: "Fri", occ: 78 },
    { day: "Sat", occ: 75 },
    { day: "Sun", occ: 78 },
];

const COLORS = ["#0F6E56", "#378ADD", "#D85A30", "#BA7517", "#888780"];

export function AdmissionsChart() {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={admissions}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="admitted" fill="#1D9E75" radius={[4, 4, 0, 0]} name="Admitted" />
                <Bar dataKey="discharged" fill="#378ADD" radius={[4, 4, 0, 0]} name="Discharged" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function DeptChart() {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie data={departments} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                    {departments.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function BedTrendChart() {
    return (
        <ResponsiveContainer width="100%" height={160}>
            <LineChart data={bedTrend}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="occ" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}