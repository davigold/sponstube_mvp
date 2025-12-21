
import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, LayoutTemplate, 
  Search, Activity, ShieldCheck,
  ShieldAlert, Plus, Edit3, Trash2,
  CheckCircle2, Eye, Gift, Save, Download,
  Filter, ExternalLink, X, Image as ImageIcon,
  FileText, AlertTriangle, Check, Lock, Banknote, RefreshCw,
  GitBranch, Box, Flag, PauseCircle, PlayCircle, History as HistoryIcon,
  Gavel, AlertOctagon, ChevronRight, User, FileSignature, TrendingUp
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Button, Card, CardContent, CardHeader, CardTitle, 
  Badge, PageHeader, StatCard, Input, EmptyState, ListSkeleton, Select, FadeIn
} from '../components/Common';
import { VerificationBadge } from '../components/Trust';
import { 
  MOCK_BRANDS, MOCK_COMMUNITIES, MOCK_CAMPAIGNS, 
  MOCK_PAYMENTS, MOCK_TEMPLATES, MOCK_CAMPAIGN_MATCHES, MOCK_USERS
} from '../mockData';
import { useCurrency } from '../contexts/CurrencyContext';
import { navigateTo } from '../utils/navigation';
import { ActionTemplate, Payment } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { logAction, getAuditLogs, AuditLogEntry } from '../utils/auditLogger';

export type AdminTab = 'overview' | 'users' | 'campaigns' | 'financials' | 'templates' | 'disputes' | 'config' | 'mgm';

const REVENUE_DATA = [
  { name: 'Jan', gmv: 45000, revenue: 6750 },
  { name: 'Feb', gmv: 52000, revenue: 7800 },
  { name: 'Mar', gmv: 48000, revenue: 7200 },
  { name: 'Apr', gmv: 61000, revenue: 9150 },
  { name: 'May', gmv: 58000, revenue: 8700 },
  { name: 'Jun', gmv: 75000, revenue: 11250 },
  { name: 'Jul', gmv: 82000, revenue: 12300 },
];

const MOCK_DISPUTES = [
  { id: 'd1', campaign: 'Lançamento SDK v2', brand: 'TechStart SaaS', community: 'React Developers', type: 'delivery_not_met', status: 'open', severity: 'high', created: '2023-11-15', description: 'Marca alega que o post foi apagado antes das 24h contratadas.' },
  { id: 'd2', campaign: 'Black Friday SaaS', brand: 'FinTech Pro', community: 'Crypto Traders', type: 'payment_issue', status: 'investigating', severity: 'medium', created: '2023-11-14', description: 'Problema no processamento do cartão da marca.' },
];

const MOCK_RISK_CAMPAIGNS = [
  { id: 'cmp_risk_1', name: 'Crypto Moonshot', brand: 'Unknown Dao', reason: 'High Risk Keywords', status: 'running', riskScore: 85 },
  { id: 'cmp_risk_2', name: 'Adult Dating App', brand: 'Global Dating', reason: 'Prohibited Category', status: 'paused', riskScore: 92 },
];

const MOCK_MGM_DATA = [
    { id: 'mgm1', user: 'TechStart SaaS', type: 'brand', invitedCount: 15, convertedCount: 5, totalEarned: 50, lastInvite: '2h ago' },
    { id: 'mgm2', user: 'Bella Makeup', type: 'community', invitedCount: 42, convertedCount: 12, totalEarned: 120, lastInvite: '1d ago' },
    { id: 'mgm3', user: 'SpeedRun King', type: 'community', invitedCount: 8, convertedCount: 8, totalEarned: 80, lastInvite: '3d ago' },
    { id: 'mgm4', user: 'FinWise App', type: 'brand', invitedCount: 3, convertedCount: 0, totalEarned: 0, lastInvite: '1w ago' },
];

// --- TEMPLATE EDIT MODAL ---
const TemplateModal = ({ 
  template, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  template: ActionTemplate | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (t: ActionTemplate) => void 
}) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<Partial<ActionTemplate>>({
    name: '',
    category: 'awareness',
    difficulty: 'low',
    baseBriefing: '',
    proofRequirements: [],
    metrics: [],
    supportedPlatforms: ['whatsapp'],
    isActive: true,
    version: 1
  });

  useEffect(() => {
    if (template) {
      setFormData({ ...template });
    } else {
      setFormData({
        name: '',
        category: 'awareness',
        difficulty: 'low',
        baseBriefing: '',
        proofRequirements: [],
        metrics: [],
        supportedPlatforms: ['whatsapp'],
        isActive: true,
        version: 1
      });
    }
  }, [template, isOpen]);

  const handleChange = (field: keyof ActionTemplate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'proofRequirements' | 'metrics', value: string) => {
    const arr = value.split(',').map(s => s.trim());
    setFormData(prev => ({ ...prev, [field]: arr }));
  };

  const handleSave = () => {
    if (!formData.name) return;
    
    const newVersion = template ? (formData.version || 1) + 1 : 1;
    
    const finalTemplate = {
      ...formData,
      version: newVersion,
      id: formData.id || `tmpl_${Date.now()}`,
      slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-'),
      deliverables: formData.deliverables || ['Default Deliverable'],
      horizon: formData.horizon || 'short',
      primarySide: formData.primarySide || 'community',
      mainGoal: formData.mainGoal || 'traffic',
      typicalDuration: formData.typicalDuration || '24h',
      memberBenefit: formData.memberBenefit || 'N/A',
      baseCopy: formData.baseCopy || '',
      howItWorks: formData.howItWorks || []
    } as ActionTemplate;

    onSave(finalTemplate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl">
        <CardHeader className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
           <CardTitle>{template ? t('staff.templates.modal.edit_title') : t('staff.templates.modal.create_title')}</CardTitle>
           <button onClick={onClose}><X size={20} className="text-slate-500 hover:text-slate-900 dark:hover:text-white"/></button>
        </CardHeader>
        <CardContent className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
           {/* Section 1: Basic Info */}
           <div className="space-y-4">
               <Input 
                  label={t('staff.templates.modal.name')} 
                  value={formData.name} 
                  onChange={e => handleChange('name', e.target.value)} 
               />
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t('staff.templates.modal.category')}</label>
                     <select 
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200"
                        value={formData.category}
                        onChange={e => handleChange('category', e.target.value)}
                     >
                        <option value="awareness">Awareness</option>
                        <option value="conversion">Conversion</option>
                        <option value="content">Content</option>
                        <option value="hiring">Hiring</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t('staff.templates.modal.platform')}</label>
                     <select 
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200"
                        value={formData.supportedPlatforms?.[0] || 'whatsapp'}
                        onChange={e => handleChange('supportedPlatforms', [e.target.value])}
                     >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="telegram">Telegram</option>
                        <option value="discord">Discord</option>
                        <option value="linkedin">LinkedIn</option>
                     </select>
                  </div>
               </div>
           </div>

           {/* Section 2: SOW Definition (New) */}
           <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
               <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
                   <FileSignature size={14} /> SOW Definition
               </h4>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t('staff.templates.modal.briefing')}</label>
                  <textarea 
                     className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 h-24 resize-none"
                     value={formData.baseBriefing}
                     onChange={e => handleChange('baseBriefing', e.target.value)}
                     placeholder="This text appears as the core scope in the SOW..."
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t('staff.templates.modal.difficulty')} (Scope)</label>
                       <select 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200"
                          value={formData.difficulty}
                          onChange={e => handleChange('difficulty', e.target.value)}
                       >
                          <option value="low">Low (0 Revisions)</option>
                          <option value="medium">Medium (1 Revision)</option>
                          <option value="high">High (2 Revisions)</option>
                       </select>
                   </div>
                   <Input 
                      label={t('staff.templates.modal.metrics')} 
                      value={formData.metrics?.join(', ')} 
                      onChange={e => handleArrayChange('metrics', e.target.value)} 
                   />
               </div>
           </div>

           {/* Section 3: Acceptance */}
           <div className="space-y-4">
               <Input 
                  label={t('staff.templates.modal.proofs')} 
                  value={formData.proofRequirements?.join(', ')} 
                  onChange={e => handleArrayChange('proofRequirements', e.target.value)} 
                  placeholder="e.g. Screenshot, Link, Analytics PDF"
               />
               
               <div className="flex items-center gap-3 pt-2">
                  <input 
                     type="checkbox" 
                     id="isActive"
                     checked={formData.isActive} 
                     onChange={e => handleChange('isActive', e.target.checked)}
                     className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-900 dark:text-white">{t('staff.templates.modal.active')}</label>
               </div>
           </div>

           <div className="pt-4 flex gap-3">
              <Button className="flex-1" onClick={handleSave}>{t('staff.templates.modal.save')}</Button>
              <Button variant="ghost" onClick={onClose}>{t('staff.templates.modal.cancel')}</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StaffDashboardProps {
  initialTab?: AdminTab;
}

export default function StaffDashboard({ initialTab }: StaffDashboardProps) {
  const { formatCurrency } = useCurrency();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab || 'overview');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    setAuditLogs(getAuditLogs());
  }, [initialTab, activeTab]);

  const [templates, setTemplates] = useState<ActionTemplate[]>(MOCK_TEMPLATES);
  const [activeDisputes, setActiveDisputes] = useState(MOCK_DISPUTES);
  const [riskCampaigns, setRiskCampaigns] = useState(MOCK_RISK_CAMPAIGNS);
  
  const totalUsers = MOCK_BRANDS.length + MOCK_COMMUNITIES.length;
  const totalGMV = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.budgetTotal, 0);
  const platformRevenue = MOCK_PAYMENTS.reduce((acc, p) => acc + p.feeAmount, 0);
  const fundsInEscrow = MOCK_PAYMENTS.filter(p => p.status === 'in_escrow').reduce((acc, p) => acc + p.amountAgreed, 0);

  const handleRiskAction = (id: string, action: 'pause' | 'resume' | 'flag') => {
    setRiskCampaigns(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newStatus = action === 'pause' ? 'paused' : action === 'resume' ? 'running' : c.status;
      const logs = logAction(action === 'flag' ? 'Flagged Campaign' : `Campaign ${action}`, id, 'campaign', `Reason: ${c.reason}`);
      setAuditLogs(logs);
      return { ...c, status: newStatus };
    }));
  };

  const handleResolveDispute = (id: string) => {
    if (!confirm('Resolve this dispute and close ticket?')) return;
    setActiveDisputes(prev => prev.filter(d => d.id !== id));
    const logs = logAction('Resolved Dispute', id, 'dispute', 'Closed via Command Center');
    setAuditLogs(logs);
  };

  // --- SUB-VIEWS ---

  const MgmTab = () => (
      <FadeIn>
          <div className="flex justify-between items-center mb-6">
              <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">MGM Performance</h2>
                  <p className="text-sm text-slate-500">Track referrals, conversions and payouts.</p>
              </div>
              <Button icon={<Download size={16} />} variant="secondary">Export Report</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Referrals" value="68" icon={Users} trend="up" trendValue="12%" />
              <StatCard label="Total Converted" value="25" icon={CheckCircle2} trend="up" trendValue="36% Rate" />
              <StatCard label="Payouts Pending" value={formatCurrency(250)} icon={DollarSign} />
              <StatCard label="Total Paid Out" value={formatCurrency(250)} icon={Gift} />
          </div>

          <Card>
              <CardContent className="p-0">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                          <tr>
                              <th className="p-4">User</th>
                              <th className="p-4">Type</th>
                              <th className="p-4 text-center">Invited</th>
                              <th className="p-4 text-center">Converted</th>
                              <th className="p-4 text-right">Total Earned</th>
                              <th className="p-4 text-right">Last Activity</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {MOCK_MGM_DATA.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                  <td className="p-4 font-bold text-slate-900 dark:text-white">{item.user}</td>
                                  <td className="p-4">
                                      <Badge variant={item.type === 'brand' ? 'brand' : 'neutral'}>{item.type}</Badge>
                                  </td>
                                  <td className="p-4 text-center text-slate-600 dark:text-slate-400">{item.invitedCount}</td>
                                  <td className="p-4 text-center">
                                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.convertedCount}</span>
                                  </td>
                                  <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                                      {formatCurrency(item.totalEarned)}
                                  </td>
                                  <td className="p-4 text-right text-xs text-slate-500">{item.lastInvite}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </CardContent>
          </Card>
      </FadeIn>
  );

  const OverviewTab = () => (
    <FadeIn className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label={t('staff.stats.gmv')} value={formatCurrency(totalGMV)} icon={Activity} trend="up" trendValue="12%" />
        <StatCard label={t('staff.stats.net_revenue')} value={formatCurrency(platformRevenue)} icon={DollarSign} trend="up" trendValue="15%" />
        <StatCard label={t('staff.stats.active_users')} value={totalUsers.toString()} icon={Users} trend="up" trendValue="8 this week" />
        <StatCard label={t('staff.stats.escrow')} value={formatCurrency(fundsInEscrow)} icon={ShieldCheck} trend="neutral" trendValue="Secure" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           {/* RISK QUEUE */}
           <Card className="border-l-4 border-l-rose-500">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                 <div className="flex justify-between items-center">
                    <CardTitle className="text-base flex items-center gap-2 text-rose-600 dark:text-rose-400">
                       <AlertOctagon size={18} /> High Risk Campaigns ({riskCampaigns.length})
                    </CardTitle>
                    <Button variant="ghost" size="xs" onClick={() => setActiveTab('campaigns')}>View All</Button>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 {riskCampaigns.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                       {riskCampaigns.map(c => (
                          <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <span className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</span>
                                   <Badge variant={c.status === 'paused' ? 'warning' : 'error'} className="text-[10px]">{c.status}</Badge>
                                </div>
                                <div className="text-xs text-slate-500">
                                   <span className="font-semibold">{c.brand}</span> • Reason: {c.reason} (Score: {c.riskScore})
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <Button size="xs" variant="secondary" icon={<Flag size={12}/>} onClick={() => handleRiskAction(c.id, 'flag')}>Flag</Button>
                                {c.status === 'paused' ? (
                                   <Button size="xs" className="bg-emerald-600 hover:bg-emerald-500" icon={<PlayCircle size={12}/>} onClick={() => handleRiskAction(c.id, 'resume')}>Resume</Button>
                                ) : (
                                   <Button size="xs" className="bg-rose-600 hover:bg-rose-500" icon={<PauseCircle size={12}/>} onClick={() => handleRiskAction(c.id, 'pause')}>Pause</Button>
                                )}
                             </div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <EmptyState icon={ShieldCheck} title="All Clean" description="No active risk alerts." />
                 )}
              </CardContent>
           </Card>

           {/* REVENUE CHART */}
           <Card>
              <CardHeader><CardTitle>Revenue Velocity</CardTitle></CardHeader>
              <CardContent className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_DATA}>
                       <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#FF0000" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#FF0000" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                       <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                       <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                       <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                          itemStyle={{ color: '#FF0000' }}
                          formatter={(value: number) => formatCurrency(value)}
                       />
                       <Area type="monotone" dataKey="revenue" stroke="#FF0000" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           {/* QUICK ACTIONS */}
           <Card>
              <CardHeader><CardTitle>{t('common.actions')}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                 <Button className="w-full justify-start" icon={<Plus size={16}/>} onClick={() => setActiveTab('templates')}>{t('staff.actions.create_template')}</Button>
                 <Button variant="secondary" className="w-full justify-start" icon={<ShieldCheck size={16}/>} onClick={() => setActiveTab('users')}>{t('staff.actions.verify_users')}</Button>
                 <Button variant="secondary" className="w-full justify-start" icon={<Gavel size={16}/>} onClick={() => setActiveTab('disputes')}>{t('staff.actions.resolve_disputes')}</Button>
              </CardContent>
           </Card>

           {/* RECENT ACTIVITY LOG */}
           <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Audit Log</CardTitle></CardHeader>
              <CardContent className="p-0">
                 <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {auditLogs.length > 0 ? (
                        auditLogs.map(log => (
                           <div key={log.id} className="p-3 border-b border-slate-100 dark:border-slate-800 text-xs hover:bg-slate-50 dark:hover:bg-slate-900/50">
                              <div className="flex justify-between mb-1">
                                 <span className="font-bold text-slate-700 dark:text-slate-300">{log.action}</span>
                                 <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              <p className="text-slate-500 truncate">{log.details}</p>
                           </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-xs text-slate-500">No activity yet.</div>
                    )}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </FadeIn>
  );

  const UsersTab = () => {
    return (
      <FadeIn>
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h2>
           <Button icon={<Download size={16} />} variant="secondary">Export CSV</Button>
        </div>
        
        <Card>
           <CardContent className="p-0">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <tr>
                       <th className="p-4">User</th>
                       <th className="p-4">Role</th>
                       <th className="p-4">Status</th>
                       <th className="p-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {MOCK_USERS.map((user) => (
                       <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-4">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                   {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full rounded-full" /> : <User size={14} />}
                                </div>
                                <div>
                                   <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                                   <div className="text-xs text-slate-500">{user.email}</div>
                                </div>
                             </div>
                          </td>
                          <td className="p-4 capitalize text-slate-600 dark:text-slate-400">{user.role}</td>
                          <td className="p-4">
                             <Badge variant="success">Active</Badge>
                          </td>
                          <td className="p-4 text-right">
                             <Button size="xs" variant="secondary">Edit</Button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </CardContent>
        </Card>
      </FadeIn>
    );
  };

  const CampaignsTab = () => (
    <FadeIn>
       <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Campaigns</h2>
           <div className="flex gap-2">
              <Input placeholder="Search campaigns..." className="w-64" />
              <Button icon={<Filter size={16} />} variant="secondary">Filter</Button>
           </div>
        </div>

        <Card>
           <CardContent className="p-0">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <tr>
                       <th className="p-4">Campaign Name</th>
                       <th className="p-4">Brand</th>
                       <th className="p-4">Budget</th>
                       <th className="p-4">Status</th>
                       <th className="p-4 text-right">Date</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {MOCK_CAMPAIGNS.map((camp) => (
                       <tr key={camp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-4 font-medium text-slate-900 dark:text-white">{camp.name}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">Brand ID: {camp.brandId}</td>
                          <td className="p-4 font-mono">{formatCurrency(camp.budgetTotal)}</td>
                          <td className="p-4">
                             <Badge variant={camp.status === 'running' ? 'brand' : 'neutral'}>{camp.status}</Badge>
                          </td>
                          <td className="p-4 text-right text-slate-500 text-xs">
                             {new Date(camp.createdAt).toLocaleDateString()}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </CardContent>
        </Card>
    </FadeIn>
  );

  const TemplatesTab = () => {
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [editingTemplate, setEditingTemplate] = useState<ActionTemplate | null>(null);

     const handleSaveTemplate = (t: ActionTemplate) => {
        if (editingTemplate) {
           setTemplates(prev => prev.map(pt => pt.id === t.id ? t : pt));
        } else {
           setTemplates(prev => [t, ...prev]);
        }
        logAction(editingTemplate ? 'Updated Template' : 'Created Template', t.id, 'template', t.name);
        setAuditLogs(getAuditLogs());
     };

     const handleDeleteTemplate = (id: string) => {
        if (confirm('Delete this template?')) {
           setTemplates(prev => prev.filter(t => t.id !== id));
           logAction('Deleted Template', id, 'template');
           setAuditLogs(getAuditLogs());
        }
     };

     return (
        <FadeIn>
           <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search templates..." />
              </div>
              <Button icon={<Plus size={16}/>} onClick={() => { setEditingTemplate(null); setIsModalOpen(true); }}>New Template</Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(t => (
                 <Card key={t.id} className="group hover:border-indigo-500/50 transition-all">
                    <CardContent className="p-5 flex flex-col h-full">
                       <div className="flex justify-between items-start mb-3">
                          <Badge variant="neutral">{t.category}</Badge>
                          <div className={`w-2 h-2 rounded-full ${t.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                       </div>
                       <h4 className="font-bold text-slate-900 dark:text-white mb-2">{t.name}</h4>
                       <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">{t.baseBriefing}</p>
                       <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="xs" variant="ghost" icon={<Trash2 size={14}/>} onClick={() => handleDeleteTemplate(t.id)} />
                          <Button size="xs" variant="secondary" icon={<Edit3 size={14}/>} onClick={() => { setEditingTemplate(t); setIsModalOpen(true); }}>Edit</Button>
                       </div>
                    </CardContent>
                 </Card>
              ))}
           </div>

           <TemplateModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              template={editingTemplate}
              onSave={handleSaveTemplate}
           />
        </FadeIn>
     );
  };

  const DisputesTab = () => (
    <FadeIn className="space-y-6">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Disputes</h2>
          <Badge variant="warning">{activeDisputes.length} Open</Badge>
       </div>
       
       {activeDisputes.length > 0 ? (
          <div className="grid gap-4">
             {activeDisputes.map(dispute => (
                <Card key={dispute.id} className="border-l-4 border-l-amber-500">
                   <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start">
                      <div>
                         <div className="flex items-center gap-2 mb-2">
                            <Badge variant="error" className="uppercase">{dispute.severity}</Badge>
                            <span className="text-xs text-slate-500">{dispute.created}</span>
                         </div>
                         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{dispute.type.replace('_', ' ').toUpperCase()}</h3>
                         <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{dispute.description}</p>
                         <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                            <span>Camp: {dispute.campaign}</span>
                            <span>Brand: {dispute.brand}</span>
                            <span>Comm: {dispute.community}</span>
                         </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                         <Button size="sm" onClick={() => handleResolveDispute(dispute.id)}>Resolve & Close</Button>
                         <Button size="sm" variant="secondary">View Evidence</Button>
                      </div>
                   </CardContent>
                </Card>
             ))}
          </div>
       ) : (
          <EmptyState icon={CheckCircle2} title="Zero Disputes" description="Everything is running smoothly." />
       )}
    </FadeIn>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title={t('staff.title')} 
        subtitle={t('staff.subtitle')}
        action={
           <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              {(['overview', 'users', 'mgm', 'campaigns', 'templates', 'disputes', 'config'] as AdminTab[]).map(tab => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-[#FF0000] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                 >
                    {tab === 'config' ? 'Logs' : (tab === 'mgm' ? 'MGM (Ref)' : tab)}
                 </button>
              ))}
           </div>
        }
      />

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'mgm' && <MgmTab />}
      {activeTab === 'campaigns' && <CampaignsTab />}
      {activeTab === 'disputes' && <DisputesTab />}
      {activeTab === 'templates' && <TemplatesTab />}
      
      {/* Fallback for other tabs */}
      {['financials', 'config'].includes(activeTab) && (
         <FadeIn>
            <EmptyState icon={Box} title="Module Under Construction" description="This admin module is currently being built." />
         </FadeIn>
      )}
    </div>
  );
}
