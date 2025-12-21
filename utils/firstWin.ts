
import { Campaign, CommunityOffer, Role, ActionTemplate } from '../types';
import { generateMeasurementPack } from '../mockData';

export interface OnboardingProfile {
  goal: string;
  category?: string;
  country?: string;
  budget?: string;
  platform?: string;
  size?: string;
  niche?: string;
  // PR-3: New fields for premium onboarding
  selectedTemplate?: ActionTemplate;
  selectedPackageTier?: {
    id: string;
    name: string;
    price: number;
    level: 'basic' | 'pro' | 'premium';
    description: string;
    deliverables: string[];
  };
}

export const generateFirstWin = (role: Role, profile: OnboardingProfile): Partial<Campaign> | Partial<CommunityOffer> => {
  const id = `draft-${Date.now()}`;
  const timestamp = new Date().toISOString();

  if (role === 'brand') {
    const budget = parseInt(profile.budget || '1000', 10);
    const template = profile.selectedTemplate;
    
    // Use template data if available, otherwise fallback to generic
    const name = template 
      ? `${template.name} - ${profile.country}` 
      : `${profile.goal === 'hiring' ? 'Hiring' : 'Launch'} Campaign: ${profile.category || 'General'}`;
      
    const brief = template
      ? `${template.baseBriefing}\n\nContext: ${profile.category} brand targeting ${profile.country}. Budget Cap: ${budget}.`
      : `Strategic campaign targeting the ${profile.country || 'Global'} market. Primary objective: ${profile.goal}. Budget allocated: ${budget}.`;

    const campaignDraft: Partial<Campaign> = {
      id,
      brandId: 'current-user', 
      name,
      status: 'draft',
      brief,
      budgetTotal: budget,
      templatesUsedIds: template ? [template.id] : [],
      createdAt: timestamp,
      priceMin: budget, 
      measurementPack: generateMeasurementPack('campaign', id, name)
    };
    return campaignDraft;
  } else {
    // Community Logic
    const tier = profile.selectedPackageTier;
    const name = tier 
      ? `${tier.name}` 
      : `${profile.platform || 'Community'} Partnership`;
      
    const description = tier
      ? `${tier.description}\n\nTailored for: ${profile.niche} audience in ${profile.country}.`
      : `Exclusive sponsorship opportunity for the ${profile.niche || 'General'} audience in ${profile.country || 'Global'}. Size: ${profile.size || 'N/A'}.`;

    const offerDraft: Partial<CommunityOffer> = {
      id,
      communityId: 'current-user',
      name,
      category: profile.goal === 'monetize' ? 'conversion' : 'awareness',
      description,
      priceMin: tier ? tier.price : 500,
      priceMax: tier ? tier.price * 1.5 : 1500,
      deliverables: tier ? tier.deliverables : ['1x Pinned Post', '1x Story/Status', 'Monthly Report'],
      currency: 'BRL',
      level: tier ? tier.level : 'pro',
      measurementPack: generateMeasurementPack('offer', id, name)
    };
    return offerDraft;
  }
};
