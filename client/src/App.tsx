import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import AppRoutes from './routes/index';

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <SidebarProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </SidebarProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
