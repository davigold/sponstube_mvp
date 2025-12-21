import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock_key',
});

// "Training" Context - System Prompt
const SYSTEM_PROMPT = `
You are Sponstube Intelligence, a Senior Influencer Marketing Strategist with 15 years of experience.
Your goal is to evaluate the compatibility between a Brand and a Creator (Community) for a marketing campaign.

You must analyze the match based on:
1. **Audience Demographics**: Does the creator's audience (Age, Gender, Location) match the Brand's target?
2. **Brand Safety**: Is the creator's content safe for this specific brand? (e.g., No swearing for kids' brands).
3. **Budget/CPM Fit**: Is the creator's pricing within the brand's likely budget range?
4. **Tone of Voice**: Does the creator's style match the brand's desired tone (e.g., Funny vs. Professional)?

Output a JSON object strictly following this schema:
{
  "score": number, // 0-100
  "summary": string, // 1 sentence verdict
  "pros": string[], // Top 3 reasons for the match
  "risks": string[], // Potential pitfalls
  "suggested_action": "High Priority" | "Consider" | "Avoid"
}
`;

export const analyzeMatch = async (brandData: any, creatorData: any) => {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'mock_key') {
        // Advanced Mock response simulating the Expert AI
        const score = Math.floor(Math.random() * 20) + 80; // 80-100
        return {
            score,
            summary: "Match Mockado (Chave de API ausente): Alta sinergia demográfica detectada.",
            pros: ["Sobreposição de audiência > 85%", "Custo por View (CPV) estimado eficiente"],
            risks: ["Verificar exclusividade com competidores recentes"],
            suggested_action: "High Priority"
        };
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: `Analyze this match:\n\nBRAND:\n${JSON.stringify(brandData)}\n\nCREATOR:\n${JSON.stringify(creatorData)}`
                }
            ],
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
        console.error('OpenAI error:', error);
        throw error;
    }
};
