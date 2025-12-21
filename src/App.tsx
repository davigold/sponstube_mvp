
import React from 'react';
import SaaSApp from './pages/App';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';

// Re-exporting the main application logic from pages/App
// This ensures index.tsx loads the fully functional SaaS application
export default function App() {
  return (
    <DataProvider>
      <ThemeProvider>
        <SaaSApp />
      </ThemeProvider>
    </DataProvider>
  );
}
