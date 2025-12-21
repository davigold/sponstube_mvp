
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
  Users, DollarSign, ShieldCheck, Zap, 
  MessageCircle, LayoutTemplate, Star, 
  CheckCircle2, AlertTriangle, TrendingUp, Lock, Briefcase
} from 'lucide-react';
import { navigateTo } from '../../utils/navigation';

export default function CommunityLanding() {
  const handleCtaClick = () => {
    navigateTo('/auth?role=community');
  };

  return (
    <div className="bg-[#050505] min-h-screen text-[#E0E0E0] selection:bg-[#FF0000]/30 font-sans">
      <LandingNavbar />

      {/* HERO */}
      <LandingHero 
        title={
          <>
            Transforme Views em<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#666]">
              Renda Recorrente.
            </span>
          </>
        }
        subtitle="Pare de depender apenas do AdSense. Tenha um Media Kit profissional, feche parcerias com marcas incríveis e receba com segurança garantida."
        primaryCta="Criar Meu Media Kit"
        secondaryCta="Ver Exemplo"
        onPrimaryClick={handleCtaClick}
        onSecondaryClick={() => {}}
      />

      {/* BRANDS TICKER (New for Community) */}
      <div className="border-y border-[#222] bg-[#0A0A0A] py-6 overflow-hidden">
         <div className="text-center text-xs font-bold text-[#666] uppercase tracking-widest mb-4">Marcas que buscam creators no SponsTube</div>
         <div className="flex justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Mock Logos using text for now */}
            <span className="text-xl font-bold text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rounded"></div> NOTION</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rounded"></div> VERCEL</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rounded"></div> SHOPIFY</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rounded"></div> NUBANK</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rounded"></div> HOSTGATOR</span>
         </div>
      </div>

      {/* PAIN POINTS */}
      <LandingSection 
        title="Foque no Conteúdo, Nós Cuidamos do Resto." 
        subtitle="Você cria vídeos incríveis. O lado comercial não deveria ser uma dor de cabeça."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-[#111] p-8 rounded-2xl border border-[#222]">
              <AlertTriangle className="text-[#FF0000] mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Dúvida no Preço?</h3>
              <p className="text-[#888] text-sm">"Quanto cobrar?" Nossa IA analisa seu canal e sugere o valor justo de mercado para você não perder dinheiro.</p>
           </div>
           <div className="bg-[#111] p-8 rounded-2xl border border-[#222]">
              <MessageCircle className="text-[#FF0000] mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Emails Infinitos?</h3>
              <p className="text-[#888] text-sm">Chega de negociar por email e levar vácuo. Receba propostas claras e objetivas diretamente na plataforma.</p>
           </div>
           <div className="bg-[#111] p-8 rounded-2xl border border-[#222]">
              <DollarSign className="text-[#FF0000] mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Medo de Calote?</h3>
              <p className="text-[#888] text-sm">O pesadelo acabou. A marca paga a plataforma ANTES de você começar a gravar. Seu dinheiro é garantido.</p>
           </div>
        </div>
      </LandingSection>

      {/* SOLUTION GRID */}
      <LandingSection 
        title="Sua Carreira Profissional" 
        subtitle="Ferramentas para você crescer e monetizar com dignidade."
        darker
      >
        <LandingFeatureGrid 
          features={[
            { 
              icon: LayoutTemplate, 
              title: "Media Kit Automático", 
              description: "Um link público (sponstube.com/s/seu-canal) conectado ao YouTube. Seus números sempre atualizados. Zero PDFs." 
            },
            { 
              icon: ShieldCheck, 
              title: "Você no Comando", 
              description: "Defina seus preços e regras. Aceite ou recuse propostas com um clique. Só trabalhe com marcas que têm a ver com você." 
            },
            { 
              icon: Lock, 
              title: "Pagamento Garantido", 
              description: "Segurança total. O dinheiro fica em custódia (Escrow) e é liberado assim que o vídeo é aprovado. Sem atrasos." 
            },
            { 
              icon: Zap, 
              title: "Venda Formatos Prontos", 
              description: "Crie pacotes como 'Combo Shorts + Post' ou 'Review 10min'. Produto 'de prateleira' vende mais rápido." 
            },
            { 
              icon: Briefcase, 
              title: "Receba Propostas", 
              description: "Marcas buscam no nosso marketplace. Se seu canal for bom, os jobs chegam até você passivamente." 
            },
            { 
              icon: TrendingUp, 
              title: "Reputação Tech", 
              description: "Construa histórico de entregas e ganhe selos de 'Verificado' e 'Top Rated' para cobrar mais caro no futuro." 
            }
          ]} 
        />
      </LandingSection>

      {/* INSPIRATION / OFFERS */}
      <LandingSection>
         <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 w-full order-2 md:order-1">
               {/* Visual Mock of Storefront */}
               <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative shadow-2xl">
                  <div className="flex items-center gap-4 mb-6 border-b border-[#333] pb-4">
                     <div className="w-12 h-12 bg-white rounded-full"></div>
                     <div>
                        <div className="h-4 w-32 bg-[#333] rounded mb-2"></div>
                        <div className="h-3 w-20 bg-[#222] rounded"></div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#333] flex justify-between items-center group hover:border-[#FF0000] transition-colors cursor-pointer">
                        <div>
                           <div className="text-xs font-bold text-[#FF0000] uppercase mb-1">Mais Vendido</div>
                           <div className="text-white font-bold">Publi Integrada (60s)</div>
                        </div>
                        <div className="text-right">
                           <div className="text-xs text-[#666]">Preço Fixo</div>
                           <div className="text-white font-bold">R$ 1.500</div>
                        </div>
                     </div>
                     <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#333] flex justify-between items-center group hover:border-[#FF0000] transition-colors cursor-pointer">
                        <div>
                           <div className="text-xs font-bold text-emerald-400 uppercase mb-1">Alta Margem</div>
                           <div className="text-white font-bold">Vídeo Dedicado (10min)</div>
                        </div>
                        <div className="text-right">
                           <div className="text-xs text-[#666]">A partir de</div>
                           <div className="text-white font-bold">R$ 5.000</div>
                        </div>
                     </div>
                  </div>
                  {/* Badge Overlay */}
                  <div className="absolute -right-6 top-10 bg-[#FF0000] text-white font-bold px-6 py-2 transform rotate-45 shadow-lg text-xs uppercase tracking-wider">
                     Disponível
                  </div>
               </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
               <div className="inline-flex items-center gap-2 text-[#FF0000] font-bold uppercase tracking-wider text-xs mb-4">
                  <Star size={16} /> Monetize com Propósito
               </div>
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Venda publicidade, não sua alma.
               </h2>
               <p className="text-[#888] text-lg mb-8 leading-relaxed">
                  Esqueça os "jogos de azar" e produtos duvidosos. No SponsTube, você atrai marcas sérias que agregam valor real ao seu público e respeitam sua criação.
               </p>
               <ul className="space-y-4">
                  {[
                     "Zero exclusividade. Você é livre.",
                     "Você aprova o roteiro e a marca.",
                     "Proteção total contra calote.",
                     "Receba em até 48h após aprovação."
                  ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-[#CCC]">
                        <CheckCircle2 className="text-[#FF0000] shrink-0" size={20} />
                        {item}
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </LandingSection>

      {/* PRICING */}
      <LandingSection id="pricing" title="Quanto Custa?" subtitle="Nosso modelo é justo. Só ganhamos quando você ganha." darker>
        <LandingPricing 
          plans={[
            {
              name: "Creator Partner",
              description: "Tudo para começar a vender.",
              price: "R$ 0",
              period: "/ mês",
              features: [
                "Media Kit Profissional",
                "Receber Propostas Ilimitadas",
                "Contratos & Escrow Inclusos",
                "Painel de Resultados"
              ],
              cta: "Criar Conta Grátis",
              recommended: true
            },
            {
              name: "Taxa de Sucesso",
              description: "Descontada do valor do deal.",
              price: "15%",
              period: "por transação",
              features: [
                "Processamento de Pagamento",
                "Emissão de Nota Fiscal para Marca",
                "Garantia de Recebimento",
                "Suporte em Disputas"
              ],
              cta: "Ver Detalhes",
              recommended: false
            }
          ]} 
        />
      </LandingSection>

      {/* FAQ */}
      <LandingSection title="FAQ para Creators">
        <LandingFAQ 
          items={[
            { 
               question: "Preciso ter CNPJ?", 
               answer: "Não é obrigatório para começar, mas recomendado para impostos. Se for PF, emitimos RPA e descontamos os impostos na fonte conforme a lei exige." 
            },
            { 
               question: "Existe exclusividade?", 
               answer: "Nunca. O canal é seu. Você pode vender por fora, ter agência ou usar outras plataformas. O SponsTube é mais uma ferramenta para seu arsenal." 
            },
            { 
               question: "E se a marca não pagar?", 
               answer: "Impossível no nosso fluxo. A marca deposita o dinheiro com a gente (Escrow) ANTES de você começar a gravar. O dinheiro já está garantido." 
            },
            { 
               question: "Quem define o preço?", 
               answer: "Você. Sempre. Nossa IA pode sugerir um preço baseado no mercado para te ajudar, mas a decisão final é sua." 
            }
          ]} 
        />
      </LandingSection>

      <LandingFooter />
    </div>
  );
}
