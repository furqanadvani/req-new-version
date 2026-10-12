import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routing';
import { ThemeProvider } from './utils/theme';
import { CurrencyProvider } from './utils/currency';
import { CompareProvider } from './components/packages/Compare';
import '@fontsource/marcellus/400.css';
import '@fontsource-variable/figtree';
import '@fontsource/amiri/arabic-400.css';
import '@fontsource/noto-nastaliq-urdu/arabic-400.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <CurrencyProvider>
            <CompareProvider>
              <AppRoutes />
            </CompareProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
