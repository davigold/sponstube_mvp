
export const CAMPAIGN_BRIEF_PROMPT = `
You are an expert YouTube Strategist for brands.
Generate a structured campaign brief for a {industry} brand targeting {targetAudience} with a budget of {budget}.
Objective: {objective}.

Focus ONLY on YouTube formats (Long-form, Shorts, Live, Podcast).
Suggest a media mix and specific video-centric KPIs.

Output strictly valid JSON with this schema:
{
  "name": "Campaign Title",
  "brief": "Detailed strategic brief focusing on video storytelling...",
  "suggestedMix": [
    { "format": "Long-form" | "Shorts" | "Live" | "Podcast", "allocation": number, "rationale": "string" }
  ],
  "keyMessage": "Core value proposition for the creator to say...",
  "predictedKPIs": {
    "views": number,
    "watchTimeHours": number,
    "clickouts": number,
    "conversions": number
  }
}
If unsure, return null for fields. Do not include markdown formatting.
`;

export const CREATOR_OFFER_PROMPT = `
You are a YouTube Creator Talent Manager.
Generate a high-converting sponsorship offer (package) for a channel in the {niche} niche with {subscriberCount} subscribers.
Target Brand Industry: {brandIndustry}.

Focus on YouTube specific deliverables (e.g., Pre-roll, Mid-roll, Dedicated, Shorts).

Output strictly valid JSON with this schema:
{
  "name": "Package Name (e.g., 'The Deep Dive Review')",
  "description": "Compelling pitch emphasizing audience retention and trust...",
  "deliverables": ["1x Dedicated Video (8-12min)", "1x YouTube Shorts adaptation"],
  "format": "Integration" | "Dedicated" | "Shorts" | "Live Mention",
  "price": number,
  "estimatedViews": number
}
If unsure, return null for fields. Do not include markdown formatting.
`;

export const RISK_ANALYSIS_PROMPT = `
Analyze the risk and Brand Safety for a YouTube sponsorship between Brand "{brandName}" and Channel "{channelName}".
Check for:
1. Brand Safety (Controversial topics, ad-friendly content).
2. Niche Mismatch (Does the audience actually align?).
3. Fake Metrics Risk (Suspicious growth or engagement patterns).
4. Policy Compliance (YouTube ToS).

Output strictly valid JSON with this schema:
{
  "riskScore": number (0-100, where 100 is critical risk),
  "alignmentScore": number (0-100, where 100 is perfect match),
  "flags": ["Brand Safety", "Niche Mismatch", "Fake Metrics", "Policy Violation", "Safe"],
  "analysis": "Brief explanation of the risk assessment..."
}
Do not include markdown formatting.
`;
