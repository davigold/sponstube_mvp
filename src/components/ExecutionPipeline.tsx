
import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2, Clock, Upload, AlertTriangle,
  FileText, ExternalLink, MessageSquare, ShieldAlert,
  ChevronRight, X, Image as ImageIcon, Link as LinkIcon,
  AlertCircle, Lock, DollarSign, Send, Check, Rocket,
  PlayCircle, Eye, Calendar, Youtube, Timer, CreditCard, Receipt,
  FileSignature, ChevronDown, ChevronUp, Flag, Shield, HelpCircle, FileWarning
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input, InfoTooltip } from './Common';
import { Campaign, Role, CampaignTimelineEvent } from '../types';
import { MOCK_TEMPLATES } from '../mockData';
import { useCurrency } from '../contexts/CurrencyContext';
import { NextBestActionDisplay } from './NextBestAction';
import { useI18n } from '../contexts/I18nContext';

// --- INLINED DOMAIN LOGIC (Missing file fix) ---
export const STAGES = {
  APPLIED: 'applied',
  APPROVED: 'approved',
  IN_ESCROW: 'in_escrow',
  RUNNING: 'running',
  AWAITING_REPORT: 'awaiting_report',
  COMPLETED: 'completed',
  DISPUTE: 'dispute'
} as const;

export const STAGE_CONFIG: Record<string, { label: string; order: number }> = {
  [STAGES.APPLIED]: { label: 'Applied', order: 1 },
  [STAGES.APPROVED]: { label: 'Negotiation', order: 2 },
  [STAGES.IN_ESCROW]: { label: 'Funded', order: 3 },
  [STAGES.RUNNING]: { label: 'Production', order: 4 },
  [STAGES.AWAITING_REPORT]: { label: 'Review', order: 5 },
  [STAGES.COMPLETED]: { label: 'Done', order: 6 },
  [STAGES.DISPUTE]: { label: 'Dispute', order: 99 }
};

export const mapStatusToStage = (status: Campaign['status']) => status;

export interface NextBestAction {
  id: string;
  label: string;
  description: string;
  type: 'primary' | 'secondary' | 'waiting';
}

export const getNextBestAction = (campaign: Campaign, role: Role): NextBestAction | null => {
  const status = campaign.status;
  if (role === 'brand') {
    if (status === 'approved') return { id: 'deposit_escrow', label: 'Deposit Funds', description: 'Secure the deal with Escrow', type: 'primary' };
    if (status === 'awaiting_report') return { id: 'view_proof', label: 'Review Work', description: 'Approve delivered content', type: 'primary' };
  }
  if (role === 'community') {
    if (status === 'running') return { id: 'submit_proof', label: 'Submit Proof', description: 'Upload URL/Screenshots', type: 'primary' };
  }
  return null;
};
// ------------------------------------------------

interface ExecutionPipelineProps {
  campaign: Campaign;
  role: Role;
  onStatusChange?: (newStatus: Campaign['status']) => void;
  onTimelineEvent?: (event: CampaignTimelineEvent) => void;
}

interface ProofData {
  link: string;
  screenshot: string;
  notes: string;
  timestamp?: string;
}

// --- ESCROW TIMELINE VISUALIZATION ---
const EscrowTimeline = ({ status }: { status: Campaign['status'] }) => {
  const { t } = useI18n();
  const steps = [
    { id: 'secured', label: 'Funds Secured', active: ['in_escrow', 'running', 'awaiting_report', 'completed', 'dispute'].includes(status) },
    { id: 'work', label: 'Production', active: ['running', 'awaiting_report', 'completed', 'dispute'].includes(status) },
    { id: 'proof', label: 'Proof Verified', active: ['awaiting_report', 'completed'].includes(status) },
    { id: 'released', label: 'Funds Released', active: ['completed'].includes(status) }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 relative overflow-hidden">
      {status === 'dispute' && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <AlertTriangle size={12} /> FROZEN
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
          <Shield size={14} className="text-emerald-500" /> Escrow Protection <InfoTooltip content={t('tooltips.escrow')} />
        </h4>
        <span className="text-[10px] text-slate-400">Funds are held safely until completion.</span>
      </div>

      <div className="relative flex items-center justify-between z-10">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>

        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center bg-slate-50 dark:bg-slate-950 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${step.active
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
              }`}>
              {step.active ? <Check size={14} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />}
            </div>
            <span className={`text-[10px] mt-2 font-bold ${step.active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SOW SUMMARY CARD ---
const SOWSummaryCard = ({ campaign }: { campaign: Campaign }) => {
  const [expanded, setExpanded] = useState(false);
  const template = MOCK_TEMPLATES.find(t => t.id === campaign.templatesUsedIds?.[0]) || MOCK_TEMPLATES[0];
  const deliverables = template.deliverables || campaign.brief.split('\n').slice(0, 3); // Fallback logic

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mb-6 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
            <FileSignature size={18} />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active SOW: {template.name}</h4>
            <p className="text-xs text-slate-500">{deliverables.length} Deliverables • Due {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {expanded && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2">
          <div>
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Deliverables</h5>
            <ul className="space-y-1">
              {deliverables.map((d, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" /> {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Acceptance Criteria</h5>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Must include tracked link in description.</li>
              <li>• Must stay published for minimum 30 days.</li>
              <li>• {template.proofRequirements?.join(' & ')} required.</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Terms</h5>
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">Revisions: 1</Badge>
              <Badge variant="neutral">Rights: Organic</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- DEPOSIT MODAL ---
const DepositModal = ({ isOpen, onClose, amount, onConfirm }: { isOpen: boolean, onClose: () => void, amount: number, onConfirm: () => void }) => {
  const { formatCurrency } = useCurrency();
  const { t } = useI18n();
  const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');

  // Financial Breakdown Logic (CFO Requirement)
  const platformFeePercent = 0.15;
  const serviceFee = amount * platformFeePercent;
  const taxes = (amount + serviceFee) * 0.05; // Mock 5% tax
  const total = amount + serviceFee + taxes;

  if (!isOpen) return null;

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onConfirm();
        setStep('review'); // Reset for next time
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border border-indigo-500/20">
        <CardContent className="p-6">
          {step === 'review' && (
            <>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock size={18} className="text-indigo-500" /> Depósito Escrow
                </h3>
                <Badge variant="brand">SECURE</Badge>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2 text-sm text-slate-600 dark:text-slate-400">
                  <span>Orçamento Creator</span>
                  <span className="font-mono">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between items-center mb-2 text-sm text-slate-600 dark:text-slate-400">
                  <span>Taxa de Plataforma (15%)</span>
                  <span className="font-mono">{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>Impostos Estimados</span>
                  <span className="font-mono">{formatCurrency(taxes)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Total a Pagar</span>
                  <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400 font-mono">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6 text-[10px] text-slate-500 bg-blue-50 dark:bg-blue-900/10 p-2 rounded-lg">
                <InfoTooltip content={t('tooltips.escrow')} />
                <span>Os fundos são retidos no Escrow e só liberados após aprovação da entrega. Garantia de Reembolso.</span>
              </div>

              <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20" icon={<CreditCard size={18} />} onClick={handlePay}>
                Confirmar e Depositar
              </Button>
              <button onClick={onClose} className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-600">Cancelar Transação</button>
            </>
          )}
          {step === 'processing' && (
            <div className="py-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <p className="font-bold text-slate-900 dark:text-white text-lg">Processando Pagamento...</p>
              <p className="text-slate-500 text-sm mt-2">Conectando com Gateway Bancário Seguro</p>
            </div>
          )}
          {step === 'success' && (
            <div className="py-12 text-center animate-in zoom-in">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Fundos Garantidos!</h3>
              <p className="text-slate-500 text-sm">O Creator foi notificado para iniciar a produção.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// --- DISPUTE MODAL ---
const DisputeModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (reason: string, desc: string) => void }) => {
  const [reason, setReason] = useState('deadlines');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-white dark:bg-slate-900 border-l-4 border-l-amber-500 shadow-2xl">
        <CardHeader className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <FileWarning size={20} /> Open Dispute
          </CardTitle>
          <button onClick={onClose}><X size={20} className="text-slate-500 hover:text-slate-900 dark:hover:text-white" /></button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-500/20">
            Funds will remain frozen in Escrow until this dispute is resolved by our Trust & Safety team (approx 48h).
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Reason</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="deadlines">Missed Deadline</option>
              <option value="quality">Quality Issues / Did not follow brief</option>
              <option value="ghosting">Unresponsive / Ghosting</option>
              <option value="other">Other Issue</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Description</label>
            <textarea
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 h-32 resize-none placeholder:text-slate-400"
              placeholder="Describe the issue in detail. Provide links if possible."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-white border-transparent"
              onClick={() => onSubmit(reason, description)}
              disabled={!description.trim()}
            >
              Submit Dispute
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- PROOF MODAL ---
export const ProofSubmissionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  deliverables,
  requirements = []
}: {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (data: ProofData) => void,
  isSubmitting: boolean,
  deliverables: string[],
  requirements?: string[]
}) => {
  const [data, setData] = useState<ProofData>({ link: '', screenshot: '', notes: '', timestamp: '' });
  const [error, setError] = useState<string | null>(null);

  const isVideoProof = useMemo(() => {
    const reqs = requirements.join(' ').toLowerCase();
    return reqs.includes('video') || reqs.includes('youtube') || reqs.includes('timestamp');
  }, [requirements]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError(null);
    if (isVideoProof) {
      if (!data.link) { setError("A URL do vídeo é obrigatória."); return; }
    } else {
      if (!data.link && !data.screenshot) { setError("Forneça um link ou screenshot."); return; }
    }
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-slate-900 shadow-xl">
        <CardHeader className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle>Enviar Prova de Execução</CardTitle>
          <button onClick={onClose}><X size={20} /></button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Input
            label={isVideoProof ? "URL do Vídeo" : "Link"}
            placeholder="https://youtube.com/..."
            value={data.link}
            onChange={e => setData({ ...data, link: e.target.value })}
          />
          {isVideoProof && (
            <Input label="Minuto da Integração (Timestamp)" placeholder="00:00" value={data.timestamp} onChange={e => setData({ ...data, timestamp: e.target.value })} />
          )}
          <Input label="Screenshot (Opcional)" value={data.screenshot} onChange={e => setData({ ...data, screenshot: e.target.value })} />
          <textarea className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2" placeholder="Observações adicionais..." value={data.notes} onChange={e => setData({ ...data, notes: e.target.value })} />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <Button className="w-full" onClick={handleSubmit} isLoading={isSubmitting}>Enviar para Aprovação</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const ExecutionPipeline: React.FC<ExecutionPipelineProps> = ({ campaign, role, onStatusChange, onTimelineEvent }) => {
  const { formatCurrency } = useCurrency();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isViewProofOpen, setIsViewProofOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persistence logic...
  const [proofData, setProofData] = useState<ProofData>(() => {
    try {
      const saved = localStorage.getItem(`cm_proof_${campaign.id}`);
      return saved ? JSON.parse(saved) : { link: '', screenshot: '', notes: '', timestamp: '' };
    } catch {
      return { link: '', screenshot: '', notes: '', timestamp: '' };
    }
  });

  const currentStage = mapStatusToStage(campaign.status);
  const nba = useMemo(() => getNextBestAction(campaign, role), [campaign, role]);

  const template = MOCK_TEMPLATES.find(t => t.id === campaign.templatesUsedIds?.[0]);
  const deliverables = template?.deliverables || ['Post Padrão'];
  const requirements = template?.proofRequirements || ['Screenshot', 'Link'];

  const handleAction = (actionId: string) => {
    if (actionId === 'submit_proof') { setIsSubmitModalOpen(true); return; }
    if (actionId === 'approve_report' || actionId === 'view_proof') { setIsViewProofOpen(true); return; }
    if (actionId === 'deposit_escrow') { setIsDepositModalOpen(true); return; }

    const transitions: Record<string, Campaign['status']> = {
      'accept_proposal': 'approved',
      'start_work': 'running',
    };

    if (transitions[actionId] && onStatusChange) {
      onStatusChange(transitions[actionId]);
    }
  };

  const handleDepositConfirm = () => {
    setIsDepositModalOpen(false);
    // Ensure we immediately update to in_escrow
    if (onStatusChange) onStatusChange('in_escrow');
    if (onTimelineEvent) onTimelineEvent({ id: `evt-${Date.now()}`, type: 'status_changed', title: 'Fundos Garantidos no Escrow', description: 'A marca depositou o orçamento.', actorRole: role, createdAt: new Date().toISOString() });
  };

  const handleProofSubmit = (data: ProofData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const finalProof = { ...data, timestamp: new Date().toISOString() };
      localStorage.setItem(`cm_proof_${campaign.id}`, JSON.stringify(finalProof));
      setProofData(finalProof);
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
      if (onStatusChange) onStatusChange('awaiting_report');
    }, 1000);
  };

  const handleApproveProof = () => {
    if (confirm("Liberar fundos para o creator?")) {
      if (onStatusChange) onStatusChange('completed');
      setIsViewProofOpen(false);
    }
  };

  const handleOpenDispute = () => {
    setIsViewProofOpen(false); // Close proof if open
    setIsDisputeModalOpen(true);
  };

  const handleSubmitDispute = (reason: string, desc: string) => {
    if (onStatusChange) onStatusChange('dispute');
    setIsDisputeModalOpen(false);
    // In real app, send to backend
    console.log("Dispute opened:", reason, desc);
  };

  // --- RENDERERS ---
  const renderStepper = () => {
    const stageIds = Object.values(STAGES);
    return (
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
        {stageIds.map((stageId, idx) => {
          const config = STAGE_CONFIG[stageId];
          const isCompleted = STAGE_CONFIG[currentStage].order > config.order || campaign.status === 'completed';
          const isCurrent = currentStage === stageId && campaign.status !== 'completed';
          return (
            <div key={stageId} className="flex items-center shrink-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                {isCompleted ? <Check size={12} strokeWidth={3} /> : <span>{idx + 1}</span>}
                <span className="hidden sm:inline">{config.label}</span>
              </div>
              {idx < stageIds.length - 1 && <div className={`w-4 h-0.5 mx-1 ${isCompleted ? 'bg-emerald-200' : 'bg-slate-200'}`} />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SOWSummaryCard campaign={campaign} />
      <EscrowTimeline status={campaign.status} />

      <div className="w-full overflow-x-auto pb-2">{renderStepper()}</div>

      {/* Dynamic Action Block */}
      {nba && <NextBestActionDisplay action={nba} onAction={handleAction} />}

      {/* Dispute Trigger Area */}
      {['running', 'awaiting_report', 'in_escrow'].includes(campaign.status) && (
        <div className="flex justify-center pt-4">
          <button
            className="text-xs text-slate-400 hover:text-rose-500 underline flex items-center gap-1 transition-colors"
            onClick={handleOpenDispute}
          >
            <Flag size={12} /> Report Issue / Open Dispute
          </button>
        </div>
      )}

      {/* Modals */}
      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} amount={campaign.budgetTotal} onConfirm={handleDepositConfirm} />

      <ProofSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleProofSubmit}
        isSubmitting={isSubmitting}
        deliverables={deliverables}
        requirements={requirements}
      />

      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onSubmit={handleSubmitDispute}
      />

      {isViewProofOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl">
            <CardHeader className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Eye size={20} /> Proof of Delivery
              </CardTitle>
              <button onClick={() => setIsViewProofOpen(false)}><X size={20} /></button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Visual Evidence Section */}
              <div className="bg-slate-50 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="aspect-video bg-black flex items-center justify-center relative group">
                  {proofData.screenshot ? (
                    <img src={proofData.screenshot} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-600 flex flex-col items-center">
                      <Youtube size={48} className="mb-2 opacity-50" />
                      <span className="text-xs">Preview Unavailable</span>
                    </div>
                  )}
                  <a
                    href={proofData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2"
                  >
                    <PlayCircle size={32} /> Watch Video
                  </a>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className="text-xs text-slate-500 uppercase font-bold">Video Link</div>
                    <a href={proofData.link} target="_blank" className="text-sm font-mono text-indigo-500 hover:underline truncate max-w-[200px]">{proofData.link}</a>
                  </div>
                  {proofData.timestamp && (
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                      <div className="text-xs text-slate-500 uppercase font-bold">Timestamp</div>
                      <span className="text-sm font-mono text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">{proofData.timestamp}</span>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Creator Notes</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{proofData.notes}"</p>
                  </div>
                </div>
              </div>

              {role === 'brand' && campaign.status === 'awaiting_report' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20" onClick={handleApproveProof} icon={<CheckCircle2 size={16} />}>
                    Approve & Release Funds
                  </Button>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] text-slate-400">Irreversible action.</span>
                    <button onClick={handleOpenDispute} className="text-xs text-rose-500 hover:underline font-medium">Reject / Dispute</button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
