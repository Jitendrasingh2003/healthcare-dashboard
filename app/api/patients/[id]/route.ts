import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parseFollowUpIntent } from "@/lib/ai-followup-parser";

// GET — single patient
export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
    });
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 });
  }
}

// PATCH — patient update
export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await req.json();
    
    const currentPatient = await prisma.patient.findUnique({ where: { id: params.id } });

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: body,
    });

    // AI Auto-Scheduling Logic
    if (body.notes && currentPatient && body.notes !== currentPatient.notes) {
      parseFollowUpIntent(body.notes).then(async (intent) => {
        if (intent && intent.days > 0) {
          const date = new Date();
          date.setDate(date.getDate() + intent.days);

          await prisma.followUp.create({
            data: {
              patientId: patient.id,
              patientName: patient.name,
              patientPhone: patient.phone || "Not Provided",
              patientEmail: patient.email,
              doctorId: patient.doctor,
              doctorName: patient.doctor,
              followUpDate: date,
              notes: `[AI Auto-Scheduled] ${intent.reason}`
            }
          });
          console.log(`🤖 AI Auto-Scheduled a follow-up for ${patient.name} in ${intent.days} days.`);
        }
      }).catch(err => console.error("AI Follow-up scheduling failed:", err));
    }

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}

// DELETE — patient delete
export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await prisma.patient.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 });
  }
}
