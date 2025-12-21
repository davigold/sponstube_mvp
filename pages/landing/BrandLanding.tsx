
import React from 'react';
import { 
  LandingNavbar, 
  LandingHero, 
  LandingSection, 
  LandingFeatureGrid, 
  LandingPricing, 
  LandingFAQ, 
  LandingFooter 
} from './LandingComponents';
import { 
  Target, BarChart3, ShieldCheck, Zap, 
  Search, FileText, PieChart, 
  Briefcase, TrendingUp, Layers, CheckCircle2,
  Filter, UserCheck, Play
} from 'lucide-react';
import { navigateTo } from '../../utils/navigation';

export default function BrandLanding() {
  const handleCtaClick = () => {
    navigateTo('/auth?role=brand');
  };

  return (
    <div className="bg-[#050505] min-h-screen text-[#E0E0E0] selection:bg-[#FF0000]/30 font-sans">
      <LandingNavbar />

      {/* HERO */}
      <LandingHero 
        title={
          <>
            Influência Real.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#666]">
              Resultados Reais.
            </span>
          </>
        }
        subtitle="Deixe de lado as planilhas e a incerteza. Encontre creators verificados que falam diretamente com seu público-alvo. Seguro, rápido e transparente."
        primaryCta="Buscar Creators"
        secondaryCta="Falar com Especialista"
        onPrimaryClick={handleCtaClick}
        onSecondaryClick={() => {}}
      />

      {/* VISUAL DEMO SECTION (NEW) */}
      <section className="relative -mt-20 z-20 px-6">
         <div className="max-w-6xl mx-auto bg-[#0F0F0F] rounded-2xl border border-[#222] shadow-2xl shadow-indigo-500/10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-8 bg-[#1A1A1A] border-b border-[#222] flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
               <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
               <div className="ml-4 text-[10px] text-[#666] font-mono">dashboard_campanhas.tsx</div>
            </div>
            <div className="p-8 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-90">
               {/* Sidebar Mock */}
               <div className="hidden md:block space-y-4">
                  <div className="h-8 w-32 bg-[#222] rounded mb-8"></div>
                  <div className="h-4 w-full bg-[#1A1A1A] rounded"></div>
                  <div className="h-4 w-3/4 bg-[#1A1A1A] rounded"></div>
                  <div className="h-4 w-5/6 bg-[#1A1A1A] rounded"></div>
               </div>
               {/* Main Content Mock */}
               <div className="col-span-2 space-y-6">
                  <div className="flex gap-4">
                     <div className="flex-1 h-24 bg-[#1A1A1A] border border-[#222] rounded-xl p-4">
                        <div className="w-8 h-8 rounded bg-[#222] mb-2"></div>
                        <div className="h-4 w-12 bg-[#333] rounded"></div>
                     </div>
                     <div className="flex-1 h-24 bg-[#1A1A1A] border border-[#222] rounded-xl p-4 border-l-2 border-l-[#FF0000]">
                        <div className="w-8 h-8 rounded bg-[#222] mb-2"></div>
                        <div className="h-4 w-20 bg-[#333] rounded"></div>
                     </div>
                     <div className="flex-1 h-24 bg-[#1A1A1A] border border-[#222] rounded-xl p-4">
                        <div className="w-8 h-8 rounded bg-[#222] mb-2"></div>
                        <div className="h-4 w-16 bg-[#333] rounded"></div>
                     </div>
                  </div>
                  <div className="h-64 bg-[#111] border border-[#222] rounded-xl flex items-center justify-center">
                     <div className="text-center">
                        <div className="text-2xl font-bold text-[#333]">Marketplace de Creators</div>
                        <div className="text-xs text-[#444] mt-2">Lista de canais verificados com métricas reais</div>
                     </div>
                  </div>
               </div>
            </div>
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"></div>
            <div className="absolute bottom-10 left-0 right-0 text-center">
               <p className="text-white font-bold text-lg mb-2">Tenha Controle Total das suas Campanhas</p>
               <button onClick={handleCtaClick} className="text-[#FF0000] text-sm hover:underline">Criar conta gratuita &rarr;</button>
            </div>
         </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <LandingSection 
        title="Escalar Influência não precisa ser difícil." 
        subtitle="Simplificamos a descoberta, contratação e pagamento para você focar na estratégia."
        className="pt-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-8">
              <h3 className="text-2xl font-bold text-rose-500 mb-6">O Jeito Tradicional (Difícil)</h3>
              {[
                 { icon: Search, title: "Caos na Descoberta", desc: "Passar horas no YouTube procurando canais e anotando emails em planilhas." },
                 { icon: FileText, title: "Negociação Lenta", desc: "Semanas trocando emails para descobrir preços e disponibilidade." },
                 { icon: PieChart, title: "Risco Financeiro", desc: "Pagar adiantado sem garantia de entrega ou sofrer com notas fiscais pingadas." }
              ].map((item, i) => (
                 <div key={i} className="flex gap-4 opacity-50">
                    <item.icon className="text-rose-700 shrink-0" size={24} />
                    <div>
                       <h4 className="font-bold text-[#DDD]">{item.title}</h4>
                       <p className="text-[#666] text-sm">{item.desc}</p>
                    </div>
                 </div>
              ))}
           </div>

           <div className="space-y-8 relative">
              <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#333] to-transparent hidden md:block"></div>
              <h3 className="text-2xl font-bold text-emerald-500 mb-6">O Jeito SponsTube (Simples)</h3>
              {[
                 { icon: Filter, title: "Filtros Inteligentes", desc: "Busque por Nicho (ex: Beleza, Tech), Preço e Tamanho da Audiência em segundos." },
                 { icon: ShieldCheck, title: "Contrato Padronizado", desc: "Termos claros desde o início. Você sabe o que vai receber e quanto vai pagar." },
                 { icon: Briefcase, title: "Pagamento Único e Seguro", desc: "Deposite o valor total. Nós cuidamos do pagamento individual de cada creator." }
              ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="p-2 bg-emerald-900/20 rounded-lg h-fit">
                       <item.icon className="text-emerald-500 shrink-0" size={20} />
                    </div>
                    <div>
                       <h4 className="font-bold text-white">{item.title}</h4>
                       <p className="text-[#888] text-sm">{item.desc}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </LandingSection>

      {/* SOLUTION GRID */}
      <LandingSection 
        title="Ferramentas para Marcas Modernas" 
        subtitle="Seja você um e-commerce, uma startup B2B ou uma agência."
        darker
      >
        <LandingFeatureGrid 
          features={[
            { 
              icon: Target, 
              title: "Smart Match", 
              description: "Nosso sistema sugere canais baseados em dados reais de audiência, garantindo que sua marca fale com quem interessa." 
            },
            { 
              icon: Layers, 
              title: "Briefing em Massa", 
              description: "Crie uma campanha e receba propostas de múltiplos canais interessados. Compare e escolha os melhores." 
            },
            { 
              icon: ShieldCheck, 
              title: "Proteção Escrow", 
              description: "Seu orçamento fica protegido em uma conta segura e só é liberado quando o vídeo é publicado e verificado." 
            },
            { 
              icon: Zap, 
              title: "Formatos Variados", 
              description: "De Shorts virais a Reviews aprofundados. Encontre o formato ideal para seu objetivo de marketing." 
            },
            { 
              icon: BarChart3, 
              title: "Dashboard Unificado", 
              description: "Acompanhe o status de todas as suas contratações em um só lugar. Nada de emails perdidos." 
            },
            { 
              icon: UserCheck, 
              title: "Creators Verificados", 
              description: "Todos os canais passam por verificação de identidade e conexão via API do YouTube. Sem surpresas." 
            }
          ]} 
        />
      </LandingSection>

      {/* SOCIAL PROOF / METRICS */}
      <LandingSection>
         <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
               <div className="inline-flex items-center gap-2 text-[#FF0000] font-bold uppercase tracking-wider text-xs mb-4">
                  <TrendingUp size={16} /> A Mídia do Momento
               </div>
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Por que investir em Creators?
               </h2>
               <p className="text-[#888] text-lg mb-8 leading-relaxed">
                  Diferente de anúncios tradicionais que são ignorados, creators possuem a confiança da audiência. É a forma mais autêntica de apresentar seu produto.
               </p>
               <ul className="space-y-4">
                  {[
                     "Custo de aquisição (CAC) competitivo",
                     "Conteúdo que gera confiança e prova social",
                     "Vídeos que continuam vendendo por meses (Evergreen)",
                     "Acesso a nichos específicos e engajados"
                  ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-[#CCC]">
                        <CheckCircle2 className="text-[#FF0000] shrink-0" size={20} />
                        {item}
                     </li>
                  ))}
               </ul>
            </div>
            <div className="flex-1 w-full">
               <div className="bg-[#111] border border-[#222] rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF0000]/10 rounded-full blur-[80px]"></div>
                  <div className="relative z-10 grid grid-cols-2 gap-6 text-center">
                     <div>
                        <div className="text-4xl font-bold text-white mb-1">2.5k+</div>
                        <div className="text-xs text-[#666] uppercase font-bold">Canais Verificados</div>
                     </div>
                     <div>
                        <div className="text-4xl font-bold text-white mb-1">15M</div>
                        <div className="text-xs text-[#666] uppercase font-bold">Impactos/Dia</div>
                     </div>
                     <div className="col-span-2 pt-6 border-t border-[#222]">
                        <div className="text-5xl font-bold text-white mb-1">R$ 21M</div>
                        <div className="text-xs text-[#666] uppercase font-bold">Gerados para Marcas (Último Trimestre)</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </LandingSection>

      {/* PRICING */}
      <LandingSection id="pricing" title="Planos Flexíveis" subtitle="Sem contratos de fidelidade. Cancele a qualquer momento." darker>
        <LandingPricing 
          plans={[
            {
              name: "Start",
              description: "Para testar e validar.",
              price: "R$ 0",
              period: "/ mês",
              features: [
                "Acesso ao Marketplace",
                "Taxa Padrão da Plataforma",
                "Pagamento via Cartão",
                "Suporte via Chat"
              ],
              cta: "Criar Conta Grátis",
              recommended: false
            },
            {
              name: "Growth",
              description: "Para quem escala.",
              price: "R$ 499",
              period: "/ mês",
              features: [
                "Taxa Reduzida nas Campanhas",
                "Relatórios Avançados",
                "Gerente de Sucesso Dedicado",
                "Pagamento via Boleto/PIX",
                "Curadoria Personalizada"
              ],
              cta: "Iniciar Trial de 14 dias",
              recommended: true
            },
            {
              name: "Enterprise",
              description: "Para grandes volumes.",
              price: "Sob Medida",
              features: [
                "Taxas Especiais por Volume",
                "Acesso à API",
                "Faturamento Flexível",
                "SLA de Atendimento",
                "Contrato Personalizado"
              ],
              cta: "Falar com Vendas",
              recommended: false
            }
          ]} 
        />
      </LandingSection>

      {/* FAQ */}
      <LandingSection title="Perguntas Frequentes">
        <LandingFAQ 
          items={[
            { 
               question: "Como meu dinheiro fica seguro?", 
               answer: "Usamos o modelo de Escrow (Custódia). Você paga para a plataforma, nós seguramos o valor. O creator só recebe quando entrega o link do vídeo e nosso sistema valida a publicação. Se o creator não entregar, você é reembolsado." 
            },
            { 
               question: "Posso aprovar o conteúdo antes?", 
               answer: "Sim! O fluxo padrão inclui uma etapa de 'Revisão Criativa' onde o creator envia o roteiro ou o vídeo não-listado antes de publicar para sua aprovação." 
            },
            { 
               question: "Qual o investimento mínimo?", 
               answer: "Não existe mínimo da plataforma. Você encontra ofertas a partir de R$ 100 em micro-influenciadores. Recomendamos testar com pelo menos R$ 2.000 para ter resultados mensuráveis." 
            },
            { 
               question: "Vocês emitem nota fiscal?", 
               answer: "Sim. Emitimos uma nota fiscal única referente à intermediação e ao valor pago aos creators, simplificando drasticamente sua contabilidade." 
            }
          ]} 
        />
      </LandingSection>

      <LandingFooter />
    </div>
  );
}
