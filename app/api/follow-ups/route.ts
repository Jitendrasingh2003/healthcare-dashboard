import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get("patientId");

        if (patientId) {
            const followUps = await prisma.followUp.findMany({
                where: { patientId },
                orderBy: { followUpDate: "asc" }
            });
            return NextResponse.json(followUps);
        }

        const allFollowUps = await prisma.followUp.findMany({
            orderBy: { followUpDate: "asc" }
        });
        return NextResponse.json(allFollowUps);
    } catch (error) {
        console.error("Error fetching follow-ups:", error);
        return NextResponse.json({ error: "Failed to fetch follow-ups" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { patientId, patientName, patientPhone, patientEmail, doctorId, doctorName, followUpDate, notes } = body;

        if (!patientId || !patientName || !patientPhone || !followUpDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newFollowUp = await prisma.followUp.create({
            data: {
                patientId,
                patientName,
                patientPhone,
                patientEmail,
                doctorId,
                doctorName,
                followUpDate: new Date(followUpDate),
                notes
            }
        });

        return NextResponse.json(newFollowUp, { status: 201 });
    } catch (error) {
        console.error("Error creating follow-up:", error);
        return NextResponse.json({ error: "Failed to create follow-up" }, { status: 500 });
    }
}
