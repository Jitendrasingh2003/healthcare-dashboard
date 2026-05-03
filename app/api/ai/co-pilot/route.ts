import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const modelsToTry = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
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

    const reportsText = reports && reports.length > 0
      ? reports.map((r: any) => `- ${r.testName}: ${r.result} (${r.status})${r.notes ? ` — ${r.notes}` : ''}`).join('\n')
      : 'No lab reports on file.';

    const prompt = `
You are an advanced Clinical Decision Support AI (Doctor's Co-pilot). Your goal is to provide evidence-based suggestions to help a doctor with diagnosis and treatment planning.

PATIENT CONTEXT:
- Name: ${patient.name} (${patient.age}y, ${patient.gender})
- Dept: ${patient.dept}
- Current Diagnosis: ${patient.diagnosis || 'None'}
- Clinical Notes: ${patient.notes || 'None'}
- Weight: ${patient.weight || 'N/A'} | Height: ${patient.height || 'N/A'}
- Blood Group: ${patient.blood}

LAB REPORTS:
${reportsText}

Provide a structured clinical analysis in HTML format (using <h3>, <p>, <ul>, <li>, <strong>, <span> tags). Use premium, professional language. 

Structure the response as follows:

<h3>🩺 Differential Diagnoses</h3>
<p>List possible conditions ranked by likelihood based on symptoms and lab findings.</p>

<h3>🧪 Recommended Investigations</h3>
<p>Suggest specific tests, imaging (MRI/CT), or screenings to narrow down the diagnosis.</p>

<h3>💊 Treatment Considerations</h3>
<p>Suggest potential medications or interventions (include dosage ranges if standard, but add a disclaimer).</p>

<h3>⚠️ Safety Alerts & Contraindications</h3>
<p>Highlight any red flags or potential drug interactions to watch for.</p>

<h3>📝 Clinical Reasoning</h3>
<p>A brief explanation of why these suggestions were made based on the provided data.</p>

IMPORTANT: 
- Do NOT include markdown code block wrappers (\`\`\`html).
- Keep it concise but insightful.
- Use a professional medical tone.
`;

    const suggestions = await generateWithFallback(ai, prompt);
    return NextResponse.json({ suggestions }, { status: 200 });

  } catch (error: any) {
    console.error('AI Co-pilot Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate co-pilot suggestions.' }, { status: 500 });
  }
}
