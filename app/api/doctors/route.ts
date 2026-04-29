import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET — saare doctors
export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

// POST — naya doctor add
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const doctor = await prisma.doctor.create({
      data: {
        name: body.name,
        dept: body.dept,
        exp: body.exp,
        phone: body.phone,
        email: body.email,
        status: body.status || "On Duty",
        shift: body.shift,
        rating: parseFloat(body.rating),
        patients: parseInt(body.patients) || 0,
        education: body.education || "",
        address: body.address || "",
      },
    });
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}
