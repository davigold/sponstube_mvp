
import React, { useState } from 'react';
import { 
  Menu, X, ArrowRight, Check, ChevronDown, Star, Youtube
} from 'lucide-react';
import { navigateTo } from '../../utils/navigation';
import { Logo } from '../../components/Brand/Logo';
import { PoweredByYouTubeDisclaimer } from '../../components/Brand/PoweredByYouTubeDisclaimer';

// --- HELPER COMPONENTS ---

const CheckCircle2 = ({ size, className }: { size: number, className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const SectionContainer = ({ 
  children, 
  className = "", 
  id = "" 
}: { 
  children?: React.ReactNode; 
  className?: string; 
  id?: string; 
}) => (
  <section id={id} className={`py-24 px-6 md:px-8 relative overflow-hidden ${className}`}>
    <div className="max-w-7xl mx-auto relative z-10">
      {children}
    </div>
  </section>
);

const GradientBlob = ({ color, position }: { color: string, position: string }) => (
  <div 
    className={`absolute ${position} w-[600px] h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none animate-pulse`}
    style={{ backgroundColor: color }}
  />
);

// --- 1. NAVBAR ---

export const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Marketplace', href: '/' },
    { name: 'Para Marcas', href: '/brands' },
    { name: 'Para Creators', href: '/communities' }, // Mapped to existing route, renamed text
  ];

  const handleNav = (e: React.MouseEvent | React.TouchEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    navigateTo(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 cursor-pointer group">
          <Logo mode="dark" />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="text-sm font-medium text-[#888] hover:text-white transition-colors tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => navigateTo('/auth?mode=login')}
            className="text-sm font-bold text-white hover:text-[#FF0000] transition-colors"
          >
            Entrar
          </button>
          <button 
            onClick={() => navigateTo('/auth?mode=signup')}
            className="bg-[#FF0000] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#CC0000] transition-colors shadow-[0_0_20px_rgba(255,0,0,0.3)]"
          >
            Começar Agora
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-[#222] p-6 space-y-4 animate-in slide-in-from-top-4 shadow-2xl absolute top-20 left-0 right-0">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="block w-full text-left text-lg font-bold text-[#CCC] hover:text-white py-2"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-6 border-t border-[#222] flex flex-col gap-3">
            <button onClick={() => { navigateTo('/auth?mode=login'); setIsOpen(false); }} className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold border border-[#333]">Entrar</button>
            <button onClick={() => { navigateTo('/auth?mode=signup'); setIsOpen(false); }} className="w-full bg-[#FF0000] text-white py-3 rounded-lg font-bold">Criar Conta</button>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- 2. HERO ---

interface LandingHeroProps {
  title: React.ReactNode;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const LandingHero = ({ 
  title, 
  subtitle, 
  primaryCta, 
  secondaryCta, 
  onPrimaryClick, 
  onSecondaryClick 
}: LandingHeroProps) => {
  return (
    <div className="relative pt-36 pb-24 md:pt-52 md:pb-40 px-6 overflow-hidden bg-[#050505]">
      <GradientBlob color="#FF0000" position="-top-32 -left-32" />
      <GradientBlob color="#222222" position="bottom-0 right-0" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F0F0F] border border-[#222] text-[#888] text-[10px] font-bold uppercase tracking-widest mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-[#FF0000] animate-pulse"></span>
          Verificado via YouTube API
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 drop-shadow-2xl">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-12 leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <button 
            onClick={onPrimaryClick}
            className="w-full sm:w-auto px-10 py-4 bg-[#FF0000] hover:bg-[#D90000] text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,0,0,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            {primaryCta} <ArrowRight size={20} />
          </button>
          <button 
            onClick={onSecondaryClick}
            className="w-full sm:w-auto px-10 py-4 bg-[#111] hover:bg-[#1A1A1A] border border-[#222] hover:border-[#333] text-white rounded-full font-bold text-lg transition-all"
          >
            {secondaryCta}
          </button>
        </div>

        <div className="mt-20 pt-10 border-t border-[#111] flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           {['Sem Agências', 'Segurança Escrow', 'Reserva Direta', 'Dados Oficiais'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#666]">
                 <CheckCircle2 size={14} className="text-[#FF0000]" /> {item}
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- 3. SECTION WRAPPER ---

export const LandingSection = ({ 
  title, 
  subtitle, 
  children, 
  darker = false, 
  className = "",
  id
}: { 
  title?: string; 
  subtitle?: string; 
  children?: React.ReactNode; 
  darker?: boolean; 
  className?: string; 
  id?: string; 
}) => {
  return (
    <SectionContainer 
      id={id} 
      className={`${darker ? 'bg-[#000]' : 'bg-[#0A0A0A]'} border-y border-[#1A1A1A] ${className}`}
    >
      {(title || subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-20">
          {title && (
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-[#666] leading-relaxed max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </SectionContainer>
  );
};

// --- 4. FEATURE GRID ---

export const LandingFeatureGrid = ({ features }: { features: { icon: any; title: string; description: string; }[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, idx) => (
        <div 
          key={idx} 
          className="bg-[#111] border border-[#222] p-8 rounded-2xl hover:border-[#FF0000]/30 transition-all duration-300 group hover:-translate-y-1"
        >
          <div className="w-14 h-14 bg-[#1A1A1A] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#FF0000] transition-colors duration-300 text-white">
            <feature.icon size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
          <p className="text-[#666] leading-relaxed text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

// --- 5. TESTIMONIALS ---

export const LandingTestimonials = ({ items }: { items: { name: string; role: string; company: string; quote: string; avatarUrl?: string; }[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <div key={idx} className="bg-[#111] border border-[#222] p-8 rounded-2xl relative">
          <div className="text-[#FF0000] mb-4 flex gap-1">
            {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-[#FF0000]" />)}
          </div>
          <p className="text-[#DDD] mb-8 text-lg font-medium italic leading-relaxed">"{item.quote}"</p>
          <div className="flex items-center gap-3 pt-6 border-t border-[#222]">
            <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center font-bold text-white text-xs">
              {item.avatarUrl ? <img src={item.avatarUrl} className="w-full h-full rounded-full" /> : item.name[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{item.name}</p>
              <p className="text-xs text-[#666] uppercase font-bold">{item.role}, {item.company}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 6. PRICING ---

interface Plan {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  recommended?: boolean;
}

export const LandingPricing = ({ plans }: { plans: Plan[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan, idx) => (
        <div 
          key={idx} 
          className={`relative p-8 rounded-3xl border flex flex-col ${
            plan.recommended 
              ? 'bg-[#111] border-[#FF0000] shadow-[0_0_40px_rgba(255,0,0,0.1)] z-10' 
              : 'bg-[#0A0A0A] border-[#222]'
          }`}
        >
          {plan.recommended && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF0000] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
              Recomendado
            </div>
          )}
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-sm text-[#666] h-8">{plan.description}</p>
          </div>

          <div className="mb-10 pb-10 border-b border-[#222]">
            <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
            {plan.period && <span className="text-[#555] font-medium ml-2">{plan.period}</span>}
          </div>

          <div className="flex-1 space-y-5 mb-10">
            {plan.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-[#CCC]">
                <Check className={`shrink-0 mt-0.5 ${plan.recommended ? 'text-[#FF0000]' : 'text-[#444]'}`} size={16} />
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigateTo('/auth?mode=signup')}
            className={`w-full py-4 rounded-xl font-bold transition-all text-sm uppercase tracking-wider ${
              plan.recommended 
                ? 'bg-[#FF0000] hover:bg-[#D90000] text-white' 
                : 'bg-[#222] hover:bg-[#333] text-white'
            }`}
          >
            {plan.cta}
          </button>
        </div>
      ))}
    </div>
  );
};

// --- 7. FAQ ---

export const LandingFAQ = ({ items }: { items: { question: string; answer: string; }[] }) => {
  return (
    <div className="max-w-3xl mx-auto divide-y divide-[#222]">
      {items.map((item, idx) => (
        <details key={idx} className="group py-6">
          <summary className="flex cursor-pointer items-center justify-between font-bold text-white hover:text-[#FF0000] transition-colors list-none text-lg">
            <span>{item.question}</span>
            <span className="transition group-open:rotate-180">
              <ChevronDown size={24} />
            </span>
          </summary>
          <p className="text-[#888] mt-4 leading-relaxed text-base pr-8 animate-in fade-in slide-in-from-top-1">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
};

// --- 8. FOOTER ---

export const LandingFooter = () => {
  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigateTo(href);
  };

  return (
    <footer className="bg-[#020202] border-t border-[#111] py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div className="col-span-2 lg:col-span-2">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 mb-8 cursor-pointer group">
            <Logo mode="dark" />
          </a>
          <p className="text-[#666] text-sm max-w-xs mb-8 leading-relaxed">
            A plataforma de mídia programática para YouTube.
            Conecte-se com canais verificados, reserve slots integrados e proteja seu orçamento em Escrow.
          </p>
          <PoweredByYouTubeDisclaimer className="mb-8" />
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#666] hover:text-white hover:border-[#FF0000] cursor-pointer transition-colors hover:scale-110">𝕏</div>
             <div className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#666] hover:text-white hover:border-[#FF0000] cursor-pointer transition-colors hover:scale-110">In</div>
             <div className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#666] hover:text-white hover:border-[#FF0000] cursor-pointer transition-colors hover:scale-110"><Youtube size={18}/></div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Plataforma</h4>
          <ul className="space-y-4 text-sm text-[#666]">
            <li><a href="/brands" onClick={(e) => handleNav(e, '/brands')} className="hover:text-white transition-colors">Para Marcas</a></li>
            <li><a href="/communities" onClick={(e) => handleNav(e, '/communities')} className="hover:text-white transition-colors">Para Creators</a></li>
            <li><a href="/#pricing" onClick={(e) => handleNav(e, '/#pricing')} className="hover:text-white transition-colors">Preços</a></li>
            <li><button className="hover:text-white transition-colors text-left" onClick={() => navigateTo('/auth?mode=login')}>Login Studio</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Recursos</h4>
          <ul className="space-y-4 text-sm text-[#666]">
            <li><button className="hover:text-white transition-colors text-left">Cases de Sucesso</button></li>
            <li><button className="hover:text-white transition-colors text-left">Playbook</button></li>
            <li><button className="hover:text-white transition-colors text-left">Docs da API</button></li>
            <li><button className="hover:text-white transition-colors text-left">Central de Ajuda</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Legal</h4>
          <ul className="space-y-4 text-sm text-[#666]">
            <li><button className="hover:text-white transition-colors text-left">Privacidade</button></li>
            <li><button className="hover:text-white transition-colors text-left">Termos de Uso</button></li>
            <li><button className="hover:text-white transition-colors text-left">Contrato Escrow</button></li>
            <li><button className="hover:text-white transition-colors text-left">Fale Conosco</button></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#111] text-center flex flex-col md:flex-row justify-between items-center text-xs text-[#444] font-medium">
        <p>&copy; 2024 SponsTube Inc. São Paulo, BR.</p>
        <p className="mt-2 md:mt-0">Feito para times de alta performance.</p>
      </div>
    </footer>
  );
};
