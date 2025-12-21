
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter as FilterIcon, LayoutTemplate, SlidersHorizontal, 
  Zap, Clock, Target, ArrowRight, Play, CheckCircle2, Hourglass
} from 'lucide-react';
import { 
  PageHeader, Input, Select, Button, EmptyState, Badge, Card, CardContent 
} from '../components/Common';
import { TemplateDetailsDrawer } from '../components/TemplateDetailsDrawer';
import { MOCK_TEMPLATES, PLATFORM_DICT } from '../mockData';
import { Role, ActionTemplate } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { navigateTo } from '../utils/navigation';

const TemplateCardThumbnail: React.FC<{ template: ActionTemplate, onClick: (t: ActionTemplate) => void }> = ({ template, onClick }) => {
    const bgGradient = template.id.includes('shorts') ? 'bg-gradient-to-br from-red-600 to-rose-900' : 'bg-gradient-to-br from-slate-800 to-slate-950';
    
    // Horizon Badge Color
    const horizonColor = 
        template.horizon === 'short' ? 'bg-emerald-500' :
        template.horizon === 'medium' ? 'bg-indigo-500' : 'bg-purple-600';

    return (
        <div 
            onClick={() => onClick(template)}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all hover:shadow-xl flex flex-col h-full"
        >
            <div className={`h-32 w-full ${bgGradient} relative flex items-center justify-center shrink-0`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Play size={20} fill="currentColor" className="ml-1 opacity-90" />
                </div>
                <div className="absolute top-3 right-3">
                    <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wider ${horizonColor} shadow-sm`}>
                        {template.horizon} Term
                    </span>
                </div>
                <div className="absolute top-3 left-3">
                    <Badge variant="neutral" className="bg-black/40 text-white border-transparent backdrop-blur-sm">{template.category}</Badge>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">{template.name}</h3>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="capitalize">{template.difficulty} Effort</span>
                    <span>•</span>
                    <span className="capitalize">{PLATFORM_DICT[template.supportedPlatforms[0]]?.label || 'YouTube'}</span>
                </div>
                
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{template.baseBriefing}</p>
                
                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button size="sm" variant="secondary" className="w-full text-xs h-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        Ver Detalhes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default function Templates({ userRole }: { userRole: Role }) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterHorizon, setFilterHorizon] = useState('all');
  const [viewingTemplate, setViewingTemplate] = useState<ActionTemplate | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(MOCK_TEMPLATES.map(t => t.category)))], 
  []);

  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchesHorizon = filterHorizon === 'all' || t.horizon === filterHorizon;
      return matchesSearch && matchesCategory && matchesHorizon;
    });
  }, [searchQuery, filterCategory, filterHorizon]);

  const handleUseTemplate = (template: ActionTemplate) => {
    setIsDrawerOpen(false);
    // UX FIX: Redirect to Campaigns (Creation Hub) with Deep Link
    navigateTo(`/app/campaigns?action=create&templateId=${template.id}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Galeria de Estratégias" 
        subtitle="Explore formatos validados para maximizar seus resultados."
        action={
           <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <Zap size={14} className="text-amber-500" />
              <span>{MOCK_TEMPLATES.length} Formatos Disponíveis</span>
           </div>
        }
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
         <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                  type="text" 
                  placeholder="Pesquisar formatos (ex: 'Review', 'Shorts')..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
               />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
               <Select 
                  className="min-w-[140px] bg-slate-50 dark:bg-slate-900"
                  options={[
                      { label: 'Duração: Todas', value: 'all' },
                      { label: 'Curto Prazo (Short)', value: 'short' },
                      { label: 'Médio Prazo (Mid)', value: 'medium' },
                      { label: 'Longo Prazo (Long)', value: 'long' }
                  ]}
                  value={filterHorizon}
                  onChange={e => setFilterHorizon(e.target.value)}
               />
               <Select 
                  className="min-w-[140px] bg-slate-50 dark:bg-slate-900"
                  options={categories.map(c => ({ label: c === 'all' ? 'Categorias: Todas' : c.charAt(0).toUpperCase() + c.slice(1), value: c }))}
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
               />
            </div>
         </div>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredTemplates.map(template => (
              <TemplateCardThumbnail 
                 key={template.id}
                 template={template}
                 onClick={(t) => { setViewingTemplate(t); setIsDrawerOpen(true); }}
              />
           ))}
        </div>
      ) : (
        <EmptyState 
           icon={LayoutTemplate}
           title="Nenhum formato encontrado"
           description="Tente ajustar seus filtros."
           action={
              <Button variant="secondary" onClick={() => { setSearchQuery(''); setFilterCategory('all'); setFilterHorizon('all'); }}>
                 Limpar Filtros
              </Button>
           }
        />
      )}

      <TemplateDetailsDrawer 
         template={viewingTemplate}
         open={isDrawerOpen}
         onClose={() => setIsDrawerOpen(false)}
         primaryActionLabel={userRole === 'brand' ? "Usar no Briefing" : "Vender este Formato"}
         onPrimaryAction={handleUseTemplate}
      />
    </div>
  );
}
