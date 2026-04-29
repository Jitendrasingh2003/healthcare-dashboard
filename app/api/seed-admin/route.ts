import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = "admin@hospital.com";
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword, role: "Admin" },
      create: {
        name: "System Admin",
        email,
        password: hashedPassword,
        role: "Admin",
      },
    });
    return NextResponse.json({ message: "Admin user seeded successfully", admin });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
