import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Initialize inside the request handler so we can catch errors
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key is missing. Please check your .env file.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const body = await req.json();
    const { testName, category, result, findings } = body;

    if (!testName || !findings) {
      return NextResponse.json(
        { error: 'Missing required report data for analysis.' },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert AI medical assistant. I am providing you with a patient's lab report details.
      Please provide a highly professional, clinical analysis and summary of the following lab report.
      
      Test Name: ${testName}
      Category: ${category}
      Result: ${result}
      Findings/Notes: ${findings}
      
      Format your response in simple HTML suitable for embedding in a React application. Use bold tags, paragraphs, and unordered lists where appropriate. 
      Please include the following sections exactly:
      <h3>🩺 Clinical Summary</h3>
      (Explain what these findings mean in a clinical context)
      
      <h3>⚠️ Significance of Result</h3>
      (Explain why this matters for the patient's health, tailored to the result level: ${result})
      
      <h3>📋 Recommended Next Steps</h3>
      (List potential follow-up tests, monitoring, or clinical actions)

      Keep the tone objective, professional, and clear. Do not include markdown code block wrappers (like \`\`\`html) in your response, just return the raw HTML string.
    `;

    // Try multiple models in order of preference (fallback if one is unavailable)
    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-flash-latest',
    ];

    let aiText: string | undefined;
    let lastError: any;

    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}...`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        aiText = response.text;
        console.log(`Success with model: ${model}`);
        break; // Stop on first success
      } catch (modelError: any) {
        console.warn(`Model ${model} failed: ${modelError.message}`);
        lastError = modelError;
      }
    }

    if (!aiText) {
      throw lastError || new Error('All models failed.');
    }

    return NextResponse.json({ analysis: aiText }, { status: 200 });

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze report using AI.' },
      { status: 500 }
    );
  }
}
