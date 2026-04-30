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

    const { beds } = await req.json();

    if (!beds || !Array.isArray(beds)) {
      return NextResponse.json({ error: 'Bed data is required.' }, { status: 400 });
    }

    const occupied = beds.filter((b: any) => b.status === 'Occupied');
    const available = beds.filter((b: any) => b.status === 'Available');
    const reserved = beds.filter((b: any) => b.status === 'Reserved');
    const maintenance = beds.filter((b: any) => b.status === 'Maintenance');

    // Calculate how long each patient has been admitted
    const today = new Date();
    const currentMonth = today.getMonth();

    const bedDetails = occupied.map((b: any) => {
      // Parse "Apr 20" style dates
      const sinceDate = b.since ? new Date(`${b.since} 2026`) : null;
      const daysAdmitted = sinceDate
        ? Math.floor((today.getTime() - sinceDate.getTime()) / (1000 * 60 * 60 * 24))
        : 'Unknown';
      return `- Bed ${b.id} (${b.ward}, ${b.type}): ${b.patient} under ${b.doctor}, admitted for ${daysAdmitted} days`;
    }).join('\n');

    const prompt = `
You are an expert hospital bed management AI. Based on the current bed occupancy data, predict bed availability for the next 24-48 hours and provide actionable recommendations.

CURRENT BED STATUS (as of today):
- Total Beds: ${beds.length}
- Occupied: ${occupied.length} (${Math.round(occupied.length / beds.length * 100)}% occupancy)
- Available: ${available.length}
- Reserved: ${reserved.length}
- Under Maintenance: ${maintenance.length}

OCCUPIED BEDS DETAIL:
${bedDetails}

WARD BREAKDOWN:
${['Neurology', 'Orthopedics', 'Cardiology'].map(ward => {
  const wardBeds = beds.filter((b: any) => b.ward === ward);
  const wardOccupied = wardBeds.filter((b: any) => b.status === 'Occupied').length;
  return `- ${ward}: ${wardOccupied}/${wardBeds.length} beds occupied`;
}).join('\n')}

Based on typical hospital discharge patterns (patients admitted 7+ days are likely candidates for discharge soon, ICU patients have longer stays), provide a bed prediction report with HTML formatting.

Include these sections with <h3>, <p>, <ul>, <li>, <strong> tags:
<h3>📊 Current Occupancy Analysis</h3>
<h3>🔮 24-Hour Bed Availability Prediction</h3>
<h3>🏥 48-Hour Forecast by Ward</h3>
<h3>⚠️ Capacity Risk Assessment</h3>
<h3>✅ Recommended Actions</h3>

Be specific with numbers. Do not include markdown code blocks.
    `;

    const prediction = await generateWithFallback(ai, prompt);
    return NextResponse.json({ prediction }, { status: 200 });

  } catch (error: any) {
    console.error('Bed Predictor Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate bed prediction.' }, { status: 500 });
  }
}
