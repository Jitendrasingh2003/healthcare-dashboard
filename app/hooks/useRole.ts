"use client";
import { useState, useEffect } from "react";

export type Role = "Admin" | "Doctor" | "Nurse";

export function useRole(): Role {
    const [role, setRole] = useState<Role>("Admin");

    useEffect(() => {
        // Fast initial load from localStorage
        const saved = localStorage.getItem("role") as Role | null;
        if (saved) setRole(saved);

        // Verify with backend
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => {
                if (data.authenticated && data.user.role) {
                    setRole(data.user.role);
                    localStorage.setItem("role", data.user.role);
                } else {
                    // Not authenticated
                    localStorage.removeItem("loggedIn");
                    localStorage.removeItem("role");
                    if (window.location.pathname !== "/login" && window.location.pathname !== "/register" && window.location.pathname !== "/landing") {
                        window.location.href = "/login";
                    }
                }
            })
            .catch(err => console.error("Auth check failed:", err));
    }, []);

    return role;
}

// What each role can access
export const rolePermissions: Record<Role, {
    canViewBilling: boolean;
    canViewStaff: boolean;
    canAddDoctor: boolean;
    canAdmitPatient: boolean;
    canManageAppointments: boolean;
    canDischargePatient: boolean;
    canViewOperations: boolean;
}> = {
    Admin: {
        canViewBilling: true,
        canViewStaff: true,
        canAddDoctor: true,
        canAdmitPatient: true,
        canManageAppointments: true,
        canDischargePatient: true,
        canViewOperations: true,
    },
    Doctor: {
        canViewBilling: false,
        canViewStaff: false,
        canAddDoctor: false,
        canAdmitPatient: true,
        canManageAppointments: true,
        canDischargePatient: true,
        canViewOperations: false,
    },
    Nurse: {
        canViewBilling: false,
        canViewStaff: false,
        canAddDoctor: false,
        canAdmitPatient: false,
        canManageAppointments: false,
        canDischargePatient: false,
        canViewOperations: false,
    },
};
