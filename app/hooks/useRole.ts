"use client";
import { useState, useEffect } from "react";

export type Role = "Admin" | "Doctor" | "Nurse";

export function useRole(): Role {
    const [role, setRole] = useState<Role>("Admin");
    useEffect(() => {
        const saved = localStorage.getItem("role") as Role | null;
        if (saved) setRole(saved);
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
