
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import FullApp from './pages/FullApp';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <FullApp />
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
