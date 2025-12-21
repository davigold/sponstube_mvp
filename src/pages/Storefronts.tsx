
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Edit3, Eye, Save, Plus, Globe, ShieldCheck, Zap, 
  Layout, Image as ImageIcon, Share2, BarChart3,
  CheckCircle2, AlertCircle, Copy, MoveRight, X, Package,
  Trash2, Briefcase, FileText, Smartphone, Monitor,
  Star, MessageSquare, ExternalLink, Palette, Layers,
  ChevronDown, ChevronUp, GripVertical, HelpCircle, Loader2,
  MapPin, PieChart as PieChartIcon, Sparkles,
  Gift, Link as LinkIcon, Tag, Code, ListChecks, ArrowLeft, Search, DollarSign
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  Button, Card, CardContent, Input, Select, Badge, 
  PageHeader, CardHeader, CardTitle, StatCard, SectionTitle, YouTubeBadge, FadeIn
} from '../components/Common';
import { TemplateCardRich } from '../components/TemplateCardRich';
import { TemplateDetailsDrawer } from '../components/TemplateDetailsDrawer';
import { 
  MOCK_COMMUNITIES, MOCK_COMMUNITY_OFFERS, MOCK_BRANDS, MOCK_BRAND_PACKS, MOCK_TEMPLATES, generateMeasurementPack, PLATFORM_DICT
} from '../mockData';
import { Role, ActionTemplate } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { navigateTo } from '../utils/navigation';
import { OBJECTIVES } from '../constants/taxonomy';
import { YouTubeOfferCard } from '../components/YouTubeCards';
import StorefrontTemplate from './PublicStorefrontPage'; // Import the unified component

// Re-using the Public Page Component as the Preview Template
// This ensures WYSIWYG accuracy.

interface EditorState {
  identity: {
    name: string;
    tagline: string;
    description: string;
    logoUrl: string;
    coverUrl: string;
    website: string;
    tags: string[];
    city: string;
    country: string;
  };
}

const ImageUploader = ({ label, currentUrl, onChange }: { label: string, currentUrl?: string, onChange: (url: string) => void }) => (
  <div>
    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{label}</label>
    <div className="relative group cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 hover:border-indigo-500 transition-colors h-32 flex items-center justify-center">
      {currentUrl ? (
        <>
          <img src={currentUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 size={16} /></div>
          </div>
        </>
      ) : (
        <div className="text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
          <ImageIcon size={24} />
          <span className="text-xs">Clique para enviar</span>
        </div>
      )}
      <input 
        type="file" 
        className="absolute inset-0 opacity-0 cursor-pointer" 
        onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
                const mockUrl = `https://source.unsplash.com/random/800x600?sig=${Math.random()}`; 
                onChange(mockUrl);
            }
        }} 
      />
    </div>
  </div>
);

const CreateItemModal = ({ isOpen, onClose, role, onCreate }: { isOpen: boolean, onClose: () => void, role: Role, onCreate: (item: any) => void }) => {
  const isCommunity = role === 'community';
  
  // State for Wizard
  const [mode, setMode] = useState<'select' | 'edit'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingTemplate, setViewingTemplate] = useState<ActionTemplate | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>('all'); 

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'awareness',
    price: '',
    deliverables: ''
  });

  const platforms = useMemo(() => ['all', ...Array.from(new Set(MOCK_TEMPLATES.flatMap(t => t.supportedPlatforms)))], []);

  useEffect(() => {
    if (isOpen) {
      setMode('select');
      setSearchQuery('');
      setFilterPlatform('all');
      setFormData({ name: '', description: '', category: 'awareness', price: '', deliverables: '' });
    }
  }, [isOpen]);

  const handleUseTemplate = (template: ActionTemplate) => {
    setFormData({
      name: template.name,
      description: template.baseBriefing,
      category: template.category,
      price: template.suggestedPriceRange?.min.toString() || '',
      deliverables: template.deliverables.join(', ')
    });
    setMode('edit');
    setIsDrawerOpen(false);
  };

  const handleScratch = () => {
    setFormData({ name: '', description: '', category: 'awareness', price: '', deliverables: '' });
    setMode('edit');
  };

  const handleOpenDrawer = (template: ActionTemplate) => {
    setViewingTemplate(template);
    setIsDrawerOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price) return alert("Nome e Preço são obrigatórios.");

    const id = `new-${Date.now()}`;
    const measurementPack = generateMeasurementPack(isCommunity ? 'offer' : 'campaign', id, formData.name);

    const newItem = {
      id,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      priceMin: Number(formData.price),
      budgetMin: Number(formData.price),
      deliverables: formData.deliverables ? formData.deliverables.split(',').map(s => s.trim()) : [],
      kpis: formData.deliverables ? formData.deliverables.split(',').map(s => s.trim()) : [], 
      level: 'basic',
      currency: 'BRL',
      measurementPack
    };
    
    onCreate(newItem);
    onClose();
  };

  if (!isOpen) return null;

  const filteredTemplates = MOCK_TEMPLATES.filter(t => 
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (isCommunity ? (t.primarySide === 'community' || t.primarySide === 'both') : true) &&
    (filterPlatform === 'all' || t.supportedPlatforms.includes(filterPlatform))
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-4xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
        <CardHeader className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
           <div className="flex items-center gap-3">
             {mode === 'edit' && (
               <button onClick={() => setMode('select')} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                 <ArrowLeft size={20} className="text-slate-500" />
               </button>
             )}
             <CardTitle>{isCommunity ? 'Novo Slot de Patrocínio' : 'Novo Briefing Público'}</CardTitle>
           </div>
           <button onClick={onClose}><X size={20} className="text-slate-500 hover:text-slate-900 dark:hover:text-white"/></button>
        </CardHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'select' ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">Selecione um Formato</h3>
                 <p className="text-slate-500">Escolha um formato validado do YouTube para vender.</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar formatos..." 
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                    <select 
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-indigo-500"
                        value={filterPlatform}
                        onChange={(e) => setFilterPlatform(e.target.value)}
                    >
                        {platforms.map(p => (
                            <option key={p} value={p}>{p === 'all' ? 'Todas Plataformas' : PLATFORM_DICT[p]?.label || p}</option>
                        ))}
                    </select>
                    <Button variant="secondary" onClick={handleScratch} icon={<Plus size={16} />}>
                      Personalizado
                    </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map(tmpl => (
                  <TemplateCardRich 
                    key={tmpl.id} 
                    template={tmpl} 
                    onViewDetails={handleOpenDrawer}
                    onSelect={handleUseTemplate}
                    selectLabel="Vender Isto"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-lg mx-auto animate-in slide-in-from-right-4">
               <Input 
                  label={isCommunity ? "Nome do Slot" : "Título do Briefing"} 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
               />
               
               <div className="grid grid-cols-2 gap-4">
                  <Input 
                     label={isCommunity ? "Preço (A partir de)" : "Budget Est."} 
                     type="number" 
                     placeholder="1000" 
                     value={formData.price} 
                     onChange={e => setFormData({...formData, price: e.target.value})} 
                     icon={<DollarSign size={16} />}
                  />
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Categoria</label>
                     <select 
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                     >
                        {OBJECTIVES.map(obj => (
                           <option key={obj.value} value={obj.value}>{obj.label}</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Descrição</label>
                  <textarea 
                     className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[200px] resize-y placeholder:text-slate-400 dark:placeholder:text-slate-600"
                     value={formData.description} 
                     onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
               </div>

               <Input 
                  label="Entregáveis (separados por vírgula)" 
                  value={formData.deliverables} 
                  onChange={e => setFormData({...formData, deliverables: e.target.value})} 
               />

               <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg text-xs text-indigo-600 dark:text-indigo-300">
                  <span className="font-bold block mb-1 flex items-center gap-1"><Zap size={12} /> Rastreamento Automático</span>
                  Links e cupons serão gerados automaticamente para este item ao publicar.
               </div>

               <div className="pt-2">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500" onClick={handleSubmit}>
                     {isCommunity ? 'Publicar Slot' : 'Publicar Briefing'}
                  </Button>
               </div>
            </div>
          )}
        </div>
      </Card>

      <TemplateDetailsDrawer 
        template={viewingTemplate}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        primaryActionLabel="Usar Esta Estratégia"
        onPrimaryAction={handleUseTemplate}
      />
    </div>
  );
};

export default function Storefronts({ userRole }: { userRole: Role }) {
  const { formatCurrency } = useCurrency();
  const isCommunity = userRole === 'community';

  const [viewMode, setViewMode] = useState<'editor' | 'public'>('editor');
  const [activeTab, setActiveTab] = useState<'design' | 'content'>('content');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // FIX: Ensure ID match or Fallback to index 0 for robust demo
  const initialData: any = isCommunity ? MOCK_COMMUNITIES[0] : MOCK_BRANDS[0];
  
  const [editorState, setEditorState] = useState<EditorState>({
    identity: {
      name: isCommunity ? (initialData as any).name : (initialData as any).companyName,
      tagline: isCommunity ? "Criando o futuro da tech" : "Soluções inovadoras para todos",
      description: initialData.description || "Liderando o mercado com inovação e comunidade.",
      logoUrl: initialData.logoUrl || "",
      coverUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1600",
      website: initialData.website || "",
      tags: isCommunity ? (initialData as any).tags : (initialData as any).objectiveTags,
      city: initialData.city || 'São Paulo',
      country: initialData.country || 'Brasil'
    }
  });

  const [items, setItems] = useState<any[]>(() => {
      // Robust initialization: if no match by ID, give default mocks so user sees something
      const matched = isCommunity 
        ? MOCK_COMMUNITY_OFFERS.filter(o => o.communityId === initialData.id)
        : MOCK_BRAND_PACKS.filter(p => p.brandId === initialData.id);
      
      if (matched.length === 0) {
          return isCommunity ? MOCK_COMMUNITY_OFFERS.slice(0,2) : MOCK_BRAND_PACKS.slice(0,2);
      }
      return matched;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'create') {
        setIsCreateModalOpen(true);
    }
  }, []);

  const updateIdentity = (field: string, value: any) => {
    setEditorState(prev => ({ ...prev, identity: { ...prev.identity, [field]: value } }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
    }, 1500);
  };

  const handleCreateItem = (newItem: any) => {
     setItems([newItem, ...items]);
  };

  const handleDeleteItem = (id: string) => {
     setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="h-auto min-h-screen lg:h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <PageHeader 
        title={isCommunity ? "Editor do Media Kit" : "Editor do Portal da Marca"}
        subtitle="Gerencie sua presença pública e inventário de patrocínios."
        action={
           <div className="flex gap-4 items-center">
              <div className="bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-1">
                  <button 
                    onClick={() => setViewMode('editor')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'editor' ? 'bg-[#FF0000] text-white shadow' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                  >
                    Editor
                  </button>
                  <button 
                    onClick={() => setViewMode('public')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'public' ? 'bg-[#FF0000] text-white shadow' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                  >
                    Visão Pública
                  </button>
              </div>
              <Button icon={isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />} onClick={handleSave} disabled={isSaving}>
                 {isSaving ? 'Salvando...' : 'Publicar'}
              </Button>
           </div>
        }
      />

      {viewMode === 'public' && (
          <div className="flex-1 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl shadow-2xl">
              {/* Pass slug as ID for preview consistency */}
              <StorefrontTemplate mode={isCommunity ? 'community' : 'brand'} slug={initialData.id} />
          </div>
      )}

      {viewMode === 'editor' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
            {/* EDITOR SIDEBAR */}
            <div className="w-full lg:w-[400px] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shrink-0 shadow-sm">
                {/* TABS */}
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    {[
                        { id: 'content', label: 'Itens & Ofertas', icon: Layers },
                        { id: 'design', label: 'Identidade', icon: Palette },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
                                activeTab === tab.id 
                                ? 'border-[#FF0000] text-[#FF0000] bg-slate-50 dark:bg-slate-800/50' 
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-[#FF0000]'
                            }`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-6 max-h-[400px] lg:max-h-full">
                    <FadeIn key={activeTab}>
                    {activeTab === 'design' && (
                        <div className="space-y-6">
                            <ImageUploader label="Capa do Canal" currentUrl={editorState.identity.coverUrl} onChange={(url) => updateIdentity('coverUrl', url)} />
                            
                            <div className="flex gap-4">
                                <div className="w-20">
                                    <ImageUploader label="Avatar" currentUrl={editorState.identity.logoUrl} onChange={(url) => updateIdentity('logoUrl', url)} />
                                </div>
                                <div className="flex-1">
                                    <Input label="Nome de Exibição" value={editorState.identity.name} onChange={(e) => updateIdentity('name', e.target.value)} />
                                </div>
                            </div>

                            <Input label="Slogan / Tagline" value={editorState.identity.tagline} onChange={(e) => updateIdentity('tagline', e.target.value)} />
                            
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Sobre / Bio</h3>
                                <textarea 
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-[#FF0000] h-24 resize-none"
                                    value={editorState.identity.description}
                                    onChange={(e) => updateIdentity('description', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Listagens Ativas</h3>
                                <Button 
                                    size="sm" 
                                    className="bg-[#FF0000] hover:bg-[#CC0000]"
                                    onClick={() => setIsCreateModalOpen(true)}
                                    icon={<Plus size={14} />}
                                >
                                    Adicionar Novo
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 group hover:border-[#FF0000] transition-colors">
                                        <div className="min-w-0 flex-1 mr-3">
                                            <div className="font-medium text-slate-900 dark:text-slate-200 truncate">{item.name}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">{item.category}</span>
                                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(item.priceMin || item.budgetMin)}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="text-slate-400 hover:text-rose-500 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {items.length === 0 && <div className="text-center text-xs text-slate-500 py-4">Nenhum item listado.</div>}
                            </div>
                        </div>
                    )}
                    </FadeIn>
                </div>
            </div>

            {/* PREVIEW AREA */}
            <div className="flex-1 bg-slate-100 dark:bg-black rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col relative shadow-2xl min-h-[500px]">
                <div className="bg-white dark:bg-slate-900 p-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                    </div>
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-white dark:bg-slate-800 text-[#FF0000] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}><Monitor size={16} /></button>
                        <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-white dark:bg-slate-800 text-[#FF0000] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}><Smartphone size={16} /></button>
                    </div>
                    <div className="w-16"></div>
                </div>

                <div className="flex-1 overflow-hidden bg-slate-100 dark:bg-slate-950 relative flex justify-center py-8">
                    <div 
                        className={`bg-slate-950 transition-all duration-500 shadow-2xl overflow-y-auto scrollbar-hide border border-slate-800/50 ${
                            previewMode === 'mobile' ? 'w-[375px] max-w-full mx-4 h-[750px] max-h-[calc(100%-2rem)] rounded-[3rem] border-[8px] border-slate-900' : 'w-full h-full rounded-none'
                        }`}
                    >
                        <StorefrontTemplate mode={isCommunity ? 'community' : 'brand'} slug={initialData.id} />
                    </div>
                </div>
            </div>
        </div>
      )}

      <CreateItemModal 
         isOpen={isCreateModalOpen} 
         onClose={() => setIsCreateModalOpen(false)} 
         role={userRole} 
         onCreate={handleCreateItem} 
      />
    </div>
  );
}
