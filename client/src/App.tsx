import React, { Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes/index';

function App() {
  return (
    <ThemeContextProvider>
      <ErrorBoundary>
        <AuthProvider>
          <SidebarProvider>
            <Suspense fallback={<LoadingFallback />}>
              <div className="App">
                <AppRoutes />
              </div>
            </Suspense>
          </SidebarProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeContextProvider>
  );
}

export default App;
