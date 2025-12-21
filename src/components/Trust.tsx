
import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Star, Lock, FileCheck, 
  AlertTriangle, Flag, X, CheckCircle2, HelpCircle,
  Award, TrendingUp, Clock, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, InfoTooltip } from './Common';
import { useI18n } from '../contexts/I18nContext';

// --- VERIFICATION BADGE ---
export const VerificationBadge = ({ status, className }: { status: string, className?: string }) => {
  if (status === 'verified') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider ${className}`} title="Identidade Verificada">
        <ShieldCheck size={12} className="fill-emerald-500/20" /> Verificado
      </div>
    );
  }
  if (status === 'premium') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-[10px] font-bold uppercase tracking-wider ${className}`} title="Parceiro Premium">
        <ShieldCheck size={12} className="fill-amber-500/20" /> Premium
      </div>
    );
  }
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider ${className}`} title="Não Verificado">
      <ShieldAlert size={12} /> Não Verificado
    </div>
  );
};

// --- NEW: TRUST BADGES ---
export type TrustBadgeVariant = 'identity' | 'payment' | 'quality' | 'delivery' | 'escrow' | 'ownership';

interface TrustBadgeProps {
  type: TrustBadgeVariant;
  size?: 'sm' | 'md';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ type, size = 'sm' }) => {
  const config = {
    identity: { icon: ShieldCheck, label: 'Identidade Verificada', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' },
    payment: { icon: Lock, label: 'Pagamento Verificado', color: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400' },
    escrow: { icon: Lock, label: 'Escrow Garantido', color: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400' },
    quality: { icon: Award, label: 'Top Rated', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' },
    delivery: { icon: Clock, label: 'Entrega Rápida', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400' },
    ownership: { icon: Shield, label: 'Dono Verificado', color: 'text-cyan-600 bg-cyan-50 border-cyan-200 dark:bg-cyan-500/10 dark:border-cyan-500/20 dark:text-cyan-400' }
  };

  const current = config[type];
  const Icon = current.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${current.color} ${size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]'} font-bold uppercase tracking-wider`}>
      <Icon size={size === 'md' ? 14 : 12} />
      {current.label}
    </div>
  );
};

export const TrustBadgeGroup = ({ badges }: { badges: TrustBadgeVariant[] }) => (
  <div className="flex flex-wrap gap-2">
    {badges.map(b => <TrustBadge key={b} type={b} />)}
  </div>
);

// --- NEW: PROOF CHECKLIST ---
export const ProofChecklist = ({ items, completed = [] }: { items: string[], completed?: string[] }) => (
  <div className="space-y-2">
    <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2">
      <FileCheck size={14} /> Provas Exigidas
      <InfoTooltip content="Evidência de que os entregáveis foram concluídos." />
    </h4>
    {items.map((item, idx) => {
        const isDone = completed.includes(item) || completed.includes(idx.toString());
        return (
            <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${isDone ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${isDone ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-slate-300 dark:border-slate-600'}`}>
                        {isDone && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                    <span className={`text-sm ${isDone ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>{item}</span>
                </div>
            </div>
        );
    })}
  </div>
);

// --- REPUTATION DISPLAY ---
export const ReputationDisplay = ({ score, count, compact = false }: { score: number, count: number, compact?: boolean }) => {
  // Normalize score (assume input 0-10 or 0-100, convert to 0-5)
  const normalizedScore = score > 10 ? score / 20 : score / 2;
  
  return (
    <div className="flex items-center gap-1.5" title={`Reputação: ${normalizedScore.toFixed(1)}/5`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={compact ? 12 : 14} 
            className={`${star <= normalizedScore ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} 
          />
        ))}
      </div>
      <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'} text-slate-700 dark:text-slate-200`}>
        {normalizedScore.toFixed(1)}
      </span>
      <span className={`text-slate-400 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        ({count})
      </span>
    </div>
  );
};

// --- ANTI-FRAUD BADGES ---
export const AntiFraudBadges = () => (
  <div className="flex gap-2">
    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700" title="Fundos retidos até conclusão">
      <Lock size={10} /> Escrow Seguro
    </div>
    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700" title="Deve prover screenshots/links">
      <FileCheck size={10} /> Prova Exigida
    </div>
  </div>
);

// --- TRUST POLICY BLOCK (TRUST SUMMARY) ---
export const TrustPolicyBlock = ({ className }: { className?: string }) => {
  const { t } = useI18n();
  return (
    <Card className={`bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          Segurança & Políticas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-3 relative group">
          <Lock size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
               Proteção Escrow <InfoTooltip content={t('tooltips.escrow')} />
            </p>
            <p className="text-[10px] text-slate-500 leading-relaxed">Fundos retidos com segurança e liberados apenas quando o job é aprovado.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <FileCheck size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
               Prova de Trabalho <InfoTooltip content={t('tooltips.proofs')} />
            </p>
            <p className="text-[10px] text-slate-500 leading-relaxed">Parceiros devem enviar screenshots ou links para verificar execução.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <AlertTriangle size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Resolução de Disputas</p>
            <p className="text-[10px] text-slate-500 leading-relaxed">Nosso time de suporte intervém se os termos não forem cumpridos em 48h.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Alias as TrustSummary for PR-6 requirements
export const TrustSummary = TrustPolicyBlock;

// --- REPORT ISSUE MODAL ---
interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
}

export const ReportIssueModal = ({ isOpen, onClose, entityName }: ReportIssueModalProps) => {
  const [reason, setReason] = useState('');
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setReason('');
      setDesc('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl">
        <CardHeader className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
           <CardTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-500">
             <Flag size={18} /> Reportar Problema
           </CardTitle>
           <button onClick={onClose}><X size={20} className="text-slate-500 hover:text-slate-900 dark:hover:text-white"/></button>
        </CardHeader>
        
        <CardContent className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Denúncia Enviada</h3>
              <p className="text-sm text-slate-500">Nosso time de confiança e segurança revisará este caso em breve.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Denunciando <span className="font-bold">{entityName}</span>. Todas as denúncias são confidenciais.
              </p>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Motivo</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Selecione um motivo...</option>
                  <option value="spam">Spam ou Info Enganosa</option>
                  <option value="scam">Atividade Suspeita / Golpe</option>
                  <option value="harassment">Assédio ou Comportamento Abusivo</option>
                  <option value="other">Outro Problema</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Detalhes</label>
                <textarea 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 h-24 resize-none"
                  placeholder="Por favor, forneça mais detalhes..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!reason}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white border-transparent"
                >
                  Enviar Denúncia
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
