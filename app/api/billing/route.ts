import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { issuedDate: "desc" },
    });
    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH to mark invoice as Paid/Unpaid
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Invoice ID and status are required" }, { status: 400 });
    }
    const updated = await prisma.invoice.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
