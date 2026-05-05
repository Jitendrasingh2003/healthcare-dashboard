import { GoogleGenAI } from '@google/genai';

const modelsToTry = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
];

export async function parseFollowUpIntent(notes: string): Promise<{ days: number, reason: string } | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !notes || notes.trim() === '') return null;

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an AI assistant for a healthcare system. Analyze the following clinical notes written by a doctor.
Your ONLY job is to detect if the doctor wants the patient to follow-up or come back for a visit.

Examples of follow-up intent:
- "Come back in 10 days"
- "Review after 2 weeks"
- "Follow up next month"

If you detect a follow-up intent:
Return ONLY a valid JSON object with:
{
  "days": <number of days calculated from the text, e.g. 10 for 10 days, 14 for 2 weeks, 30 for 1 month>,
  "reason": "<brief summary of why they need to come back, or just 'General follow up'>"
}

If NO follow-up intent is detected (e.g. "Patient is stable. Continue medication."):
Return ONLY the exact string: null

Do NOT wrap the output in markdown code blocks like \`\`\`json. Just return the raw JSON or null.

Doctor's Notes:
"${notes}"
    `.trim();

    for (const model of modelsToTry) {
        try {
            const response = await ai.models.generateContent({ model, contents: prompt });
            const text = response.text?.trim() ?? '';
            
            if (text === 'null') {
                return null;
            }

            // Remove potential markdown formatting if the model still includes it
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);

            if (parsed && typeof parsed.days === 'number') {
                return { days: parsed.days, reason: parsed.reason || "General follow up" };
            }
            return null;
        } catch (e: any) {
            console.warn(`[AI Parser] Model ${model} failed: ${e.message}`);
        }
    }

    return null;
}
