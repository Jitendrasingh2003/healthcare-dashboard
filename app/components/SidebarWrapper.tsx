"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    const isLogin = pathname === "/login";
    const isLanding = pathname === "/landing";
    const isPublic = isLogin || isLanding;

    useEffect(() => {
        const loggedIn = localStorage.getItem("loggedIn");
        if (!loggedIn && !isPublic) {
            router.push("/login");
        } else {
            setChecked(true);
        }
    }, []);

    if (!checked && !isPublic) return null;

    if (isPublic) {
        return <>{children}</>;
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}