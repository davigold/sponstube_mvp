
import React, { useState } from 'react';
import { 
  Filter as FilterIcon, ChevronDown, ChevronUp, Check, X, Search, 
  MapPin, Globe, ShieldCheck, DollarSign, Users, MonitorPlay, BarChart3, Youtube
} from 'lucide-react';
import { FilterState } from '../utils/filterState';

interface MarketplaceFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onClear: () => void;
  role: 'brand' | 'community' | 'staff';
  mode: 'entity' | 'offer';
}

interface FilterGroupProps {
  label: string;
  icon?: React.ElementType;
  isOpenDefault?: boolean;
  children: React.ReactNode;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ 
  label, 
  icon: Icon, 
  isOpenDefault = false, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="border-b border-slate-800 last:border-0 py-4">
      <button 
        className="flex items-center justify-between w-full text-sm font-bold text-slate-300 hover:text-white transition-colors mb-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-slate-500" />}
          {label}
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {isOpen && (
        <div className="pt-2 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between py-1.5 cursor-pointer group">
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-[#FF0000] border-[#FF0000]' : 'bg-transparent border-slate-700 group-hover:border-slate-500'}`}>
        {checked && <Check size={10} className="text-white" />}
      </div>
      <span className={`text-sm ${checked ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-200'}`}>{label}</span>
    </div>
  </label>
);

export const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({ 
  filters, 
  onChange, 
  onClear, 
  role,
  mode
}) => {
  const isBrand = role === 'brand';
  
  const toggleArrayItem = (field: keyof FilterState, value: string) => {
    const current = filters[field] as string[];
    const next = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    onChange({ ...filters, [field]: next });
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <FilterIcon size={18} /> Filtros
        </h3>
        <button onClick={onClear} className="text-xs text-slate-500 hover:text-[#FF0000] transition-colors">
          Limpar
        </button>
      </div>

      <FilterGroup label="Formato YouTube" icon={Youtube} isOpenDefault={true}>
        <div className="space-y-1">
          <CheckboxItem label="Vídeo Longo" checked={filters.platforms.includes('long_form')} onChange={() => toggleArrayItem('platforms', 'long_form')} />
          <CheckboxItem label="YouTube Shorts" checked={filters.platforms.includes('shorts')} onChange={() => toggleArrayItem('platforms', 'shorts')} />
          <CheckboxItem label="Live Stream" checked={filters.platforms.includes('live')} onChange={() => toggleArrayItem('platforms', 'live')} />
          <CheckboxItem label="Post na Comunidade" checked={filters.platforms.includes('community_post')} onChange={() => toggleArrayItem('platforms', 'community_post')} />
        </div>
      </FilterGroup>

      <FilterGroup label="Categoria do Canal" icon={Globe} isOpenDefault={true}>
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
          {['Tecnologia & Dev', 'Games', 'Finanças', 'Cripto', 'Negócios', 'Lifestyle', 'Educação', 'Beleza', 'Vlog'].map(c => (
            <CheckboxItem 
              key={c}
              label={c}
              checked={filters.categories.includes(c)}
              onChange={() => toggleArrayItem('categories', c)}
            />
          ))}
        </div>
      </FilterGroup>

      {mode === 'entity' && (
        <FilterGroup label="Inscritos / Subs" icon={Users} isOpenDefault={true}>
          <div className="space-y-3 px-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Mín</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:border-red-500 outline-none" placeholder="10k"
                  value={filters.minSize} onChange={e => onChange({...filters, minSize: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Máx</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:border-red-500 outline-none" placeholder="Qualquer"
                  value={filters.maxSize} onChange={e => onChange({...filters, maxSize: e.target.value})} />
              </div>
            </div>
          </div>
        </FilterGroup>
      )}

      <FilterGroup label="CPM / Preço" icon={DollarSign} isOpenDefault={true}>
        <div className="space-y-3 px-1">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Mín (BRL)</label>
              <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:border-red-500 outline-none" placeholder="0"
                value={filters.minPrice} onChange={e => onChange({...filters, minPrice: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Máx (BRL)</label>
              <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:border-red-500 outline-none" placeholder="Qualquer"
                value={filters.maxPrice} onChange={e => onChange({...filters, maxPrice: e.target.value})} />
            </div>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup label="Qualidade" icon={ShieldCheck}>
        <div className="space-y-1">
          <CheckboxItem label="Dono Verificado (API)" checked={filters.verification.includes('verified')} onChange={() => toggleArrayItem('verification', 'verified')} />
          <CheckboxItem label="Alta Retenção (Premium)" checked={filters.verification.includes('premium')} onChange={() => toggleArrayItem('verification', 'premium')} />
        </div>
      </FilterGroup>
    </div>
  );
};
