
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Users, 
  Menu, Search, Bell, CreditCard,
  Globe, DollarSign, LogOut, X, Check,
  MessageSquare, Zap, AlertTriangle, ShieldAlert,
  BarChart3, FileText, Gift, Megaphone, User, ChevronDown, Shield, LayoutTemplate,
  Telescope, Clapperboard, MonitorPlay, Wallet, Settings as SettingsIcon,
  Sun, Moon, Command, PackagePlus, Plus, PanelLeftClose, PanelLeftOpen, ChevronRight,
  PieChart
} from 'lucide-react';
import { Role } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';
import { navigateTo } from '../utils/navigation';
import { Logo } from './Brand/Logo';
import { Mark } from './Brand/Mark';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  currentRole: Role;
  onSwitchRole: (role: Role) => void;
  onLogout?: () => void;
}

// Mock Notifications Data
const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Novo Match', desc: 'TechStart SaaS quer conectar.', time: '2m atrás', type: 'match', read: false },
  { id: 2, title: 'Pagamento Liberado', desc: 'Fundos liberados para Campanha #402.', time: '1h atrás', type: 'success', read: false },
  { id: 3, title: 'Asset Rejeitado', desc: 'Por favor revise o banner.', time: '3h atrás', type: 'alert', read: true },
  { id: 4, title: 'Bem-vindo!', desc: 'Obrigado por entrar no SponsTube.', time: '1d atrás', type: 'info', read: true },
];

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, currentRole, onSwitchRole, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Sidebar Collapse State
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('cm_sidebar_collapsed') === 'true';
  });

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { t, language, setLanguage } = useI18n();
  const { currency, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('cm_sidebar_collapsed', String(newState));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const NavItem = ({ id, icon: Icon, label, badge, alert }: { id: string, icon: any, label: string, badge?: string, alert?: boolean }) => (
    <button
      onClick={() => {
        onNavigate(id);
        setIsMobileMenuOpen(false);
      }}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden
        ${currentPage === id 
          ? 'bg-[#F2F2F2] text-[#FF0000] dark:bg-[#272727] dark:text-white' 
          : 'text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F9F9F9] dark:text-[#AAAAAA] dark:hover:text-white dark:hover:bg-[#272727]'
        }`}
    >
      {/* Active Indicator Line (YouTube Style) */}
      {currentPage === id && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#FF0000] rounded-r-full"></div>}
      
      <div className={`flex items-center gap-4 relative z-10 ${isCollapsed ? '' : 'pl-2'}`}>
        <Icon size={20} className={currentPage === id ? 'text-[#FF0000]' : alert ? 'text-rose-500' : 'text-[#909090] group-hover:text-[#606060] dark:group-hover:text-white transition-colors'} />
        {!isCollapsed && <span>{label}</span>}
      </div>
      
      {!isCollapsed && badge && (
        <span className={`text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wide relative z-10 ${currentPage === id ? 'bg-red-50 text-[#FF0000] dark:bg-red-900/30 dark:text-[#FF0000]' : 'bg-[#F2F2F2] text-[#606060] dark:bg-[#272727] dark:text-[#AAAAAA]'}`}>
          {badge}
        </span>
      )}
      
      {/* Alert dot for collapsed mode */}
      {isCollapsed && alert && (
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
      )}

      {!isCollapsed && alert && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
      )}
    </button>
  );

  const SectionHeader = ({ label }: { label: string }) => {
      if (isCollapsed) return <div className="h-px w-8 mx-auto bg-slate-200 dark:bg-slate-800 my-4"></div>;
      return <p className="px-3 text-[10px] font-bold text-[#606060] dark:text-[#AAAAAA] uppercase tracking-widest mb-3 opacity-80">{label}</p>;
  };

  const renderNavigation = () => {
    if (currentRole === 'staff') {
      return (
        <>
          <div>
            <SectionHeader label="Cockpit" />
            <div className="space-y-1">
              <NavItem id="dashboard" icon={BarChart3} label="Visão Geral" />
              <NavItem id="marketplace" icon={Users} label="Usuários" />
              <NavItem id="storefront" icon={FileText} label="Templates & CMS" />
              <NavItem id="mgm" icon={Gift} label="Gestão MGM" badge="New" />
            </div>
          </div>

          <div>
            <SectionHeader label="Operações" />
            <div className="space-y-1">
              <NavItem id="management" icon={ShieldAlert} label="Disputas & Risco" alert={true} />
              <NavItem id="payments" icon={Wallet} label="Tesouraria" />
            </div>
          </div>
        </>
      );
    }

    // CREATOR NAVIGATION (OPTIMIZED)
    if (currentRole === 'community') {
        return (
            <>
              <div>
                <div className="space-y-1">
                  <NavItem id="dashboard" icon={LayoutDashboard} label={t('nav.dashboard')} />
                  <NavItem id="marketplace" icon={Telescope} label={t('nav.marketplace')} />
                </div>
              </div>
      
              <div className={`pt-4 border-t border-[#E5E5E5] dark:border-[#303030] mt-4`}>
                <SectionHeader label="Negócios" />
                <div className="space-y-1">
                  <NavItem id="campaigns" icon={PackagePlus} label={t('nav.campaigns')} />
                  <NavItem id="management" icon={Clapperboard} label={t('nav.executions')} badge="Action" />
                  <NavItem id="reports" icon={BarChart3} label={t('nav.reports')} />
                  <NavItem id="payments" icon={Wallet} label={t('nav.payments')} />
                </div>
              </div>
      
              <div className={`pt-4 border-t border-[#E5E5E5] dark:border-[#303030] mt-4`}>
                <SectionHeader label="Canal" />
                <div className="space-y-1">
                  <NavItem id="storefront" icon={MonitorPlay} label={t('nav.storefront')} />
                  <NavItem id="settings" icon={SettingsIcon} label={t('nav.settings')} />
                </div>
              </div>
            </>
          );
    }

    // BRAND NAVIGATION
    return (
      <>
        <div>
          <div className="space-y-1">
            <NavItem id="dashboard" icon={LayoutDashboard} label={t('nav.dashboard')} />
            <NavItem id="marketplace" icon={Users} label={t('nav.marketplace')} badge="AI" />
          </div>
        </div>

        <div className={`pt-4 border-t border-[#E5E5E5] dark:border-[#303030] mt-4`}>
          <SectionHeader label="Gestão" />
          <div className="space-y-1">
            <NavItem id="campaigns" icon={Megaphone} label={t('nav.campaigns')} />
            <NavItem id="management" icon={Clapperboard} label={t('nav.executions')} />
            <NavItem id="reports" icon={PieChart} label={t('nav.reports')} />
            <NavItem id="payments" icon={Wallet} label={t('nav.payments')} />
          </div>
        </div>

        <div className={`pt-4 border-t border-[#E5E5E5] dark:border-[#303030] mt-4`}>
          <SectionHeader label="Conta" />
          <div className="space-y-1">
            <NavItem id="settings" icon={SettingsIcon} label={t('nav.settings')} />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex h-screen bg-[#F9F9F9] dark:bg-[#0F0F0F] text-[#0F0F0F] dark:text-[#F1F1F1] font-sans selection:bg-red-500/30 overflow-hidden transition-colors duration-300">
      
      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#0F0F0F] border-r border-[#E5E5E5] dark:border-[#303030] transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col shadow-xl lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        {/* Logo Area */}
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-[#F0F0F0] dark:border-[#1F1F1F]`}>
          <div className="flex items-center gap-4 w-full justify-between">
             <div className="cursor-pointer group" onClick={() => onNavigate('dashboard')}>
               {isCollapsed ? <Mark className="text-[#FF0000]" size={32} /> : <Logo mode={theme} />}
             </div>
             <button className="lg:hidden text-[#606060] hover:text-[#0F0F0F] dark:hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
             </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-[#CCCCCC] dark:scrollbar-thumb-[#333]">
          {renderNavigation()}
        </div>

        {/* Footer Settings */}
        <div className={`border-t border-[#E5E5E5] dark:border-[#303030] bg-[#FAFAFA] dark:bg-[#181818] ${isCollapsed ? 'p-2' : 'p-4'}`}>
           <div className={`flex ${isCollapsed ? 'flex-col gap-3 items-center' : 'gap-2 mb-4'}`}>
               {!isCollapsed ? (
                   <>
                        <button 
                            onClick={() => setLanguage(language === 'pt-BR' ? 'en-US' : 'pt-BR')}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-[#272727] border border-[#E5E5E5] dark:border-[#3F3F3F] py-2 rounded-lg text-xs font-bold text-[#606060] dark:text-[#AAAAAA] hover:text-[#0F0F0F] dark:hover:text-white transition-colors"
                        >
                            <Globe size={14} /> {language === 'pt-BR' ? 'PT' : 'EN'}
                        </button>
                        <button 
                            onClick={() => setCurrency(currency === 'BRL' ? 'USD' : 'BRL')}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-[#272727] border border-[#E5E5E5] dark:border-[#3F3F3F] py-2 rounded-lg text-xs font-bold text-[#606060] dark:text-[#AAAAAA] hover:text-[#0F0F0F] dark:hover:text-white transition-colors"
                        >
                            <DollarSign size={14} /> {currency}
                        </button>
                   </>
               ) : null}
               <button 
                  onClick={toggleTheme}
                  className={`flex items-center justify-center gap-1.5 bg-white dark:bg-[#272727] border border-[#E5E5E5] dark:border-[#3F3F3F] rounded-lg text-xs font-bold text-[#606060] dark:text-[#AAAAAA] hover:text-[#FF0000] dark:hover:text-white transition-colors ${isCollapsed ? 'w-10 h-10 p-0' : 'flex-1 py-2'}`}
                  title="Toggle Theme"
               >
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
               </button>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* TOPBAR */}
        <header className="h-16 bg-white/90 dark:bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#303030] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-[#606060] dark:text-[#AAAAAA] hover:text-[#0F0F0F] dark:hover:text-white">
              <Menu size={24} />
            </button>
            <button 
                onClick={toggleSidebar} 
                className="hidden lg:flex p-2 text-[#606060] dark:text-[#AAAAAA] hover:text-[#0F0F0F] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
            >
                {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center w-full max-w-xl mx-auto px-4">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#909090] group-focus-within:text-[#FF0000] transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder={t('common.search')} 
                className="block w-full pl-10 pr-10 py-2 border border-[#CCCCCC] dark:border-[#3F3F3F] rounded-full leading-5 bg-[#F9F9F9] dark:bg-[#121212] text-[#0F0F0F] dark:text-[#F1F1F1] placeholder-[#909090] focus:outline-none focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] sm:text-sm transition-all shadow-inner"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                 <Command size={12} className="text-[#909090]" />
                 <span className="text-[10px] text-[#909090] font-bold">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            {/* Role Switcher */}
            <div className="hidden md:flex items-center bg-[#F2F2F2] dark:bg-[#272727] rounded-lg p-1 border border-[#E5E5E5] dark:border-[#3F3F3F]">
              {(['brand', 'community', 'staff'] as Role[]).map(r => (
                <button
                  key={r}
                  onClick={() => onSwitchRole(r)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${currentRole === r ? 'bg-white dark:bg-[#0F0F0F] text-[#0F0F0F] dark:text-white shadow-sm' : 'text-[#606060] hover:text-[#0F0F0F] dark:text-[#AAAAAA] dark:hover:text-white'}`}
                >
                  {t(`role.${r}` as any) || r}
                </button>
              ))}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
                <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 text-[#606060] hover:text-[#0F0F0F] dark:text-[#AAAAAA] dark:hover:text-white transition-colors"
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#FF0000] rounded-full ring-2 ring-white dark:ring-[#0F0F0F]"></span>
                    )}
                </button>

                {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1F1F1F] border border-[#E5E5E5] dark:border-[#3F3F3F] rounded-xl shadow-2xl z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-3 border-b border-[#E5E5E5] dark:border-[#3F3F3F] flex justify-between items-center bg-[#FAFAFA] dark:bg-[#252525]">
                            <h3 className="font-bold text-[#0F0F0F] dark:text-white text-sm">Notificações</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-[10px] font-bold text-[#FF0000] uppercase tracking-wide hover:underline">
                                    Marcar lidas
                                </button>
                            )}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.map(notif => (
                                <div key={notif.id} className={`p-3 border-b border-[#E5E5E5] dark:border-[#3F3F3F] flex gap-3 hover:bg-[#F9F9F9] dark:hover:bg-[#2A2A2A] transition-colors ${notif.read ? 'opacity-60' : ''}`}>
                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notif.read ? 'bg-[#CCCCCC]' : 'bg-[#FF0000]'}`} />
                                    <div>
                                        <div className="flex justify-between items-start w-full gap-4">
                                            <h4 className="text-sm font-bold text-[#0F0F0F] dark:text-white">{notif.title}</h4>
                                            <span className="text-[10px] text-[#909090] whitespace-nowrap">{notif.time}</span>
                                        </div>
                                        <p className="text-xs text-[#606060] dark:text-[#AAAAAA] mt-0.5">{notif.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Avatar */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-[#F2F2F2] dark:hover:bg-[#272727] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-[#0F0F0F]">
                  {currentRole === 'staff' ? 'AD' : 'C'}
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1F1F1F] border border-[#E5E5E5] dark:border-[#3F3F3F] rounded-xl shadow-xl z-50">
                  <div className="p-4 border-b border-[#E5E5E5] dark:border-[#3F3F3F] bg-[#FAFAFA] dark:bg-[#252525]">
                    <p className="text-sm font-bold text-[#0F0F0F] dark:text-white">{currentRole === 'staff' ? 'System Admin' : 'Creator User'}</p>
                    <p className="text-xs text--[#606060] truncate capitalize">Conta {currentRole}</p>
                  </div>
                  <div className="p-1">
                    <button onClick={() => { navigateTo('/app/settings/profile'); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#606060] dark:text-[#AAAAAA] hover:bg-[#F2F2F2] dark:hover:bg-[#272727] rounded-lg">
                      <User size={16} /> Perfil
                    </button>
                    <button onClick={() => { navigateTo('/app/settings/billing'); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#606060] dark:text-[#AAAAAA] hover:bg-[#F2F2F2] dark:hover:bg-[#272727] rounded-lg">
                      <Wallet size={16} /> Faturamento
                    </button>
                  </div>
                  <div className="p-1 border-t border-[#E5E5E5] dark:border-[#3F3F3F]">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg">
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-transparent p-4 lg:p-8 scroll-smooth pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0F0F0F]/95 backdrop-blur-md border-t border-[#E5E5E5] dark:border-[#303030] z-50 px-6 pb-6 pt-2 flex justify-between items-end shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {/* Simplified Mobile Nav based on Role */}
        {currentRole === 'staff' ? (
           <>
             <button onClick={() => onNavigate('dashboard')} className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'dashboard' ? 'text-[#FF0000]' : 'text-[#909090]'}`}>
                <BarChart3 size={24} /> <span className="text-[10px] font-bold">Cockpit</span>
             </button>
             <button onClick={() => onNavigate('management')} className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'management' ? 'text-[#FF0000]' : 'text-[#909090]'}`}>
                <ShieldAlert size={24} /> <span className="text-[10px] font-bold">Risk</span>
             </button>
           </>
        ) : (
           <>
            <button onClick={() => onNavigate('dashboard')} className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'dashboard' ? 'text-[#FF0000]' : 'text-[#909090]'}`}>
              <LayoutDashboard size={24} /> <span className="text-[10px] font-bold">Home</span>
            </button>
            <div className="relative -top-6 group">
                <button onClick={() => onNavigate('campaigns')} className={`w-14 h-14 relative z-10 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-[#F9F9F9] dark:border-[#0F0F0F] transition-all bg-[#FF0000] active:scale-95`}>
                    <Plus size={24} />
                </button>
            </div>
            <button onClick={() => onNavigate('management')} className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'management' ? 'text-[#FF0000]' : 'text-[#909090]'}`}>
              <Clapperboard size={24} /> <span className="text-[10px] font-bold">Entregas</span>
            </button>
           </>
        )}
      </div>
    </div>
  );
};

export default Layout;
