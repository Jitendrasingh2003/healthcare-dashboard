import React from "react";

interface EmptyStateProps {
    title?: string;
    subtitle?: string;
    icon?: "patients" | "doctors" | "appointments" | "reports" | "generic";
    action?: { label: string; onClick: () => void };
}

const illustrations = {
    patients: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32">
            <rect x="20" y="40" width="160" height="100" rx="12" fill="currentColor" className="text-teal-50 dark:text-teal-900/20" />
            <rect x="35" y="60" width="130" height="10" rx="5" fill="currentColor" className="text-teal-100 dark:text-teal-800/40" />
            <rect x="35" y="78" width="90" height="8" rx="4" fill="currentColor" className="text-gray-100 dark:text-gray-800" />
            <rect x="35" y="94" width="110" height="8" rx="4" fill="currentColor" className="text-gray-100 dark:text-gray-800" />
            <circle cx="100" cy="22" r="18" fill="currentColor" className="text-teal-100 dark:text-teal-900/40" />
            <circle cx="100" cy="18" r="7" fill="currentColor" className="text-teal-400" />
            <path d="M84 34c0-8.84 7.16-16 16-16s16 7.16 16 16" fill="currentColor" className="text-teal-400" />
            <circle cx="155" cy="50" r="12" fill="currentColor" className="text-teal-500" />
            <line x1="155" y1="44" x2="155" y2="56" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="149" y1="50" x2="161" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    ),
    doctors: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32">
            <rect x="20" y="40" width="160" height="100" rx="12" fill="currentColor" className="text-blue-50 dark:text-blue-900/20" />
            <circle cx="100" cy="22" r="18" fill="currentColor" className="text-blue-100 dark:text-blue-900/40" />
            <circle cx="100" cy="18" r="7" fill="currentColor" className="text-blue-400" />
            <path d="M84 34c0-8.84 7.16-16 16-16s16 7.16 16 16" fill="currentColor" className="text-blue-400" />
            <rect x="70" y="65" width="60" height="50" rx="8" fill="currentColor" className="text-blue-100 dark:text-blue-900/40" />
            <line x1="100" y1="75" x2="100" y2="105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-blue-400" />
            <line x1="85" y1="90" x2="115" y2="90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-blue-400" />
        </svg>
    ),
    appointments: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32">
            <rect x="30" y="30" width="140" height="110" rx="12" fill="currentColor" className="text-yellow-50 dark:text-yellow-900/20" />
            <rect x="30" y="30" width="140" height="30" rx="12" fill="currentColor" className="text-yellow-100 dark:text-yellow-900/40" />
            <rect x="30" y="50" width="140" height="10" fill="currentColor" className="text-yellow-100 dark:text-yellow-900/40" />
            <circle cx="65" cy="22" r="8" fill="currentColor" className="text-yellow-400" />
            <circle cx="135" cy="22" r="8" fill="currentColor" className="text-yellow-400" />
            <rect x="48" y="80" width="28" height="20" rx="4" fill="currentColor" className="text-yellow-200 dark:text-yellow-900/40" />
            <rect x="86" y="80" width="28" height="20" rx="4" fill="currentColor" className="text-teal-200 dark:text-teal-900/40" />
            <rect x="124" y="80" width="28" height="20" rx="4" fill="currentColor" className="text-yellow-200 dark:text-yellow-900/40" />
            <rect x="48" y="110" width="28" height="20" rx="4" fill="currentColor" className="text-gray-100 dark:text-gray-800" />
            <rect x="86" y="110" width="28" height="20" rx="4" fill="currentColor" className="text-gray-100 dark:text-gray-800" />
        </svg>
    ),
    reports: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32">
            <rect x="50" y="20" width="100" height="130" rx="10" fill="currentColor" className="text-purple-50 dark:text-purple-900/20" />
            <rect x="65" y="45" width="70" height="8" rx="4" fill="currentColor" className="text-purple-200 dark:text-purple-900/40" />
            <rect x="65" y="63" width="50" height="8" rx="4" fill="currentColor" className="text-gray-100 dark:text-gray-800" />
            <rect x="65" y="79" width="60" height="8" rx="4" fill="currentColor" className="text-gray-100 dark:text-gray-800" />
            <rect x="65" y="95" width="40" height="8" rx="4" fill="currentColor" className="text-gray-100 dark:text-gray-800" />
            <circle cx="140" cy="120" r="22" fill="currentColor" className="text-purple-500" />
            <line x1="140" y1="110" x2="140" y2="130" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="130" y1="120" x2="150" y2="120" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
    ),
    generic: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32">
            <circle cx="100" cy="75" r="55" fill="currentColor" className="text-gray-50 dark:text-gray-800/40" />
            <circle cx="100" cy="65" r="22" fill="currentColor" className="text-gray-200 dark:text-gray-700" />
            <path d="M60 115c0-22.09 17.91-40 40-40s40 17.91 40 40" fill="currentColor" className="text-gray-200 dark:text-gray-700" />
            <line x1="80" y1="140" x2="120" y2="140" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-200 dark:text-gray-700" />
        </svg>
    ),
};

export default function EmptyState({ title = "Nothing here yet", subtitle = "Add something to get started", icon = "generic", action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up">
            <div className="mb-4 opacity-70">
                {illustrations[icon]}
            </div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed mb-6">{subtitle}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="btn-primary"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
