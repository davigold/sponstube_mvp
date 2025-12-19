
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'BRL' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatCurrency: (value: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('BRL');

  const formatCurrency = (value: number) => {
    // Simple mock conversion for demo: 1 USD = 5 BRL
    const convertedValue = currency === 'USD' ? value / 5 : value;

    return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(convertedValue);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
