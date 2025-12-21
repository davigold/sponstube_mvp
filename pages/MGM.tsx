
import React, { useState } from 'react';
import { 
  Copy, Gift, Share2, DollarSign, Users, 
  TrendingUp, CheckCircle2, Wallet, Sparkles, Building
} from 'lucide-react';
import { 
  Button, Card, CardContent, CardHeader, CardTitle, 
  StatCard, PageHeader 
} from '../components/Common';
import { useCurrency } from '../contexts/CurrencyContext';
import { MOCK_USERS } from '../mockData';

export default function MGM() {
  const { formatCurrency } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [inviteType, setInviteType] = useState<'brand' | 'community'>('brand');
  
  // Mock User Data for MGM
  const user = MOCK_USERS[0];
  const referralCode = `CM-${user.name.split(' ')[0].toUpperCase()}-2024`;
  // Dynamic link generation based on invite type
  const referralLink = `https://sponstube.com/auth?mode=signup&referral=${referralCode}&role=${inviteType}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Convite SponsTube',
          text: `Use meu código ${referralCode} para ganhar R$10 ao se cadastrar no SponsTube!`,
          url: referralLink,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Indique e Ganhe (MGM)" 
        subtitle="Convide parceiros para a plataforma e ganhe recompensas em dinheiro."
      />

      {/* HERO SECTION */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-violet-900 to-indigo-900 p-8 border border-indigo-500/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4">
               <Sparkles size={14} className="text-amber-400" /> Programa de Indicações
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              Indique e <span className="text-emerald-400">Ambos Ganham {formatCurrency(10)}</span>
            </h2>
            <p className="text-indigo-200 text-lg leading-relaxed mb-6">
              Para cada amigo que se cadastrar e completar o perfil usando seu link, 
              <strong>você ganha R$ 10 e ele também ganha R$ 10</strong> de crédito na plataforma.
            </p>
            
            {/* Invite Type Toggle */}
            <div className="flex gap-2 mb-4 bg-slate-950/30 p-1 rounded-lg w-fit">
               <button 
                  onClick={() => setInviteType('brand')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${inviteType === 'brand' ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:text-white'}`}
               >
                  <Building size={14} /> Convidar Marca
               </button>
               <button 
                  onClick={() => setInviteType('community')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${inviteType === 'community' ? 'bg-emerald-600 text-white' : 'text-indigo-200 hover:text-white'}`}
               >
                  <Users size={14} /> Convidar Creator
               </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
               <div className="flex items-center bg-slate-950/50 border border-indigo-500/30 rounded-lg p-1 pl-4 flex-1 max-w-md">
                  <div className="flex-1 overflow-hidden mr-2">
                      <div className="text-[10px] text-indigo-300 font-bold uppercase">Seu Link Único</div>
                      <code className="text-white font-mono text-sm truncate block">{referralLink}</code>
                  </div>
                  <Button size="sm" onClick={handleCopy} className={copied ? "bg-emerald-600 hover:bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-500"}>
                     {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </Button>
               </div>
               <Button variant="secondary" icon={<Share2 size={18} />} onClick={handleShare}>
                  Compartilhar
               </Button>
            </div>
          </div>

          {/* Visual Illustration */}
          <div className="hidden md:flex relative w-64 h-64 items-center justify-center">
             <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[60px] animate-pulse"></div>
             <div className="relative z-10 bg-slate-950/80 p-6 rounded-2xl border border-indigo-500/50 shadow-2xl transform rotate-6">
                <Gift size={64} className="text-indigo-400 mx-auto mb-2" />
                <div className="text-center font-bold text-white text-xl">+ {formatCurrency(10)}</div>
                <div className="text-center text-xs text-slate-400 uppercase tracking-wide">Para Você</div>
             </div>
             <div className="absolute z-0 bg-slate-900/80 p-6 rounded-2xl border border-slate-700 shadow-xl transform -rotate-6 scale-90 opacity-60">
                <Gift size={64} className="text-emerald-500 mx-auto mb-2" />
                <div className="text-center font-bold text-white text-xl">+ {formatCurrency(10)}</div>
                <div className="text-center text-xs text-slate-400 uppercase tracking-wide">Para o Amigo</div>
             </div>
          </div>
        </div>
      </div>

      {/* STATS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard 
            label="Total Ganho" 
            value={formatCurrency(140)} 
            icon={Wallet} 
            trend="up" 
            trendValue="R$ 30 essa semana" 
         />
         <StatCard 
            label="Indicações Enviadas" 
            value="24" 
            icon={Share2} 
            trend="neutral" 
            trendValue="12 clicks" 
         />
         <StatCard 
            label="Cadastros Confirmados" 
            value="14" 
            icon={Users} 
            trend="up" 
            trendValue="58% conversão" 
         />
      </div>

      {/* REFERRAL HISTORY */}
      <Card>
         <CardHeader>
            <CardTitle>Histórico de Indicações</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-900/50 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase">
                     <tr>
                        <th className="p-4">Usuário Convidado</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Data</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Recompensa</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                     {[
                        { name: 'Ricardo Silva', type: 'Brand', email: 'ricardo@startup.com', date: 'Hoje', status: 'pending', reward: 10 },
                        { name: 'Ana Tech', type: 'Creator', email: 'ana@dev.io', date: 'Ontem', status: 'completed', reward: 10 },
                        { name: 'Pedro Loja', type: 'Brand', email: 'pedro@store.br', date: '12 Out', status: 'completed', reward: 10 },
                        { name: 'Grupo Marketing', type: 'Brand', email: 'admin@mkt.com', date: '10 Out', status: 'expired', reward: 0 },
                     ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                           <td className="p-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">
                                    {item.name[0]}
                                 </div>
                                 <div>
                                    <div className="font-medium text-white text-sm">{item.name}</div>
                                    <div className="text-xs text-slate-500">{item.email}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="p-4">
                              <span className={`text-xs font-bold px-2 py-1 rounded border ${item.type === 'Brand' ? 'bg-indigo-900/30 border-indigo-800 text-indigo-300' : 'bg-red-900/30 border-red-800 text-red-300'}`}>
                                 {item.type}
                              </span>
                           </td>
                           <td className="p-4 text-sm text-slate-400">{item.date}</td>
                           <td className="p-4">
                              {item.status === 'completed' && <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Confirmado</span>}
                              {item.status === 'pending' && <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full"><TrendingUp size={12}/> Pendente</span>}
                              {item.status === 'expired' && <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-full">Expirado</span>}
                           </td>
                           <td className="p-4 text-right font-mono font-bold text-white">
                              {item.status === 'completed' ? formatCurrency(item.reward) : <span className="text-slate-600">--</span>}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
