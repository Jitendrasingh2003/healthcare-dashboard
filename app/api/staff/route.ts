import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET — Fetch all staff members
export async function GET() {
  try {
    // Clean up any corrupted seed data (name less than 3 chars = bad record)
    await prisma.staff.deleteMany({
      where: { name: { not: { contains: " " } } }
    });

    let staff = await prisma.staff.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Auto-seed if empty for demo purposes
    if (staff.length === 0) {
      const initialStaff = [
        { name: "Kavita Sharma", role: "Nurse", dept: "Cardiology", shift: "Morning", phone: "98765-11111", status: "Active" },
        { name: "Mohan Lal", role: "Admin", dept: "Administration", shift: "Day", phone: "98765-22222", status: "Active" },
        { name: "Neha Gupta", role: "Lab Technician", dept: "Pathology", shift: "Morning", phone: "98765-33333", status: "Active" },
        { name: "Suresh Kumar", role: "Pharmacist", dept: "Pharmacy", shift: "Evening", phone: "98765-44444", status: "On Leave" },
        { name: "Anita Verma", role: "Nurse", dept: "Neurology", shift: "Night", phone: "98765-55555", status: "Active" },
        { name: "Ramesh Tiwari", role: "Receptionist", dept: "OPD", shift: "Morning", phone: "98765-66666", status: "Active" },
      ];
      
      await Promise.all(initialStaff.map(s => prisma.staff.create({ data: s })));
      
      staff = await prisma.staff.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

// DELETE — Clear all staff (for resetting)
export async function DELETE() {
  try {
    await prisma.staff.deleteMany();
    return NextResponse.json({ message: "All staff cleared" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear staff" }, { status: 500 });
  }
}

// POST — Add a new staff member
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const staff = await prisma.staff.create({
      data: {
        name: body.name,
        role: body.role,
        dept: body.dept,
        shift: body.shift,
        phone: body.phone,
        status: body.status || "Active",
      },
    });
    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}
