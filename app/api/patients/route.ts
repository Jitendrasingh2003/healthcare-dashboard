import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendSMS, sendEmail } from "@/lib/notifications";

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

        // Send Registration Notifications in background
        const smsMessage = `Welcome ${patient.name}! You have been successfully registered at Healthcare Clinic. Your doctor is ${patient.doctor}. Thank you for choosing us.`;
        const emailSubject = "Registration Successful - Healthcare Clinic";
        const emailMessage = `Dear ${patient.name},\n\nYou have been successfully registered at our Healthcare Clinic.\n\nDetails:\n- Patient ID: ${patient.id}\n- Department: ${patient.dept}\n- Assigned Doctor: ${patient.doctor}\n\nWe wish you a speedy recovery!\n\nBest Regards,\nHealthcare Clinic`;

        if (patient.phone) {
            sendSMS(patient.phone, smsMessage).catch(e => console.error("Reg SMS failed:", e));
        }
        if (patient.email) {
            sendEmail(patient.email, emailSubject, emailMessage).catch(e => console.error("Reg Email failed:", e));
        }

        return NextResponse.json(patient);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
    }
}