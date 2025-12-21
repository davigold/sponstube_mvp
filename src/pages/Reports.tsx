
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Download, Calendar, Filter, Eye, Activity, DollarSign, TrendingUp, Search
} from 'lucide-react';
import { 
  Button, Card, CardContent, CardHeader, CardTitle, Badge, PageHeader, StatCard, Select 
} from '../components/Common';
import { MOCK_CAMPAIGNS } from '../mockData';
import { Role } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useI18n } from '../contexts/I18nContext';

// --- MOCK DATA ---
const CREATOR_EARNINGS_DATA = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1900 },
  { name: 'Mar', value: 1500 },
  { name: 'Apr', value: 2800 },
  { name: 'May', value: 3500 },
  { name: 'Jun', value: 4200 },
];

const BRAND_SPEND_DATA = [
    { name: 'Jan', value: 5000 },
    { name: 'Feb', value: 7500 },
    { name: 'Mar', value: 4000 },
    { name: 'Apr', value: 12000 },
    { name: 'May', value: 15000 },
    { name: 'Jun', value: 18500 },
];

const AUDIENCE_DATA = [
    { name: '18-24', value: 20 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 25 },
    { name: '45+', value: 10 },
];

const MainChart = ({ data, color, title, sub }: { data: any[], color: string, title: string, sub: string }) => {
    const { formatCurrency } = useCurrency();
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-sm text-slate-500 font-medium uppercase tracking-wider">{title}</CardTitle>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {formatCurrency(data[data.length-1].value)}
                        </div>
                    </div>
                    <Badge variant={color === '#FF0000' ? 'neutral' : 'success'}>{sub}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={`colorValue${title}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" strokeOpacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                            <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" tickFormatter={(v) => `${v/1000}k`} />
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }}
                                formatter={(val: number) => [formatCurrency(val), title]}
                            />
                            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#colorValue${title})`} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

const CampaignTable = ({ role }: { role: Role }) => {
    const { formatCurrency } = useCurrency();
    const { t } = useI18n();
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = MOCK_CAMPAIGNS.filter(c => 
        statusFilter === 'all' || c.status === statusFilter
    );

    return (
        <Card className="overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-900 dark:text-white">
                    {role === 'brand' ? 'Histórico de Campanhas' : 'Histórico de Jobs'}
                </h3>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input className="pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Search..." />
                    </div>
                    <select 
                        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Todos Status</option>
                        <option value="completed">Concluídos</option>
                        <option value="running">Em Andamento</option>
                        <option value="draft">Rascunhos</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                        <tr>
                            <th className="p-4">Campanha</th>
                            <th className="p-4">ID</th>
                            <th className="p-4">Data</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Valor</th>
                            <th className="p-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filtered.map((camp) => (
                            <tr key={camp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{camp.name}</div>
                                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{camp.brief}</div>
                                </td>
                                <td className="p-4 font-mono text-xs text-slate-500">{camp.id}</td>
                                <td className="p-4 text-slate-600 dark:text-slate-400">
                                    {new Date(camp.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-center">
                                    <Badge variant={
                                        camp.status === 'completed' ? 'success' : 
                                        camp.status === 'running' ? 'brand' : 
                                        'neutral'
                                    }>
                                        {camp.status}
                                    </Badge>
                                </td>
                                <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(camp.budgetTotal)}
                                </td>
                                <td className="p-4 text-right">
                                    <Button size="xs" variant="ghost" icon={<Eye size={14} />}>Detalhes</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default function Reports({ userRole }: { userRole: Role }) {
  const { t } = useI18n();
  const { formatCurrency } = useCurrency();
  const isBrand = userRole === 'brand';

  // Stats Logic
  const totalSpent = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.budgetTotal, 0);
  const totalViews = isBrand ? 850000 : 125000; // Mock
  const avgCpm = (totalSpent / (totalViews / 1000)).toFixed(2);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title={isBrand ? t('reports.title_brand') : t('reports.title_community')}
        subtitle={t('reports.subtitle')}
        action={
           <div className="flex gap-2">
              <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                 <button className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-md text-xs font-bold shadow-sm">{t('common.period')}: 30D</button>
                 <button className="px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md text-xs font-bold transition-colors">90D</button>
                 <button className="px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md text-xs font-bold transition-colors">YTD</button>
              </div>
              <Button icon={<Download size={16} />} variant="secondary">PDF</Button>
           </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard label={t('reports.kpi_spend')} value={formatCurrency(totalSpent)} icon={DollarSign} trend="up" trendValue="15%" />
         <StatCard label={t('reports.kpi_revenue')} value={formatCurrency(totalSpent * 3.5)} icon={TrendingUp} trend="up" trendValue="ROI 3.5x" />
         <StatCard label={t('reports.kpi_views')} value={(totalViews/1000).toFixed(1) + 'k'} icon={Eye} trend="up" trendValue="4%" />
         <StatCard label={t('reports.kpi_cpm')} value={`R$ ${avgCpm}`} icon={Activity} trend="down" trendValue="-2% (Melhor)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <MainChart 
                data={isBrand ? BRAND_SPEND_DATA : CREATOR_EARNINGS_DATA} 
                color={isBrand ? "#6366f1" : "#10b981"} 
                title={isBrand ? "Investimento Mensal" : "Receita Mensal"} 
                sub="+12% vs mês anterior" 
            />
         </div>
         <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Distribuição Demográfica</CardTitle></CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={AUDIENCE_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                <Cell fill="#3B82F6" />
                                <Cell fill="#EC4899" />
                                <Cell fill="#10B981" />
                                <Cell fill="#F59E0B" />
                            </Pie>
                            <RechartsTooltip contentStyle={{ backgroundColor: '#0F0F0F', borderColor: '#333', color: '#fff' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-xs text-slate-500 mt-[-20px]">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> 18-24</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-500"></div> 25-34</span>
                    </div>
                </CardContent>
            </Card>
         </div>
      </div>

      <CampaignTable role={userRole} />
    </div>
  );
}
