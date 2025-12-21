
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Check, Target, Users, Zap, 
  Globe, Briefcase, LayoutTemplate, Sparkles,
  Smartphone, DollarSign, MapPin, Youtube,
  BarChart3, ShieldCheck, Search, Image as ImageIcon,
  ChevronRight, PlayCircle, MonitorPlay, Mic, Loader2, Link as LinkIcon, CheckCircle2,
  SlidersHorizontal, Ban, X, Video
} from 'lucide-react';
import { 
  Button, Card, CardContent, Input, Select, Badge, YouTubeConnectButton, CardHeader, CardTitle 
} from '../components/Common';
import { Role, BrandProfile, Community } from '../types';
import { NICHES } from '../constants/taxonomy';

interface OnboardingProps {
  userRole: Role;
  onComplete: (data: Partial<BrandProfile> | Partial<Community>, draft?: any) => void;
}

const StepIndicator = ({ current, total }: { current: number, total: number }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div 
        key={i} 
        className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 === current ? 'w-8 bg-[#FF0000]' : i + 1 < current ? 'w-2 bg-emerald-500' : 'w-2 bg-slate-200 dark:bg-slate-800'}`} 
      />
    ))}
  </div>
);

// --- BRAND FLOW: 1. INTELLIGENCE SCAN ---
const BrandUrlScannerStep = ({ onNext }: { onNext: (data: any) => void }) => {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
    const [scannedData, setScannedData] = useState<any>(null);

    const handleScan = () => {
        if (!url) return;
        setStatus('scanning');
        // Simulate AI Scraping - UPDATED TO B2C EXAMPLE
        setTimeout(() => {
            setScannedData({
                name: 'Urban Kicks Store',
                logo: 'https://ui-avatars.com/api/?name=Urban+Kicks&background=000&color=fff',
                sector: 'E-commerce / Fashion',
                tone: 'Jovem, Urbano, Hype'
            });
            setStatus('success');
        }, 2000);
    };

    return (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Vamos configurar sua Marca</h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                    Cole o site da sua empresa. Nossa IA analisará seu produto para sugerir os melhores canais.
                </p>
            </div>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardContent className="p-8">
                    {status === 'success' ? (
                        <div className="animate-in zoom-in-95">
                            <div className="w-20 h-20 mx-auto rounded-xl border border-slate-200 dark:border-slate-800 p-1 mb-4">
                                <img src={scannedData.logo} className="w-full h-full rounded-lg object-cover" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{scannedData.name}</h3>
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                <Badge variant="brand">{scannedData.sector}</Badge>
                                <Badge variant="neutral">{scannedData.tone}</Badge>
                            </div>
                            <Button size="lg" className="w-full" onClick={() => onNext(scannedData)}>
                                Sim, esta é minha empresa <ArrowRight size={16} className="ml-2"/>
                            </Button>
                            <button onClick={() => setStatus('idle')} className="mt-4 text-xs text-slate-400 hover:text-slate-600 underline">Escanear outro site</button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Globe size={18} className="text-slate-400" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="ex: www.urbankicks.com.br"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    disabled={status === 'scanning'}
                                />
                            </div>
                            
                            <Button 
                                size="lg" 
                                className="w-full bg-indigo-600 hover:bg-indigo-500" 
                                onClick={handleScan}
                                isLoading={status === 'scanning'}
                                disabled={!url}
                            >
                                {status === 'scanning' ? 'Analisando Marca...' : 'Analisar com IA'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// --- BRAND FLOW: 2. STRATEGY ---
const BrandStrategyStep = ({ onNext }: { onNext: (data: any) => void }) => {
    const [goal, setGoal] = useState('conversion');
    const [budget, setBudget] = useState('5000');

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Defina seu Foco</h2>
                <p className="text-slate-500 dark:text-slate-400">Isso ajuda nosso algoritmo a encontrar creators com o ROI ideal.</p>
            </div>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardContent className="p-8 space-y-8">
                    {/* Goals */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Target size={16} className="text-indigo-500"/> Qual o objetivo principal?
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { id: 'conversion', label: 'Vendas / Leads', icon: DollarSign },
                                { id: 'awareness', label: 'Brand Awareness', icon: Zap },
                                { id: 'content', label: 'UGC / Conteúdo', icon: Video },
                            ].map(opt => (
                                <div 
                                    key={opt.id}
                                    onClick={() => setGoal(opt.id)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${goal === opt.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-300'}`}
                                >
                                    <opt.icon size={24} />
                                    <span className="font-bold text-sm">{opt.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Briefcase size={16} className="text-emerald-500"/> Budget Mensal Estimado
                        </label>
                        <Select 
                            options={[
                                { label: 'R$ 1k - R$ 5k (Start)', value: '5000' },
                                { label: 'R$ 5k - R$ 20k (Growth)', value: '20000' },
                                { label: 'R$ 20k - R$ 100k (Scale)', value: '100000' },
                                { label: 'R$ 100k+ (Enterprise)', value: '500000' },
                            ]}
                            value={budget}
                            onChange={e => setBudget(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 py-3"
                        />
                        <p className="text-xs text-slate-500">Não se preocupe, você define o orçamento de cada campanha individualmente.</p>
                    </div>

                    <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white" onClick={() => onNext({ goal, budget })}>
                        Acessar Dashboard
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

// --- CREATOR FLOW: 1. API SYNC ---
const CreatorConnectStep = ({ onNext }: { onNext: (data: any) => void }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const handleConnect = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Conecte seu Canal</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Usamos a API oficial do YouTube para verificar sua propriedade, métricas reais e criar seu Media Kit automaticamente.
        </p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
        {status === 'success' ? (
          <div className="p-8 animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 mx-auto rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden mb-4 relative">
                <img src="https://ui-avatars.com/api/?name=Bella+Life&background=FF0000&color=fff" className="w-full h-full object-cover" />
                <div className="absolute bottom-1 right-1 bg-emerald-500 p-1.5 rounded-full border-2 border-white dark:border-slate-900">
                   <Check size={12} className="text-white" />
                </div>
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Bella Makeup & Life</h3>
             <div className="flex justify-center gap-4 text-sm text-slate-500 mb-8">
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"><Users size={14}/> 850k Subs</span>
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"><BarChart3 size={14}/> 120k Avg Views</span>
             </div>
             <Button size="lg" className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white shadow-lg shadow-red-500/20" onClick={() => onNext({ name: 'Bella Makeup', size: 850000 })}>
                Confirmar e Continuar <ArrowRight size={18} className="ml-2" />
             </Button>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center">
             <div className={`w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-8 relative ${status === 'scanning' ? 'animate-pulse' : ''}`}>
                <Youtube size={48} className="text-[#FF0000]" />
                {status === 'scanning' && (
                   <div className="absolute inset-0 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                )}
             </div>
             
             {status === 'scanning' ? (
                <div className="space-y-2">
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analisando Dados...</h3>
                   <p className="text-sm text-slate-500">Importando demografia, taxa de engajamento e histórico de vídeos.</p>
                </div>
             ) : (
                <div className="w-full space-y-6">
                   <YouTubeConnectButton onConnect={handleConnect} className="w-full justify-center py-4 text-base" />
                   <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Permissão apenas de leitura. Nunca postaremos ou deletaremos vídeos.
                   </p>
                </div>
             )}
          </div>
        )}
      </Card>
    </div>
  );
};

// --- CREATOR FLOW: 2. STRATEGY & RULES ---
const CreatorStrategyStep = ({ onNext, initialData }: { onNext: (data: any) => void, initialData: any }) => {
    const [cpm, setCpm] = useState('35');
    const [niche, setNiche] = useState('Beauty & Makeup');
    const [blacklist, setBlacklist] = useState<string[]>([]);

    const toggleBlacklist = (item: string) => {
        setBlacklist(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Regras de Negócio</h2>
                <p className="text-slate-500 dark:text-slate-400">Configure como a IA deve precificar e filtrar ofertas para você.</p>
            </div>
            
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardContent className="p-8 space-y-8">
                    
                    {/* Pricing */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <DollarSign size={16} className="text-emerald-500"/> CPM Base (Custo por 1k Views)
                            </label>
                            <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Média do Nicho: R$ 30-50</span>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                            <input 
                                type="number" 
                                value={cpm}
                                onChange={e => setCpm(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-lg font-mono font-bold focus:ring-2 focus:ring-[#FF0000] outline-none"
                            />
                        </div>
                        <p className="text-xs text-slate-500">Usaremos isso para sugerir preços nos seus slots automáticos.</p>
                    </div>

                    {/* Niche */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Target size={16} className="text-indigo-500"/> Nicho Principal
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {['Beauty & Makeup', 'Gaming', 'Finance', 'Lifestyle', 'Tech', 'Home & Decor'].map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setNiche(cat)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${niche === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Brand Safety */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Ban size={16} className="text-rose-500"/> O que você NÃO divulga?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['Cassinos / Apostas', 'Cripto / NFTs', 'Adulto (+18)', 'Dropshipping', 'Política', 'Bebidas Alcoólicas'].map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => toggleBlacklist(tag)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${blacklist.includes(tag) ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-200 dark:border-rose-800' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400'}`}
                                >
                                    {tag} {blacklist.includes(tag) && <X size={12} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white" onClick={() => onNext({ cpm, niche, blacklist })}>
                        Finalizar Configuração
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default function Onboarding({ userRole, onComplete }: OnboardingProps) {
  const [stepIndex, setStepIndex] = useState(1);
  const [data, setData] = useState<any>({});
  
  const creatorSteps = 2; 
  const brandSteps = 2; // Increased to 2 steps for Brand
  const totalSteps = userRole === 'community' ? creatorSteps : brandSteps;

  const handleNext = (stepData: any = {}) => {
    const updatedData = { ...data, ...stepData };
    setData(updatedData);

    if (stepIndex >= totalSteps) {
        // Finalize
        onComplete(updatedData, {
            name: userRole === 'community' ? 'Meu Primeiro Slot' : 'Campanha de Lançamento',
            category: updatedData.niche || updatedData.sector || 'Geral',
            priceMin: userRole === 'community' ? 500 : undefined,
            budgetMin: userRole === 'brand' ? 5000 : undefined,
        });
    } else {
      setStepIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pt-10 pb-12 px-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FF0000]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col">
         <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
               <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Spons<span className="text-[#FF0000]">Tube</span>
               </span>
            </div>
            {/* Show indicator for both roles now */}
            <StepIndicator current={stepIndex} total={totalSteps} />
         </div>

         <div className="flex-1 flex flex-col justify-center">
            
            {userRole === 'community' ? (
               <>
                  {stepIndex === 1 && <CreatorConnectStep onNext={handleNext} />}
                  {stepIndex === 2 && <CreatorStrategyStep onNext={handleNext} initialData={data} />}
               </>
            ) : (
               <>
                  {stepIndex === 1 && <BrandUrlScannerStep onNext={handleNext} />}
                  {stepIndex === 2 && <BrandStrategyStep onNext={handleNext} />}
               </>
            )}
         </div>
      </div>
    </div>
  );
}
