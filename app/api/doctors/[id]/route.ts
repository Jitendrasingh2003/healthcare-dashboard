import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const doctor = await prisma.doctor.findUnique({
      where: { id: params.id },
    });
    if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await req.json();
    const doctor = await prisma.doctor.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await prisma.doctor.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 });
  }
}
