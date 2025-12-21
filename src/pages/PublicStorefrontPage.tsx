
import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { 
  Share2, MapPin, CheckCircle2, ArrowLeft,
  Link as LinkIcon, Package, PlayCircle, BarChart3, 
  Youtube, Instagram, Twitter, Smartphone, Calendar as CalendarIcon,
  ShoppingBag, ShieldCheck, Crown, Users as UsersIcon, Clock, Star, Video, Award, Globe, Activity
} from 'lucide-react';
import { 
  Button, Card, CardContent, Badge, SectionTitle, YouTubeBadge 
} from '../components/Common';
import { 
  VerificationBadge, TrustBadgeGroup
} from '../components/Trust';
import { 
  MOCK_BRANDS, MOCK_COMMUNITIES, MOCK_COMMUNITY_OFFERS, MOCK_BRAND_PACKS
} from '../mockData';
import { Role, InventorySlot } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { navigateTo } from '../utils/navigation';

// --- COMPONENTS ---

const StatBox = ({ label, value, sub, highlight }: { label: string, value: string, sub?: string, highlight?: boolean }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">{label}</span>
    <span className={`text-2xl font-bold ${highlight ? 'text-[#FF0000]' : 'text-white'}`}>{value}</span>
    {sub && <span className="text-xs text-[#606060] font-medium">{sub}</span>}
  </div>
);

const TabButton = ({ active, label, onClick, icon: Icon }: { active: boolean, label: string, onClick: () => void, icon?: any }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wide border-b-2 transition-all
      ${active 
        ? 'border-[#FF0000] text-white' 
        : 'border-transparent text-[#AAAAAA] hover:text-white hover:border-[#333]'}
    `}
  >
    {Icon && <Icon size={16} className={active ? 'text-[#FF0000]' : ''} />}
    {label}
  </button>
);

const ReputationCard = ({ label, value, icon: Icon, sub, color = "text-white" }: { label: string, value: string, icon: any, sub?: string, color?: string }) => (
  <div className="bg-[#1F1F1F] border border-[#333] p-5 rounded-xl flex items-center gap-4 hover:border-[#555] transition-colors">
    <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#AAAAAA]">
      <Icon size={22} />
    </div>
    <div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-[10px] text-[#888] font-bold uppercase tracking-wider">{label}</div>
      {sub && <div className="text-xs text-[#666] mt-0.5">{sub}</div>}
    </div>
  </div>
);

// --- SECTIONS ---

const PerformanceSection = () => {
  const data = [
    { name: 'Jan', views: 45000 },
    { name: 'Feb', views: 52000 },
    { name: 'Mar', views: 48000 },
    { name: 'Apr', views: 61000 },
    { name: 'May', views: 55000 },
    { name: 'Jun', views: 67000 },
    { name: 'Jul', views: 72000 },
    { name: 'Aug', views: 85000 },
  ];

  return (
    <Card className="bg-[#1F1F1F] border-[#333] mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-end mb-6">
           <div>
              <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2 mb-1">
                <Activity size={16} className="text-[#FF0000]" /> Channel Performance
              </h4>
              <p className="text-xs text-[#888]">Monthly Views (Last 90 Days)</p>
           </div>
           <div className="text-right">
              <div className="text-2xl font-bold text-white">85.2K</div>
              <div className="text-xs text-emerald-500 font-bold uppercase">+12% Growth</div>
           </div>
        </div>
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                 <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#FF0000" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#FF0000" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                 <XAxis dataKey="name" stroke="#606060" fontSize={12} tickLine={false} axisLine={false} />
                 <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0F0F0F', borderColor: '#333', color: '#fff' }} 
                    itemStyle={{ color: '#FF0000' }}
                 />
                 <Area type="monotone" dataKey="views" stroke="#FF0000" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const DemographicsSection = () => {
  const genderData = [{ name: 'Male', value: 75 }, { name: 'Female', value: 25 }];
  const ageData = [
    { name: '18-24', value: 20 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 25 },
    { name: '45+', value: 10 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <Card className="bg-[#1F1F1F] border-[#333]">
        <CardContent className="p-6">
          <h4 className="text-sm font-bold text-white uppercase mb-6 flex items-center gap-2">
            <UsersIcon size={16} className="text-[#AAAAAA]" /> Audience Gender
          </h4>
          <div className="h-48 flex items-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                   <Pie data={genderData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      <Cell fill="#3B82F6" />
                      <Cell fill="#EC4899" />
                   </Pie>
                   <RechartsTooltip contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
             </ResponsiveContainer>
             <div className="space-y-2 ml-4">
                <div className="flex items-center gap-2 text-sm text-[#AAAAAA]"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Male (75%)</div>
                <div className="flex items-center gap-2 text-sm text-[#AAAAAA]"><div className="w-3 h-3 rounded-full bg-pink-500"></div> Female (25%)</div>
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1F1F1F] border-[#333]">
        <CardContent className="p-6">
          <h4 className="text-sm font-bold text-white uppercase mb-6 flex items-center gap-2">
            <BarChart3 size={16} className="text-[#AAAAAA]" /> Age Distribution
          </h4>
          <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData}>
                   <XAxis dataKey="name" stroke="#606060" fontSize={12} tickLine={false} axisLine={false} />
                   <Bar dataKey="value" fill="#FF0000" radius={[4, 4, 0, 0]} barSize={40} />
                   <RechartsTooltip cursor={{fill: '#2a2a2a'}} contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #333', borderRadius: '8px' }} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PastSponsorsSection = () => (
  <div className="mb-12">
    <SectionTitle title="Trusted By" />
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 opacity-70">
       {['Notion', 'Shopify', 'Vercel', 'Epidemic', 'Skillshare'].map((brand, i) => (
          <div key={i} className="h-16 bg-[#1F1F1F] border border-[#333] rounded-xl flex items-center justify-center font-bold text-[#666] uppercase hover:text-white hover:border-[#555] transition-all cursor-default">
             {brand}
          </div>
       ))}
    </div>
  </div>
);

// --- INVENTORY ITEM ---

interface InventoryItemProps {
  item: any;
  onBook: (item: any) => void;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ item, onBook }) => {
    const { formatCurrency } = useCurrency();
    const isSeason = item.type === 'season';
    
    // Determine icon based on category/name
    let Icon = Video;
    if (item.name.toLowerCase().includes('short')) Icon = Smartphone;
    if (item.name.toLowerCase().includes('live')) Icon = Activity;
    if (item.name.toLowerCase().includes('post')) Icon = ShoppingBag;

    // Fallback slots if mock data is missing
    const slots: InventorySlot[] = item.availableSlots || [
        { date: '2023-11-15', isBooked: false },
        { date: '2023-11-22', isBooked: false },
        { date: '2023-11-29', isBooked: true },
    ];

    return (
        <div className={`
            group relative bg-[#1F1F1F] border border-[#333] rounded-xl overflow-hidden flex flex-col hover:border-[#555] transition-all hover:-translate-y-1 hover:shadow-xl
            ${isSeason ? 'border-amber-500/30 bg-amber-950/10' : ''}
        `}>
            {/* Header */}
            <div className="p-5 border-b border-[#333] flex justify-between items-start bg-[#252525]/50">
                <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSeason ? 'bg-amber-900/30 text-amber-500' : 'bg-[#333] text-white'}`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        {isSeason && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                                <Crown size={12} /> Season Pass
                            </div>
                        )}
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#FF0000] transition-colors line-clamp-1">{item.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-[#888]">
                            {item.platforms?.map((p: string) => (
                                <span key={p} className="capitalize flex items-center gap-1"><Youtube size={12}/> {p}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Deliverables */}
            <div className="p-5 flex-1 space-y-4">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider">Includes</p>
                    <ul className="space-y-2">
                        {item.deliverables?.slice(0, 3).map((d: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#CCC]">
                                <CheckCircle2 size={14} className="text-[#FF0000] shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{d}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#333]">
                    <div>
                        <p className="text-[10px] font-bold text-[#666] uppercase">Exposure</p>
                        <p className="text-sm font-bold text-white">~{(item.priceMin * 0.04).toFixed(0)}k Views</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#666] uppercase">Format</p>
                        <p className="text-sm font-bold text-white capitalize">{item.type || 'Single Slot'}</p>
                    </div>
                </div>
            </div>

            {/* Pricing & CTA */}
            <div className="p-4 bg-[#111] border-t border-[#333] flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-[#666] uppercase font-bold">Base Price</p>
                    <p className={`text-xl font-mono font-bold ${isSeason ? 'text-amber-400' : 'text-white'}`}>
                        {formatCurrency(item.priceMin)}
                    </p>
                </div>
                <Button size="sm" className={`${isSeason ? 'bg-amber-600 hover:bg-amber-500' : 'bg-[#FF0000] hover:bg-[#CC0000]'} text-white border-transparent px-6`} onClick={() => onBook(item)}>
                    {isSeason ? 'Negotiate' : 'Book'}
                </Button>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

interface PublicStorefrontProps {
  mode: 'brand' | 'community';
  slug: string;
}

export default function PublicStorefrontPage({ mode, slug }: PublicStorefrontProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'sponsorships' | 'portfolio'>('overview');
  const isCommunity = mode === 'community';
  const { formatCurrency } = useCurrency();

  // Data Lookup
  const data = useMemo(() => {
    let profile, items;
    if (isCommunity) {
      profile = MOCK_COMMUNITIES.find(c => c.slug === slug || c.id === slug) || MOCK_COMMUNITIES[0];
      items = MOCK_COMMUNITY_OFFERS.filter(o => o.communityId === profile.id);
      if (items.length === 0) items = MOCK_COMMUNITY_OFFERS.slice(0, 3);
    } else {
      profile = MOCK_BRANDS.find(b => b.id === slug || b.companyName.toLowerCase().includes(slug)) || MOCK_BRANDS[0];
      items = MOCK_BRAND_PACKS.filter(p => p.brandId === profile.id);
      if (items.length === 0) items = MOCK_BRAND_PACKS.slice(0, 3);
    }
    return { profile, items };
  }, [mode, slug]);

  const handleBook = (item?: any) => {
      const targetRole = mode === 'brand' ? 'community' : 'brand';
      const slotId = item?.id || 'general';
      const slotName = item?.name || 'Inquiry';
      const returnUrl = encodeURIComponent(`/app/campaigns?action=create&source=storefront&slotId=${slotId}&slotName=${slotName}&targetId=${data.profile?.id}`);
      navigateTo(`/auth?mode=signup&role=${targetRole}&returnTo=${returnUrl}`);
  };

  if (!data.profile) return <div>Not Found</div>;

  const { profile, items } = data;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F1F1F1] font-sans">
       {/* 1. CHANNEL BANNER */}
       <div className="h-48 md:h-80 w-full bg-[#1F1F1F] relative overflow-hidden group">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-700"
            style={{ backgroundImage: `url(https://source.unsplash.com/random/1600x400?tech,studio&sig=${profile.id})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-transparent"></div>
          
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
             <button onClick={() => navigateTo('/app/marketplace')} className="flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-bold transition-all border border-white/10">
                <ArrowLeft size={16} /> Back to Search
             </button>
             <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link Copied!'); }} className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md border border-white/10">
                <Share2 size={18} />
             </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
             <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-8">
                <div className="relative mb-2">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0F0F0F] bg-[#1F1F1F] overflow-hidden shadow-2xl relative z-10">
                       {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#333]">{profile.name?.[0]}</div>}
                    </div>
                    {isCommunity && (
                       <div className="absolute bottom-2 right-2 z-20 bg-[#0F0F0F] rounded-full p-1.5 border border-[#333]">
                          <VerificationBadge status={profile.verificationStatus} />
                       </div>
                    )}
                </div>
                
                <div className="flex-1 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                           {isCommunity ? profile.name : profile.companyName}
                        </h1>
                        {isCommunity && <YouTubeBadge className="h-fit" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-[#CCC]">
                       <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#666]" />
                          <span>{profile.city || 'São Paulo'}, {profile.country || 'Brasil'}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Globe size={16} className="text-[#666]" />
                          <span>PT-BR (Native)</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Video size={16} className="text-[#666]" />
                          <span>4 Videos / Month</span>
                       </div>
                    </div>
                </div>

                <div className="pb-4 hidden md:flex gap-3">
                   <Button className="bg-[#FF0000] hover:bg-[#CC0000] text-white border-transparent shadow-lg shadow-red-900/20" onClick={() => setActiveTab('sponsorships')}>
                      View Media Kit
                   </Button>
                </div>
             </div>
          </div>
       </div>

       {/* 3. NAVIGATION TABS */}
       <div className="sticky top-0 z-30 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#333] mb-8">
          <div className="max-w-7xl mx-auto px-6 flex gap-2 overflow-x-auto scrollbar-hide">
             <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={BarChart3} />
             <TabButton label="Sponsorships" active={activeTab === 'sponsorships'} onClick={() => setActiveTab('sponsorships')} icon={ShoppingBag} />
             <TabButton label="Portfolio" active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} icon={PlayCircle} />
          </div>
       </div>

       {/* 4. CONTENT AREA */}
       <div className="max-w-7xl mx-auto px-6 pb-20 min-h-[500px]">
          {activeTab === 'overview' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/* Left Column: Stats & Performance */}
                   <div className="lg:col-span-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                         <Card className="bg-[#1F1F1F] border-[#333]">
                            <CardContent className="p-6">
                               <StatBox 
                                  label={isCommunity ? "Subscribers" : "Active Campaigns"} 
                                  value={isCommunity ? "1.2M" : "12"} 
                                  sub={isCommunity ? "+15K last 30d" : undefined}
                                  highlight
                               />
                            </CardContent>
                         </Card>
                         <Card className="bg-[#1F1F1F] border-[#333]">
                            <CardContent className="p-6">
                               <StatBox label="Avg. Views" value="85.2K" sub="last 90d" />
                            </CardContent>
                         </Card>
                         <Card className="bg-[#1F1F1F] border-[#333]">
                            <CardContent className="p-6">
                               <StatBox label="Engagement" value="8.5%" sub="High" />
                            </CardContent>
                         </Card>
                         <Card className="bg-[#1F1F1F] border-[#333]">
                            <CardContent className="p-6">
                               <StatBox label="Quality Score" value="9.8" sub="/ 10.0" highlight />
                            </CardContent>
                         </Card>
                      </div>

                      <PerformanceSection />
                      <DemographicsSection />
                   </div>

                   {/* Right Column: Bio & Trust */}
                   <div className="space-y-8">
                      <Card className="bg-[#1F1F1F] border-[#333]">
                         <CardContent className="p-6">
                            <h4 className="text-sm font-bold text-white uppercase mb-4">About Channel</h4>
                            <p className="text-[#AAA] text-sm leading-relaxed mb-6">
                               {profile.description || "Tech enthusiast sharing the latest in gadgets, coding, and lifestyle. Helping brands connect with a highly engaged Gen-Z audience."}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                               {['Tech Reviews', 'Unboxing', 'Tutorials', 'Vlogs'].map(t => (
                                  <span key={t} className="px-3 py-1 bg-[#111] border border-[#333] rounded-full text-xs text-[#AAA]">{t}</span>
                               ))}
                            </div>
                            <div className="flex gap-4 border-t border-[#333] pt-4">
                               <Youtube size={20} className="text-[#AAA] hover:text-white cursor-pointer" />
                               <Instagram size={20} className="text-[#AAA] hover:text-white cursor-pointer" />
                               <Twitter size={20} className="text-[#AAA] hover:text-white cursor-pointer" />
                            </div>
                         </CardContent>
                      </Card>

                      <div>
                         <SectionTitle title="Reputation" />
                         <div className="space-y-3">
                            <ReputationCard label="On-Time Delivery" value="100%" icon={Clock} sub="Always hits deadlines" color="text-emerald-500" />
                            <ReputationCard label="Avg Brand Rating" value="4.9" icon={Star} sub="Based on 12 reviews" color="text-amber-500" />
                            <ReputationCard label="Total Campaigns" value="42" icon={CheckCircle2} sub="Completed successfully" />
                         </div>
                      </div>

                      <div>
                         <SectionTitle title="Verification" />
                         <div className="bg-[#1F1F1F] border border-[#333] rounded-xl p-6">
                            <TrustBadgeGroup badges={['identity', 'payment', 'escrow', 'quality']} />
                         </div>
                      </div>
                   </div>
                </div>

                <PastSponsorsSection />
             </div>
          )}

          {activeTab === 'sponsorships' && (
             <div className="animate-in fade-in">
                <div className="flex justify-between items-end mb-8">
                   <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Sponsorship Formats</h2>
                      <p className="text-[#888]">Standardized inventory ready for instant booking.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {items.length === 0 ? (
                       <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#606060]">
                           <Package size={48} className="mb-4 opacity-20" />
                           <p>No inventory available.</p>
                       </div>
                   ) : (
                       items.map(item => (
                           <InventoryItem key={item.id} item={item} onBook={handleBook} />
                       ))
                   )}
                </div>
             </div>
          )}

          {activeTab === 'portfolio' && (
             <div className="text-center py-20">
                <PlayCircle size={48} className="text-[#333] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Previous Collaborations</h3>
                <p className="text-[#606060]">Access restricted to logged in users.</p>
                <Button variant="outline" className="mt-4" onClick={() => handleBook()}>Login to View</Button>
             </div>
          )}
       </div>

    </div>
  );
}
