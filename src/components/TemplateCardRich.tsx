
import React from 'react';
import { ArrowRight, Info, Zap, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, Badge, Button } from './Common';
import { ActionTemplate } from '../types';
import { PLATFORM_DICT } from '../mockData';

interface TemplateCardRichProps {
  template: ActionTemplate;
  onViewDetails: (template: ActionTemplate) => void;
  onSelect?: (template: ActionTemplate) => void;
  selectLabel?: string;
  className?: string;
}

export const TemplateCardRich: React.FC<TemplateCardRichProps> = ({
  template,
  onViewDetails,
  onSelect,
  selectLabel = "Usar Template",
  className
}) => {
  const platformConfig = PLATFORM_DICT[template.supportedPlatforms[0]] || PLATFORM_DICT.default;

  return (
    <Card className={`group hover:border-indigo-500/50 transition-all cursor-pointer h-full flex flex-col ${className}`} onClick={() => onViewDetails(template)}>
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <Badge variant="neutral" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
            {template.category}
          </Badge>
          <div className="flex items-center gap-2">
            {template.aiAutoGenerate && (
              <Zap size={14} className="text-amber-500 fill-amber-500/20" title="IA Ready" />
            )}
            <button 
              className="text-slate-400 hover:text-indigo-600 transition-colors"
              onClick={(e) => { e.stopPropagation(); onViewDetails(template); }}
            >
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* Title & Platform */}
        <div className="mb-4">
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {template.name}
          </h4>
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: platformConfig.hex }}
            />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {platformConfig.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed flex-1">
          {template.baseBriefing}
        </p>

        {/* Footer Meta */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {template.trackingSetup?.requiresUniqueLink && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800">
                Link Único
              </span>
            )}
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium border border-slate-100 dark:border-slate-700 capitalize">
              Esforço: {template.difficulty === 'low' ? 'Baixo' : template.difficulty === 'medium' ? 'Médio' : 'Alto'}
            </span>
          </div>

          {/* Action */}
          {onSelect && (
            <Button 
              size="sm" 
              className="w-full justify-between group-hover:bg-indigo-600 group-hover:text-white transition-all"
              variant="secondary"
              onClick={(e) => { e.stopPropagation(); onSelect(template); }}
            >
              <span>{selectLabel}</span>
              <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
