
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { Role, Campaign } from '../types';
import { ExecutionPipeline } from '../components/ExecutionPipeline';
import { LayoutDashboard, Users, Megaphone, AlertCircle } from 'lucide-react';
import api from '../services/api';

const FullApp: React.FC = () => {
    const { users, campaigns, loading, refreshData } = useData();
    const [currentRole, setCurrentRole] = useState<Role>('brand');
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Convert DataContext types to strict types if needed, or cast
    // For MVP we assume they match enough

    const handleSwitchRole = (r: Role) => setCurrentRole(r);

    const renderContent = () => {
        if (currentPage === 'dashboard') {
            return (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Olá, {currentRole === 'brand' ? 'Gestor' : 'Creator'}</h1>
                            <p className="text-slate-500">Bem-vindo ao Sponstube Enterprise.</p>
                        </div>
                        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold">
                            Saldo Escrow: R$ 12.500,00
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-sm mb-1">Campanhas Ativas</div>
                            <div className="text-3xl font-bold">{campaigns.length}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-sm mb-1">Ação Necessária</div>
                            <div className="text-3xl font-bold text-indigo-600">2</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-sm mb-1">ROI Est (Mês)</div>
                            <div className="text-3xl font-bold text-emerald-600">320%</div>
                        </div>
                    </div>
                </div>
            );
        }

        if (currentPage === 'campaigns') {
            return (
                <div className="space-y-8">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Megaphone size={24} /> Campanhas & Entregas
                    </h2>

                    {campaigns.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl">
                            <p>Nenhuma campanha encontrada.</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {campaigns.map((camp) => (
                                <div key={camp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                                        <div>
                                            <h3 className="text-lg font-bold">{camp.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${camp.status === 'running' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100'}`}>
                                                {camp.status}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-slate-500">Budget</div>
                                            <div className="font-mono font-bold">R$ {camp.budgetTotal}</div>
                                        </div>
                                    </div>

                                    {/* The Rich Component */}
                                    <ExecutionPipeline
                                        campaign={camp as any}
                                        role={currentRole}
                                        onStatusChange={(s) => { console.log('Status update logic here', s); refreshData(); }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Fallback for other pages
        return (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <AlertCircle size={48} className="mb-4 opacity-50" />
                <h3 className="text-lg font-bold">Em construção</h3>
                <p>O módulo {currentPage} estará disponível na versão V2.</p>
            </div>
        );
    };

    return (
        <Layout
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            currentRole={currentRole}
            onSwitchRole={handleSwitchRole}
            onLogout={() => window.location.reload()}
        >
            {renderContent()}
        </Layout>
    );
};

export default FullApp;
