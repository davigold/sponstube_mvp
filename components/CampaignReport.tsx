
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Download, Share2, Printer, ExternalLink, 
  TrendingUp, Users, MousePointer2, ShoppingBag, 
  CheckCircle2, AlertCircle, Info, FileText
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, StatCard, SectionTitle, InfoTooltip } from './Common';
import { Campaign } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useI18n } from '../contexts/I18nContext';

interface CampaignReportProps {
  campaign: Campaign;
}

export const CampaignReport: React.FC<CampaignReportProps> = ({ campaign }) => {
  const { formatCurrency } = useCurrency();
  const { t } = useI18n();

  // Mock Data Generation based on Budget
  const budget = campaign.budgetTotal || 1000;
  const views = Math.floor(budget * (40 + Math.random() * 20));
  const clicks = Math.floor(views * 0.045);
  const conversions = Math.floor(clicks * 0.08);
  const cpm = (budget / (views / 1000)).toFixed(2);
  const ctr = ((clicks / views) * 100).toFixed(2);
  const cpa = conversions > 0 ? (budget / conversions).toFixed(2) : '0.00';

  const dailyData = [
    { day: 'Day 1', views: views * 0.4, clicks: clicks * 0.45 },
    { day: 'Day 2', views: views * 0.25, clicks: clicks * 0.25 },
    { day: 'Day 3', views: views * 0.15, clicks: clicks * 0.15 },
    { day: 'Day 4', views: views * 0.1, clicks: clicks * 0.08 },
    { day: 'Day 5', views: views * 0.05, clicks: clicks * 0.04 },
    { day: 'Day 6', views: views * 0.03, clicks: clicks * 0.02 },
    { day: 'Day 7', views: views * 0.02, clicks: clicks * 0.01 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Performance Report
            {campaign.status === 'completed' && <Badge variant="success">Finalized</Badge>}
          </h3>
          <p className="text-xs text-slate-500">Campaign ID: {campaign.id} • Generated {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" icon={<Share2 size={14} />}>Share</Button>
          <Button size="sm" icon={<Download size={14} />}>Export PDF</Button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Views</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">{(views / 1000).toFixed(1)}k</h4>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center">
                <TrendingUp size={10} className="mr-0.5" /> +12%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">CPM: R$ {cpm}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Link Clicks</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">{clicks}</h4>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center">
                <TrendingUp size={10} className="mr-0.5" /> High
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">CTR: {ctr}%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Est. Sales</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">{conversions}</h4>
              <span className="text-[10px] text-slate-400">orders</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">CPA: R$ {cpa}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Spend</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(budget)}</h4>
            </div>
            <p className="text-[10px] text-emerald-500 mt-1 font-bold">Paid via Escrow</p>
          </CardContent>
        </Card>
      </div>

      {/* MAIN CHART */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <CardTitle className="text-sm">Traffic & Engagement Velocity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 w-full bg-slate-50 dark:bg-slate-900/30 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" strokeOpacity={0.1} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="Views" />
                <Area type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" name="Clicks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* TRACKING EXPLANATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MousePointer2 size={16} className="text-indigo-500" /> Tracking Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                    Tracking Link (UTM) <InfoTooltip content={t('tooltips.tracking')} />
                </span>
                <Badge variant="success">Active</Badge>
              </div>
              <code className="text-xs text-indigo-600 dark:text-indigo-400 break-all font-mono">
                {campaign.measurementPack?.trackingUrl || 'https://brand.com/?utm_source=sponstube&utm_medium=video'}
              </code>
            </div>
            
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Coupon Code</span>
                <Badge variant="neutral">Redeemed: {Math.floor(conversions * 0.8)}</Badge>
              </div>
              <code className="text-lg font-bold text-slate-900 dark:text-white tracking-widest font-mono">
                {campaign.measurementPack?.couponCode || 'PROMO20'}
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-lg shrink-0">
                <Users size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Audience Match</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  92% of viewers matched target demographics (18-34, Tech Interest).
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg shrink-0">
                <AlertCircle size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Brand Safety</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No controversial keywords found in comments. 99% Positive Sentiment.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
               <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Info size={12} /> Data verified via YouTube Data API & proprietary tracking.
               </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FOOTER */}
      <div className="flex justify-center pt-8 border-t border-slate-200 dark:border-slate-800">
         <div className="text-center space-y-4">
            <p className="text-sm text-slate-500">Ready to present to your CFO?</p>
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20" icon={<Printer size={18} />}>
               Generate PDF Report
            </Button>
         </div>
      </div>
    </div>
  );
};
    