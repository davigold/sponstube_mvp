
import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { ptBR } from '../locales/pt-BR'; REMOVED
// import { enUS } from '../locales/en-US'; REMOVED

// --- INLINED LOCALES ---
const ptBR = {
  nav: { dashboard: "Dashboard", marketplace: "Marketplace", campaigns: "Minhas Campanhas", executions: "Execuções", reports: "Relatórios", payments: "Financeiro", storefront: "Minha Vitrine", settings: "Configurações" },
  common: { search: "Buscar..." },
  role: { brand: "Marca", community: "Creator", staff: "Admin" },
  tooltips: { escrow: "Seu dinheiro fica protegido até o trabalho ser entregue." }
};
const enUS = {
  nav: { dashboard: "Dashboard", marketplace: "Marketplace", campaigns: "My Campaigns", executions: "Executions", reports: "Reports", payments: "Payments", storefront: "Storefront", settings: "Settings" },
  common: { search: "Search..." },
  role: { brand: "Brand", community: "Creator", staff: "Admin" },
  tooltips: { escrow: "Your funds are held safely until work is delivered." }
};
// -----------------------

type Language = 'pt-BR' | 'en-US';
type Translations = typeof ptBR;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-BR');

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = language === 'pt-BR' ? ptBR : enUS;

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback to key if translation missing
        return key;
      }
    }

    if (typeof value !== 'string') return key;

    // Replace params like {name}
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, v);
      });
    }

    return value;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
