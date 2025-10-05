import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LayoutWrapper from '../components/LayoutWrapper';
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import NotFound404 from '../pages/Shared/404NotFound';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminUsers from '../pages/Admin/Users';
import AdminCompanies from '../pages/Admin/Companies';
import AdminJobs from '../pages/Admin/Jobs';
import AdminApplications from '../pages/Admin/Applications';
import AdminJobCategories from '../pages/Admin/JobCategories';
import AdminLocations from '../pages/Admin/Locations';

// Employer Pages
import EmployerDashboard from '../pages/Employer/EmployerDashboard';

// Candidate Pages
import CandidateDashboard from '../pages/Candidate/CandidateDashboard';

// Shared Pages
import Profile from '../pages/Shared/Profile';

// Role-based route protection
interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' ,
        width: '100vw'
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403-forbidden" replace />;
  }

  return <LayoutWrapper>{children}</LayoutWrapper>;
};

// Dashboard redirect based on role
const DashboardRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw'
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'employer':
      return <Navigate to="/employer/dashboard" replace />;
    case 'candidate':
      return <Navigate to="/candidate/dashboard" replace />;
    default:
      return <Navigate to="/404-not-found" replace />;
  }
};

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw'
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/404-not-found" replace />;
  }

  return <>{children}</>;
};

// Public Route wrapper (redirects to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw'
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect to role-based dashboard
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'employer':
        return <Navigate to="/employer/dashboard" replace />;
      case 'candidate':
        return <Navigate to="/candidate/dashboard" replace />;
      default:
        return <Navigate to="/404-not-found" replace />;
    }
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } 
        />

        {/* Dashboard Redirects */}
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="job-categories" element={<AdminJobCategories />} />
              <Route path="locations" element={<AdminLocations />} />
              <Route path="profile" element={<Profile />} />
              <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="*" element={<NotFound404 />} />
            </Routes>
          </RoleProtectedRoute>
        } />

        {/* Employer Routes */}
        <Route path="/employer/*" element={
          <RoleProtectedRoute allowedRoles={['employer']}>
            <Routes>
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="" element={<Navigate to="/employer/dashboard" replace />} />
              <Route path="*" element={<NotFound404 />} />
            </Routes>
          </RoleProtectedRoute>
        } />

        {/* Candidate Routes */}
        <Route path="/candidate/*" element={
          <RoleProtectedRoute allowedRoles={['candidate']}>
            <Routes>
              <Route path="dashboard" element={<CandidateDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="" element={<Navigate to="/candidate/dashboard" replace />} />
              <Route path="*" element={<NotFound404 />} />
            </Routes>
          </RoleProtectedRoute>
        } />

        {/* Shared Protected Routes (accessible by all authenticated users) */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Profile />
            </LayoutWrapper>
          </ProtectedRoute>
        } />

        <Route path="/404-not-found" element={<NotFound404 />} />
        <Route path="/403-forbidden" element={
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            textAlign: 'center'
          }}>
            <h1>403 - Truy cập bị từ chối</h1>
            <p>Bạn không có quyền truy cập trang này.</p>
            <button onClick={() => window.history.back()}>Quay lại</button>
          </div>
        } />

        {/* Catch all routes */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;