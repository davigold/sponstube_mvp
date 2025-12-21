
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Auth from './Auth';
import Onboarding from './Onboarding';
import WowMoment from './WowMoment';
import Dashboard from './Dashboard';
import Storefronts from './Storefronts';
import Marketplace from './Marketplace';
import Campaigns from './Campaigns';
import Management from './Management';
import Payments from './Payments';
import Settings from './Settings';
import MGM from './MGM'; 
import Templates from './Templates';
import Reports from './Reports';
import StaffDashboard from './StaffDashboard';
import NotFound from './NotFound';
import AccessDenied from './AccessDenied';
import GeneralLanding from './landing/GeneralLanding';
import BrandLanding from './landing/BrandLanding';
import CommunityLanding from './landing/CommunityLanding';
import PublicStorefrontPage from './PublicStorefrontPage';
import { I18nProvider } from '../contexts/I18nContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Role, User, BrandProfile, Community } from '../types';
import { MOCK_COMMUNITIES } from '../mockData';
import { navigateTo } from '../utils/navigation';

type AppFlowState = 'AUTH' | 'ONBOARDING' | 'WOW' | 'APP';
type PageRoute = 'dashboard' | 'marketplace' | 'campaigns' | 'management' | 'payments' | 'settings' | 'mgm' | 'storefront' | 'templates' | 'reports';

const getPageFromPath = (path: string): PageRoute | null => {
  // Extract the segment after /app/
  const match = path.match(/\/app\/([^/?#]+)/);
  if (!match) {
    // If it's exactly /app or /app/, default to dashboard
    if (path === '/app' || path === '/app/') return 'dashboard';
    return null;
  }
  
  const segment = match[1];
  const validRoutes: PageRoute[] = ['dashboard', 'marketplace', 'campaigns', 'management', 'payments', 'settings', 'mgm', 'storefront', 'templates', 'reports'];
  
  if (validRoutes.includes(segment as PageRoute)) {
    return segment as PageRoute;
  }
  
  return null;
};

interface SaaSAppProps {
  initialRoleParam?: Role;
  initialAuthMode?: 'login' | 'signup';
  currentPath: string;
}

const SaaSApp = ({ initialRoleParam, initialAuthMode, currentPath }: SaaSAppProps) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('cm_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to load user from storage", e);
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    if (initialRoleParam) return initialRoleParam;
    try {
      const savedRole = localStorage.getItem('cm_role');
      return (savedRole as Role) || 'brand';
    } catch (e) {
      return 'brand';
    }
  });

  const [flowState, setFlowState] = useState<AppFlowState>(() => {
    const savedUser = localStorage.getItem('cm_user');
    if (!savedUser) return 'AUTH';
    
    try {
      const u = JSON.parse(savedUser);
      const onboarded = localStorage.getItem(`cm_onboarding_${u.id}`);
      return onboarded === 'true' ? 'APP' : 'ONBOARDING';
    } catch (e) {
      return 'AUTH';
    }
  });

  const currentPage = getPageFromPath(currentPath);

  // --- AUTH GUARD ---
  useEffect(() => {
    // If trying to access app routes without user, redirect to Auth
    if (!user && currentPath.startsWith('/app')) {
      const returnTo = encodeURIComponent(currentPath);
      navigateTo(`/auth?mode=login&returnTo=${returnTo}`);
      setFlowState('AUTH');
    }
  }, [user, currentPath]);

  useEffect(() => {
    if (initialRoleParam) {
      setCurrentRole(initialRoleParam);
    }
  }, [initialRoleParam]);

  const handleLogin = (userData: User, isNewUser: boolean) => {
    if (initialRoleParam && isNewUser) {
        userData.role = initialRoleParam;
    }
    
    setUser(userData);
    setCurrentRole(userData.role);

    localStorage.setItem('cm_user', JSON.stringify(userData));
    localStorage.setItem('cm_role', userData.role);

    // PR-2: Existing users skip onboarding
    // If not a new user, we treat them as onboarded (and save state for reload)
    if (!isNewUser) {
        localStorage.setItem(`cm_onboarding_${userData.id}`, 'true');
    }

    // Check persistence to decide flow
    const hasOnboarded = localStorage.getItem(`cm_onboarding_${userData.id}`) === 'true';

    if (!hasOnboarded) {
      setFlowState('ONBOARDING');
    } else {
      setFlowState('APP');
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get('returnTo');
      if (returnTo && returnTo.startsWith('/app')) {
        navigateTo(decodeURIComponent(returnTo));
      } else {
        navigateTo('/app/dashboard');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setFlowState('AUTH');
    localStorage.removeItem('cm_user');
    localStorage.removeItem('cm_role');
    navigateTo('/');
  };

  const handleOnboardingComplete = (data: Partial<BrandProfile> | Partial<Community>, draft?: any) => {
    if (user) {
        localStorage.setItem(`cm_onboarding_${user.id}`, 'true');
        // In a real app, we would save 'data' and 'draft' to backend here.
        console.log("Onboarding Saved:", data, draft);
    }
    setFlowState('APP');
    navigateTo('/app/dashboard');
  };

  const handleRoleSwitch = (newRole: Role) => {
    if (user) {
      setCurrentRole(newRole);
      localStorage.setItem('cm_role', newRole);
      navigateTo('/app/dashboard');
    }
  };

  const handleMenuNavigation = (page: string) => {
    navigateTo(`/app/${page}`);
  };

  if (flowState === 'AUTH') {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get('returnTo') || undefined;

    return (
      <Auth 
        onLogin={handleLogin} 
        initialMode={initialAuthMode || 'signup'} 
        initialRole={initialRoleParam}
        returnTo={returnTo}
      />
    );
  }

  if (flowState === 'ONBOARDING' && user) {
    return (
      <Onboarding 
        userRole={currentRole} 
        onComplete={handleOnboardingComplete} 
      />
    );
  }

  if (flowState === 'WOW' && user) {
    // Deprecated step kept for compatibility if needed, though now Onboarding handles First Win.
    // Mapping Onboarding Finish directly to APP in new logic.
    return (
      <WowMoment 
        userRole={currentRole} 
        onFinish={() => { setFlowState('APP'); navigateTo('/app/dashboard'); }} 
      />
    );
  }

  // --- ROUTE GUARD: NOT FOUND ---
  if (!currentPage) {
    return (
      <Layout 
        currentPage="404" 
        onNavigate={handleMenuNavigation} 
        currentRole={currentRole} 
        onSwitchRole={handleRoleSwitch}
        onLogout={handleLogout}
      >
        <NotFound />
      </Layout>
    );
  }

  const renderPage = () => {
    if (currentRole === 'staff') {
        switch (currentPage) {
            case 'dashboard': return <StaffDashboard initialTab="overview" />;
            case 'marketplace': return <StaffDashboard initialTab="users" />; 
            case 'management': return <StaffDashboard initialTab="disputes" />; 
            case 'mgm': return <StaffDashboard initialTab="mgm" />; 
            case 'storefront': return <StaffDashboard initialTab="templates" />; 
            case 'settings': return <StaffDashboard initialTab="config" />; 
            case 'payments': return <Payments userRole={currentRole} />; 
            case 'templates': return <Templates userRole={currentRole} />;
            case 'reports': return <Reports userRole={currentRole} />;
            default: return <AccessDenied />;
        }
    }

    switch (currentPage) {
      case 'dashboard': return <Dashboard userRole={currentRole} />;
      case 'marketplace': return <Marketplace userRole={currentRole} />;
      case 'campaigns': return <Campaigns userRole={currentRole} />;
      case 'management': return <Management userRole={currentRole} />;
      case 'payments': return <Payments userRole={currentRole} />;
      case 'storefront': return <Storefronts userRole={currentRole} />;
      case 'mgm': return <MGM />; 
      case 'settings': return <Settings userRole={currentRole} />;
      case 'templates': return <Templates userRole={currentRole} />;
      case 'reports': return <Reports userRole={currentRole} />;
      default: return <NotFound />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onNavigate={handleMenuNavigation} 
      currentRole={currentRole} 
      onSwitchRole={handleRoleSwitch}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname + window.location.search);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    };

    const handleAppNavigate = (e: Event) => {
        const customEvent = e as CustomEvent<{ path: string }>;
        if (customEvent.detail?.path) {
            setCurrentPath(customEvent.detail.path);
            window.scrollTo(0, 0);
        } else {
            handleLocationChange();
        }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('app-navigate', handleAppNavigate as EventListener);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('app-navigate', handleAppNavigate as EventListener);
    };
  }, []);

  const renderRoute = () => {
    const [pathname, search] = currentPath.split('?');
    const path = pathname || '/';
    const params = new URLSearchParams(search || window.location.search);

    // Auth Routes
    if (path.startsWith('/auth') || path.startsWith('/app')) {
      let roleParam: Role | undefined;
      const r = params.get('role');
      if (r === 'brand' || r === 'community' || r === 'staff') {
        roleParam = r as Role;
      }

      let authMode: 'login' | 'signup' | undefined;
      const m = params.get('mode');
      if (m === 'login' || m === 'signup') {
        authMode = m as 'login' | 'signup';
      }

      return <SaaSApp initialRoleParam={roleParam} initialAuthMode={authMode} currentPath={currentPath} />;
    }

    // Public Storefront Routes
    if (path.startsWith('/s/')) {
      const slug = path.split('/s/')[1];
      if (!slug) return <GeneralLanding />; 
      
      const isCommunity = MOCK_COMMUNITIES.some(c => c.slug === slug || c.id === slug);
      const mode = isCommunity ? 'community' : 'brand';
      return <PublicStorefrontPage mode={mode} slug={slug} />;
    }

    // Landing Pages
    if (path === '/brands') return <BrandLanding />;
    if (path === '/communities') return <CommunityLanding />;
    if (path === '/') return <GeneralLanding />;
    
    // Global 404
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
         <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="mb-8 text-slate-400">Page not found.</p>
            <button onClick={() => navigateTo('/')} className="bg-indigo-600 px-6 py-2 rounded-full font-bold">Go Home</button>
         </div>
      </div>
    );
  };

  return (
    <ThemeProvider>
      <I18nProvider>
        <CurrencyProvider>
          <div className="antialiased text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            {renderRoute()}
          </div>
        </CurrencyProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
