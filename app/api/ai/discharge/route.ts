import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { patientId } = await req.json();

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
    }

    // Fetch patient details and recent lab reports
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const labReports = await prisma.labReport.findMany({
      where: { patientId: patientId },
      orderBy: { date: "desc" },
      take: 5
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI API Key not configured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Construct the prompt for Gemini
    const prompt = `
You are a highly experienced Chief Medical Officer generating a formal clinical Discharge Summary.
Based on the following patient details and lab reports, write a comprehensive and structured discharge summary.

Patient Name: ${patient.name}
Age: ${patient.age}
Gender: ${patient.gender}
Department: ${patient.dept}
Attending Doctor: ${patient.doctor}
Admitted Diagnosis: ${patient.diagnosis || "Not specified"}
Current Status: ${patient.status}
Clinical Notes: ${patient.notes || "No additional notes"}

Recent Lab Reports:
${labReports.length > 0 ? labReports.map(lr => `- ${lr.testName}: ${lr.result} (${lr.status})`).join('\n') : "No lab reports available"}

Format the output strictly in clean Markdown with the following sections:
1. **Admission Details** (Summary of admission)
2. **Hospital Course** (What happened during the stay based on notes and labs)
3. **Condition on Discharge** (Current status)
4. **Discharge Medications** (Suggest 2-3 standard medications based on the diagnosis)
5. **Follow-up Instructions** (When to visit next and red-flag symptoms to watch out for)

Do not include any introductory or concluding conversational text. Output only the Markdown content.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const aiSummary = response.text || "Failed to generate summary.";

    return NextResponse.json({ summary: aiSummary }, { status: 200 });

  } catch (error) {
    console.error("AI Discharge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
