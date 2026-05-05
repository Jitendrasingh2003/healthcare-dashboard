import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, phone, department } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (role === "Admin") {
      return NextResponse.json({ error: "Cannot register as Admin" }, { status: 403 });
    }

    if (role !== "Doctor" && role !== "Nurse") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get IP and User-Agent for audit log
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Unknown";
    const userAgent = headersList.get("user-agent") || "Unknown";

    // Create user in User table
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone: phone || null,
        department: department || null,
      },
    });

    // If Doctor → also create profile in Doctor table
    if (role === "Doctor") {
      await prisma.doctor.create({
        data: {
          name,
          email,
          dept: department || "General",
          exp: "0 yrs",
          phone: phone || "N/A",
          shift: "Morning",
          rating: 4.5,
          patients: 0,
          status: "On Duty",
          userId: newUser.id,
        },
      });
    }

    // If Nurse → also create profile in Staff table
    if (role === "Nurse") {
      await prisma.staff.create({
        data: {
          name,
          role: "Nurse",
          dept: department || "General",
          shift: "Morning",
          phone: phone || "N/A",
          status: "Active",
          userId: newUser.id,
        },
      });
    }

    // Log the registration activity in UserActivity table
    await prisma.userActivity.create({
      data: {
        userId: newUser.id,
        action: "REGISTER",
        role,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
