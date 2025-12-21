
import React from 'react';
import {
  Users, Eye, Clock, BarChart3, CheckCircle2,
  MonitorPlay, Smartphone, Mic, Radio, PlayCircle,
  MoreHorizontal, ShieldCheck, Youtube, Star, ArrowRight,
  Briefcase, Zap, MapPin
} from 'lucide-react';
import { Card, Button, Badge } from './Common';
import { VerificationBadge, TrustBadge } from './Trust';
import { useCurrency } from '../contexts/CurrencyContext';
import { Community, BrandProfile } from '../types';

// --- STATS ROW ---
export const StatsRow = ({ stats, className = "", layout = 'grid' }: { stats: { label: string, value: string, icon?: any, highlight?: boolean }[], className?: string, layout?: 'grid' | 'list' }) => (
  <div className={`grid ${layout === 'list' ? 'grid-cols-3 gap-4 border-l border-slate-100 dark:border-slate-800 pl-4 ml-4' : 'grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-y border-slate-100 dark:border-slate-800 py-3 my-4'} ${className}`}>
    {stats.map((stat, idx) => (
      <div key={idx} className={layout === 'list' ? "text-left" : "px-2 text-center first:pl-0 last:pr-0"}>
        <div className={`flex items-center ${layout === 'list' ? 'justify-start' : 'justify-center'} gap-1 text-[10px] uppercase font-bold text-slate-400 mb-1`}>
          {stat.icon && <stat.icon size={10} />}
          {stat.label}
        </div>
        <div className={`text-sm font-bold ${stat.highlight ? 'text-[#FF0000]' : 'text-slate-900 dark:text-slate-100'}`}>
          {stat.value}
        </div>
      </div>
    ))}
  </div>
);

// --- FORMAT BADGES ---
export const FormatBadges = ({ platforms }: { platforms: string[] }) => {
  const map: Record<string, { icon: any, label: string, color: string }> = {
    youtube: { icon: MonitorPlay, label: 'Video', color: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' },
    shorts: { icon: Smartphone, label: 'Shorts', color: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' },
    live: { icon: Radio, label: 'Live', color: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
  };

  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map(p => {
        const key = p.toLowerCase();
        const config = map[key] || { icon: PlayCircle, label: p, color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' };
        return (
          <span key={p} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${config.color}`}>
            <config.icon size={10} /> {config.label}
          </span>
        );
      })}
    </div>
  );
};

// --- CHANNEL CARD (CREATOR) ---
export const YouTubeChannelCard = ({
  data,
  onClick,
  onAction,
  layout = 'grid'
}: {
  data: Community,
  onClick?: () => void,
  onAction?: (e: any) => void,
  layout?: 'grid' | 'list'
}) => {
  const bannerUrl = `https://source.unsplash.com/random/600x200?tech,setup&sig=${data.id}`;
  
  const formatK = (n: number) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : n.toString();
  const formatM = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : formatK(n);

  if (layout === 'list') {
      return (
        <div 
            onClick={onClick}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-red-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-row h-40"
        >
            <div className="w-48 relative h-full shrink-0">
                <img src={bannerUrl} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
                        {data.logoUrl ? <img src={data.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">{data.name[0]}</div>}
                    </div>
                </div>
            </div>
            
            <div className="flex-1 p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                        {data.name}
                    </h3>
                    <VerificationBadge status={data.verificationStatus} className="scale-90 origin-left" />
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mb-2">{data.description}</p>
                <div className="flex items-center">
                    <FormatBadges platforms={data.platforms.slice(0,2)} />
                    <StatsRow 
                        layout="list"
                        stats={[
                            { label: 'Subs', value: formatM(data.size), icon: Users },
                            { label: 'Avg Views', value: formatK(data.youtubeStats?.avgViews || data.size * 0.1), icon: Eye, highlight: true },
                            { label: 'CPM', value: `$${data.youtubeStats?.cpm || 25}`, icon: BarChart3 }
                        ]} 
                    />
                </div>
            </div>

            <div className="w-40 border-l border-slate-100 dark:border-slate-800 p-4 flex flex-col justify-center items-center gap-2 bg-slate-50 dark:bg-slate-800/50">
                <Button 
                    size="sm" 
                    variant="secondary" 
                    className="w-full justify-between bg-white dark:bg-slate-700"
                    onClick={(e) => { e.stopPropagation(); onAction && onAction(data); }}
                >
                    <span>View</span>
                    <ArrowRight size={14} />
                </Button>
            </div>
        </div>
      );
  }

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 cursor-pointer flex flex-col h-full relative"
    >
      <div className="h-28 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
         <img src={bannerUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
         <div className="absolute top-2 right-2">
            <VerificationBadge status={data.verificationStatus} />
         </div>
      </div>

      <div className="px-5 pb-5 flex-1 flex flex-col relative pt-12">
         {/* Avatar overlaps banner and content */}
         <div className="absolute -top-10 left-5 z-10">
            <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 overflow-hidden shadow-sm relative">
                {data.logoUrl ? (
                    <img src={data.logoUrl} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-300">{data.name[0]}</div>
                )}
            </div>
         </div>
         
         <div className="absolute top-3 right-5">
             <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase bg-red-600 text-white shadow-sm">
                <Youtube size={10} fill="currentColor" /> YouTuber
             </span>
         </div>

         <div className="mb-4 mt-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors pr-20">
               {data.name}
            </h3>
            {/* Removed fixed height to allow text to fit naturally */}
            <p className="text-xs text-slate-500 line-clamp-2 min-h-[2.5em] leading-relaxed">{data.description}</p>
         </div>

         <StatsRow 
            stats={[
                { label: 'Subscribers', value: formatM(data.size), icon: Users },
                { label: 'Avg Views', value: formatK(data.youtubeStats?.avgViews || data.size * 0.1), icon: Eye, highlight: true },
                { label: 'CPM (Est)', value: `$${data.youtubeStats?.cpm || 25}`, icon: BarChart3 }
            ]} 
         />

         <div className="mb-5">
            <FormatBadges platforms={data.platforms} />
         </div>

         <div className="mt-auto pt-2">
            <Button 
                size="sm" 
                variant="secondary" 
                className="w-full justify-between group-hover:bg-slate-50 dark:group-hover:bg-slate-800"
                onClick={(e) => { e.stopPropagation(); onAction && onAction(data); }}
            >
                <span>View Inventory</span>
                <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Button>
         </div>
      </div>
    </div>
  );
};

// --- BRAND CARD ---
export const YouTubeBrandCard = ({
    data,
    onClick,
    onAction,
    layout = 'grid'
  }: {
    data: BrandProfile,
    onClick?: () => void,
    onAction?: (e: any) => void,
    layout?: 'grid' | 'list'
  }) => {
    const { formatCurrency } = useCurrency();
    const bannerUrl = `https://source.unsplash.com/random/600x200?office,corporate&sig=${data.id}`;
  
    if (layout === 'list') {
        return (
            <div 
                onClick={onClick}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-[#FF0000]/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-row h-40"
            >
                <div className="w-48 relative h-full shrink-0">
                    <img src={bannerUrl} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg border-2 border-white dark:border-slate-900 bg-white dark:bg-slate-800 overflow-hidden shadow-sm flex items-center justify-center">
                            {data.logoUrl ? <img src={data.logoUrl} className="w-full h-full object-cover" /> : <div className="text-xs font-black text-slate-300">{data.companyName[0]}</div>}
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-[#FF0000] transition-colors">
                            {data.companyName}
                        </h3>
                        <Badge variant="brand">{data.industry}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <MapPin size={10} /> {data.city}, {data.country}
                    </p>
                    <div className="flex items-center">
                        <div className="flex flex-wrap gap-2 mr-4">
                            {data.objectiveTags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded-md uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <StatsRow 
                            layout="list"
                            stats={[
                                { label: 'Budget', value: formatCurrency(data.mediaBudgetRange?.min || 0), icon: Briefcase },
                                { label: 'Briefs', value: (data.metrics?.totalCampaigns || 0).toString(), icon: BarChart3 }
                            ]} 
                        />
                    </div>
                </div>

                <div className="w-40 border-l border-slate-100 dark:border-slate-800 p-4 flex flex-col justify-center items-center gap-2 bg-slate-50 dark:bg-slate-800/50">
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        className="w-full justify-between bg-white dark:bg-slate-700"
                        onClick={(e) => { e.stopPropagation(); onAction && onAction(data); }}
                    >
                        <span>Briefs</span>
                        <ArrowRight size={14} />
                    </Button>
                </div>
            </div>
        );
    }

    return (
      <div 
        onClick={onClick}
        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-[#FF0000]/50 hover:shadow-xl hover:shadow-[#FF0000]/5 transition-all duration-300 cursor-pointer flex flex-col h-full relative"
      >
        <div className="h-28 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
           <img src={bannerUrl} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" />
        </div>
  
        <div className="px-5 pb-5 flex-1 flex flex-col relative pt-12">
           <div className="absolute -top-10 left-5 z-10">
              <div className="w-20 h-20 rounded-xl border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 overflow-hidden shadow-sm flex items-center justify-center">
                  {data.logoUrl ? (
                      <img src={data.logoUrl} className="w-full h-full object-cover" />
                  ) : (
                      <div className="text-2xl font-black text-slate-300">{data.companyName[0]}</div>
                  )}
              </div>
           </div>
           
           <div className="absolute top-3 right-5">
              <Badge variant="brand">{data.industry}</Badge>
           </div>
  
           <div className="mb-4 mt-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-[#FF0000] transition-colors pr-20">
                 {data.companyName}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                 <MapPin size={10} /> {data.city}, {data.country}
              </p>
           </div>
  
           <StatsRow 
              stats={[
                  { label: 'Budget', value: formatCurrency(data.mediaBudgetRange?.min || 0) + '+', icon: Briefcase },
                  { label: 'Briefs', value: (data.metrics?.totalCampaigns || 0).toString(), icon: BarChart3 },
                  { label: 'Rating', value: '4.8/5', icon: Star, highlight: true }
              ]} 
           />
  
           <div className="flex flex-wrap gap-2 mb-5">
              {data.objectiveTags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded-md uppercase tracking-wider">
                      {tag}
                  </span>
              ))}
           </div>
  
           <div className="mt-auto pt-2">
              <Button 
                  size="sm" 
                  variant="secondary" 
                  className="w-full justify-between"
                  onClick={(e) => { e.stopPropagation(); onAction && onAction(data); }}
              >
                  <span>View Briefs</span>
                  <ArrowRight size={14} />
              </Button>
           </div>
        </div>
      </div>
    );
};

// --- OFFER CARD (INVENTORY) ---
export const YouTubeOfferCard = ({
  item,
  type,
  onClick,
  onAction,
  layout = 'grid'
}: {
  item: any,
  type: 'offer' | 'brief',
  onClick?: () => void,
  onAction?: (e: any) => void,
  layout?: 'grid' | 'list'
}) => {
  const { formatCurrency } = useCurrency();
  const isOffer = type === 'offer';
  const accentColor = isOffer ? 'decoration-emerald-500' : 'decoration-indigo-500';
  const badgeVariant = isOffer ? 'neutral' : 'brand';

  if (layout === 'list') {
      return (
        <div 
            onClick={onClick}
            className="group flex flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-[#FF0000]/50 transition-all cursor-pointer shadow-sm hover:shadow-lg h-32 relative"
        >
           <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#FF0000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           
           <div className="w-24 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800 shrink-0">
               <div className="text-lg font-bold text-slate-900 dark:text-white font-mono leading-none text-center">
                   {formatCurrency(item.priceMin || item.budgetMin)}
               </div>
               {item.priceMax && <div className="text-[9px] text-slate-400 mt-1">Up to {formatCurrency(item.priceMax)}</div>}
           </div>

           <div className="flex-1 p-4 flex flex-col justify-center">
               <div className="flex justify-between items-start mb-1">
                   <h3 className={`text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#FF0000] transition-colors line-clamp-1`}>
                        {item.name}
                   </h3>
                   <Badge variant={badgeVariant}>{item.category || item.objective}</Badge>
               </div>
               <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                    {item.description}
               </p>
               <div className="flex items-center gap-4 text-xs text-slate-500">
                   {(item.deliverables || item.kpis || []).slice(0, 2).map((d: string, i: number) => (
                       <span key={i} className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> {d}</span>
                   ))}
               </div>
           </div>

           <div className="w-36 flex items-center justify-center p-4 border-l border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20">
               <Button 
                   size="sm" 
                   className={isOffer ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-[#FF0000] hover:bg-[#CC0000]'}
                   onClick={(e) => { e.stopPropagation(); onAction && onAction(item); }}
                >
                   {isOffer ? 'Book Slot' : 'Apply'}
                </Button>
           </div>
        </div>
      );
  }

  return (
    <div 
        onClick={onClick}
        className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-[#FF0000]/50 transition-all cursor-pointer shadow-sm hover:shadow-lg h-full relative"
    >
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

       <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
             <Badge variant={badgeVariant} className="mb-2">{item.category || item.objective}</Badge>
             <div className="text-right">
                <div className="text-lg font-bold text-slate-900 dark:text-white font-mono leading-none">
                   {formatCurrency(item.priceMin || item.budgetMin)}
                </div>
                {item.priceMax && <div className="text-[10px] text-slate-400 mt-1">Up to {formatCurrency(item.priceMax)}</div>}
             </div>
          </div>

          <h3 className={`text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#FF0000] transition-colors line-clamp-2 min-h-[3.5rem]`}>
             {item.name}
          </h3>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed min-h-[3rem]">
             {item.description}
          </p>

          <div className="mt-auto space-y-3">
             <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {(item.deliverables || item.kpis || []).slice(0, 2).map((d: string, i: number) => (
                   <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{d}</span>
                   </div>
                ))}
                {(item.deliverables?.length > 2) && (
                   <div className="text-[10px] text-slate-400 pl-5">+{item.deliverables.length - 2} more deliverables</div>
                )}
             </div>

             <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                   <ShieldCheck size={12} />
                   {isOffer ? 'Guaranteed' : 'Verified'}
                </div>
                <Button 
                   size="sm" 
                   className={isOffer ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-[#FF0000] hover:bg-[#CC0000]'}
                   onClick={(e) => { e.stopPropagation(); onAction && onAction(item); }}
                >
                   {isOffer ? 'Book Slot' : 'Apply'}
                </Button>
             </div>
          </div>
       </div>
    </div>
  );
};
