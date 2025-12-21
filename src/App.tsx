
import React from 'react';
import FullApp from './pages/FullApp';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <FullApp />
      </DataProvider>
    </ThemeProvider>
  );
}
