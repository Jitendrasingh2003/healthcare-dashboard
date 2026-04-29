import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all lab reports (optionally filter by patientId)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get("patientId");

        const reports = await (prisma as any).labReport.findMany({
            where: patientId ? { patientId } : undefined,
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(reports);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch lab reports" }, { status: 500 });
    }
}

// POST — add a new lab report
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const report = await (prisma as any).labReport.create({
            data: {
                patientId: body.patientId,
                patientName: body.patientName,
                testName: body.testName,
                result: body.result || "",
                status: body.status || "Pending",
                notes: body.notes || "",
                date: body.date ? new Date(body.date) : new Date(),
            },
        });
        return NextResponse.json(report);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create lab report" }, { status: 500 });
    }
}
