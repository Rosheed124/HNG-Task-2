import React from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { ThemeProvider } from './context/ThemeContext';
import { InvoiceProvider } from './context/InvoiceContext';

function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <Sidebar />
        <MainContent />
      </InvoiceProvider>
    </ThemeProvider>
  );
}

export default App;
