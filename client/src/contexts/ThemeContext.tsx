import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

// PTIT Job Branding Palette
const PTIT_COLORS = {
  primary: '#DE221A',          // PTIT Red
  primaryDark: '#B01B14',      // Darker PTIT Red
  accentBlue: '#0A4D8C',       // Navy Blue accent
  neutralGray: '#F5F5F5',      // Light gray background
  textDark: '#333333',         // Dark text
  textLight: '#FFFFFF',        // Light text
};

// Create theme based on mode
const createAppTheme = (mode: PaletteMode): Theme => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: PTIT_COLORS.primary,
        light: mode === 'light' ? '#FF4444' : '#FF5555',
        dark: PTIT_COLORS.primaryDark,
        contrastText: PTIT_COLORS.textLight,
      },
      secondary: {
        main: PTIT_COLORS.accentBlue,
        light: '#4B7BC8',
        dark: '#083A6B',
        contrastText: PTIT_COLORS.textLight,
      },
      background: {
        default: mode === 'light' ? PTIT_COLORS.neutralGray : '#121212',
        paper: mode === 'light' ? PTIT_COLORS.textLight : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? PTIT_COLORS.textDark : PTIT_COLORS.textLight,
        secondary: mode === 'light' ? '#666666' : '#b3b3b3',
      },
      // Custom colors for PTIT theme
      error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
      },
      info: {
        main: PTIT_COLORS.accentBlue,
        light: '#64b5f6',
        dark: '#1976d2',
      },
      success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? PTIT_COLORS.primary : '#1e1e1e',
            boxShadow: mode === 'light' 
              ? '0 2px 8px rgba(222, 34, 26, 0.2)' 
              : '0 2px 4px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 500,
          },
          contained: {
            boxShadow: mode === 'light'
              ? '0 2px 8px rgba(222, 34, 26, 0.3)'
              : '0 2px 8px rgba(0,0,0,0.3)',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 4px 12px rgba(222, 34, 26, 0.4)'
                : '0 4px 12px rgba(0,0,0,0.4)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? PTIT_COLORS.textLight : '#2d2d2d',
            boxShadow: mode === 'light'
              ? '0 2px 12px rgba(0,0,0,0.08)'
              : '0 2px 8px rgba(0,0,0,0.3)',
            borderRadius: 12,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 4px 20px rgba(0,0,0,0.12)'
                : '0 4px 16px rgba(0,0,0,0.4)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? PTIT_COLORS.textLight : '#2d2d2d',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? PTIT_COLORS.neutralGray : '#333333',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'light' ? '#f0f0f0' : '#404040',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            '&.MuiChip-colorDefault': {
              backgroundColor: mode === 'light' ? '#e0e0e0' : '#404040',
              color: mode === 'light' ? PTIT_COLORS.textDark : PTIT_COLORS.textLight,
            },
          },
        },
      },
    },
  });
};

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  // Get initial mode from localStorage or default to light
  const getInitialMode = (): PaletteMode => {
    const savedMode = localStorage.getItem('ptit-job-theme-mode');
    if (savedMode === 'dark' || savedMode === 'light') {
      return savedMode;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('ptit-job-theme-mode', mode);
  }, [mode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedMode = localStorage.getItem('ptit-job-theme-mode');
      // Only update if user hasn't manually set a preference
      if (!savedMode) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createAppTheme(mode);

  const contextValue: ThemeContextType = {
    mode,
    toggleColorMode,
    isDarkMode: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;