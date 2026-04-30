import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-flash-latest'];

async function generateWithFallback(ai: GoogleGenAI, prompt: string): Promise<string> {
  let lastError: any;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({ model, contents: prompt });
      return response.text ?? '';
    } catch (e: any) {
      lastError = e;
    }
  }
  throw lastError;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API Key missing.' }, { status: 500 });

    const ai = new GoogleGenAI({ apiKey });
    const { symptoms, age, gender, vitals } = await req.json();

    if (!symptoms) return NextResponse.json({ error: 'Symptoms are required.' }, { status: 400 });

    const prompt = `
You are an expert AI triage physician working in a busy emergency department. Based on the patient information below, provide a structured triage assessment.

PATIENT INFORMATION:
- Age: ${age || 'Unknown'}
- Gender: ${gender || 'Unknown'}
- Presenting Symptoms: ${symptoms}
- Vitals (if available): ${vitals || 'Not recorded'}

Respond ONLY with valid JSON in exactly this format (no markdown, no explanation, just JSON):
{
  "urgencyLevel": "EMERGENCY" | "URGENT" | "MODERATE" | "ROUTINE",
  "urgencyReason": "one sentence explaining urgency",
  "possibleDiagnoses": ["diagnosis1", "diagnosis2", "diagnosis3"],
  "recommendedDepartment": "department name",
  "immediateActions": ["action1", "action2", "action3"],
  "redFlags": ["flag1", "flag2"],
  "estimatedWaitTime": "e.g. Immediate / 15 mins / 30 mins / 2 hours",
  "clinicalNote": "2-3 sentence clinical assessment"
}

Be clinically accurate and concise. Base urgency on standard triage protocols (ESI or Manchester).
    `;

    const raw = await generateWithFallback(ai, prompt);
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Triage Error:', error);
    return NextResponse.json({ error: error.message || 'Triage analysis failed.' }, { status: 500 });
  }
}
