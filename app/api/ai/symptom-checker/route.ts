import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key is missing. Please check your .env file.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const body = await req.json();
    const { symptoms } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Symptoms data is required.' },
        { status: 400 }
      );
    }

    const symptomsListText = symptoms
      .map((s: any) => `- ${s.part}: ${s.symptom}`)
      .join('\n');

    const prompt = `
      You are an expert AI medical assistant. I am providing you with a list of symptoms a patient is experiencing, along with the affected body parts.
      
      Patient Symptoms:
      ${symptomsListText}
      
      Please analyze these symptoms and provide a preliminary assessment.
      You must respond strictly in JSON format matching the structure below.
      Do not include any markdown wrappers like \`\`\`json.
      
      {
        "possibleConditions": ["Condition 1", "Condition 2", "Condition 3"],
        "triageLevel": "Emergency", // Must be exactly one of: "Emergency", "Urgent", or "Routine"
        "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
      }
    `;

    // Try multiple models in order of preference
    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-flash-latest',
    ];

    let resultJson: any = null;
    let lastError: any;

    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}...`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });
        
        const aiText = response.text;
        if (aiText) {
          resultJson = JSON.parse(aiText);
          console.log(`Success with model: ${model}`);
          break; // Stop on first success
        }
      } catch (modelError: any) {
        console.warn(`Model ${model} failed: ${modelError.message}`);
        lastError = modelError;
      }
    }

    if (!resultJson) {
      throw lastError || new Error('All models failed or returned empty response.');
    }

    return NextResponse.json(resultJson, { status: 200 });

  } catch (error: any) {
    console.error('Symptom Checker AI Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze symptoms using AI.' },
      { status: 500 }
    );
  }
}
