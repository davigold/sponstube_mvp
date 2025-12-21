
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, AlertCircle, FileText, Upload, 
  MessageSquare, ChevronRight, MoreHorizontal, Filter as FilterIcon, 
  Search, Calendar, Download, Eye, ExternalLink, Briefcase, X, Plus,
  Link as LinkIcon, Image as ImageIcon, KanbanSquare, LayoutGrid, Zap, PlayCircle, Loader2, PieChart
} from 'lucide-react';
import { 
  Button, Card, CardContent, CardHeader, CardTitle, Badge, PageHeader, 
  Input, Select, EmptyState, FadeIn
} from '../components/Common';
import { MOCK_CAMPAIGNS, MOCK_COMMUNITIES } from '../mockData';
import { Campaign, Role, Execution } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { ExecutionPipeline } from '../components/ExecutionPipeline';
import { TemplateDetailsDrawer } from '../components/TemplateDetailsDrawer';
import { MessageThread } from '../components/MessageThread';
import { CampaignReport } from '../components/CampaignReport';

// Enhanced Kanban for Creators
const CREATOR_COLUMNS = [
  { id: 'proposed', label: 'Propostas Enviadas', statuses: ['applied', 'proposed'] },
  { id: 'todo', label: 'Para Fazer', statuses: ['approved', 'in_escrow', 'running'] },
  { id: 'review', label: 'Em Aprovação', statuses: ['awaiting_report', 'dispute'] },
  { id: 'done', label: 'Concluído', statuses: ['completed'] }
];

const BRAND_COLUMNS = [
  { id: 'match', label: 'Negociação (Applicants)', statuses: ['proposed', 'applied', 'published'] },
  { id: 'escrow', label: 'Pagar (Escrow)', statuses: ['approved'] },
  { id: 'execution', label: 'Em Produção', statuses: ['in_escrow', 'running'] },
  { id: 'review', label: 'Aprovar Entrega', statuses: ['awaiting_report', 'dispute'] },
  { id: 'done', label: 'Concluído', statuses: ['completed'] }
];

// --- CARD COMPONENT ---
interface PipelineCardProps {
  item: Campaign;
  onClick: () => void;
  userRole: Role;
  formatCurrency: (v: number) => string;
}

const PipelineCard: React.FC<PipelineCardProps> = ({ item, onClick, userRole, formatCurrency }) => (
  <div 
    onClick={onClick}
    className={`
      bg-white dark:bg-slate-900 border rounded-xl p-4 cursor-pointer transition-all shadow-sm group relative overflow-hidden
      ${item.status === 'in_escrow' ? 'border-emerald-500/30 ring-1 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500'}
    `}
  >
      {/* Visual Status Indicator */}
      {item.status === 'in_escrow' && (
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-bold uppercase tracking-wider shadow-sm">
              Pago (Escrow)
          </div>
      )}
      {item.status === 'awaiting_report' && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-bold uppercase tracking-wider shadow-sm">
              Aprovação
          </div>
      )}
      {item.status === 'applied' && userRole === 'community' && (
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-bold uppercase tracking-wider shadow-sm">
              Aguardando
          </div>
      )}
      {item.status === 'approved' && userRole === 'brand' && (
          <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-bold uppercase tracking-wider shadow-sm">
              Pagamento Pendente
          </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-indigo-500 transition-colors line-clamp-1">{item.name}</h4>
      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{item.brief}</p>
      
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {userRole === 'brand' ? 'C' : 'B'}
              </div>
              <span className="text-[10px] text-slate-400">{userRole === 'brand' ? '@Creator' : 'Brand'}</span>
          </div>
          <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300">{formatCurrency(item.budgetTotal)}</span>
      </div>
      
      {/* Action Prompt - Creator Side */}
      {item.status === 'running' && userRole === 'community' && (
          <button className="mt-3 w-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold text-center py-1.5 rounded-md border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
              Enviar Prova
          </button>
      )}
      {/* Action Prompt - Brand Side */}
      {item.status === 'awaiting_report' && userRole === 'brand' && (
          <button className="mt-3 w-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center py-1.5 rounded-md border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
              Revisar & Pagar
          </button>
      )}
  </div>
);

// --- DRAWER COMPONENT ---
const CampaignDrawer = ({ 
    campaign, 
    role, 
    onClose, 
    onUpdate
}: { 
    campaign: Campaign | null, 
    role: Role, 
    onClose: () => void, 
    onUpdate: (id: string, newStatus: Campaign['status']) => void
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    
    if (!campaign) return null;

    // Report is available even if not completed for preview purposes in this demo
    // In production, might restrict to running/completed
    const tabs = ['overview', 'messages', 'report', 'files'];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{campaign.name}</h2>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Badge variant="neutral">{campaign.status}</Badge>
                                <span>ID: {campaign.id}</span>
                            </div>
                        </div>
                        <Button variant="ghost" onClick={onClose}><X size={20} /></Button>
                    </div>
                    
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 min-w-[80px] py-1.5 text-xs font-bold rounded-md capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                {tab === 'report' ? 'Relatórios' : tab === 'overview' ? 'Execução' : tab === 'messages' ? 'Chat' : 'Arquivos'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                    {activeTab === 'overview' && (
                        <ExecutionPipeline 
                            campaign={campaign} 
                            role={role} 
                            onStatusChange={(s) => onUpdate(campaign.id, s)} 
                        />
                    )}
                    {activeTab === 'messages' && (
                        <MessageThread contextId={campaign.id} userRole={role} className="h-full" />
                    )}
                    {activeTab === 'report' && (
                        <CampaignReport campaign={campaign} />
                    )}
                    {activeTab === 'files' && (
                        <div className="text-center py-10 text-slate-500">
                            <Upload size={40} className="mx-auto mb-4 opacity-50" />
                            <p>Asset management (logos, scripts) here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Management({ userRole }: { userRole: Role }) {
  const { t } = useI18n();
  const { formatCurrency } = useCurrency();
  const [items, setItems] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [selectedItem, setSelectedItem] = useState<Campaign | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize data including localStorage items
  useEffect(() => {
      try {
          const stored = localStorage.getItem('cm_campaigns');
          if (stored) {
              const newItems = JSON.parse(stored);
              // Merge unique items by ID
              const merged = [...newItems, ...MOCK_CAMPAIGNS].filter((item, index, self) => 
                  index === self.findIndex((t) => t.id === item.id)
              );
              setItems(merged);
          }
      } catch (e) {
          console.error("Failed to load campaigns", e);
      }
  }, []);

  // Handle status updates from the drawer
  const handleUpdateStatus = (id: string, newStatus: Campaign['status']) => {
      setItems(prev => {
          const updated = prev.map(item => item.id === id ? { ...item, status: newStatus } : item);
          // Persist changes to localStorage if it's a dynamic item
          if (id.startsWith('custom-')) {
              const dynamics = updated.filter(i => i.id.startsWith('custom-'));
              localStorage.setItem('cm_campaigns', JSON.stringify(dynamics));
          }
          return updated;
      });
      setSelectedItem(prev => prev ? { ...prev, status: newStatus } : null);
  };

  // Demo Feature: Simulate Logic
  const handleSimulate = () => {
      setIsSimulating(true);
      
      if (userRole === 'community') {
          // Simulate Brand sending an Order
          setTimeout(() => {
              const newOrder: Campaign = {
                  id: `demo-${Date.now()}`,
                  brandId: 'b1',
                  name: 'Campanha Demo: Vercel Launch',
                  status: 'in_escrow', 
                  brief: 'Precisamos de um vídeo de 60s explicando as novas features do Next.js.',
                  budgetTotal: 3500,
                  templatesUsedIds: ['yt_integrated_60'],
                  createdAt: new Date().toISOString()
              };
              setItems([newOrder, ...items]);
              setIsSimulating(false);
              setSelectedItem(newOrder);
          }, 1000);
      } else {
          // BRAND SIMULATION: Simulate Creator actions to unblock the Brand flow
          setTimeout(() => {
              // Priority 1: Accept application
              const applied = items.find(c => c.status === 'applied');
              if (applied) {
                  handleUpdateStatus(applied.id, 'approved');
                  setIsSimulating(false);
                  alert("Demo: Creator 'aceitou' a proposta. Agora você pode pagar o Escrow.");
                  return;
              }

              // Priority 2: Submit proof for running campaign
              const runningCampaign = items.find(c => c.status === 'running' || c.status === 'in_escrow');
              
              if (runningCampaign) {
                  // Simulate proof submission
                  localStorage.setItem(`cm_proof_${runningCampaign.id}`, JSON.stringify({
                      link: 'https://youtube.com/watch?v=demo123',
                      screenshot: '',
                      notes: 'Vídeo publicado conforme briefing!',
                      timestamp: new Date().toISOString()
                  }));
                  handleUpdateStatus(runningCampaign.id, 'awaiting_report');
                  alert("Demo: O Creator enviou a prova! Verifique a coluna 'Aprovar Entrega'.");
              } else {
                  alert("Crie uma campanha ou mova uma existente para 'Em Produção' primeiro.");
              }
              setIsSimulating(false);
          }, 1000);
      }
  };

  const COLUMNS = userRole === 'community' ? CREATOR_COLUMNS : BRAND_COLUMNS;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <PageHeader 
        title={userRole === 'community' ? "Entregas & Jobs" : "Pipeline de Vídeos"} 
        subtitle={userRole === 'community' ? "Gerencie seus trabalhos ativos." : "Acompanhe a produção das suas campanhas."}
        action={
            <div className="flex gap-2">
                <Button 
                    variant="secondary" 
                    icon={isSimulating ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} />} 
                    onClick={handleSimulate}
                    disabled={isSimulating}
                >
                    {userRole === 'community' ? "Simular Pedido" : "Simular Ação do Creator"}
                </Button>
                <Button variant="ghost" icon={<FilterIcon size={16} />}>Filtros</Button>
            </div>
        }
      />

      <div className="flex-1 overflow-x-auto pb-4">
         <div className="flex gap-4 h-full min-w-max px-1">
            {COLUMNS.map(col => {
                const colItems = items.filter(i => col.statuses.includes(i.status));
                // Brand logic: Escrow and Review are critical actionable steps
                const isActionable = 
                    (userRole === 'community' && col.id === 'todo') || 
                    (userRole === 'brand' && (col.id === 'escrow' || col.id === 'review'));
                
                return (
                    <div key={col.id} className={`w-[320px] flex flex-col rounded-2xl border ${isActionable ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-500/20' : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/50'}`}>
                        <div className="p-4 border-b border-inherit flex justify-between items-center sticky top-0 bg-inherit rounded-t-2xl z-10 backdrop-blur-sm">
                            <h3 className={`font-bold text-xs uppercase tracking-wide ${isActionable ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                {col.label}
                            </h3>
                            <Badge variant={isActionable ? 'brand' : 'neutral'}>{colItems.length}</Badge>
                        </div>
                        <div className="p-3 space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
                            {colItems.map(item => (
                                <PipelineCard 
                                    key={item.id} 
                                    item={item} 
                                    onClick={() => setSelectedItem(item)}
                                    userRole={userRole}
                                    formatCurrency={formatCurrency}
                                />
                            ))}
                            {colItems.length === 0 && (
                                <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800/50 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs opacity-60">
                                    <div className="mb-2">
                                        {col.id === 'done' ? <CheckCircle2 size={24}/> : <Clock size={24}/>}
                                    </div>
                                    Vazio
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
         </div>
      </div>

      <CampaignDrawer 
         campaign={selectedItem} 
         role={userRole} 
         onClose={() => setSelectedItem(null)} 
         onUpdate={handleUpdateStatus}
      />
    </div>
  );
}
