
import React from 'react';
import { 
  ArrowRight, CheckCircle2, Zap, 
  BarChart3, Lock, Youtube, Play, Mic, Video, 
  MonitorPlay, Globe, TrendingUp, Activity, Smartphone, Heart, ShoppingBag
} from 'lucide-react';
import { LandingNavbar, LandingFooter, LandingFAQ } from './LandingComponents';
import { navigateTo } from '../../utils/navigation';
import { useI18n } from '../../contexts/I18nContext';

// --- NEW COMPONENT: LIVE MARKET TICKER (DIVERSIFIED) ---
const MarketTicker = () => (
  <div className="w-full bg-[#111] border-y border-[#222] overflow-hidden py-3">
    <div className="flex items-center gap-12 animate-scroll whitespace-nowrap text-xs font-mono text-[#666]">
       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> MAKEUP_TUTORIAL: SLOT RESERVADO (R$ 800)</span>
       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> GAMING_LIVE: PARCERIA FECHADA (R$ 1.200)</span>
       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> NOVO BRIEFING: LANÇAMENTO SNEAKERS (R$ 15k BUDGET)</span>
       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> VLOG_VIAGEM: PAGAMENTO LIBERADO</span>
       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> REVIEW_TECH: SLOT RESERVADO (R$ 3.500)</span>
       {/* Duplicate for infinite loop feel */}
       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> UNBOXING_BRINQUEDOS: SLOT RESERVADO (R$ 500)</span>
       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> PODCAST_CORTES: DEAL FECHADO (R$ 200)</span>
    </div>
  </div>
);

const FormatCard = ({ icon: Icon, title, specs, price, gradient, hot }: { icon: any, title: string, specs: string, price: string, gradient: string, hot?: boolean }) => (
  <div className="relative flex flex-col h-full bg-[#0F0F0F] border border-[#222] rounded-2xl overflow-hidden hover:border-[#FF0000]/50 transition-all group hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-900/10">
    {hot && (
        <div className="absolute top-3 right-3 bg-[#FF0000] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-20 shadow-lg animate-pulse">
            Alta Procura
        </div>
    )}
    <div className={`h-40 ${gradient} relative p-6 flex flex-col justify-end`}>
      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
      <div className="relative z-10 text-white">
        <Icon size={36} className="mb-3 opacity-90 drop-shadow-md group-hover:scale-110 transition-transform" />
        <h3 className="font-bold text-xl tracking-tight">{title}</h3>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col bg-[#141414]">
      <p className="text-[#888] text-sm mb-6 flex-1 leading-relaxed">{specs}</p>
      <div className="pt-4 border-t border-[#222] flex justify-between items-center">
        <span className="text-[10px] text-[#666] uppercase font-bold tracking-wider flex items-center gap-1">
            <Activity size={10} /> Investimento Médio
        </span>
        <span className="text-white font-mono font-medium text-lg">{price}</span>
      </div>
    </div>
  </div>
);

const TrustPill = ({ text, icon: Icon = CheckCircle2 }: { text: string, icon?: any }) => (
  <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] px-4 py-2 rounded-full text-xs font-semibold text-[#CCC] hover:border-[#FF0000]/50 hover:text-white transition-colors cursor-default">
    <Icon size={14} className="text-[#FF0000]" /> {text}
  </div>
);

export default function GeneralLanding() {
  const { t } = useI18n();

  const handleBrandAuth = () => navigateTo('/auth?role=brand');
  const handleCreatorAuth = () => navigateTo('/auth?role=community');

  return (
    <div className="bg-[#050505] min-h-screen text-[#E0E0E0] font-sans selection:bg-[#FF0000]/30">
      <LandingNavbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
           <div className="absolute top-[10%] left-[15%] w-[800px] h-[800px] bg-[#FF0000]/5 rounded-full blur-[120px] animate-pulse"></div>
           <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111] border border-[#222] text-[#888] text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:border-[#FF0000]/50 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-[#FF0000] animate-pulse"></span>
            A Nova Era da Publicidade
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.95] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Patrocínios no YouTube. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500">
              Simples e Seguros.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-12 leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Conectamos marcas ambiciosas a criadores autênticos. De Tech a Beleza, de Games a Educação.
            <strong> Sem agências, sem burocracia, com garantia total.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <button 
              onClick={handleBrandAuth}
              className="w-full sm:w-auto px-10 py-5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_50px_rgba(255,0,0,0.4)] ring-2 ring-[#FF0000]/50 ring-offset-2 ring-offset-black"
            >
              Quero Anunciar <span className="opacity-70 text-sm font-normal">(Marcas)</span> <ArrowRight size={20} />
            </button>
            <button 
              onClick={handleCreatorAuth}
              className="w-full sm:w-auto px-10 py-5 bg-[#111] hover:bg-[#222] border border-[#333] text-white rounded-full font-bold text-lg transition-all hover:border-[#666]"
            >
              Sou Creator <span className="opacity-50 text-sm font-normal">(Tenho Canal)</span>
            </button>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-3 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-forwards">
             <TrustPill text="Zero Taxa de Adesão" />
             <TrustPill text="Canais Verificados" icon={Youtube} />
             <TrustPill text="Pagamento Garantido (Escrow)" icon={Lock} />
             <TrustPill text="Suporte Humanizado" icon={Heart} />
          </div>
        </div>
      </section>

      {/* TICKER */}
      <MarketTicker />

      {/* 2. INVENTORY GRID */}
      <section className="py-24 px-6 border-t border-[#111] bg-gradient-to-b from-[#050505] to-[#0A0A0A]">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
               <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Formatos que Funcionam</h2>
                  <p className="text-[#666] text-lg">Escolha como sua marca vai aparecer. Previsível e escalável.</p>
               </div>
               <button onClick={handleBrandAuth} className="text-white font-bold hover:text-[#FF0000] flex items-center gap-2 transition-colors border-b border-transparent hover:border-[#FF0000] pb-1">
                  Explorar Marketplace <ArrowRight size={16} />
               </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <FormatCard 
                  icon={Video} 
                  title="Vídeo Integrado" 
                  specs="Sua marca inserida organicamente no conteúdo. O creator apresenta seu produto com as palavras dele." 
                  price="R$ 150 - R$ 5.000+"
                  gradient="bg-gradient-to-br from-red-900 to-black" 
                  hot
               />
               <FormatCard 
                  icon={Smartphone} 
                  title="YouTube Shorts" 
                  specs="Vídeos curtos e verticais. Perfeito para alcance rápido, unboxing e dicas rápidas." 
                  price="R$ 50 - R$ 1.500"
                  gradient="bg-gradient-to-br from-[#FF0000] to-[#500000]" 
               />
               <FormatCard 
                  icon={MonitorPlay} 
                  title="Review Completo" 
                  specs="Vídeo dedicado 100% ao seu produto ou serviço. Ideal para explicar funcionalidades complexas." 
                  price="R$ 500 - R$ 10.000+"
                  gradient="bg-gradient-to-br from-indigo-900 to-black" 
               />
               <FormatCard 
                  icon={Mic} 
                  title="Live Shoutout" 
                  specs="Menção ao vivo durante uma transmissão. Interação em tempo real com o chat." 
                  price="R$ 100 - R$ 3.000"
                  gradient="bg-gradient-to-br from-amber-900 to-black" 
               />
            </div>
         </div>
      </section>

      {/* 3. NO TOUCH WORKFLOW (VISUAL UPGRADE) */}
      <section className="py-32 bg-[#000] border-y border-[#111] relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
           <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Adeus, Burocracia.</h2>
              <p className="text-[#888] max-w-xl mx-auto text-lg">Removemos as barreiras para você focar no que importa: criar conexões reais.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#333] via-[#FF0000] to-[#333] z-0"></div>
              
              {/* Step 1 */}
              <div className="relative text-center group">
                 <div className="w-24 h-24 mx-auto bg-[#0A0A0A] border-2 border-[#222] rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:border-[#FF0000] group-hover:scale-110 transition-all duration-300 shadow-2xl">
                    <Globe size={32} className="text-white group-hover:text-[#FF0000] transition-colors" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#222] rounded-full flex items-center justify-center text-sm font-bold border border-[#333] text-white">1</div>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Encontre o Match</h3>
                 <p className="text-[#666] text-sm leading-relaxed px-4">Busque canais pelo público, nicho e valores. Veja preços transparentes na hora.</p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center group">
                 <div className="w-24 h-24 mx-auto bg-[#0A0A0A] border-2 border-[#222] rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:border-[#FF0000] group-hover:scale-110 transition-all duration-300 shadow-2xl">
                    <Lock size={32} className="text-white group-hover:text-[#FF0000] transition-colors" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#222] rounded-full flex items-center justify-center text-sm font-bold border border-[#333] text-white">2</div>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Segurança Total</h3>
                 <p className="text-[#666] text-sm leading-relaxed px-4">O dinheiro fica protegido (Escrow). O creator trabalha tranquilo, a marca não corre riscos.</p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center group">
                 <div className="w-24 h-24 mx-auto bg-[#0A0A0A] border-2 border-[#222] rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:border-[#FF0000] group-hover:scale-110 transition-all duration-300 shadow-2xl">
                    <Zap size={32} className="text-white group-hover:text-[#FF0000] transition-colors" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#222] rounded-full flex items-center justify-center text-sm font-bold border border-[#333] text-white">3</div>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Publicação & Sucesso</h3>
                 <p className="text-[#666] text-sm leading-relaxed px-4">Vídeo no ar, link verificado, pagamento liberado. Simples assim.</p>
              </div>
           </div>
        </div>
      </section>

      {/* 4. METRICS / PROOF */}
      <section className="py-24 px-6">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
               <div className="text-[#FF0000] font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                  <TrendingUp size={16} /> Resultados Reais
               </div>
               <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                  Atenção Real.<br/>
                  <span className="text-[#666]">Sem Bots. Sem Inflação.</span>
               </h2>
               <p className="text-[#888] text-lg mb-8 leading-relaxed">
                  Diferente de anúncios intrusivos, os patrocínios aproveitam a confiança que o creator já tem com sua audiência. O SponsTube garante que você pague o preço justo por essa conexão.
               </p>
               
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <div className="text-3xl font-black text-white mb-1">2.500+</div>
                     <div className="text-xs text-[#666] uppercase font-bold">Creators Verificados</div>
                  </div>
                  <div>
                     <div className="text-3xl font-black text-white mb-1">R$ 15mi</div>
                     <div className="text-xs text-[#666] uppercase font-bold">Gerados em Negócios</div>
                  </div>
                  <div>
                     <div className="text-3xl font-black text-white mb-1">100%</div>
                     <div className="text-xs text-[#666] uppercase font-bold">Garantia Anti-Calote</div>
                  </div>
                  <div>
                     <div className="text-3xl font-black text-white mb-1">24h</div>
                     <div className="text-xs text-[#666] uppercase font-bold">Setup Médio</div>
                  </div>
               </div>
            </div>
            
            {/* Visual Abstract Dashboard */}
            <div className="order-1 lg:order-2 bg-[#0F0F0F] border border-[#222] rounded-3xl p-8 relative shadow-2xl group hover:border-[#333] transition-colors">
               <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[#FF0000] to-transparent opacity-50"></div>
               
               {/* Mock UI Elements */}
               <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#222]">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs font-mono text-[#444]">ATIVIDADE RECENTE</div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-[#111] rounded-lg border border-[#222]">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-900/30 text-blue-500 rounded flex items-center justify-center"><Video size={16}/></div>
                        <div>
                           <div className="text-xs font-bold text-white">Lançamento E-commerce</div>
                           <div className="text-[10px] text-[#666]">@CanalDeModa • 45k Views</div>
                        </div>
                     </div>
                     <div className="text-emerald-500 text-xs font-bold font-mono">+12.4%</div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-[#111] rounded-lg border border-[#222]">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-900/30 text-red-500 rounded flex items-center justify-center"><Play size={16}/></div>
                        <div>
                           <div className="text-xs font-bold text-white">Promoção Gamer</div>
                           <div className="text-[10px] text-[#666]">@TechPro • 120k Views</div>
                        </div>
                     </div>
                     <div className="text-emerald-500 text-xs font-bold font-mono">+48.1%</div>
                  </div>

                  <div className="h-32 mt-4 flex items-end justify-between gap-1">
                     {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                        <div key={i} className="w-full bg-[#222] hover:bg-[#FF0000] transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. FAQ */}
      <section className="py-24 px-6 bg-[#050505] border-t border-[#111]">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Perguntas Frequentes</h2>
            <LandingFAQ items={[
               { question: "É seguro? Como funciona o pagamento?", answer: "Usamos um sistema de Escrow bancário. A marca deposita o valor antes do trabalho começar, mas o dinheiro fica 'congelado'. O creator só recebe após entregar o vídeo conforme o combinado. Se houver problemas, nosso time de disputas resolve." },
               { question: "Preciso ser uma grande empresa?", answer: "Não! O SponsTube é feito para todos. Temos micro-influenciadores com pacotes a partir de R$ 100 e grandes canais para orçamentos maiores. Você filtra pelo seu budget." },
               { question: "Como funciona a Nota Fiscal?", answer: "A SponsTube emite uma nota única para a marca referente ao serviço, simplificando sua contabilidade. Nós cuidamos dos repasses individuais aos criadores." },
               { question: "Os creators são reais?", answer: "Sim. 100% verificados. Usamos a API oficial do YouTube para confirmar que a pessoa é dona do canal e para puxar dados reais de audiência e engajamento." }
            ]} />
         </div>
      </section>

      <LandingFooter />
    </div>
  );
}
