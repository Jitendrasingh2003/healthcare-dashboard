import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ROOM_RATE_PER_DAY = 2500;
const DOCTOR_FEE_PER_DAY = 1000;
const LAB_TEST_FLAT_FEE = 1500;
const MEDICATION_FLAT_FEE = 800;

export async function POST(req: Request) {
  try {
    const { patientId, aiSummary } = await req.json();

    if (!patientId || !aiSummary) {
      return NextResponse.json({ error: "Patient ID and AI Summary are required" }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Calculate days admitted
    const admittedDate = new Date(patient.admittedDate);
    const dischargeDate = new Date();
    const diffTime = Math.abs(dischargeDate.getTime() - admittedDate.getTime());
    let daysAdmitted = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Ensure at least 1 day
    if (daysAdmitted === 0) daysAdmitted = 1;

    // Check if patient had lab tests
    const labReportsCount = await prisma.labReport.count({
      where: { patientId: patientId }
    });

    // Calculate bill Breakdown
    const roomCharges = daysAdmitted * ROOM_RATE_PER_DAY;
    const doctorCharges = daysAdmitted * DOCTOR_FEE_PER_DAY;
    const labCharges = labReportsCount > 0 ? LAB_TEST_FLAT_FEE : 0;
    const medicationCharges = daysAdmitted * MEDICATION_FLAT_FEE;
    
    const subtotal = roomCharges + doctorCharges + labCharges + medicationCharges;
    const tax = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + tax;

    const breakdown = JSON.stringify({
      daysAdmitted,
      roomRate: ROOM_RATE_PER_DAY,
      roomCharges,
      doctorFee: DOCTOR_FEE_PER_DAY,
      doctorCharges,
      labCharges,
      medicationCharges,
      subtotal,
      tax,
      totalAmount
    });

    // Start a transaction to ensure all operations succeed together
    await prisma.$transaction(async (tx) => {
      // 1. Save the AI Discharge Summary
      await tx.dischargeSummary.create({
        data: {
          patientId: patient.id,
          patientName: patient.name,
          doctorId: patient.doctor, // We just store the doctor name string for now
          aiGeneratedText: aiSummary,
        }
      });

      // 2. Save the Invoice
      await tx.invoice.create({
        data: {
          patientId: patient.id,
          patientName: patient.name,
          totalAmount: totalAmount,
          breakdown: breakdown,
          status: "Unpaid"
        }
      });

      // 3. Update Patient Status and free up bed
      await tx.patient.update({
        where: { id: patient.id },
        data: {
          status: "Discharged",
          bedNo: null // Free the bed
        }
      });
    });

    return NextResponse.json({ 
        message: "Discharge processed and invoice generated successfully",
        totalAmount,
        breakdown: JSON.parse(breakdown)
    }, { status: 200 });

  } catch (error) {
    console.error("Billing/Discharge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
