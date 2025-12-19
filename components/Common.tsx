
import React, { ReactNode, useState, useEffect } from 'react';
import { Loader2, Check, AlertTriangle, RefreshCw, Sparkles, Youtube, X, HelpCircle, Info } from 'lucide-react';

// Types
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'glass';
export type Size = 'xs' | 'sm' | 'md' | 'lg';

// Helper for classes
const cx = (...classes: (string | undefined | false | null)[]) => classes.filter(Boolean).join(' ');

// --- GLOBAL STYLES CONSTANTS ---
export const TYPOGRAPHY = {
  h1: "text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-[#0F0F0F] dark:text-white",
  h2: "text-2xl font-bold tracking-tight text-[#0F0F0F] dark:text-white",
  h3: "text-lg font-bold tracking-tight text-[#0F0F0F] dark:text-white",
  body: "text-sm leading-relaxed text-[#606060] dark:text-[#AAAAAA]",
  caption: "text-xs font-bold text-[#606060] uppercase tracking-widest",
};

export const LAYOUT = {
  cardPadding: "p-5 md:p-6",
  cardHeaderPadding: "px-5 py-4 md:px-6 md:py-5",
};

// --- ANIMATION WRAPPERS ---
export const FadeIn = ({ children, className, delay = 0 }: { children?: ReactNode, className?: string, delay?: number, key?: any }) => (
  <div 
    className={cx("animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-forwards motion-reduce:animate-none", className)}
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

// --- TOOLTIP COMPONENT ---
export const InfoTooltip = ({ content, className }: { content: string, className?: string }) => (
  <div className={cx("group relative inline-flex items-center justify-center ml-1 align-middle", className)}>
    <HelpCircle size={14} className="text-[#909090] hover:text-[#FF0000] transition-colors cursor-help" />
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-[#1F1F1F] text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none transform origin-bottom scale-95 group-hover:scale-100 border border-[#333]">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1F1F1F]"></div>
    </div>
  </div>
);

// --- YOUTUBE INTEGRATION COMPONENTS ---

export const YouTubeBadge = ({ className }: { className?: string }) => (
  <div className={cx("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/20 text-[#FF0000] text-[10px] font-bold uppercase tracking-wider", className)} title="Channel Connected & Verified">
    <Youtube size={12} className="fill-[#FF0000]" /> 
    <span>YouTube Connected</span>
  </div>
);

export const YouTubeConnectButton = ({ onConnect, onDisconnect, className }: { onConnect?: () => void, onDisconnect?: () => void, className?: string }) => {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'connected'>('idle');

  useEffect(() => {
    const isConnected = localStorage.getItem('cm_youtube_connected') === 'true';
    if (isConnected) setStatus('connected');
  }, []);

  const handleConnect = () => {
    setStatus('syncing');
    // Mock OAuth Delay
    setTimeout(() => {
      localStorage.setItem('cm_youtube_connected', 'true');
      setStatus('connected');
      if (onConnect) onConnect();
    }, 2000);
  };

  const handleDisconnect = () => {
    if (confirm('Desconectar canal do YouTube? Os dados de analytics pararão de atualizar.')) {
      localStorage.removeItem('cm_youtube_connected');
      setStatus('idle');
      if (onDisconnect) onDisconnect();
    }
  };

  if (status === 'connected') {
    return (
      <div className={cx("flex items-center gap-3", className)}>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0F0F0F] text-white border border-[#333] rounded-lg text-sm font-bold">
          <Check size={16} className="text-[#FF0000]" /> Canal Sincronizado
        </div>
        <button 
          onClick={handleDisconnect}
          className="text-xs text-[#606060] hover:text-[#FF0000] underline"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={status === 'syncing'}
      className={cx(
        "flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-wait",
        "bg-[#FF0000] hover:bg-[#D90000] shadow-[#FF0000]/20",
        className
      )}
    >
      {status === 'syncing' ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Sincronizando...</span>
        </>
      ) : (
        <>
          <Youtube size={18} fill="currentColor" />
          <span>Conectar YouTube</span>
        </>
      )}
    </button>
  );
};

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, className, variant = 'primary', size = 'md', isLoading, icon, ...props 
}) => {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  // YouTube Style Colors
  const variants = {
    primary: "focus:ring-red-500/20 bg-[#FF0000] hover:bg-[#D90000] text-white border border-transparent shadow-[0_2px_10px_rgba(255,0,0,0.2)]",
    secondary: "focus:ring-slate-200 bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[#0F0F0F] border border-[#E5E5E5] dark:bg-[#272727] dark:hover:bg-[#3F3F3F] dark:text-white dark:border-[#3F3F3F]",
    outline: "focus:ring-slate-200 bg-transparent border border-[#CCCCCC] text-[#0F0F0F] hover:bg-[#F2F2F2] dark:border-[#3F3F3F] dark:text-[#AAAAAA] dark:hover:text-white dark:hover:bg-[#272727]",
    ghost: "focus:ring-slate-200 bg-transparent border border-transparent text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F2F2F2] dark:text-[#AAAAAA] dark:hover:text-white dark:hover:bg-[#272727]",
    danger: "focus:ring-rose-200 bg-transparent border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-500 dark:hover:bg-rose-900/10",
    glass: "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md shadow-lg"
  };

  const sizes = {
    xs: "px-2.5 py-1 text-xs gap-1.5",
    sm: "px-3.5 py-2 text-xs gap-1.5 font-semibold tracking-wide",
    md: "px-5 py-2.5 text-sm gap-2 font-medium",
    lg: "px-7 py-3.5 text-base gap-2.5"
  };

  return (
    <button 
      className={cx(base, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} />}
      {!isLoading && icon && <span className="opacity-90">{icon}</span>}
      {children}
    </button>
  );
};

// --- CARD SYSTEM ---
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => (
  <div 
    onClick={onClick}
    className={cx(
      "relative bg-white border border-[#E5E5E5] rounded-xl shadow-sm overflow-hidden",
      "dark:bg-[#1F1F1F] dark:border-[#3F3F3F] dark:shadow-none",
      onClick ? "cursor-pointer hover:border-[#CCCCCC] dark:hover:border-[#555] transition-all duration-300" : "",
      className
    )}
  >
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className }) => (
  <div className={cx(LAYOUT.cardHeaderPadding, "border-b border-[#F0F0F0] dark:border-[#303030]", className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className }) => (
  <h3 className={cx(TYPOGRAPHY.h3, "flex items-center gap-2", className)}>
    {children}
  </h3>
);

export const CardSubtitle: React.FC<CardProps> = ({ children, className }) => (
  <p className={cx("text-sm text-[#606060] dark:text-[#AAAAAA] mt-1 font-medium leading-relaxed", className)}>
    {children}
  </p>
);

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={cx(LAYOUT.cardPadding, className)}>
    {children}
  </div>
);

// --- BADGES & TAGS ---
interface BadgeProps {
  children: ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'brand';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  const styles = {
    neutral: "bg-[#F2F2F2] text-[#606060] border-[#E5E5E5] dark:bg-[#272727] dark:text-[#AAAAAA] dark:border-[#3F3F3F]",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30",
    warning: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30",
    error: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30",
    brand: "bg-red-50 text-[#FF0000] border-red-100 dark:bg-[#FF0000]/10 dark:text-[#FF0000] dark:border-[#FF0000]/20"
  };
  
  return (
    <span className={cx("inline-flex items-center px-2.5 py-0.5 rounded-sm text-[10px] uppercase font-bold tracking-widest border", styles[variant], className)}>
      {children}
    </span>
  );
};

// --- FORM ELEMENTS ---
export const Input = ({ className, label, icon, error, defaultValue, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode, error?: string, icon?: ReactNode }) => (
  <div className="w-full group">
    {label && <label className={cx("block mb-1.5 ml-1", TYPOGRAPHY.caption)}>{label}</label>}
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#909090] group-focus-within:text-[#FF0000] transition-colors">
          {icon}
        </div>
      )}
      <input 
        className={cx(
          "w-full px-4 py-2.5 text-sm rounded-lg transition-all duration-200 outline-none",
          "bg-white border border-[#CCCCCC] text-[#0F0F0F] placeholder:text-[#909090] focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000]",
          "dark:bg-[#121212] dark:border-[#3F3F3F] dark:text-white dark:placeholder:text-[#606060] dark:focus:border-[#FF0000]",
          icon ? "pl-10" : "",
          error 
            ? "border-rose-500 focus:border-rose-500" 
            : "",
          className
        )}
        defaultValue={defaultValue}
        {...props}
      />
    </div>
    {error && <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 animate-fade-in-up">⚠ {error}</p>}
  </div>
);

export const Select = ({ className, label, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, options: { label: string, value: string }[] }) => (
  <div className="w-full">
    {label && <label className={cx("block mb-1.5 ml-1", TYPOGRAPHY.caption)}>{label}</label>}
    <div className="relative">
      <select 
        className={cx(
          "w-full px-4 py-2.5 text-sm rounded-lg appearance-none cursor-pointer transition-all duration-200 outline-none",
          "bg-white border border-[#CCCCCC] text-[#0F0F0F] focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000]",
          "dark:bg-[#121212] dark:border-[#3F3F3F] dark:text-white dark:focus:border-[#FF0000]",
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#606060]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);

// --- LOADING & ERROR STATES ---

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cx("animate-pulse bg-[#E5E5E5] dark:bg-[#272727] rounded", className)} />
);

export const CardSkeleton = () => (
  <div className="p-4 border border-[#E5E5E5] dark:border-[#3F3F3F] rounded-xl bg-white dark:bg-[#1F1F1F]">
    <div className="flex gap-4">
      <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>
    </div>
    <div className="mt-4 pt-3 border-t border-[#F0F0F0] dark:border-[#303030] flex gap-2">
      <Skeleton className="h-4 w-1/4 rounded-md" />
      <Skeleton className="h-4 w-1/4 rounded-md" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 3, type = 'card' }: { count?: number, type?: 'card' | 'row' }) => (
  <div className={type === 'card' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
    {Array.from({ length: count }).map((_, i) => (
      type === 'card' ? <CardSkeleton key={i} /> : (
        <div key={i} className="p-4 bg-white dark:bg-[#1F1F1F] rounded-xl border border-[#E5E5E5] dark:border-[#3F3F3F] flex gap-4 items-center">
           <Skeleton className="w-10 h-10 rounded-full" />
           <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
           </div>
           <Skeleton className="w-20 h-8 rounded-lg" />
        </div>
      )
    ))}
  </div>
);

export const ErrorState = ({ title, description, onRetry }: { title: string, description: string, onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-rose-200 dark:border-rose-900/50 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 backdrop-blur-sm">
    <div className="bg-rose-100 dark:bg-rose-900/50 p-4 rounded-full mb-4 text-rose-600 dark:text-rose-400">
      <AlertTriangle size={24} />
    </div>
    <h3 className="mb-2 text-rose-900 dark:text-rose-200 font-bold text-lg">{title}</h3>
    <p className="max-w-xs mb-6 text-rose-700 dark:text-rose-300 text-sm leading-relaxed">{description}</p>
    {onRetry && (
      <Button variant="danger" size="sm" onClick={onRetry} icon={<RefreshCw size={14} />}>
        Try Again
      </Button>
    )}
  </div>
);

// --- WORKFLOW STEPPER ---
export interface Step {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming' | 'error';
}

export const WorkflowStepper = ({ steps }: { steps: Step[] }) => (
  <div className="w-full flex justify-center py-2">
    <div className="flex items-center gap-1 sm:gap-2">
      {steps.map((step, idx) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={cx(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold whitespace-nowrap",
              isCompleted 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" 
                : isCurrent
                  ? "bg-[#FF0000] border-[#FF0000] text-white shadow-md"
                  : "bg-white dark:bg-[#1F1F1F] border-[#E5E5E5] dark:border-[#3F3F3F] text-[#909090]"
            )}>
              {isCompleted ? <Check size={12} strokeWidth={3} /> : <span>{idx + 1}</span>}
              <span className={isCurrent ? "inline" : "hidden sm:inline"}>{step.label}</span>
            </div>
            
            {idx < steps.length - 1 && (
              <div className={cx(
                "w-4 sm:w-8 h-0.5 mx-1",
                isCompleted ? "bg-emerald-200 dark:bg-emerald-900" : "bg-[#E5E5E5] dark:bg-[#3F3F3F]"
              )} />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// --- EMPTY STATE ---
interface EmptyStateProps {
  icon: any;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[#CCCCCC] dark:border-[#3F3F3F] rounded-xl bg-gradient-to-b from-[#FAFAFA] to-white dark:from-[#121212] dark:to-[#1F1F1F] animate-in fade-in zoom-in-95 duration-500 hover:border-[#909090] dark:hover:border-[#606060] transition-all group">
    <div className="bg-[#F2F2F2] dark:bg-[#272727] p-5 rounded-full mb-6 text-[#909090] dark:text-[#AAAAAA] group-hover:scale-110 transition-transform duration-300 group-hover:text-[#FF0000]">
       <Icon size={32} strokeWidth={1.5} />
    </div>
    <h3 className={cx("mb-2 text-[#0F0F0F] dark:text-white", TYPOGRAPHY.h3)}>{title}</h3>
    <p className={cx("max-w-sm mb-8 text-[#606060] dark:text-[#AAAAAA] leading-relaxed", TYPOGRAPHY.body)}>{description}</p>
    {action && (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
        {action}
      </div>
    )}
  </div>
);

// --- LAYOUT COMPONENTS ---
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-8 pb-6 border-b border-[#E5E5E5] dark:border-[#303030]">
    <div>
      <h1 className={TYPOGRAPHY.h1}>
        {title}
      </h1>
      {subtitle && <p className={cx("mt-2 text-base font-normal", TYPOGRAPHY.body)}>{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

interface SectionTitleProps {
  title: string;
  action?: ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-6 mt-10 border-l-4 border-[#FF0000] pl-4">
    <h2 className={cx("text-[#0F0F0F] dark:text-white flex items-center gap-3", TYPOGRAPHY.h3)}>
      {title}
    </h2>
    {action}
  </div>
);

interface StatCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: any;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendValue, icon: Icon }) => (
  <Card className="hover:-translate-y-1 transition-transform duration-300">
    <CardContent>
      <div className="flex justify-between items-start">
        <div>
          <p className={cx("mb-1", TYPOGRAPHY.caption)}>{label}</p>
          <p className={TYPOGRAPHY.h1}>{value}</p>
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-[#F2F2F2] dark:bg-[#272727] text-[#606060] dark:text-[#AAAAAA]">
            <Icon size={20} />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cx(
            "text-xs font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 border",
            trend === 'up' ? "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-900/30" : 
            trend === 'down' ? "text-rose-700 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-900/20 dark:border-rose-900/30" : "text-[#606060] bg-[#F2F2F2] border-[#E5E5E5] dark:text-[#AAAAAA] dark:bg-[#272727] dark:border-[#3F3F3F]"
          )}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '•'} {trendValue}
          </span>
          <span className="text-xs text-[#909090] font-medium">vs last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);