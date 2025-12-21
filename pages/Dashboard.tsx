
import React, { useMemo } from 'react';
import { 
  Rocket, TrendingUp, Users, DollarSign, Activity, PlusCircle, ArrowRight, Star, Zap,
  LayoutList, Compass, Store, Search, PackagePlus, Megaphone, Edit3, Upload, ShieldCheck, PlayCircle, MousePointer2, Eye,
  Calendar, CheckCircle2, AlertCircle, Clock, Wallet, BarChart2, Briefcase, Target, Sparkles
} from 'lucide-react';
import { 
  Button, Card, CardContent, CardHeader, CardTitle, 
  StatCard, Badge, SectionTitle, EmptyState
} from '../components/Common';
import { MOCK_CAMPAIGNS, MOCK_COMMUNITIES, MOCK_BRAND_PACKS } from '../mockData';
import { Role } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import StaffDashboard from './StaffDashboard';
import { navigateTo } from '../utils/navigation';
import { useI18n } from '../contexts/I18nContext';

// --- BRAND DASHBOARD (COCKPIT) ---
const BrandHub = () => {
    const { formatCurrency } = useCurrency();
    const { t } = useI18n();
    const activeCampaigns = MOCK_CAMPAIGNS.filter(c => c.status !== 'draft' && c.status !== 'completed');
    
    // Quick Stats
    const pendingActions = MOCK_CAMPAIGNS.filter(c => c.status === 'awaiting_report' || c.status === 'applied').length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('dashboard.title_brand')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.greeting', { name: 'TechStart' })}</p>
                </div>
                <div className="p-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-500/30 flex items-center gap-2 px-3">
                    <Activity size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">{pendingActions} {t('common.actions')}</span>
                </div>
            </div>

            {/* ACTION CENTER (KANBAN STYLE) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                            onClick={() => navigateTo('/app/management')}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm hover:border-indigo-500 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:scale-110 transition-transform">
                                    <Clock size={20} />
                                </div>
                                <Badge variant="brand">{pendingActions} Pendentes</Badge>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Aprovações & Pagamentos</h3>
                            <p className="text-xs text-slate-500 mt-1">Verifique entregas e libere pagamentos.</p>
                        </div>

                        <div 
                            onClick={() => navigateTo('/app/marketplace')}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
                                    <Search size={20} />
                                </div>
                                <Badge variant="success">Novo</Badge>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Explorar Novos Canais</h3>
                            <p className="text-xs text-slate-500 mt-1">Encontre creators verificados para sua marca.</p>
                        </div>
                    </div>

                    {/* SHORTCUTS GRID */}
                    <div>
                        <SectionTitle title={t('dashboard.shortcuts')} />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button variant="secondary" className="justify-start h-auto py-3 flex-col gap-2 items-start bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800" onClick={() => navigateTo('/app/campaigns?action=create')}>
                                <PlusCircle size={20} className="text-indigo-500" />
                                <span className="text-xs font-bold">{t('dashboard.quick_actions.create_campaign')}</span>
                            </Button>
                            <Button variant="secondary" className="justify-start h-auto py-3 flex-col gap-2 items-start bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800" onClick={() => navigateTo('/app/storefront')}>
                                <Store size={20} className="text-pink-500" />
                                <span className="text-xs font-bold">Portal da Marca</span>
                            </Button>
                            <Button variant="secondary" className="justify-start h-auto py-3 flex-col gap-2 items-start bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800" onClick={() => navigateTo('/app/settings/team')}>
                                <Users size={20} className="text-blue-500" />
                                <span className="text-xs font-bold">Gerenciar Time</span>
                            </Button>
                            <Button variant="secondary" className="justify-start h-auto py-3 flex-col gap-2 items-start bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800" onClick={() => navigateTo('/app/reports')}>
                                <BarChart2 size={20} className="text-amber-500" />
                                <span className="text-xs font-bold">{t('nav.reports')}</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: AI SUGGESTIONS */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-6 relative overflow-hidden flex flex-col">
                    <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={18} className="text-amber-400" />
                            <span className="font-bold uppercase text-xs tracking-wider">{t('dashboard.recommendations')}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Canal: Hardware Unboxed BR</h3>
                        <p className="text-indigo-200 text-xs mb-6 leading-relaxed">95% de afinidade com seu objetivo de "Conversão" para público Tech. Alto engajamento em reviews recentes.</p>
                        
                        <div className="mt-auto">
                            <Button size="sm" className="w-full bg-white text-indigo-900 hover:bg-indigo-50 border-transparent" onClick={() => navigateTo('/s/c1')}>
                                Ver Media Kit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">Campanhas Ativas</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigateTo('/app/management')}>Ver Pipeline Completo</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {activeCampaigns.slice(0, 3).map(c => (
                                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="p-4 font-bold text-slate-900 dark:text-white w-1/2">{c.name}</td>
                                    <td className="p-4"><Badge variant={c.status === 'running' ? 'brand' : 'neutral'}>{c.status}</Badge></td>
                                    <td className="p-4 text-right text-xs text-slate-500">Atualizado hoje</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- CREATOR DASHBOARD (COCKPIT) ---
const CreatorHub = () => {
  const { t } = useI18n();
  const { formatCurrency } = useCurrency();
  const myCommunity = MOCK_COMMUNITIES[0];
  
  const actionItems = MOCK_CAMPAIGNS.filter(c => ['running', 'approved'].includes(c.status));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-[#FF0000] ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950 relative">
                <img src={myCommunity.logoUrl || `https://ui-avatars.com/api/?name=${myCommunity.name}&background=FF0000&color=fff`} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Online"></div>
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {myCommunity.name}
                    </h1>
                    <Badge variant="brand" className="text-[10px]">Verificado</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Users size={12}/> 142k Subs</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Star size={12}/> 5.0 Rating</span>
                </div>
            </div>
         </div>
         <div className="flex gap-3 w-full md:w-auto">
            <Button variant="secondary" icon={<Eye size={16}/>} onClick={() => navigateTo(`/s/${myCommunity.id}`)}>Media Kit</Button>
            <Button icon={<PlusCircle size={16}/>} className="bg-[#FF0000] hover:bg-[#CC0000] text-white" onClick={() => navigateTo('/app/campaigns?action=create')}>Novo Slot</Button>
         </div>
      </div>

      {/* URGENT ACTION ITEMS */}
      {actionItems.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm">Você tem {actionItems.length} ações pendentes</h3>
                    <p className="text-xs text-amber-700 dark:text-amber-400">Entregas atrasadas ou aprovações pendentes.</p>
                </div>
            </div>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white border-transparent" onClick={() => navigateTo('/app/management')}>
                Resolver Agora
            </Button>
        </div>
      )}

      {/* MAIN ACTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Card 1: Inventory */}
         <Card className="hover:border-indigo-500/50 transition-colors cursor-pointer group" onClick={() => navigateTo('/app/campaigns')}>
            <CardContent className="p-6">
                <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 w-fit rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <PackagePlus size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Gerenciar Slots</h3>
                <p className="text-xs text-slate-500 mb-4">Atualize datas disponíveis e preços do seu Media Kit.</p>
                <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Acessar Inventário <ArrowRight size={12} className="ml-1" />
                </div>
            </CardContent>
         </Card>

         {/* Card 2: Executions */}
         <Card className="hover:border-emerald-500/50 transition-colors cursor-pointer group" onClick={() => navigateTo('/app/management')}>
            <CardContent className="p-6">
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 w-fit rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Entregar Jobs</h3>
                <p className="text-xs text-slate-500 mb-4">Faça upload de provas e links para receber pagamentos.</p>
                <div className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Ir para Entregas <ArrowRight size={12} className="ml-1" />
                </div>
            </CardContent>
         </Card>

         {/* Card 3: Analytics */}
         <Card className="hover:border-amber-500/50 transition-colors cursor-pointer group" onClick={() => navigateTo('/app/reports')}>
            <CardContent className="p-6">
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 w-fit rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <BarChart2 size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Ver Relatórios</h3>
                <p className="text-xs text-slate-500 mb-4">Acompanhe seu faturamento e crescimento.</p>
                <div className="flex items-center text-xs font-bold text-amber-600 dark:text-amber-400">
                    Abrir Analytics <ArrowRight size={12} className="ml-1" />
                </div>
            </CardContent>
         </Card>
      </div>

      {/* QUICK STATUS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Jobs Recentes</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {MOCK_CAMPAIGNS.slice(0, 3).map((item, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer" onClick={() => navigateTo('/app/management')}>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                {item.status === 'completed' ? <CheckCircle2 size={16} className="text-emerald-500"/> : <Clock size={16} />}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                <p className="text-[10px] text-slate-500 uppercase">{item.status.replace('_', ' ')}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(item.budgetTotal)}</p>
                        </div>
                    </div>
                ))}
            </div>
      </div>
    </div>
  );
};

export default function Dashboard({ userRole }: { userRole: Role }) {
  if (userRole === 'community') return <CreatorHub />;
  if (userRole === 'brand') return <BrandHub />;
  if (userRole === 'staff') return <StaffDashboard />;
  
  return <div className="p-10 text-center">Dashboard not found.</div>; 
}
