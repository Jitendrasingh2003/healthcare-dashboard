import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET — Fetch a specific staff member by ID
export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const staff = await prisma.staff.findUnique({
      where: { id: params.id },
    });
    if (!staff) return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch staff member" }, { status: 500 });
  }
}

// PATCH — Update a staff member
export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await req.json();
    const staff = await prisma.staff.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update staff member" }, { status: 500 });
  }
}

// DELETE — Delete a staff member
export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await prisma.staff.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Staff deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete staff member" }, { status: 500 });
  }
}
