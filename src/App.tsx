
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import FullApp from './pages/FullApp';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { I18nProvider } from './contexts/I18nContext';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <I18nProvider>
          <ThemeProvider>
            <DataProvider>
              <FullApp />
            </DataProvider>
          </ThemeProvider>
        </I18nProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
