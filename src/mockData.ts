
import { 
  ActionTemplate, User, Community, BrandProfile, CommunityOffer, 
  BrandPack, Campaign, Asset, Payment, Execution, Transaction, 
  CampaignMatch, MeasurementPack, Role
} from './types';

// Helper
export const generateMeasurementPack = (type: 'offer' | 'campaign', id: string, name: string): MeasurementPack => ({
  id: `mp-${id}`,
  trackingUrl: `https://sponstube.com/c/${name.toLowerCase().substring(0,3)}/${Math.floor(Math.random()*1000)}`,
  couponCode: `${name.toUpperCase().substring(0,4)}20`,
  qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=cm-${id}`
});

// --- PLATFORM DEFINITIONS (STRICTLY YOUTUBE) ---
export type PlatformType = 'core' | 'extended';

export const PLATFORM_DICT: Record<string, { 
  label: string; 
  type: PlatformType; 
  color: string; 
  hex: string; 
  textColor: string; 
  expectation: string;
  measurement: string;
}> = {
  long_form: { 
    label: 'Vídeo Longo', 
    type: 'core', 
    color: 'bg-[#FF0000]/10', 
    hex: '#FF0000',
    textColor: 'text-[#FF0000]',
    expectation: 'Alta retenção e storytelling.',
    measurement: 'CPM, Tempo de Exibição.'
  },
  shorts: { 
    label: 'YouTube Shorts', 
    type: 'core', 
    color: 'bg-[#FF0000]/10', 
    hex: '#FF0000',
    textColor: 'text-[#FF0000]',
    expectation: 'Alcance viral e frequência.',
    measurement: 'CPV, Taxa de Swipe.'
  },
  live: { 
    label: 'Transmissão Ao Vivo', 
    type: 'core', 
    color: 'bg-[#FF0000]/10', 
    hex: '#FF0000',
    textColor: 'text-[#FF0000]',
    expectation: 'Engajamento profundo e confiança.',
    measurement: 'Pico de Simultâneos, Chat.'
  },
  community_post: {
    label: 'Post na Comunidade',
    type: 'extended',
    color: 'bg-slate-100',
    hex: '#606060',
    textColor: 'text-slate-500',
    expectation: 'Atualizações rápidas e enquetes.',
    measurement: 'Impressões, CTR.'
  }
};

// --- MATCHING INTELLIGENCE HELPER ---
export const getMatchAnalysis = (entity: any, contextRole: Role) => {
  const baseScore = 85 + Math.floor(Math.random() * 14);
  
  const reasons = [];
  if (baseScore >= 90) reasons.push("🎯 Match Demográfico de Audiência (Idade/Geo)");
  if (baseScore >= 80) reasons.push("💰 CPM dentro da sua faixa alvo");
  reasons.push("✅ Propriedade do Canal Verificada (API)");

  const risks = [
    { label: "Rastreamento de Link", type: "positive", icon: "link" },
    { label: "Seguro via Escrow", type: "positive", icon: "shield" }
  ];

  return { score: baseScore, reasons, risks };
};

// --- YOUTUBE NATIVE TEMPLATES (EXPERT SELECTION) ---
export const MOCK_TEMPLATES: ActionTemplate[] = [
  // --- SHORT TERM (ACTIVATION / AWARENESS) ---
  {
    id: 'yt_shorts_viral_spark',
    name: 'Viral Spark (Shorts)',
    slug: 'yt-shorts-spark',
    category: 'awareness',
    difficulty: 'low',
    horizon: 'short',
    primarySide: 'both',
    mainGoal: 'reach',
    typicalDuration: 'Entrega em 48h',
    memberBenefit: 'Alto Volume',
    supportedPlatforms: ['shorts'],
    deliverables: ['1x YouTube Short (15-60s)', 'Comentário Fixado'],
    metrics: ['Visualizações', 'Taxa de Retenção'],
    baseCopy: 'Você sabia que a [Marca] resolveu [Problema]? Confira no link!',
    baseBriefing: 'Prenda a atenção nos primeiros 3 segundos. Cortes rápidos, áudio em alta se possível. Foque em UM benefício chave. Sem introduções longas.',
    howItWorks: ['Aprovação de Roteiro', 'Gravação', 'Revisão', 'Publicação'],
    proofRequirements: ['Link do Short'],
    aiAutoGenerate: true,
    version: 1,
    isActive: true,
    suggestedPriceRange: { min: 150, max: 1500, currency: 'BRL' }
  },
  {
    id: 'yt_integrated_shoutout',
    name: 'Inserção 60s (Shoutout)',
    slug: 'yt-shoutout',
    category: 'traffic',
    difficulty: 'low',
    horizon: 'short',
    primarySide: 'brand',
    mainGoal: 'clickthrough',
    typicalDuration: '1 Semana',
    memberBenefit: 'Renda Fácil',
    supportedPlatforms: ['long_form'],
    deliverables: ['1x Pre-roll ou Mid-roll (45-60s)', 'Link na Descrição (Topo)'],
    metrics: ['CTR', 'Cliques'],
    baseCopy: 'Este vídeo é oferecido pela [Marca]. Se você quer...',
    baseBriefing: 'Foco em resposta direta. Apresente o problema, introduza a [Marca] como solução, dê a Chamada para Ação (CTA) e o Cupom imediatamente.',
    howItWorks: ['Pontos Chave', 'Gravação da Integração', 'Publicação'],
    proofRequirements: ['Link com Minutagem'],
    aiAutoGenerate: true,
    version: 2,
    isActive: true,
    suggestedPriceRange: { min: 300, max: 3000, currency: 'BRL' }
  },
  {
    id: 'yt_community_poll',
    name: 'Pesquisa de Mercado (Enquete)',
    slug: 'yt-poll',
    category: 'feedback',
    difficulty: 'low',
    horizon: 'short',
    primarySide: 'brand',
    mainGoal: 'insights',
    typicalDuration: '24h',
    memberBenefit: 'Baixo Esforço',
    supportedPlatforms: ['community_post'],
    deliverables: ['1x Enquete na Comunidade', '1x Post de Imagem com Link'],
    metrics: ['Votos', 'Comentários'],
    baseCopy: 'Estamos curiosos: Como você lida com [Problema]? Vote abaixo! Patrocinado por [Marca].',
    baseBriefing: 'Engaje seus super-fãs na Aba Comunidade. Faça uma pergunta relevante ao nosso setor para medir interesse ou dores.',
    howItWorks: ['Rascunho da Enquete', 'Postar', 'Coletar Dados'],
    proofRequirements: ['Print'],
    aiAutoGenerate: true,
    version: 1,
    isActive: true,
    suggestedPriceRange: { min: 50, max: 500, currency: 'BRL' }
  },

  // --- MEDIUM TERM (CONSIDERATION / TRUST) ---
  {
    id: 'yt_deep_dive_review',
    name: 'Review Dedicado (Deep Dive)',
    slug: 'yt-review',
    category: 'conversion',
    difficulty: 'high',
    horizon: 'medium',
    primarySide: 'creator',
    mainGoal: 'trust',
    typicalDuration: '2 Semanas',
    memberBenefit: 'Ticket Alto',
    supportedPlatforms: ['long_form'],
    deliverables: ['1x Vídeo Dedicado (8min+)', '2x Cortes para Shorts', 'SEO Otimizado'],
    metrics: ['Tempo de Exibição', 'Vendas', 'Retenção'],
    baseCopy: 'Testei a [Marca] por 7 dias e aqui está o que aconteceu...',
    baseBriefing: 'Review honesto e aprofundado. Mostre o unboxing, setup e uso diário. Aborde prós e contras (confiamos na sua voz). Conclua para quem este produto é ideal.',
    howItWorks: ['Envio de Produto', 'Fase de Teste (7 dias)', 'Roteiro', 'Gravação', 'Review', 'Publicação'],
    proofRequirements: ['Link do Vídeo', 'Print do Analytics (Retenção)'],
    aiAutoGenerate: false,
    version: 2,
    isActive: true,
    suggestedPriceRange: { min: 2000, max: 15000, currency: 'BRL' }
  },
  {
    id: 'yt_tutorial_howto',
    name: 'Tutorial "Como Fazer"',
    slug: 'yt-tutorial',
    category: 'content',
    difficulty: 'medium',
    horizon: 'medium',
    primarySide: 'both',
    mainGoal: 'education',
    typicalDuration: '10 Dias',
    memberBenefit: 'Conteúdo Evergreen',
    supportedPlatforms: ['long_form'],
    deliverables: ['1x Segmento Tutorial Integrado (3-5min)', 'Comentário Fixado'],
    metrics: ['Tráfego de Busca', 'Salvamentos'],
    baseCopy: 'Para conseguir [Resultado], eu uso a [Marca] porque...',
    baseBriefing: 'Ensine uma habilidade valiosa. Use a [Marca] como a ferramenta que torna isso possível ou mais fácil. O valor deve estar na lição, não apenas no anúncio.',
    howItWorks: ['Aprovação de Conceito', 'Gravação', 'Edição', 'Publicação'],
    proofRequirements: ['Link do Vídeo'],
    aiAutoGenerate: false,
    version: 1,
    isActive: true,
    suggestedPriceRange: { min: 800, max: 6000, currency: 'BRL' }
  },
  {
    id: 'yt_comparison_battle',
    name: 'Batalha Comparativa (Versus)',
    slug: 'yt-versus',
    category: 'conversion',
    difficulty: 'medium',
    horizon: 'medium',
    primarySide: 'brand',
    mainGoal: 'differentiation',
    typicalDuration: '2 Semanas',
    memberBenefit: 'Alto CTR',
    supportedPlatforms: ['long_form'],
    deliverables: ['1x Segmento Comparando Soluções', 'Link na Bio'],
    metrics: ['CTR', 'Vendas'],
    baseCopy: 'Por que troquei [Concorrente/Velho Jeito] pela [Marca]...',
    baseBriefing: 'Compare o jeito antigo de fazer as coisas vs usando a [Marca]. Destaque velocidade, custo ou qualidade. Seja respeitoso mas claro sobre as vantagens.',
    howItWorks: ['Diferenciais Chave', 'Gravação', 'Publicação'],
    proofRequirements: ['Link do Vídeo'],
    aiAutoGenerate: false,
    version: 1,
    isActive: true,
    suggestedPriceRange: { min: 1000, max: 8000, currency: 'BRL' }
  },

  // --- LONG TERM (ADVOCACY / LOYALTY) ---
  {
    id: 'yt_brand_ambassador_q',
    name: 'Embaixador Trimestral',
    slug: 'yt-ambassador',
    category: 'loyalty',
    difficulty: 'high',
    horizon: 'long',
    primarySide: 'creator',
    mainGoal: 'authority',
    typicalDuration: '3 Meses',
    memberBenefit: 'Receita Recorrente',
    supportedPlatforms: ['long_form', 'shorts', 'community_post'],
    deliverables: ['3x Vídeos Integrados (1/mês)', '3x Shorts de Lembrete', 'Presença na Comunidade'],
    metrics: ['Brand Lift', 'LTV'],
    baseCopy: 'Orgulho de ser parceiro da [Marca] nesta temporada...',
    baseBriefing: 'Você é a cara da marca neste trimestre. Queremos menções consistentes. Torne-se um power user do produto e compartilhe atualizações ao longo do tempo.',
    howItWorks: ['Assinatura de Contrato', 'Check-ins Mensais', 'Liberdade Criativa'],
    proofRequirements: ['Relatório Mensal'],
    aiAutoGenerate: false,
    version: 3,
    isActive: true,
    suggestedPriceRange: { min: 5000, max: 50000, currency: 'BRL' }
  },
  {
    id: 'yt_series_sponsor',
    name: 'Patrocínio de Série',
    slug: 'yt-series',
    category: 'awareness',
    difficulty: 'medium',
    horizon: 'long',
    primarySide: 'brand',
    mainGoal: 'recall',
    typicalDuration: '4-6 Vídeos',
    memberBenefit: 'Estabilidade',
    supportedPlatforms: ['long_form'],
    deliverables: ['Intro "Apresentado Por" em 4 vídeos', '30s Mid-roll em 4 vídeos', 'Logo na Thumbnail'],
    metrics: ['Frequência', 'Recall'],
    baseCopy: 'Esta série é possível graças à [Marca]...',
    baseBriefing: 'Patrocine uma mini-série inteira (ex: "Construindo uma Casa" ou "Aprenda a Programar"). Sua marca viabiliza esse conteúdo. Alto valor sentimental.',
    howItWorks: ['Conceito da Série', 'Entrega de Assets', 'Lançamento Sequencial'],
    proofRequirements: ['Link da Playlist'],
    aiAutoGenerate: false,
    version: 1,
    isActive: true,
    suggestedPriceRange: { min: 4000, max: 30000, currency: 'BRL' }
  },
  {
    id: 'yt_live_marathon',
    name: 'Takeover de Live (Maratona)',
    slug: 'yt-live-takeover',
    category: 'engagement',
    difficulty: 'high',
    horizon: 'short', // Technically short duration but long prep
    primarySide: 'creator',
    mainGoal: 'interaction',
    typicalDuration: 'Live de 4h',
    memberBenefit: 'Status de Evento',
    supportedPlatforms: ['live'],
    deliverables: ['Logo no Overlay (4h)', 'Comandos no ChatBot', 'Sorteio de Produto ao Vivo', 'Replay VOD'],
    metrics: ['Pico de Simultâneos', 'Velocidade do Chat'],
    baseCopy: 'Digite !marca no chat para participar do sorteio!',
    baseBriefing: 'Um evento de stream dedicado. Unboxing ao vivo, jogando com o produto ou um desafio patrocinado. Deve incluir um sorteio para explodir o engajamento.',
    howItWorks: ['Agenda do Evento', 'Check Técnico', 'Go Live', 'Envio de Prêmios'],
    proofRequirements: ['VOD da Stream', 'Log do Chat'],
    aiAutoGenerate: false,
    version: 1,
    isActive: true,
    suggestedPriceRange: { min: 1000, max: 10000, currency: 'BRL' }
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Diretor de Marketing', email: 'brand@store.com', role: 'brand', avatarUrl: 'https://ui-avatars.com/api/?name=Brand&background=0f0f0f&color=fff', createdAt: '2023-01-01' },
  { id: 'u2', name: 'Creator Lifestyle', email: 'creator@yt.com', role: 'community', avatarUrl: 'https://ui-avatars.com/api/?name=Creator&background=FF0000&color=fff', createdAt: '2023-01-02' },
  { id: 'u3', name: 'Admin', email: 'admin@sponstube.com', role: 'staff', avatarUrl: '', createdAt: '2023-01-03' }
];

// --- DIVERSE COMMUNITIES (CHANNELS) ---
export const MOCK_COMMUNITIES: Community[] = [
  { 
    id: 'c1', 
    name: 'Bella Makeup & Life', 
    slug: 'bella-makeup', 
    description: 'Tutoriais de maquiagem, vlogs de rotina e dicas de skincare. Público 90% feminino engajado em autocuidado.', 
    platforms: ['long_form', 'shorts'], 
    size: 850000, 
    engagementRate: 9.2, 
    tags: ['Beauty', 'Lifestyle', 'Fashion'], 
    verificationStatus: 'verified',
    verificationMethod: 'api', 
    riskLevel: 'low', 
    growthRate: 15, 
    qualityScore: 9.9, 
    churnRate: 0, 
    city: 'Rio de Janeiro', 
    country: 'Brasil', 
    pricingStyle: 'fixed',
    youtubeStats: {
        avgViews: 120000,
        avgDuration: "18:00",
        demographics: "Mulheres 18-34 (85%)",
        cpm: 35
    },
    socialProof: [{ name: 'Sephora', quote: 'Esgotou o estoque em 24h.', role: 'Marketing', type: 'Sponsor' }]
  },
  {
    id: 'c2', 
    name: 'SpeedRun King', 
    slug: 'speedrun-king', 
    description: 'Gameplay de alta performance, speedruns e desafios de jogos indie e AAA.',
    platforms: ['live', 'shorts'], 
    size: 2100000, 
    engagementRate: 14.5, 
    tags: ['Gaming', 'Esports', 'Entertainment'], 
    verificationStatus: 'verified',
    verificationMethod: 'api', 
    riskLevel: 'low', 
    growthRate: 8, 
    qualityScore: 9.2, 
    churnRate: 0, 
    city: 'São Paulo', 
    country: 'Brasil', 
    pricingStyle: 'range',
    youtubeStats: {
        avgViews: 450000,
        avgDuration: "25:00",
        demographics: "Homens 16-28",
        cpm: 15
    },
    socialProof: []
  },
  {
    id: 'c3',
    name: 'Organiza Comigo',
    slug: 'organiza-comigo',
    description: 'Dicas de organização da casa, limpeza (Clean With Me) e decoração DIY.',
    platforms: ['long_form', 'community_post'],
    size: 320000,
    engagementRate: 7.8,
    tags: ['Home', 'DIY', 'Lifestyle'],
    verificationStatus: 'verified',
    verificationMethod: 'api',
    riskLevel: 'low',
    growthRate: 5,
    qualityScore: 9.0,
    churnRate: 0,
    city: 'Curitiba',
    country: 'Brasil',
    pricingStyle: 'custom',
    youtubeStats: {
        avgViews: 55000,
        avgDuration: "15:00",
        demographics: "Mulheres 25-50",
        cpm: 40
    },
    socialProof: []
  },
  {
    id: 'c4',
    name: 'Investidor Moderno',
    slug: 'invest-mod',
    description: 'Educação financeira, review de cartões de crédito e apps de investimento.',
    platforms: ['long_form'],
    size: 150000,
    engagementRate: 6.5,
    tags: ['Finance', 'Business', 'Education'],
    verificationStatus: 'verified',
    verificationMethod: 'api',
    riskLevel: 'medium',
    growthRate: 10,
    qualityScore: 9.5,
    churnRate: 0,
    city: 'Belo Horizonte',
    country: 'Brasil',
    pricingStyle: 'fixed',
    youtubeStats: {
        avgViews: 25000,
        avgDuration: "12:00",
        demographics: "Homens 25-45",
        cpm: 80
    },
    socialProof: []
  }
];

// --- DIVERSE BRANDS ---
export const MOCK_BRANDS: BrandProfile[] = [
  {
    id: 'b1', 
    companyName: 'Urban Kicks', 
    industry: 'E-commerce / Moda', 
    size: 'sme', 
    objectiveTags: ['conversion', 'sales'],
    toneOfVoice: 'Descolado & Energético', 
    metrics: { totalCampaigns: 45, totalCommunities: 12, avgNps: 88, avgCpa: 45, avgCtr: 2.8 },
    city: 'São Paulo', 
    country: 'Brasil', 
    description: 'A maior loja de streetwear e sneakers exclusivos do Brasil.',
    mediaBudgetRange: { min: 2000, max: 20000, currency: 'BRL' }
  },
  {
    id: 'b2', 
    companyName: 'GamerFuel', 
    industry: 'Alimentos & Bebidas', 
    size: 'enterprise', 
    objectiveTags: ['awareness', 'reach'],
    toneOfVoice: 'Agressivo & Divertido', 
    metrics: { totalCampaigns: 200, totalCommunities: 80, avgNps: 92, avgCpa: 15, avgCtr: 1.5 },
    city: 'Los Angeles', 
    country: 'EUA', 
    description: 'Bebidas energéticas projetadas para foco e tempo de reação.',
    mediaBudgetRange: { min: 50000, max: 750000, currency: 'BRL' }
  },
  {
    id: 'b3', 
    companyName: 'FinWise App', 
    industry: 'Fintech', 
    size: 'startup', 
    objectiveTags: ['install', 'trust'],
    toneOfVoice: 'Confiável & Inteligente', 
    metrics: { totalCampaigns: 15, totalCommunities: 5, avgNps: 70, avgCpa: 60, avgCtr: 3.2 },
    city: 'São Paulo', 
    country: 'Brasil', 
    description: 'Organize suas finanças e invista com inteligência artificial.',
    mediaBudgetRange: { min: 5000, max: 30000, currency: 'BRL' }
  }
];

// GENERATE DATES FOR SLOTS
const today = new Date();
const getFutureDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

// --- RICH MOCK CAMPAIGNS FOR KANBAN TESTING ---
export const MOCK_CAMPAIGNS: Campaign[] = [
  // 1. APPLIED (Waiting for Brand Approval)
  {
    id: 'cmp_applied_1', 
    brandId: 'b1', 
    name: 'Lançamento Jordan Retro - Review', 
    status: 'applied', 
    brief: 'Estamos lançando o novo Jordan. Precisamos de um review detalhado focado nos detalhes do couro e conforto.',
    budgetTotal: 1500, 
    templatesUsedIds: ['yt_shorts_viral_spark'], 
    createdAt: getFutureDate(-2),
    priceMin: 1500,
    measurementPack: generateMeasurementPack('campaign', 'cmp_applied_1', 'JordanLaunch')
  },
  // 2. APPROVED (Brand accepted, waiting for Escrow deposit)
  {
    id: 'cmp_approved_1', 
    brandId: 'b3', 
    name: 'FinWise - Dicas de Economia', 
    status: 'approved', 
    brief: 'Vídeo sobre "Como sair das dívidas". Integrar o app FinWise como a solução para organizar os gastos.',
    budgetTotal: 3000, 
    templatesUsedIds: ['yt_tutorial_howto'], 
    createdAt: getFutureDate(-5),
    priceMin: 3000
  },
  // 3. RUNNING (Funded, Creator needs to submit proof)
  {
    id: 'cmp_running_1', 
    brandId: 'b2', 
    name: 'GamerFuel - Live Stream Marathon', 
    status: 'running', 
    brief: 'Beber GamerFuel durante a live de 4h. Logo no overlay. Comando !fuel no chat.',
    budgetTotal: 5000, 
    templatesUsedIds: ['yt_live_marathon'], 
    createdAt: getFutureDate(-10),
    priceMin: 5000,
    measurementPack: generateMeasurementPack('campaign', 'cmp_running_1', 'GamerFuelLive')
  },
  // 4. AWAITING REPORT (Proof submitted, Brand reviewing)
  {
    id: 'cmp_review_1', 
    brandId: 'b1', 
    name: 'Haul de Verão - Shorts', 
    status: 'awaiting_report', 
    brief: 'Montando 3 looks com tênis da Urban Kicks. Foco em transição rápida.',
    budgetTotal: 800, 
    templatesUsedIds: ['yt_shorts_viral_spark'], 
    createdAt: getFutureDate(-12),
    priceMin: 800
  },
  // 5. COMPLETED (Paid)
  {
    id: 'cmp_done_1', 
    brandId: 'b3', 
    name: 'Investindo com R$ 100', 
    status: 'completed', 
    brief: 'Tutorial prático de como começar a investir usando o app.',
    budgetTotal: 2500, 
    templatesUsedIds: ['yt_integrated_shoutout'], 
    createdAt: getFutureDate(-30),
    priceMin: 2500
  }
];

export const MOCK_COMMUNITY_OFFERS: CommunityOffer[] = [
  {
    id: 'off1', communityId: 'c1', name: 'Combo: Get Ready With Me + Link', category: 'conversion', description: 'Vou usar seu produto durante meu vídeo de preparação (GRWM). Link nos primeiros 30s.',
    priceMin: 2500, deliverables: ['1x Integração (60s)', 'Link na Bio', 'Post na Comunidade'], level: 'pro', currency: 'BRL',
    measurementPack: generateMeasurementPack('offer', 'off1', 'GRWM Promo'),
    platforms: ['long_form'],
    type: 'slot',
    availableSlots: [
        { date: getFutureDate(3), isBooked: true },
        { date: getFutureDate(10), isBooked: false },
        { date: getFutureDate(17), isBooked: false, priceModifier: 1.2 }, // Peak
        { date: getFutureDate(24), isBooked: false }
    ]
  },
  {
    id: 'off2', communityId: 'c2', name: 'Shout-out na Live (Sexta-feira)', category: 'awareness', description: 'Vou falar da sua marca por 2 minutos durante o horário de pico da live de sexta.',
    priceMin: 1200, deliverables: ['Menção ao Vivo', 'Logo na Tela', 'Comando no Chat'], level: 'basic', currency: 'BRL',
    measurementPack: generateMeasurementPack('offer', 'off2', 'Live Shout'),
    platforms: ['live'],
    type: 'slot',
    availableSlots: [
        { date: getFutureDate(5), isBooked: false },
        { date: getFutureDate(12), isBooked: false },
    ]
  },
  {
    id: 'off3', communityId: 'c3', name: 'Transformação do Espaço (Sala)', category: 'content', description: 'Vídeo dedicado reformando um ambiente usando seus produtos de decoração/móveis.',
    priceMin: 8000, deliverables: ['Vídeo Dedicado (15min)', 'Shorts de Antes/Depois', 'Link Afiliado'], level: 'premium', currency: 'BRL',
    measurementPack: generateMeasurementPack('offer', 'off3', 'Room Makeover'),
    platforms: ['long_form', 'shorts'],
    type: 'season',
    seasonDuration: '1 Mês',
    recurrence: 'Único'
  }
];

export const MOCK_BRAND_PACKS: BrandPack[] = [
  {
    id: 'brief_1', brandId: 'b1', name: 'Lançamento Coleção Streetwear', objective: 'sales', description: 'Procuramos canais de moda masculina e streetwear para unboxing de tênis.',
    budgetMin: 2000, kpis: ['Vendas (Cupom)', 'Views'], level: 'standard',
    measurementPack: generateMeasurementPack('campaign', 'brief_1', 'Streetwear Drop')
  },
  {
    id: 'brief_2', brandId: 'b2', name: 'Patrocínio Camp. CS:GO', objective: 'awareness', description: 'Queremos patrocinar streamers que narram ou jogam campeonatos de FPS.',
    budgetMin: 5000, kpis: ['CCV (Simultâneos)', 'Chat Mentions'], level: 'standard',
    measurementPack: generateMeasurementPack('campaign', 'brief_2', 'Esports Sponsor')
  },
  {
    id: 'brief_3', brandId: 'b3', name: 'Desafio: 1 Semana Sem Gastar', objective: 'content', description: 'Canais de lifestyle/vlog. Tente passar a semana economizando e usando o FinWise para trackear.',
    budgetMin: 3500, kpis: ['Retenção', 'Novos Cadastros'], level: 'standard',
    measurementPack: generateMeasurementPack('campaign', 'brief_3', 'Economy Challenge')
  }
];

export const MOCK_ASSETS: Asset[] = [];
export const MOCK_PAYMENTS: Payment[] = [];
export const MOCK_EXECUTIONS: Execution[] = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
export const MOCK_CAMPAIGN_MATCHES: CampaignMatch[] = [];
