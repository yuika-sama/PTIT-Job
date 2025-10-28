import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingFallback from '../components/LoadingFallback';

// Layouts - Eager load (needed frequently)
import LayoutWrapper from '../components/LayoutWrapper';
import EmployerLayout from '../components/EmployerLayout';
import CandidateLayout from '../components/CandidateLayout';

// Lazy load pages
// Auth Pages
const Login = lazy(() => import('../pages/Auth/Login'));
const SignUp = lazy(() => import('../pages/Auth/SignUp'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const NotFound404 = lazy(() => import('../pages/Shared/404NotFound'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/Admin/Users'));
const AdminCompanies = lazy(() => import('../pages/Admin/Companies'));
const AdminJobs = lazy(() => import('../pages/Admin/Jobs'));
const AdminApplications = lazy(() => import('../pages/Admin/Applications'));
const AdminJobCategories = lazy(() => import('../pages/Admin/JobCategories'));
const AdminLocations = lazy(() => import('../pages/Admin/Locations'));

// Employer Pages
const EmployerDashboard = lazy(() => import('../pages/Employer/EmployerDashboard'));

// Candidate Pages
const CandidateDashboard = lazy(() => import('../pages/Candidate/CandidateDashboard'));
const CandidateJobList = lazy(() => import('../pages/Candidate/CandidateJobList'));
const BestJobsPage = lazy(() => import('../pages/Candidate/BestJobsPage'));
const AttractiveJobsPage = lazy(() => import('../pages/Candidate/AttractiveJobsPage'));
const CompaniesPage = lazy(() => import('../pages/Candidate/CompaniesPage'));
const TopCompaniesPage = lazy(() => import('../pages/Candidate/TopCompaniesPage'));
const CompanyDetailPage = lazy(() => import('../pages/Candidate/CompanyDetailPage'));
const BHXHCalculatorPage = lazy(() => import('../pages/Candidate/BHXHCalculatorPage'));
const SalaryCalculatorPage = lazy(() => import('../pages/Candidate/SalaryCalculatorPage'));
const UnemploymentInsurancePage = lazy(() => import('../pages/Candidate/UnemploymentInsurancePage'));
const JobSearchPage = lazy(() => import('../pages/Candidate/JobSearchPage'));
const CVEvaluationPage = lazy(() => import('../pages/Candidate/CVEvaluationPage'));
const InterviewEmulate = lazy(() => import('../pages/Candidate/InterviewEmulate'));
const CompoundInterestPage = lazy(() => import('../pages/Candidate/CompoundInterestPage'));
const JobDetailsPage = lazy(() => import('../pages/Candidate/JobDetailsPage'));
const PersonalIncomeTaxPage = lazy(() => import('../pages/Candidate/PersonalIncomeTaxPage'));

// Shared Pages
const Profile = lazy(() => import('../pages/Shared/Profile'));

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

  if (allowedRoles.includes('admin')) {
    return <LayoutWrapper>{children}</LayoutWrapper>;
  }
  if (allowedRoles.includes('employer')) {
    return <EmployerLayout>{children}</EmployerLayout>;
  }
  if (allowedRoles.includes('candidate')) {
    return <CandidateLayout>{children}</CandidateLayout>;
  }
  return <>{children}</>;
}

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
      <Suspense fallback={<LoadingFallback />}>
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
              <Route path="jobs" element={<CandidateJobList />} />
              <Route path="job-search" element={<JobSearchPage />} />
              <Route path="cv-evaluation" element={<CVEvaluationPage />} />
              <Route path="interview-emulate" element={<InterviewEmulate />} />
              <Route path="best-jobs" element={<BestJobsPage />} />
              <Route path="attractive-jobs" element={<AttractiveJobsPage />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="companies/:companyId" element={<CompaniesPage />} />
              <Route path="top-companies" element={<TopCompaniesPage />} />
              <Route path="company/:id" element={<CompanyDetailPage />} />
              <Route path="bhxh-calculator" element={<BHXHCalculatorPage />} />
              <Route path="personal-income-tax" element={<PersonalIncomeTaxPage />} />
              <Route path="salary-calculator" element={<SalaryCalculatorPage />} />
              <Route path="unemployment-insurance" element={<UnemploymentInsurancePage />} />
              <Route path="compound-interest" element={<CompoundInterestPage />} />
              <Route path="/job/:jobId" element={<JobDetailsPage />} />
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
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;