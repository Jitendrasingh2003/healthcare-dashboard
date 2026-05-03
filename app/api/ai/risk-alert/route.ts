import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key missing.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const body = await req.json();
    const { patient, reports } = body;

    if (!patient) {
      return NextResponse.json({ error: 'Patient data required.' }, { status: 400 });
    }

    // Build a context from reports
    const reportsSummary = reports && reports.length > 0
      ? reports.map((r: any) => `- ${r.testName}: ${r.result || 'N/A'} (Status: ${r.status})${r.notes ? ` — Notes: ${r.notes}` : ''}`).join('\n')
      : 'No lab reports available.';

    const prompt = `You are an expert clinical AI system for a hospital. Analyze the following patient data and provide a RISK ALERT assessment.

PATIENT INFORMATION:
- Name: ${patient.name}
- Age: ${patient.age} years
- Gender: ${patient.gender}
- Blood Group: ${patient.blood}
- Department: ${patient.dept}
- Assigned Doctor: ${patient.doctor}
- Current Status: ${patient.status}
- Diagnosis: ${patient.diagnosis || 'Not recorded'}
- Doctor's Notes: ${patient.notes || 'None'}

LAB REPORTS:
${reportsSummary}

Based on this data, provide a JSON response (no markdown, pure JSON) in this exact format:
{
  "riskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "riskScore": <number 1-100>,
  "primaryAlert": "<one concise sentence describing the main risk>",
  "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"],
  "immediateActions": ["<action 1>", "<action 2>"],
  "monitoringRequired": "<what to watch for>",
  "estimatedStabilityTime": "<e.g. 24-48 hours / Immediate intervention needed>"
}

Be clinically precise. If status is Critical or any lab report is Critical/Abnormal, reflect that in the risk level. Return only valid JSON, no extra text.`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
    let aiText: string | undefined;
    let lastError: any;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        aiText = response.text;
        break;
      } catch (e: any) {
        lastError = e;
      }
    }

    if (!aiText) throw lastError || new Error('All models failed.');

    // Clean and parse JSON
    const cleaned = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const alert = JSON.parse(cleaned);

    return NextResponse.json({ alert }, { status: 200 });

  } catch (error: any) {
    console.error('Risk Alert Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate risk alert.' }, { status: 500 });
  }
}
