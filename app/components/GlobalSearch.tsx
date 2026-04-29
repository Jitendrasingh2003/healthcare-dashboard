"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Users, Stethoscope, X } from "lucide-react";
import { useRouter } from "next/navigation";

const searchData = [
    { id: 1, type: "Patient", name: "Rahul Agarwal", subtitle: "Cardiology • Stable", href: "/patients/1" },
    { id: 2, type: "Patient", name: "Priya Sharma", subtitle: "Neurology • Critical", href: "/patients/2" },
    { id: 3, type: "Patient", name: "Arjun Kumar", subtitle: "Orthopedics • Observation", href: "/patients/3" },
    { id: 4, type: "Patient", name: "Sunita Mishra", subtitle: "Pediatrics • Discharged", href: "/patients/4" },
    { id: 5, type: "Patient", name: "Vikas Gupta", subtitle: "Cardiology • Stable", href: "/patients/5" },
    { id: 6, type: "Patient", name: "Anita Patel", subtitle: "Neurology • Stable", href: "/patients/6" },
    { id: 7, type: "Patient", name: "Rohit Jain", subtitle: "Orthopedics • Critical", href: "/patients/7" },
    { id: 8, type: "Patient", name: "Kavita Singh", subtitle: "Pediatrics • Observation", href: "/patients/8" },
    { id: 1, type: "Doctor", name: "Dr. Rajesh Mehta", subtitle: "Cardiology • On Duty", href: "/doctors/1" },
    { id: 2, type: "Doctor", name: "Dr. Sunita Verma", subtitle: "Neurology • On Duty", href: "/doctors/2" },
    { id: 3, type: "Doctor", name: "Dr. Amit Singh", subtitle: "Orthopedics • Off Duty", href: "/doctors/3" },
    { id: 4, type: "Doctor", name: "Dr. Priya Joshi", subtitle: "Pediatrics • On Duty", href: "/doctors/4" },
];

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.trim().length === 0) {
            setResults([]);
            return;
        }
        const filtered = searchData.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    }, [query]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSelect = (href: string) => {
        router.push(href);
        setQuery("");
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative w-full max-w-sm">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 focus-within:border-teal-400 transition">
                <Search size={15} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search patients, doctors..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    className="text-sm outline-none w-full bg-transparent text-gray-700 dark:text-gray-200"
                />
                {query && (
                    <button onClick={() => { setQuery(""); setResults([]); }}>
                        <X size={14} className="text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {open && results.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                    {/* Patients */}
                    {results.filter(r => r.type === "Patient").length > 0 && (
                        <div>
                            <p className="text-xs text-gray-400 px-3 pt-3 pb-1 font-medium uppercase tracking-wider">Patients</p>
                            {results.filter(r => r.type === "Patient").map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(item.href)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
                                >
                                    <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                        <Users size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">{item.name}</p>
                                        <p className="text-xs text-gray-400">{item.subtitle}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Doctors */}
                    {results.filter(r => r.type === "Doctor").length > 0 && (
                        <div>
                            <p className="text-xs text-gray-400 px-3 pt-3 pb-1 font-medium uppercase tracking-wider">Doctors</p>
                            {results.filter(r => r.type === "Doctor").map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(item.href)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                        <Stethoscope size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">{item.name}</p>
                                        <p className="text-xs text-gray-400">{item.subtitle}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No results */}
                    {results.length === 0 && query.length > 0 && (
                        <div className="px-3 py-4 text-sm text-gray-400 text-center">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}

            {/* No results message */}
            {open && query.length > 0 && results.length === 0 && (
                <div className="absolute top-12 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-50 p-4 text-center">
                    <p className="text-sm text-gray-400">No results found for "<span className="text-gray-600 dark:text-gray-300">{query}</span>"</p>
                </div>
            )}
        </div>
    );
}