import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: body,
    });
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
