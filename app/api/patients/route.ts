import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET — saare patients
export async function GET() {
    try {
        const patients = await prisma.patient.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(patients);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
    }
}

// POST — naya patient admit
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const patient = await prisma.patient.create({
            data: {
                name: body.name,
                age: parseInt(body.age),
                gender: body.gender,
                blood: body.blood,
                phone: body.phone,
                email: body.email || "",
                address: body.address || "",
                dept: body.dept,
                doctor: body.doctor,
                status: body.status || "Stable",
                bedNo: body.bedNo || "",
                diagnosis: body.diagnosis || "",
                notes: body.notes || "",
            },
        });
        return NextResponse.json(patient);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
    }
}