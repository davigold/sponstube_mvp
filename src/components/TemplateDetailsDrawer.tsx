
import React from 'react';
import { 
  X, Check, Clock, Activity, Target, Zap, Shield, Link as LinkIcon, 
  Ticket, Monitor, DollarSign, FileText, CheckCircle2, AlertCircle, ShieldAlert,
  Calendar, FileSignature, Scale, Repeat, Eye
} from 'lucide-react';
import { Button, Badge, Card, CardContent } from './Common';
import { ActionTemplate } from '../types';
import { PLATFORM_DICT } from '../mockData';
import { useCurrency } from '../contexts/CurrencyContext';

interface TemplateDetailsDrawerProps {
  template: ActionTemplate | null;
  open: boolean;
  onClose: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: (template: ActionTemplate) => void;
}

export const TemplateDetailsDrawer: React.FC<TemplateDetailsDrawerProps> = ({
  template,
  open,
  onClose,
  primaryActionLabel = "Agree & Continue",
  onPrimaryAction
}) => {
  const { formatCurrency } = useCurrency();

  if (!open || !template) return null;

  const platformConfig = PLATFORM_DICT[template.supportedPlatforms[0]] || PLATFORM_DICT.default;

  // Mock SOW Data based on Template Difficulty/Category (Visual Enforcement)
  const revisions = template.difficulty === 'high' ? 2 : template.difficulty === 'medium' ? 1 : 0;
  const rights = template.category === 'conversion' ? 'Organic + Paid Amplification (30 Days)' : 'Organic Use Only (Perpetual)';
  const timeline = template.difficulty === 'high' ? { draft: '7 Days', review: '3 Days', live: '14 Days' } : { draft: '2 Days', review: '24 Hours', live: '48 Hours' };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col font-sans">
        
        {/* Header - SOW Style */}
        <div className="sticky top-0 z-20 bg-slate-50 dark:bg-[#0F0F0F] border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <FileSignature size={14} className="text-indigo-500" />
              Statement of Work (SOW)
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {template.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
                <Badge variant="neutral">Version {template.version}.0</Badge>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-500">ID: {template.id}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 p-8 space-y-10 bg-white dark:bg-[#0F0F0F]">
          
          {/* 1. DELIVERABLES & SPECS */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <CheckCircle2 size={16} className="text-indigo-500" /> 1. Deliverables & Specifications
            </h3>
            
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                        <tr>
                            <th className="p-4 w-1/2">Item Description</th>
                            <th className="p-4">Platform</th>
                            <th className="p-4 text-right">Qty</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {template.deliverables.map((item, i) => (
                            <tr key={i}>
                                <td className="p-4 font-medium text-slate-900 dark:text-white">{item}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platformConfig.hex }}></div>
                                        <span className="text-slate-600 dark:text-slate-400">{platformConfig.label}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right text-slate-600 dark:text-slate-400">1</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 bg-slate-100 dark:bg-slate-800/50 text-xs text-slate-500 flex justify-between items-center">
                    <span><strong>Platform Requirement:</strong> {platformConfig.expectation}</span>
                    <span>Measured via: {platformConfig.measurement}</span>
                </div>
            </div>
          </section>

          {/* 2. TIMELINE & PROCESS */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Calendar size={16} className="text-indigo-500" /> 2. Production Timeline
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Draft Delivery</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{timeline.draft}</div>
                    <div className="text-[10px] text-slate-400">After Escrow Deposit</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center relative">
                    <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Review Window</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{timeline.review}</div>
                    <div className="text-[10px] text-slate-400">Client Approval Time</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center relative">
                    <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Publication</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{timeline.live}</div>
                    <div className="text-[10px] text-slate-400">After Approval</div>
                </div>
            </div>
          </section>

          {/* 3. ACCEPTANCE & REVISIONS */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ShieldAlert size={16} className="text-indigo-500" /> 3. Acceptance Criteria & Terms
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase mb-3 flex items-center gap-2">
                            <Check size={14} /> Definition of Done
                        </h4>
                        <ul className="space-y-2">
                            <li className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                                Content published on specified platform.
                            </li>
                            <li className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                                Proof of performance uploaded (Link/Screenshot).
                            </li>
                            {template.proofRequirements?.map((req, i) => (
                                <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase mb-3 flex items-center gap-2">
                            <Scale size={14} /> Rights & Revisions
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Revisions Included</span>
                                <span className="font-bold text-slate-900 dark:text-white">{revisions} Round{revisions !== 1 && 's'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Usage Rights</span>
                                <span className="font-bold text-slate-900 dark:text-white text-right max-w-[120px]">{rights}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Exclusivity</span>
                                <span className="font-bold text-slate-900 dark:text-white">None (Non-Exclusive)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* Pricing Summary */}
          {template.suggestedPriceRange && (
            <div className="p-6 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white dark:bg-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-indigo-900 dark:text-white">Estimated Investment</h4>
                        <p className="text-xs text-indigo-600 dark:text-indigo-300">Market rate for this SOW scope.</p>
                    </div>
                </div>
                <div className="text-2xl font-mono font-bold text-indigo-700 dark:text-indigo-400">
                    {formatCurrency(template.suggestedPriceRange.min)} - {formatCurrency(template.suggestedPriceRange.max)}
                </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 p-6 bg-white dark:bg-[#0F0F0F] border-t border-slate-200 dark:border-slate-800 flex gap-4 z-20">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Close Preview</Button>
          <Button 
            className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
            onClick={() => { onPrimaryAction?.(template); onClose(); }}
          >
            {primaryActionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
