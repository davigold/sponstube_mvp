
export type Role = 'brand' | 'community' | 'staff';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string;
    createdAt?: string;
    supabaseId?: string; // Phase 2
}

export interface BrandProfile {
    id: string;
    companyName: string;
    industry: string;
    size: string;
    objectiveTags: string[];
    toneOfVoice: string;
    city: string;
    country: string;
    description: string;
    userId?: string;
    metrics?: {
        totalCampaigns: number;
        totalCommunities: number;
        avgNps: number;
        avgCpa: number;
        avgCtr: number;
    };
    mediaBudgetRange?: { min: number; max: number; currency: string };
}

export interface Community {
    id: string;
    name: string;
    slug: string;
    description: string;
    platforms: string[];
    size: number;
    engagementRate: number;
    tags: string[];
    verificationStatus: string;
    verificationMethod?: string;
    riskLevel?: string;
    growthRate?: number;
    qualityScore?: number;
    churnRate?: number;
    city: string;
    country: string;
    pricingStyle?: string;
    userId?: string;
    youtubeStats?: {
        avgViews: number;
        avgDuration: string;
        demographics: string;
        cpm: number;
    };
    socialProof?: any[];
}

export interface MeasurementPack {
    id: string;
    trackingUrl: string;
    couponCode: string;
    qrCodeUrl: string;
}

export interface ActionTemplate {
    id: string;
    name: string;
    slug: string;
    category: string;
    difficulty: string;
    horizon: string;
    primarySide: string;
    mainGoal: string;
    typicalDuration: string;
    memberBenefit: string;
    supportedPlatforms: string[];
    deliverables: string[];
    metrics: string[];
    baseCopy: string;
    baseBriefing: string;
    howItWorks: string[];
    proofRequirements: string[];
    aiAutoGenerate: boolean;
    version: number;
    isActive: boolean;
    suggestedPriceRange: { min: number; max: number; currency: string };
}

export interface Campaign {
    id: string;
    brandId: string;
    name: string;
    status: 'applied' | 'approved' | 'running' | 'awaiting_report' | 'completed' | 'dispute' | 'in_escrow';
    brief: string;
    budgetTotal: number;
    templatesUsedIds?: string[];
    createdAt?: string;
    priceMin?: number;
    measurementPack?: MeasurementPack;
}

export interface CommunityOffer {
    id: string;
    communityId: string;
    name: string;
    category: string;
    description: string;
    priceMin: number;
    deliverables: string[];
    level: string;
    currency: string;
    measurementPack?: MeasurementPack;
    platforms: string[];
    type?: string;
    availableSlots?: any[];
    seasonDuration?: string;
    recurrence?: string;
}

export interface BrandPack {
    id: string;
    brandId: string;
    name: string;
    objective: string;
    description: string;
    budgetMin: number;
    kpis: string[];
    level: string;
    measurementPack?: MeasurementPack;
}

// Placeholders for unused types to prevent errors
export interface Asset { }
export interface Payment { }
export interface Execution { }
export interface Transaction { }
export interface CampaignMatch { }

export interface CampaignTimelineEvent {
    id: string;
    type: string;
    title: string;
    description: string;
    actorRole: Role;
    createdAt: string;
}
