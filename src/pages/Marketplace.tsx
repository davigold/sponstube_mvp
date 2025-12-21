
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Users, Package, Briefcase, Layers, ShieldCheck,
  Zap, Info, AlertTriangle, Link as LinkIcon, Image as ImageIcon,
  CheckCircle2, Flag, Save, Bookmark, Trash2, SlidersHorizontal, X,
  ChevronDown, Sparkles, Youtube, PlayCircle, Eye, MonitorPlay, Calendar, DollarSign, Clock,
  BrainCircuit, TrendingUp, Target, Award, ThumbsUp, LayoutGrid, List
} from 'lucide-react';
import { 
  Button, Badge, PageHeader, Select, EmptyState, ListSkeleton, Input, YouTubeBadge, FadeIn, Card 
} from '../components/Common';
import { 
  VerificationBadge, ReputationDisplay, AntiFraudBadges, ReportIssueModal 
} from '../components/Trust';
import { MarketplaceFilters } from '../components/MarketplaceFilters';
import { 
  MOCK_BRANDS, MOCK_BRAND_PACKS, MOCK_COMMUNITIES, MOCK_COMMUNITY_OFFERS, getMatchAnalysis, PLATFORM_DICT 
} from '../mockData';
import { FilterState, INITIAL_FILTERS, parseUrlParams, toUrlParams, getSavedViews, saveView, deleteView, SavedView } from '../utils/filterState';
import { Role, Community, BrandProfile } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { navigateTo } from '../utils/navigation';
import { track } from '../utils/track';
import { YouTubeChannelCard, YouTubeBrandCard, YouTubeOfferCard } from '../components/YouTubeCards';

type SearchMode = 'entity' | 'offer';
type ViewLayout = 'grid' | 'list';

// --- DATA FILTERING ENGINE (UNCHANGED LOGIC) ---
const applyFilters = (data: any[], filters: FilterState, role: Role, mode: SearchMode) => {
  return data.filter(item => {
    // 1. Text Query
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const nameMatch = (item.name || item.companyName)?.toLowerCase().includes(q);
      const descMatch = item.description?.toLowerCase().includes(q);
      const tagsMatch = (item.tags || item.objectiveTags || []).some((t: string) => t.toLowerCase().includes(q));
      if (!nameMatch && !descMatch && !tagsMatch) return false;
    }
    // 2. Platforms
    if (filters.platforms.length > 0) {
      const itemPlatforms = item.platforms || [];
      const hasPlatform = filters.platforms.some(p => itemPlatforms.includes(p));
      if (!hasPlatform) return false;
    }
    // 3. Categories
    if (filters.categories.length > 0) {
      const itemCats = [
        ...(item.tags || []),
        ...(item.objectiveTags || []),
        item.category,
        item.industry
      ].filter(Boolean).map(s => s.toLowerCase());
      const hasCategory = filters.categories.some(c => itemCats.some((ic: string) => ic.includes(c.toLowerCase())));
      if (!hasCategory) return false;
    }
    // 4. Verification
    if (filters.verification.length > 0) {
      const status = item.verificationStatus || 'unverified';
      const isPremium = item.qualityScore > 9 || item.level === 'premium';
      const matches = filters.verification.some(v => {
        if (v === 'verified') return status === 'verified';
        if (v === 'unverified') return status !== 'verified';
        if (v === 'premium') return isPremium;
        return false;
      });
      if (!matches) return false;
    }
    // 5. Geo
    if (filters.countries.length > 0) {
      if (!filters.countries.includes(item.country)) return false;
    }
    // 6. Price
    if (filters.minPrice || filters.maxPrice) {
      const price = item.priceMin || item.budgetMin || 0;
      if (filters.minPrice && price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && price > Number(filters.maxPrice)) return false;
    }
    // 7. Size
    if (mode === 'entity' && (filters.minSize || filters.maxSize)) {
      const size = item.size || 0;
      if (filters.minSize && size < Number(filters.minSize)) return false;
      if (filters.maxSize && size > Number(filters.maxSize)) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'newest': return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'rating':
        const scoreA = a.qualityScore || a.metrics?.avgNps || 0;
        const scoreB = b.qualityScore || b.metrics?.avgNps || 0;
        return scoreB - scoreA;
      case 'price_asc': return (a.priceMin || a.budgetMin || 0) - (b.priceMin || b.budgetMin || 0);
      case 'price_desc': return (b.priceMin || b.budgetMin || 0) - (a.priceMin || a.budgetMin || 0);
      default: return (b.id.charCodeAt(b.id.length - 1)) - (a.id.charCodeAt(a.id.length - 1));
    }
  });
};

// --- AI MATCH COMPONENTS ---

const MatchScoreRing = ({ score }: { score: number }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const color = score >= 90 ? '#10B981' : score >= 80 ? '#8B5CF6' : '#F59E0B';

  return (
    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-slate-200 dark:text-slate-800"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-[9px] font-bold text-slate-700 dark:text-white">{score}</span>
    </div>
  );
};

interface SmartMatchCardProps {
  item: any;
  type: 'entity' | 'offer';
  onClick: () => void;
  onAction: (item: any) => void;
}

const SmartMatchCard: React.FC<SmartMatchCardProps> = ({ item, type, onClick, onAction }) => {
  const { formatCurrency } = useCurrency();
  const isEntity = type === 'entity';
  
  // Mock AI Analysis based on item data
  const score = isEntity ? (item.qualityScore * 10) : 92; // Mock score
  const insights = [
    { icon: Target, label: 'Audience', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
    { icon: ShieldCheck, label: 'Brand Safe', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' },
    { icon: DollarSign, label: 'Value', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400' }
  ];

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 rounded-2xl p-4 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Premium Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>

      <div className="flex gap-3 mb-3 relative z-10">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm shrink-0">
             {item.logoUrl ? <img src={item.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">{item.name?.[0] || 'C'}</div>}
          </div>
          
          <div className="flex-1 min-w-0">
             <div className="flex justify-between items-start gap-2">
                 <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight mb-1 group-hover:text-indigo-500 transition-colors truncate">
                   {isEntity ? (item.name || item.companyName) : item.name}
                 </h3>
                 <div className="flex flex-col items-center shrink-0 -mt-1">
                    <MatchScoreRing score={score} />
                 </div>
             </div>
             
             <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2 pr-8">
               {isEntity ? (item.description || item.industry) : (item.description || item.category)}
             </p>
             
             <div className="flex flex-wrap gap-1.5">
                {insights.slice(0, 2).map((insight, idx) => (
                   <div key={idx} className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border border-transparent ${insight.color}`}>
                      <insight.icon size={10} /> {insight.label}
                   </div>
                ))}
             </div>
          </div>
      </div>

      <div className="grid grid-cols-3 gap-2 py-2 border-t border-slate-100 dark:border-slate-800 mb-3 relative z-10 flex-1">
         <div className="text-center">
            <div className="text-[9px] text-slate-400 font-bold uppercase mb-0.5 truncate">Reach</div>
            <div className="font-bold text-slate-700 dark:text-slate-200 text-xs">
               {isEntity ? `${(item.size/1000).toFixed(0)}k` : `~${((item.priceMin || 0)/30).toFixed(0)}k`}
            </div>
         </div>
         <div className="text-center border-l border-slate-100 dark:border-slate-800">
            <div className="text-[9px] text-slate-400 font-bold uppercase mb-0.5 truncate">Trust</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">98%</div>
         </div>
         <div className="text-center border-l border-slate-100 dark:border-slate-800">
            <div className="text-[9px] text-slate-400 font-bold uppercase mb-0.5 truncate">{isEntity ? 'Cost' : 'Price'}</div>
            <div className="font-bold text-slate-700 dark:text-slate-200 text-xs truncate">
               {formatCurrency(item.priceMin || item.budgetMin || 0)}
            </div>
         </div>
      </div>

      <Button 
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-[1.02] transition-transform text-xs h-8" 
        size="sm"
        onClick={(e) => { e.stopPropagation(); onAction(item); }}
      >
        {isEntity ? 'Convidar' : 'Comprar Slot'}
      </Button>
    </div>
  );
};

// --- MAIN PAGE ---

export default function Marketplace({ userRole }: { userRole: Role }) {
  const { t } = useI18n();
  // CHANGED DEFAULT: Start in 'offer' mode to emphasize "Buying Products" over "Searching People"
  const [searchMode, setSearchMode] = useState<SearchMode>('offer'); 
  const [viewLayout, setViewLayout] = useState<ViewLayout>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportEntityName, setReportEntityName] = useState('');
  
  // Saved Views
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [viewNameInput, setViewNameInput] = useState('');
  const [isSavingView, setIsSavingView] = useState(false);
  const [isSavedSearchesOpen, setIsSavedSearchesOpen] = useState(false);
  const savedSearchesRef = useRef<HTMLDivElement>(null);

  const isBrand = userRole === 'brand';

  // Loaders & Sync Logic
  useEffect(() => {
    const params = parseUrlParams(window.location.search);
    if (window.location.search) setFilters(prev => ({ ...prev, ...params }));
    setSavedViews(getSavedViews());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        const queryString = toUrlParams(filters);
        const url = `${window.location.pathname}?${queryString}`;
        try { window.history.replaceState({}, '', url); } catch (e) {}
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (savedSearchesRef.current && !savedSearchesRef.current.contains(event.target as Node)) {
        setIsSavedSearchesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = useMemo(() => {
    const sourceData = isBrand 
      ? (searchMode === 'entity' ? MOCK_COMMUNITIES : MOCK_COMMUNITY_OFFERS)
      : (searchMode === 'entity' ? MOCK_BRANDS : MOCK_BRAND_PACKS);
    return applyFilters(sourceData, filters, userRole, searchMode);
  }, [userRole, searchMode, filters, isBrand]);

  // AI Recommended Items (Top 3 from filtered or generic top 3 if empty query)
  const recommendedItems = useMemo(() => {
      // Logic: Pick high score items or sort by quality score
      const sorted = [...filteredData].sort((a,b) => (b.qualityScore || 0) - (a.qualityScore || 0));
      return sorted.slice(0, 3);
  }, [filteredData]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [filters, searchMode]);

  const handleSaveView = () => {
    if (!viewNameInput) return;
    const updated = saveView(viewNameInput, filters);
    setSavedViews(updated);
    setIsSavingView(false);
    setViewNameInput('');
  };

  const handleLoadView = (view: SavedView) => setFilters(view.filters);
  const handleDeleteView = (id: string) => setSavedViews(deleteView(id));
  const handleReport = (name: string) => { setReportEntityName(name); setReportModalOpen(true); };
  
  // IMPROVED: Handle Invite/Buy Action with Data
  const handleInvite = (item: any) => {
     track('initiate_campaign', { targetId: item.id, role: userRole });
     
     // Construct deep link params
     const params = new URLSearchParams();
     params.set('action', 'create');
     
     if (isBrand) {
         if (searchMode === 'entity') {
             // Inviting a Channel (Creator)
             params.set('communityId', item.id);
             params.set('targetName', item.name);
         } else {
             // Buying an Offer (Slot/Package)
             params.set('communityId', item.communityId);
             params.set('offerId', item.id);
             params.set('offerName', item.name);
             params.set('price', item.priceMin);
             // Pass deliverables if available to pre-fill the scope
             if (item.deliverables && item.deliverables.length > 0) {
                 params.set('deliverables', item.deliverables.join(', '));
             }
         }
     } else {
         // Creator applying to Brand Brief
         params.set('brandId', item.brandId);
         params.set('briefId', item.id);
     }

     navigateTo(`/app/campaigns?${params.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader 
        title={isBrand ? "Busca de Mídia" : "Briefings Abertos"}
        subtitle={isBrand ? "Encontre e contrate canais verificados." : "Encontre oportunidades de patrocínio."}
        action={
            <div className="flex items-center gap-3">
                <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-lg flex items-center border border-slate-200 dark:border-slate-800">
                    <button 
                        onClick={() => setViewLayout('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewLayout === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                        title="Grid View"
                    >
                        <LayoutGrid size={16}/>
                    </button>
                    <button 
                        onClick={() => setViewLayout('list')}
                        className={`p-1.5 rounded-md transition-all ${viewLayout === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                        title="List View"
                    >
                        <List size={16}/>
                    </button>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-lg flex items-center border border-slate-200 dark:border-slate-800">
                    <button 
                        onClick={() => setSearchMode('offer')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${searchMode === 'offer' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        {isBrand ? <Package size={14}/> : <Layers size={14}/>} 
                        {isBrand ? 'Slots (Ofertas)' : 'Briefings'}
                    </button>
                    <button 
                        onClick={() => setSearchMode('entity')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${searchMode === 'entity' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        {isBrand ? <Users size={14}/> : <Briefcase size={14}/>} 
                        {isBrand ? 'Canais' : 'Marcas'}
                    </button>
                </div>
            </div>
        }
      />

      <div className="flex flex-col md:flex-row gap-6 relative">
         {/* SIDEBAR FILTERS */}
         <div className={`
            fixed inset-0 z-40 bg-white dark:bg-slate-900 p-6 overflow-y-auto transition-transform duration-300 md:static md:inset-auto md:w-64 md:translate-x-0 md:bg-transparent md:p-0 md:border-none
            ${showFilters ? 'translate-x-0' : '-translate-x-full'}
         `}>
            {/* Mobile Header for Filters */}
            <div className="flex justify-between items-center mb-6 md:hidden">
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">Filtros</h3>
               <button onClick={() => setShowFilters(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <X size={20} />
               </button>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 md:sticky md:top-20 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin">
                <MarketplaceFilters 
                    filters={filters} 
                    onChange={setFilters} 
                    onClear={() => setFilters(INITIAL_FILTERS)}
                    role={userRole}
                    mode={searchMode}
                />
            </div>
         </div>

         {/* MAIN CONTENT */}
         <div className="flex-1 min-w-0">
            {/* AI RECOMMENDATION SECTION (Only on Grid/Init View) */}
            {isBrand && !isLoading && recommendedItems.length > 0 && viewLayout === 'grid' && (
                <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500">
                            <BrainCircuit size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recomendados para Você</h3>
                            <p className="text-[10px] text-slate-500">Baseado no seu histórico e objetivos de campanha.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendedItems.map((item) => (
                            <SmartMatchCard 
                                key={item.id} 
                                item={item} 
                                type={searchMode} 
                                onClick={() => navigateTo(`/s/${item.slug || item.id}`)}
                                onAction={handleInvite}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={isBrand ? "Buscar canais por palavra-chave (ex: 'Tech Review')..." : "Buscar briefings..."}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                        value={filters.query}
                        onChange={(e) => setFilters({...filters, query: e.target.value})}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <button 
                        className="md:hidden flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg"
                        onClick={() => setShowFilters(true)}
                    >
                        <SlidersHorizontal size={16} /> Filtros
                    </button>
                    
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs font-bold text-slate-500 uppercase">Ordenar:</span>
                        <select 
                            className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                            value={filters.sort}
                            onChange={(e) => setFilters({...filters, sort: e.target.value as any})}
                        >
                            <option value="relevance">Relevância</option>
                            <option value="newest">Recentes</option>
                            <option value="rating">Melhor Avaliados</option>
                            <option value="price_asc">Preço: Menor para Maior</option>
                            <option value="price_desc">Preço: Maior para Menor</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Grid/List */}
            {isLoading ? (
                <ListSkeleton count={6} type={viewLayout === 'list' ? 'row' : 'card'} />
            ) : filteredData.length > 0 ? (
                <div className={viewLayout === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                    {filteredData.map((item: any, idx) => (
                        <FadeIn key={item.id}>
                            <div className="relative group">
                                {/* URGENCY BADGE (CMO REQUEST) - Only show for top 3 items */}
                                {isBrand && idx < 3 && searchMode === 'offer' && viewLayout === 'grid' && (
                                    <div className="absolute top-2 right-2 z-20 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm shadow-md animate-pulse uppercase tracking-wide flex items-center gap-1">
                                        <Clock size={10} /> Limited Slots
                                    </div>
                                )}
                                
                                {searchMode === 'entity' ? (
                                    isBrand ? (
                                        <YouTubeChannelCard 
                                            data={item} 
                                            onClick={() => navigateTo(`/s/${item.slug || item.id}`)}
                                            onAction={handleInvite}
                                            layout={viewLayout}
                                        />
                                    ) : (
                                        <YouTubeBrandCard 
                                            data={item}
                                            onClick={() => navigateTo(`/s/${item.slug || item.id}`)}
                                            onAction={handleInvite}
                                            layout={viewLayout}
                                        />
                                    )
                                ) : (
                                    <YouTubeOfferCard 
                                        item={item} 
                                        type={isBrand ? 'offer' : 'brief'}
                                        onClick={() => navigateTo(`/s/${isBrand ? item.communityId : item.brandId}`)}
                                        onAction={handleInvite}
                                        layout={viewLayout}
                                    />
                                )}
                            </div>
                        </FadeIn>
                    ))}
                </div>
            ) : (
                <EmptyState 
                    icon={Search}
                    title={t('marketplace.empty.title')}
                    description={t('marketplace.empty.desc')}
                    action={
                        <Button variant="secondary" onClick={() => setFilters(INITIAL_FILTERS)}>
                            {t('marketplace.filters.clear')}
                        </Button>
                    }
                />
            )}
         </div>
      </div>

      <ReportIssueModal 
        isOpen={reportModalOpen} 
        onClose={() => setReportModalOpen(false)} 
        entityName={reportEntityName} 
      />
    </div>
  );
}
