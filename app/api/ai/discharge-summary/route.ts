import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const modelsToTry = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest',
];

async function generateWithFallback(ai: GoogleGenAI, prompt: string): Promise<string> {
  let lastError: any;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({ model, contents: prompt });
      return response.text ?? '';
    } catch (e: any) {
      console.warn(`Model ${model} failed: ${e.message}`);
      lastError = e;
    }
  }
  throw lastError;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is missing.' }, { status: 500 });
    }
    const ai = new GoogleGenAI({ apiKey });

    const { patient, reports } = await req.json();

    if (!patient) {
      return NextResponse.json({ error: 'Patient data is required.' }, { status: 400 });
    }

    const admittedDate = new Date(patient.admittedDate);
    const today = new Date();
    const daysAdmitted = Math.floor((today.getTime() - admittedDate.getTime()) / (1000 * 60 * 60 * 24));

    const reportsText = reports && reports.length > 0
      ? reports.map((r: any) => `- ${r.testName}: ${r.result} (${r.status})${r.notes ? ` — ${r.notes}` : ''}`).join('\n')
      : 'No lab reports on file.';

    const prompt = `
You are an expert clinical documentation specialist. Generate a formal, professional hospital discharge summary for the following patient.

PATIENT INFORMATION:
- Name: ${patient.name}
- Age: ${patient.age} years | Gender: ${patient.gender}
- Blood Group: ${patient.blood}
- Department: ${patient.dept}
- Attending Physician: ${patient.doctor}
- Admitted: ${admittedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} (${daysAdmitted} days ago)
- Diagnosis: ${patient.diagnosis || 'Not specified'}
- Clinical Notes: ${patient.notes || 'None recorded'}
- Weight: ${patient.weight || 'N/A'} | Height: ${patient.height || 'N/A'}
- Bed No: ${patient.bedNo || 'N/A'}

LAB REPORTS:
${reportsText}

Generate a complete, formal discharge summary with HTML formatting (use <h3>, <p>, <ul>, <li>, <strong> tags). Include these sections:
<h3>📋 Discharge Summary</h3>
<h3>🏥 Reason for Admission</h3>
<h3>🔬 Investigations & Findings</h3>
<h3>💊 Treatment Given</h3>
<h3>📊 Patient Progress</h3>
<h3>📋 Discharge Instructions</h3>
<h3>🔄 Follow-up Plan</h3>

Be professional, concise, and clinically accurate. Do not include markdown code block wrappers.
    `;

    const summary = await generateWithFallback(ai, prompt);
    return NextResponse.json({ summary }, { status: 200 });

  } catch (error: any) {
    console.error('Discharge Summary Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate summary.' }, { status: 500 });
  }
}
