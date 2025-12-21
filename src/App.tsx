
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import FullApp from './pages/FullApp';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <DataProvider>
            <FullApp />
          </DataProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
