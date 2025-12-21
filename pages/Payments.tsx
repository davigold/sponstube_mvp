
import React from 'react';
import { 
  DollarSign, ArrowUpRight, ArrowDownLeft, Download, 
  FileText, Calendar, CreditCard, PieChart, TrendingUp, Plus
} from 'lucide-react';
import { 
  Button, Card, CardContent, CardHeader, CardTitle, 
  StatCard, Badge, PageHeader, SectionTitle, EmptyState, InfoTooltip
} from '../components/Common';
import { MOCK_TRANSACTIONS } from '../mockData';
import { useCurrency } from '../contexts/CurrencyContext';
import { useI18n } from '../contexts/I18nContext';
import { Role } from '../types';

export default function Payments({ userRole }: { userRole: Role }) {
  const { formatCurrency } = useCurrency();
  const { t } = useI18n();

  const balance = userRole === 'brand' ? 3500 : 12450;
  const escrow = 2100;

  return (
    <>
      <PageHeader 
        title={t('nav.payments')}
        subtitle="Gerencie sua carteira, notas fiscais e histórico de transações."
        action={
           <Button icon={<Download size={18} />}>Exportar Relatório</Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         {/* Balance Card - Keeping Gradient but adjusting text for clarity */}
         <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/30 text-white lg:col-span-2">
            <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
               <div>
                  <p className="text-indigo-200 font-medium mb-1 flex items-center gap-2">
                      Saldo Disponível <InfoTooltip content={t('tooltips.payout')} className="text-indigo-300 hover:text-white" />
                  </p>
                  <h2 className="text-4xl font-bold mb-4 text-white">{formatCurrency(balance)}</h2>
                  <div className="flex gap-4 text-sm">
                     <div className="px-3 py-1 rounded-full bg-slate-900/50 border border-indigo-500/30 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Bloqueado em Escrow: <span className="font-bold text-white">{formatCurrency(escrow)}</span>
                        <InfoTooltip content={t('tooltips.escrow')} className="text-indigo-300 hover:text-white" />
                     </div>
                  </div>
               </div>
               <div className="flex gap-3">
                  {userRole === 'brand' ? (
                     <Button className="bg-white text-indigo-900 hover:bg-slate-100 shadow-xl" icon={<Plus size={18} />}>Adicionar Fundos</Button>
                  ) : (
                     <Button className="bg-white text-indigo-900 hover:bg-slate-100 shadow-xl" icon={<ArrowUpRight size={18} />}>Sacar</Button>
                  )}
               </div>
            </CardContent>
         </Card>

         {/* Quick Actions / Cards */}
         <Card>
            <CardHeader><CardTitle>Métodos de Pagamento</CardTitle></CardHeader>
            <CardContent>
               <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mb-3 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-white">
                        <CreditCard size={20} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Mastercard •••• 4242</p>
                        <p className="text-xs text-slate-500">Expira 12/25</p>
                     </div>
                  </div>
                  <Badge variant="success">Padrão</Badge>
               </div>
               <Button variant="outline" className="w-full text-sm">Gerenciar Cartões</Button>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatCard label="Total Gasto (Ano)" value={formatCurrency(45000)} icon={TrendingUp} trend="up" trendValue="12%" />
         <StatCard label="Faturas Abertas" value="0" icon={FileText} trend="neutral" />
         <StatCard label="Próximo Pagamento" value="25 Out" icon={Calendar} />
         <StatCard label="Custo Médio/Campanha" value={formatCurrency(2500)} icon={PieChart} />
      </div>

      <SectionTitle title="Histórico de Transações" />
      <Card className="overflow-hidden">
         {MOCK_TRANSACTIONS.length === 0 ? (
            <div className="p-8">
                <EmptyState 
                    icon={FileText} 
                    title="Nenhuma Transação" 
                    description="Sua atividade financeira aparecerá aqui." 
                />
            </div>
         ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Data</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Descrição</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Valor</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Nota Fiscal</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {MOCK_TRANSACTIONS.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{tx.date}</td>
                            <td className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500'}`}>
                                    {tx.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                </div>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">{tx.description}</span>
                            </div>
                            </td>
                            <td className="p-4">
                            <Badge variant={tx.status === 'completed' ? 'success' : 'warning'}>{tx.status}</Badge>
                            </td>
                            <td className={`p-4 text-sm font-bold text-right ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                            {tx.type === 'debit' && '-'}{formatCurrency(tx.amount)}
                            </td>
                            <td className="p-4 text-center">
                            {tx.invoiceUrl && (
                                <button className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    <Download size={16} />
                                </button>
                            )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
         )}
      </Card>
    </>
  );
}
    