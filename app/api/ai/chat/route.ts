import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are MedAssist, an expert AI medical assistant embedded in the City General Hospital's healthcare dashboard.
You assist doctors, nurses, and hospital staff with:
- Explaining medical terms, test results, diagnoses, and medications
- Answering clinical questions and providing evidence-based guidance
- Helping interpret lab reports, vitals, and patient data
- Offering suggestions for patient care and workflow optimization

Important rules:
- Be concise, professional, and empathetic
- Always recommend consulting a qualified physician for actual patient decisions
- Format responses with bullet points or numbered lists where it helps clarity
- Use simple language when possible, but be precise with medical terminology
- If asked about specific patients, note that you don't have access to the live database — you can only discuss general medical information
- Respond in the same language the user writes in (Hindi or English)`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key is missing.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided.' },
        { status: 400 }
      );
    }

    // Build conversation history for multi-turn chat
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-flash-latest',
    ];

    let replyText: string | undefined;
    let lastError: any;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });
        replyText = response.text;
        break;
      } catch (modelError: any) {
        console.warn(`Chat model ${model} failed: ${modelError.message}`);
        lastError = modelError;
      }
    }

    if (!replyText) {
      throw lastError || new Error('All models failed.');
    }

    return NextResponse.json({ reply: replyText }, { status: 200 });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get AI response.' },
      { status: 500 }
    );
  }
}
