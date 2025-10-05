import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../services/types';
import { authService } from '../services/authService';

// Types
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    email: string;
    password: string;
    full_name: string;
    phone_number?: string;
    role?: 'candidate' | 'employer' | 'admin';
    company_id?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshAuthToken: () => Promise<boolean>;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

// Local Storage Keys
const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'ptitjob_access_token',
  REFRESH_TOKEN: 'ptitjob_refresh_token',
  USER: 'ptitjob_user',
  REMEMBER_ME: 'ptitjob_remember_me'
} as const;

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
        
        if (accessToken && refreshToken && userStr) {
          const user = JSON.parse(userStr);
          
          // Validate token expiry (basic check)
          const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
          const isTokenExpired = tokenPayload.exp * 1000 < Date.now();
          
          if (isTokenExpired) {
            console.log('🔄 Access token expired, will attempt refresh on first API call');
          }
          
          setAuthState({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
          
          console.log('✅ Auth state restored from localStorage');
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('❌ Failed to restore auth state:', error);
        clearAuthStorage();
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Helper: Save auth data to localStorage
  const saveAuthData = (data: { user: User; accessToken: string; refreshToken: string }, rememberMe = true) => {
    try {
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(data.user));
        localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER_ME, 'true');
      } else {
        // Session storage for temporary login
        sessionStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        sessionStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        sessionStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(data.user));
      }
      
      console.log('💾 Auth data saved to storage');
    } catch (error) {
      console.error('❌ Failed to save auth data:', error);
    }
  };

  // Helper: Clear auth data from storage
  const clearAuthStorage = () => {
    try {
      // Clear localStorage
      Object.values(AUTH_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      console.log('🗑️ Auth storage cleared');
    } catch (error) {
      console.error('❌ Failed to clear auth storage:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string, rememberMe = true): Promise<{ success: boolean; message?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Save to storage
        saveAuthData({ user, accessToken, refreshToken }, rememberMe);
        
        // Update state
        setAuthState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false
        });
        
        console.log('✅ Login successful:', user.email);
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.error('❌ Login error:', error);
      return { success: false, message: error.message || 'Đăng nhập thất bại' };
    }
  };

  // Register function
  const register = async (userData: {
    email: string;
    password: string;
    full_name: string;
    phone_number?: string;
    role?: 'candidate' | 'employer' | 'admin';
    company_id?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.register({
        ...userData,
        role: userData.role || 'candidate'
      });
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Save to storage
        saveAuthData({ user, accessToken, refreshToken }, true);
        
        // Update state
        setAuthState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false
        });
        
        console.log('✅ Registration successful:', user.email);
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.error('❌ Registration error:', error);
      return { success: false, message: error.message || 'Đăng ký thất bại' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if refresh token exists
      if (authState.refreshToken) {
        await authService.logout(authState.refreshToken).catch(error => {
          console.warn('⚠️ Logout API call failed:', error);
        });
      }
    } catch (error) {
      console.warn('⚠️ Logout API error:', error);
    } finally {
      // Always clear local state and storage
      clearAuthStorage();
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false
      });
      console.log('✅ Logout completed');
    }
  };

  // Refresh token function
  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      if (!authState.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(authState.refreshToken);
      
      if (response.success && response.data) {
        const { accessToken, refreshToken } = response.data;
        const rememberMe = localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME) === 'true';
        
        // Update storage
        if (rememberMe) {
          localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          sessionStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }
        
        // Update state
        setAuthState(prev => ({
          ...prev,
          accessToken,
          refreshToken
        }));
        
        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        throw new Error(response.message || 'Token refresh failed');
      }
    } catch (error: any) {
      console.error('❌ Token refresh failed:', error);
      // Force logout on refresh failure
      logout();
      return false;
    }
  };

  // Clear auth function (for manual clearing)
  const clearAuth = () => {
    clearAuthStorage();
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  // Update user function (for profile updates)
  const updateUser = (user: User) => {
    try {
      const rememberMe = localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME) === 'true';
      
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
      }
      
      setAuthState(prev => ({ ...prev, user }));
      console.log('✅ User data updated');
    } catch (error) {
      console.error('❌ Failed to update user:', error);
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshAuthToken,
    clearAuth,
    updateUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export storage keys for use in other components
export { AUTH_STORAGE_KEYS };