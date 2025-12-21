
import { CAMPAIGN_BRIEF_PROMPT, CREATOR_OFFER_PROMPT, RISK_ANALYSIS_PROMPT } from './prompts';

export interface CampaignInput {
  industry?: string;
  targetAudience?: string;
  budget?: number;
  objective?: string;
}

export interface CreatorInput {
  niche?: string;
  subscriberCount?: string;
  brandIndustry?: string;
}

export interface RiskInput {
  brandName: string;
  channelName: string;
}

export interface GeneratedBrief {
  name: string;
  brief: string;
  suggestedMix: { format: string; allocation: number; rationale: string }[];
  keyMessage: string;
  predictedKPIs: {
    views: number;
    watchTimeHours: number;
    clickouts: number;
    conversions: number;
  };
}

export interface GeneratedOffer {
  name: string;
  description: string;
  deliverables: string[];
  format: string;
  price: number;
  estimatedViews: number;
}

export interface RiskAnalysis {
  riskScore: number;
  alignmentScore: number;
  flags: string[];
  analysis: string;
}

export const aiClient = {
  generateCampaignBrief: async (input: CampaignInput): Promise<GeneratedBrief> => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Deterministic mock based on objective for YouTube context (in Portuguese)
    const isConversion = input.objective === 'conversion' || input.objective === 'sales';
    
    return {
      name: isConversion ? "Integração de Alta Conversão Q4" : "Blitz de Brand Awareness",
      brief: isConversion 
        ? "Foque em integrações mid-roll (60-90s) em canais de tecnologia e finanças. Enfatize o cupom de desconto por tempo limitado e a proposta de valor única. Creators devem demonstrar o produto em uso."
        : "Patrocine YouTube Shorts e introduções de alta energia para maximizar o alcance. O objetivo é que o nome da marca seja ouvido pelo maior número possível de pessoas no público-alvo.",
      suggestedMix: isConversion 
        ? [
            { format: "Integração Long-form", allocation: 70, rationale: "Maior confiança e tempo para explicar funcionalidades." },
            { format: "Shorts", allocation: 30, rationale: "Retargeting e frequência." }
          ]
        : [
            { format: "Shorts", allocation: 60, rationale: "Potencial viral e baixo CPM." },
            { format: "Leitura em Podcast", allocation: 40, rationale: "Construção de autoridade." }
          ],
      keyMessage: isConversion ? "Pare de perder tempo. Automatize seu fluxo de trabalho hoje." : "A nova maneira de gerenciar sua vida digital.",
      predictedKPIs: {
        views: input.budget ? Math.floor(input.budget * 0.15) : 50000,
        watchTimeHours: 1200,
        clickouts: input.budget ? Math.floor(input.budget * 0.02) : 1500,
        conversions: input.budget ? Math.floor(input.budget * 0.001) : 50
      }
    };
  },

  generateCreatorOffer: async (input: CreatorInput): Promise<GeneratedOffer> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock logic based on subscriber count string (e.g. "100k")
    const isLarge = input.subscriberCount && parseInt(input.subscriberCount) > 100000;

    return {
      name: isLarge ? "Review Dedicado & Deep Dive" : "Pacote de Shoutout Integrado",
      description: isLarge
        ? "Um vídeo completo de 10 minutos dedicado ao seu produto, incluindo testes de estresse e comparação. Perfeito para SaaS complexo ou hardware Tech."
        : "Uma integração mid-roll natural de 60 segundos + Link no Comentário Fixado. Vou costurar seu produto no meu storytelling para máxima retenção.",
      deliverables: isLarge 
        ? ["1x Vídeo Dedicado (10m+)", "2x Cortes para Shorts", "Post na Comunidade"]
        : ["1x Integração Mid-roll (60s)", "Link na Bio (48h)"],
      format: isLarge ? "Dedicado" : "Integração",
      price: isLarge ? 5000 : 1500,
      estimatedViews: isLarge ? 85000 : 15000
    };
  },

  analyzeRiskROI: async (input: RiskInput): Promise<RiskAnalysis> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock risk assessment
    const isRisky = input.channelName.toLowerCase().includes('crypto') || input.channelName.toLowerCase().includes('bet');

    return {
        riskScore: isRisky ? 85 : 12,
        alignmentScore: isRisky ? 40 : 88,
        flags: isRisky ? ["Nicho de Alto Risco", "Audiência Volátil"] : ["Seguro"],
        analysis: isRisky 
            ? "Canal opera em nicho de alta volatilidade. Verifique desempenho de campanhas anteriores e cheque comentários bots."
            : "Forte alinhamento de brand safety. Conteúdo é family-friendly e consistente."
    };
  }
};
