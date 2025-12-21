
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, LayoutTemplate, DollarSign, 
  FileText, CheckCircle2, Zap, ArrowRight, X, Clock, Monitor,
  Eye, Copy, Calendar, Upload, AlertCircle, ShieldCheck, Link as LinkIcon,
  ListChecks, Image as ImageIcon, Package, CalendarDays, Award, Sparkles, Send, Type, Target
} from 'lucide-react';
import { 
  Button, Card, Badge, PageHeader, 
  Input, ListSkeleton, CardHeader, CardTitle, Select, InfoTooltip, EmptyState, CardContent
} from '../components/Common';
import { TemplateCardRich } from '../components/TemplateCardRich';
import { MOCK_TEMPLATES, MOCK_BRAND_PACKS, MOCK_COMMUNITY_OFFERS, PLATFORM_DICT, MOCK_CAMPAIGNS } from '../mockData';
import { Role, ActionTemplate } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { navigateTo } from '../utils/navigation';
import { OBJECTIVES } from '../constants/taxonomy';
import { parseUrlParams } from '../utils/filterState';

// --- COMPONENTS ---

// 1. CREATOR: OFFER TYPE SELECTOR
const OfferTypeSelector = ({ onSelect }: { onSelect: (type: 'slot' | 'package') => void }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
            <div 
                onClick={() => onSelect('slot')}
                className="group border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-6 cursor-pointer bg-white dark:bg-slate-900 transition-all hover:shadow-lg"
            >
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
                    <CalendarDays size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Slot Único (Spot)</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Venda uma inserção em uma data específica. Ideal para preencher inventário sobrando.
                    <br/><span className="text-xs font-bold text-indigo-500 mt-2 block">Ex: Review no vídeo de Terça-feira.</span>
                </p>
            </div>

            <div 
                onClick={() => onSelect('package')}
                className="group border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl p-6 cursor-pointer bg-white dark:bg-slate-900 transition-all hover:shadow-lg"
            >
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
                    <Package size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Pacote Estratégico</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Crie um produto recorrente ou de longo prazo. Maior ticket médio e fidelidade.
                    <br/><span className="text-xs font-bold text-emerald-500 mt-2 block">Ex: Embaixador Trimestral (3 vídeos + Stories).</span>
                </p>
            </div>
        </div>
    );
};

const TemplateSelectorStep = ({ onSelect }: { onSelect: (t: ActionTemplate) => void }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Formatos Padronizados</h4>
                <p className="text-xs text-slate-500">Escolha a base da sua entrega.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {MOCK_TEMPLATES.map(t => (
                    <TemplateCardRich 
                        key={t.id} 
                        template={t} 
                        onViewDetails={() => onSelect(t)} 
                        onSelect={onSelect}
                        selectLabel="Selecionar"
                    />
                ))}
            </div>
        </div>
    );
};

interface CustomizationStepProps {
    template: ActionTemplate | null;
    role: Role;
    offerType?: 'slot' | 'package';
    onBack: () => void;
    onSave: (data: any) => void;
    initialData?: any; // For pre-filling from Marketplace
}

const CustomizationStep = ({ template, role, offerType, onBack, onSave, initialData }: CustomizationStepProps) => {
    const { t } = useI18n();
    const isCommunity = role === 'community';
    const [activeTab, setActiveTab] = useState<'general' | 'details' | 'rules'>('general');
    const [isAILoading, setIsAILoading] = useState(false);
    
    // Initial State based on Template & Offer Type & Pre-filled Data
    const [formData, setFormData] = useState({
        // Common
        name: initialData?.name || template?.name || (isCommunity ? (offerType === 'package' ? 'Pacote Trimestral' : 'Integração 60s') : 'Lançamento Q4'),
        price: initialData?.price || template?.suggestedPriceRange?.min.toString() || '',
        category: template?.category || 'awareness',
        description: template?.baseBriefing || '',
        
        // Deliverables are crucial for SOW
        deliverables: initialData?.deliverables || template?.deliverables.join(', ') || '',

        // Brand Specific (No-Touch Requirements)
        keyMessage: 'O principal benefício é...',
        callToAction: 'Clique no link da descrição',
        trackingLink: 'https://seusite.com/utm_source=youtube',
        assetsUrl: '',
        targetId: initialData?.communityId || '',
        
        // Creator Specific (Inventory Control)
        slotDate: '',
        deliveryTime: '7', // days
        revisionsAllowed: '1',
        techSpecs: '1080p, 60fps',
        
        // Package Specifics
        duration: '3 Meses',
        recurrence: '1 vídeo por mês'
    });

    const handleSubmit = () => {
        if (!formData.name || !formData.price) return alert("Nome e Valor são obrigatórios.");
        onSave({ ...formData, type: offerType });
    };

    // AI Pricing / Briefing Logic
    const handleAIAction = () => {
        setIsAILoading(true);
        setTimeout(() => {
            if (isCommunity) {
                const views = 85000; 
                const cpm = 30; 
                const suggested = (views / 1000) * cpm;
                setFormData(prev => ({ ...prev, price: suggested.toString() }));
            } else {
                // Brand Logic: Write Brief
                setFormData(prev => ({
                    ...prev,
                    description: "Procuramos canais de tecnologia para demonstrar as novas features de IA do nosso software. O vídeo deve focar em como economizar tempo no dia a dia. Público alvo: Desenvolvedores e Designers.",
                    keyMessage: "Automatize seu trabalho com 1 clique.",
                    name: "Divulgação Feature AI - Tech Channels"
                }));
            }
            setIsAILoading(false);
        }, 1200);
    };

    const TabButton = ({ id, label, icon: Icon }: any) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === id ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
            <Icon size={16} /> {label}
        </button>
    );

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
            {/* Context Banner if Target ID exists */}
            {initialData?.targetName && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 border-b border-indigo-100 dark:border-indigo-500/20 flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-200">
                    <Target size={16} />
                    <span>Contratando: <strong>{initialData.targetName}</strong></span>
                </div>
            )}

            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-4 shrink-0 pt-4">
                <div className="flex gap-1">
                    <TabButton id="general" label="Visão Geral" icon={FileText} />
                    <TabButton id="details" label={isCommunity ? "Entregáveis" : "Assets & Roteiro"} icon={ListChecks} />
                    <TabButton id="rules" label={isCommunity ? "Regras" : "Diretrizes"} icon={ShieldCheck} />
                </div>
                {!initialData?.targetName && (
                    <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowRight className="rotate-180" size={14}/>}>Voltar</Button>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-1">
                
                {/* --- TAB: GENERAL --- */}
                {activeTab === 'general' && (
                    <div className="space-y-5">
                        <Input 
                            label={isCommunity ? (offerType === 'package' ? "Nome do Pacote" : "Nome do Slot") : "Título da Campanha"} 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder={isCommunity ? "Ex: Review Dedicado" : "Ex: Lançamento Produto X"}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label={isCommunity ? "Preço (R$)" : "Orçamento (R$)"}
                                type="number" 
                                value={formData.price} 
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                icon={<DollarSign size={16} />}
                            />
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Objetivo / Categoria</label>
                                <select 
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
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
                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Descreva o que está sendo oferecido ou solicitado..."
                            />
                        </div>
                    </div>
                )}

                {/* --- TAB: DETAILS --- */}
                {activeTab === 'details' && (
                    <div className="space-y-5">
                       {isCommunity ? (
                           <>
                               <Input label="Entregáveis (Lista)" value={formData.deliverables} onChange={e => setFormData({...formData, deliverables: e.target.value})} />
                               <div className="grid grid-cols-2 gap-4">
                                   <Input label="Prazo de Entrega (Dias)" type="number" value={formData.deliveryTime} onChange={e => setFormData({...formData, deliveryTime: e.target.value})} icon={<Clock size={16}/>} />
                                   <Input label="Revisões Inclusas" type="number" value={formData.revisionsAllowed} onChange={e => setFormData({...formData, revisionsAllowed: e.target.value})} />
                               </div>
                           </>
                       ) : (
                           <>
                               <Input label="Mensagem Chave" value={formData.keyMessage} onChange={e => setFormData({...formData, keyMessage: e.target.value})} />
                               <Input label="Call to Action (CTA)" value={formData.callToAction} onChange={e => setFormData({...formData, callToAction: e.target.value})} />
                               <Input label="Link de Rastreamento" value={formData.trackingLink} onChange={e => setFormData({...formData, trackingLink: e.target.value})} icon={<LinkIcon size={16}/>} />
                           </>
                       )}
                    </div>
                )}

                {/* --- TAB: RULES --- */}
                {activeTab === 'rules' && (
                    <div className="space-y-5">
                       <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
                           <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-2 flex items-center gap-2">
                               <ShieldCheck size={16} /> Termos de Serviço
                           </h4>
                           <p className="text-xs text-indigo-700 dark:text-indigo-400">
                               Ao publicar, você concorda que o pagamento será processado via Escrow e liberado apenas após a entrega conforme os requisitos.
                           </p>
                       </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="pt-4 mt-auto border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
                <Button variant="ghost" onClick={handleAIAction} icon={<Zap size={16} className={isAILoading ? "animate-pulse text-amber-500" : "text-amber-500"} />}>
                    {isAILoading ? t('campaigns.wizard.generating') : t('campaigns.wizard.ai_generate')}
                </Button>
                <Button onClick={handleSubmit}>
                    {isCommunity ? t('campaigns.wizard.publish_package') : t('campaigns.wizard.publish_brief')}
                </Button>
            </div>
        </div>
    );
};

export default function Campaigns({ userRole }: { userRole: Role }) {
    const { t } = useI18n();
    const { formatCurrency } = useCurrency();
    const isBrand = userRole === 'brand';
    
    // Wizard State
    const [view, setView] = useState<'list' | 'wizard_type' | 'wizard_template' | 'wizard_customize'>('list');
    const [wizardData, setWizardData] = useState<any>({});
    const [items, setItems] = useState<any[]>(() => {
        // Load initial items based on role (Mock)
        return isBrand ? MOCK_BRAND_PACKS : MOCK_COMMUNITY_OFFERS;
    });

    useEffect(() => {
        // Handle Deep Linking for Creation
        const params = parseUrlParams(window.location.search);
        if (params.query) { 
            // In a real app we might use query param 'action=create'
        }
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'create') {
            startWizard();
            
            // Pre-fill if coming from marketplace
            if (urlParams.get('communityId')) {
               setWizardData({
                   communityId: urlParams.get('communityId'),
                   targetName: urlParams.get('targetName'),
                   offerId: urlParams.get('offerId'),
                   name: urlParams.get('offerName'),
                   price: urlParams.get('price'),
                   deliverables: urlParams.get('deliverables')
               });
               setView('wizard_customize');
            }
        }
    }, []);

    const startWizard = () => {
        setWizardData({});
        if (isBrand) {
            setView('wizard_template');
        } else {
            setView('wizard_type');
        }
    };

    const handleSave = (data: any) => {
        const newItem = {
            id: `new-${Date.now()}`,
            ...wizardData,
            ...data,
            createdAt: new Date().toISOString(),
            status: isBrand ? 'draft' : 'active'
        };
        setItems([newItem, ...items]);
        setView('list');
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
            {view === 'list' && (
                <>
                    <PageHeader 
                        title={isBrand ? t('campaigns.title_brand') : t('campaigns.title_community')}
                        subtitle={isBrand ? t('campaigns.subtitle_brand') : t('campaigns.subtitle_community')}
                        action={
                            <Button icon={<Plus size={18} />} onClick={startWizard}>
                                {isBrand ? t('campaigns.create_button_brand') : t('campaigns.create_button_community')}
                            </Button>
                        }
                    />
                    
                    <div className="flex-1 overflow-y-auto">
                        {items.length === 0 ? (
                            <EmptyState 
                                icon={LayoutTemplate} 
                                title="Nenhum item encontrado" 
                                description="Crie sua primeira campanha ou slot."
                                action={<Button onClick={startWizard}>Começar</Button>}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map((item) => (
                                    <Card key={item.id} className="group hover:border-indigo-500/50 transition-all cursor-pointer">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="neutral">{item.category || item.objective}</Badge>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                                                        {formatCurrency(item.priceMin || item.budgetMin || 0)}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">{item.description}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Calendar size={12} />
                                                <span>{new Date().toLocaleDateString()}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* WIZARD VIEWS */}
            {view !== 'list' && (
                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                    <div className="mb-6">
                        <button onClick={() => setView('list')} className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 mb-2">
                            <ArrowRight className="rotate-180" size={12} /> Voltar
                        </button>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {view === 'wizard_type' ? 'Escolha o Tipo de Oferta' : 
                             view === 'wizard_template' ? 'Selecione um Formato' : 
                             'Detalhes & Customização'}
                        </h2>
                    </div>

                    <Card className="flex-1 overflow-hidden flex flex-col">
                        <CardContent className="p-6 flex-1 flex flex-col overflow-hidden">
                            {view === 'wizard_type' && (
                                <OfferTypeSelector onSelect={(type) => {
                                    setWizardData({ ...wizardData, type });
                                    setView('wizard_template');
                                }} />
                            )}

                            {view === 'wizard_template' && (
                                <TemplateSelectorStep onSelect={(template) => {
                                    setWizardData({ ...wizardData, template });
                                    setView('wizard_customize');
                                }} />
                            )}

                            {view === 'wizard_customize' && (
                                <CustomizationStep 
                                    role={userRole}
                                    template={wizardData.template}
                                    offerType={wizardData.type}
                                    initialData={wizardData}
                                    onBack={() => setView(isBrand ? 'wizard_template' : 'wizard_type')} // Simplified back nav
                                    onSave={handleSave}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
