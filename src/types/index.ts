
export type Role = 'brand' | 'community' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}

export interface BrandProfile {
  id: string;
  userId?: string;
  companyName: string;
  logoUrl?: string;
  website?: string;
  industry: string;
  size: 'startup' | 'sme' | 'enterprise';
  objectiveTags: string[];
  toneOfVoice?: string;
  metrics: {
    totalCampaigns: number;
    totalCommunities: number; // Legacy name, effectively 'Channels'
    avgNps: number;
    avgCpa: number;
    avgCtr: number;
  };
  socialProof?: { name: string; quote: string; role?: string; logoUrl?: string; type?: string }[];
  city?: string;
  country?: string;
  description?: string;
  mediaBudgetRange?: { min: number; max: number; currency: string };
  slug?: string;
}

export interface Community { // Conceptually 'Channel'
  id: string;
  ownerUserId?: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  platforms: string[]; // 'youtube', 'shorts'
  size: number; // Subscribers
  engagementRate: number;
  tags: string[];
  verificationStatus: 'verified' | 'unverified' | 'pending' | 'rejected';
  verificationMethod?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  growthRate: number;
  qualityScore: number;
  churnRate?: number;
  city?: string;
  country?: string;
  pricingStyle?: 'fixed' | 'range' | 'custom';
  socialProof?: { name: string; quote: string; role?: string; logoUrl?: string; type?: string }[];
  youtubeStats?: {
    avgViews: number;
    avgDuration: string;
    demographics: string;
    cpm: number;
  };
}

export interface MeasurementPack {
  id: string;
  trackingUrl: string;
  couponCode: string;
  qrCodeUrl: string;
}

export interface InventorySlot {
  date: string; // ISO Date YYYY-MM-DD
  isBooked: boolean;
  priceModifier?: number; // 1.0 default, 1.2 for peak season
}

export interface CommunityOffer { // Conceptually 'Inventory Item' or 'Product'
  id: string;
  communityId: string;
  name: string;
  slug?: string;
  type: 'slot' | 'season' | 'bundle'; // NEW: Differentiator for Programmatic vs Long-term
  category: 'awareness' | 'conversion' | 'content' | 'loyalty' | 'feedback' | 'hiring' | 'traffic' | 'growth' | 'engagement';
  description: string;
  priceMin: number;
  priceMax?: number;
  deliverables: string[];
  metrics?: string[];
  platforms?: string[];
  recommendedUseCases?: string[];
  level?: 'basic' | 'pro' | 'premium';
  currency: string;
  isTemplateBased?: boolean;
  measurementPack?: MeasurementPack;
  // NEW: Inventory Logic
  availableSlots?: InventorySlot[]; 
  seasonDuration?: string; // e.g., "3 Months"
  recurrence?: string; // e.g., "1 Video / Month"
}

export interface BrandPack { // Conceptually 'Campaign Brief'
  id: string;
  brandId: string;
  name: string;
  description: string;
  objective: string;
  budgetMin: number;
  budgetMax?: number;
  currency?: string;
  targetCommunityTags?: string[];
  kpis: string[];
  level?: string;
  measurementPack?: MeasurementPack;
}

export interface CampaignTimelineEvent {
  id: string;
  type: 'campaign_created' | 'community_invited' | 'match_approved' | 'payment_initiated' | 'asset_submitted' | 'execution_started' | 'status_changed';
  title: string;
  description: string;
  actorRole: Role;
  createdAt: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  name: string;
  status: 'draft' | 'published' | 'proposed' | 'applied' | 'approved' | 'in_escrow' | 'running' | 'awaiting_report' | 'dispute' | 'completed' | 'cancelled';
  brief: string;
  budgetTotal: number;
  currency?: string;
  templatesUsedIds: string[];
  measurementPack?: MeasurementPack;
  timeline?: CampaignTimelineEvent[];
  createdAt: string;
  updatedAt?: string;
  priceMin?: number; 
}

export interface Asset {
  id: string;
  campaignId: string;
  name: string;
  type: 'image' | 'video' | 'text';
  url?: string;
  contentSnippet?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  uploadedByRole: Role;
  createdAt: string;
}

export interface Payment {
  id: string;
  campaignId: string;
  amountAgreed: number;
  feeAmount: number;
  platformTakeRate: number;
  status: 'pending' | 'in_escrow' | 'ready_for_payout' | 'released' | 'refunded' | 'held';
  createdAt: string;
}

export interface Execution {
  id: string;
  campaignId: string;
  communityId: string;
  status: 'not_started' | 'in_progress' | 'awaiting_proof' | 'under_review' | 'needs_changes' | 'approved';
  title: string;
  deadline: string;
  plannedDeliverables: string[];
  proofs: { id: string; type: 'link' | 'screenshot' | 'video'; url: string; note?: string; uploadedAt: string }[];
  reportSummary?: string;
  kpiResults?: { name: string; value: number; unit?: string }[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending';
  amount: number;
  invoiceUrl?: string;
}

export interface CampaignMatch {
  id: string;
  campaignId: string;
  communityId: string;
  score: number;
  status: 'invited' | 'applied' | 'shortlisted' | 'approved' | 'rejected';
  proposedBudget?: number;
  negotiatedBudget?: number;
  currency?: string;
  notes?: string;
}

export interface ActionTemplate {
  id: string;
  name: string;
  slug: string;
  category: 'awareness' | 'conversion' | 'content' | 'loyalty' | 'feedback' | 'hiring' | 'traffic' | 'growth' | 'engagement';
  difficulty: 'low' | 'medium' | 'high';
  horizon: 'short' | 'medium' | 'long';
  primarySide: 'brand' | 'community' | 'both' | 'creator';
  mainGoal: 'traffic' | 'awareness' | 'research' | 'review' | 'install' | 'product_test' | 'engagement' | 'hiring' | 'sales' | 'leads' | 'insights' | 'trust' | 'retention' | 'reach' | 'ugc' | 'applications' | 'education' | 'showcase' | 'differentiation' | 'humanize' | 'distribution' | 'interaction' | 'launch' | 'clickthrough' | 'recall' | 'dominance' | 'virality' | 'authority' | 'entertainment' | 'placement' | 'value';
  typicalDuration: string;
  memberBenefit: string;
  supportedPlatforms: string[];
  deliverables: string[];
  metrics: string[];
  baseCopy: string;
  baseBriefing: string;
  howItWorks: string[];
  
  benefitsForMembers?: string[];
  trackingSetup?: {
    requiresUniqueLink: boolean;
    requiresCouponCode: boolean;
    trackingVariables: string[];
    exampleTrackingLink: string;
  };
  proofRequirements?: string[];
  aiAutoGenerate?: boolean;
  bestForCommunities?: string[];
  bestForBrands?: string[];
  executionSteps?: { 
    id: string; 
    label: string; 
    description: string;
  }[];

  version: number;
  isActive: boolean;
  suggestedPriceRange?: {
    min: number;
    max: number;
    currency: string;
  };
}
