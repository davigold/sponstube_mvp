
import React from 'react';
import { 
  ArrowRight, DollarSign, Rocket, Upload, CheckCircle2, 
  AlertTriangle, Clock, PlayCircle, Info, Zap 
} from 'lucide-react';
import { Button, Badge } from './Common';
import { NextBestAction } from '../domain/pipeline';

// Icon mapping
export const getNBAIcon = (key?: string) => {
  switch(key) {
    case 'money': return <DollarSign size={20} />;
    case 'rocket': return <Rocket size={20} />;
    case 'upload': return <Upload size={20} />;
    case 'check': return <CheckCircle2 size={20} />;
    case 'alert': return <AlertTriangle size={20} />;
    case 'clock': return <Clock size={20} />;
    default: return <Zap size={20} />;
  }
};

interface NextBestActionProps {
  action: NextBestAction;
  onAction: (actionId: string) => void;
  className?: string;
  variant?: 'full' | 'card' | 'banner';
}

export const NextBestActionDisplay: React.FC<NextBestActionProps> = ({ 
  action, 
  onAction, 
  className = "", 
  variant = 'full' 
}) => {
  
  if (variant === 'card') {
     return (
        <div className={`mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between animate-in fade-in slide-in-from-top-1 ${className}`}>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
               <div className={`p-1 rounded-full ${action.variant === 'primary' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {React.cloneElement(getNBAIcon(action.iconKey) as React.ReactElement, { size: 12 })}
               </div>
               <span className="font-medium truncate max-w-[120px] sm:max-w-xs">{action.title}</span>
            </div>
            <Button 
                size="xs" 
                variant={action.variant === 'primary' ? 'primary' : 'secondary'} 
                onClick={(e) => { e.stopPropagation(); onAction(action.actionId); }}
                className="h-7 text-xs px-3"
            >
               {action.ctaLabel}
            </Button>
        </div>
     );
  }

  if (variant === 'banner') {
      return (
        <div className={`flex items-center justify-between p-3 rounded-lg border ${action.variant === 'primary' ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-500/30' : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800'} ${className}`}>
            <div className="flex items-center gap-3">
                <div className={`${action.variant === 'primary' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                    {React.cloneElement(getNBAIcon(action.iconKey) as React.ReactElement, { size: 18 })}
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{action.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{action.description}</p>
                </div>
            </div>
            <Button 
                size="sm" 
                variant={action.variant === 'primary' ? 'primary' : 'secondary'} 
                onClick={() => onAction(action.actionId)}
            >
                {action.ctaLabel}
            </Button>
        </div>
      );
  }

  // Full Variant (Default)
  const isPrimary = action.variant === 'primary';
  return (
    <div className={`
      relative overflow-hidden p-6 rounded-xl border transition-all mb-6
      ${isPrimary 
        ? 'bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-900 border-indigo-100 dark:border-indigo-500/30 shadow-lg shadow-indigo-500/5' 
        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'}
      ${className}
    `}>
      {isPrimary && (
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      )}
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex gap-4">
           <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center shrink-0
              ${isPrimary ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}
           `}>
              {getNBAIcon(action.iconKey)}
           </div>
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">{action.title}</h3>
                 {isPrimary && <Badge variant="brand" className="animate-pulse">Next Step</Badge>}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                 {action.description}
              </p>
           </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
           <Button 
              size="lg" 
              className={`w-full md:w-auto ${isPrimary ? 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20' : ''}`}
              variant={action.variant as any}
              onClick={() => onAction(action.actionId)}
           >
              {action.ctaLabel} <ArrowRight size={16} className="ml-2" />
           </Button>
        </div>
      </div>
    </div>
  );
};
