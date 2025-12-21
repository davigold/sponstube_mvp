import React from 'react';
import { LayoutDashboard, Users, Megaphone, ShoppingBag, Settings, RefreshCw, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import api from '../services/api';

export default function SaaSApp() {
    const { users, campaigns, loading, refreshData } = useData();

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-slate-500">Carregando dados...</div>;
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar (Simplified) */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 text-xl font-bold">Sponstube</div>
                <nav className="flex-1 px-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"><LayoutDashboard size={20} /> Dashboard</a>
                    <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg text-slate-400"><Megaphone size={20} /> Campanhas</a>
                    <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg text-slate-400"><span className="text-xl">$</span> Financeiro</a>
                </nav>
            </aside>

            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <div className="flex gap-4">
                        <button onClick={refreshData} className="p-2 hover:bg-slate-100 rounded-full" title="Recarregar">
                            <RefreshCw size={20} className="text-slate-600" />
                        </button>
                        <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">DV</div>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard icon={<Users className="text-blue-500" />} label="Usuários Totais" value={users.length} />
                        <StatCard icon={<Megaphone className="text-purple-500" />} label="Campanhas Ativas" value={campaigns.filter(c => c.status === 'running').length} />
                        <StatCard icon={<ShoppingBag className="text-green-500" />} label="Total de Campanhas" value={campaigns.length} />
                        <StatCard icon={<Settings className="text-orange-500" />} label="Status do Sistema" value="Online" />
                    </div>

                    {/* Actions Grid */}
                    <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-blue-900">Teste de Integração (Stripe)</h3>
                            <p className="text-blue-700 text-sm">Simule um depósito em Escrow para uma campanha.</p>
                        </div>
                        <button
                            onClick={async () => {
                                try {
                                    const res = await api.post('/payments/checkout', { amount: 5000, currency: 'brl' });
                                    if (res.data.url) window.location.href = res.data.url;
                                    else alert('Modo Mock: Pagamento simulado com sucesso (Sem chave Stripe configurada)');
                                } catch (e) {
                                    alert('Erro ao iniciar pagamento');
                                }
                            }}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                        >
                            Depositar R$ 50,00
                        </button>
                    </div>

                    {/* Recent Campaigns Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between">
                            <h2 className="font-bold text-slate-800">Campanhas Recentes</h2>
                        </div>
                        {campaigns.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                                <AlertCircle className="mb-2 h-8 w-8 text-slate-300" />
                                <p>Nenhuma campanha encontrada no banco de dados.</p>
                                <p className="text-sm mt-1">Certifique-se que o backend está rodando e conectado ao PostgreSQL.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-sm">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Nome</th>
                                        <th className="px-6 py-3 font-medium">Orçamento</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {campaigns.map(campaign => (
                                        <tr key={campaign.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">{campaign.name}</td>
                                            <td className="px-6 py-4">R$ {campaign.budgetTotal}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                    {campaign.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
            <div>
                <div className="text-slate-500 text-sm font-medium">{label}</div>
                <div className="text-2xl font-bold text-slate-800">{value}</div>
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'running': return 'bg-green-100 text-green-700';
        case 'applied': return 'bg-blue-100 text-blue-700';
        case 'approved': return 'bg-purple-100 text-purple-700';
        case 'completed': return 'bg-slate-100 text-slate-700';
        default: return 'bg-gray-100 text-gray-700';
    }
}
