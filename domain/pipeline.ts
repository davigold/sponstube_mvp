
import { Campaign, Role } from '../types';

export const STAGES = {
  BRIEF: 'brief',
  MATCH: 'match',
  ESCROW: 'escrow',
  EXECUTION: 'execution',
  REVIEW: 'review',
  DONE: 'done',
} as const;

export type PipelineStageId = typeof STAGES[keyof typeof STAGES];

export const STAGE_CONFIG: Record<PipelineStageId, { label: string; order: number }> = {
  [STAGES.BRIEF]: { label: 'Briefing', order: 1 },
  [STAGES.MATCH]: { label: 'Negociação', order: 2 },
  [STAGES.ESCROW]: { label: 'Pagamento', order: 3 },
  [STAGES.EXECUTION]: { label: 'Produção', order: 4 },
  [STAGES.REVIEW]: { label: 'Aprovação', order: 5 },
  [STAGES.DONE]: { label: 'Concluído', order: 6 },
};

export const mapStatusToStage = (status: Campaign['status']): PipelineStageId => {
  switch (status) {
    case 'draft': return STAGES.BRIEF;
    case 'published':
    case 'applied':
    case 'proposed': return STAGES.MATCH;
    case 'approved': return STAGES.ESCROW; // Approved, waiting for funds
    case 'in_escrow': return STAGES.EXECUTION; // Funds secured, ready to start execution
    case 'running': return STAGES.EXECUTION;
    case 'awaiting_report': return STAGES.REVIEW;
    case 'dispute': return STAGES.REVIEW;
    case 'completed': return STAGES.DONE;
    case 'cancelled': return STAGES.DONE;
    default: return STAGES.BRIEF;
  }
};

export interface NextBestAction {
  title: string;
  description: string;
  ctaLabel: string;
  actionId: string;
  targetStatus?: Campaign['status'];
  requiredRole: Role;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  iconKey?: 'money' | 'rocket' | 'upload' | 'check' | 'alert' | 'clock';
}

export const getNextBestAction = (campaign: Campaign, userRole: Role): NextBestAction | null => {
  const { status } = campaign;

  // 1. MATCHING PHASE
  if (['proposed', 'applied'].includes(status)) {
    const isActor = (status === 'proposed' && userRole === 'community') || 
                    (status === 'applied' && userRole === 'brand');
    
    if (isActor) {
      return {
        title: 'Aceitar Proposta',
        description: 'Revise os termos e aceite para prosseguir para o pagamento.',
        ctaLabel: 'Fechar Negócio',
        actionId: 'accept_proposal',
        targetStatus: 'approved',
        requiredRole: userRole,
        variant: 'primary',
        iconKey: 'check'
      };
    }
    return {
        title: 'Aguardando Parceiro',
        description: 'A proposta está sendo analisada pela outra parte.',
        ctaLabel: 'Ver Detalhes',
        actionId: 'view_details',
        requiredRole: userRole,
        variant: 'secondary',
        iconKey: 'clock'
    };
  }

  // 2. ESCROW FUNDING
  if (status === 'approved') {
    if (userRole === 'brand') {
      return {
        title: 'Garantir Orçamento',
        description: 'Deposite os fundos no Escrow para iniciar a campanha com segurança.',
        ctaLabel: 'Realizar Depósito',
        actionId: 'deposit_escrow',
        targetStatus: 'in_escrow',
        requiredRole: 'brand',
        variant: 'primary',
        iconKey: 'money'
      };
    }
    return {
        title: 'Aguardando Depósito',
        description: 'Não inicie o trabalho ainda. Aguarde a marca garantir os fundos.',
        ctaLabel: 'Verificar Status',
        actionId: 'check_status',
        requiredRole: 'community',
        variant: 'secondary',
        iconKey: 'clock'
    };
  }

  // 3. START EXECUTION (Funds Secured)
  if (status === 'in_escrow') {
    if (userRole === 'community') {
      return {
        title: 'Iniciar Produção',
        description: 'Fundos garantidos. Confirme que você vai começar a produzir.',
        ctaLabel: 'Começar Trabalho',
        actionId: 'start_work',
        targetStatus: 'running',
        requiredRole: 'community',
        variant: 'primary',
        iconKey: 'rocket'
      };
    }
    return {
        title: 'Produção Pendente',
        description: 'O parceiro foi notificado para iniciar o trabalho.',
        ctaLabel: 'Enviar Mensagem',
        actionId: 'chat',
        requiredRole: 'brand',
        variant: 'secondary',
        iconKey: 'clock'
    };
  }

  // 4. SUBMIT PROOF
  if (status === 'running') {
    if (userRole === 'community') {
      return {
        title: 'Enviar Prova',
        description: 'Faça upload do link ou print para verificar a entrega.',
        ctaLabel: 'Enviar Entrega',
        actionId: 'submit_proof',
        targetStatus: 'awaiting_report',
        requiredRole: 'community',
        variant: 'primary',
        iconKey: 'upload'
      };
    }
    return {
        title: 'Monitorando',
        description: 'Campanha ativa. Aguardando prova de execução do creator.',
        ctaLabel: 'Ver Status',
        actionId: 'view_status',
        requiredRole: 'brand',
        variant: 'secondary',
        iconKey: 'clock'
    };
  }

  // 5. APPROVE PROOF
  if (status === 'awaiting_report') {
    if (userRole === 'brand') {
      return {
        title: 'Aprovar Entrega',
        description: 'Revise a prova enviada. Aprove para liberar o pagamento.',
        ctaLabel: 'Aprovar e Pagar',
        actionId: 'approve_report',
        targetStatus: 'completed',
        requiredRole: 'brand',
        variant: 'primary',
        iconKey: 'check'
      };
    }
    return {
        title: 'Em Análise',
        description: 'A marca está revisando sua entrega. Liberação automática em 48h.',
        ctaLabel: 'Ver Prova',
        actionId: 'view_proof',
        requiredRole: 'community',
        variant: 'secondary',
        iconKey: 'clock'
    };
  }

  return null;
};
