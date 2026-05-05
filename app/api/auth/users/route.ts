import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/auth/users — Returns all registered users with their activity logs (Admin only)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ["Doctor", "Nurse"] } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        department: true,
        createdAt: true,
        activities: {
          orderBy: { createdAt: "desc" },
          take: 5, // Last 5 activity events per user
          select: {
            id: true,
            action: true,
            role: true,
            ipAddress: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
