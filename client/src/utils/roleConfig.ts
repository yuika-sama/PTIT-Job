// Role-based routing and permissions configuration

export type UserRole = 'candidate' | 'employer' | 'admin';

// Define permissions for each role
export interface RolePermissions {
  canViewJobs: boolean;
  canCreateJobs: boolean;
  canEditJobs: boolean;
  canDeleteJobs: boolean;
  canViewApplications: boolean;
  canCreateApplications: boolean;
  canViewUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewCompanies: boolean;
  canCreateCompanies: boolean;
  canEditCompanies: boolean;
  canDeleteCompanies: boolean;
  canViewReports: boolean;
  canManageSystem: boolean;
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  candidate: {
    canViewJobs: true,
    canCreateJobs: false,
    canEditJobs: false,
    canDeleteJobs: false,
    canViewApplications: true, // Their own applications
    canCreateApplications: true,
    canViewUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewCompanies: true, // Read-only company info
    canCreateCompanies: false,
    canEditCompanies: false,
    canDeleteCompanies: false,
    canViewReports: false,
    canManageSystem: false,
  },
  employer: {
    canViewJobs: true,
    canCreateJobs: true,
    canEditJobs: true, // Their own company's jobs
    canDeleteJobs: true, // Their own company's jobs
    canViewApplications: true, // Applications to their jobs
    canCreateApplications: false,
    canViewUsers: true, // Candidate profiles
    canEditUsers: false,
    canDeleteUsers: false,
    canViewCompanies: true, // Their own company
    canCreateCompanies: true, // Register their company
    canEditCompanies: true, // Their own company
    canDeleteCompanies: false,
    canViewReports: true, // Job performance reports
    canManageSystem: false,
  },
  admin: {
    canViewJobs: true,
    canCreateJobs: true,
    canEditJobs: true,
    canDeleteJobs: true,
    canViewApplications: true,
    canCreateApplications: false,
    canViewUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canViewCompanies: true,
    canCreateCompanies: true,
    canEditCompanies: true,
    canDeleteCompanies: true,
    canViewReports: true,
    canManageSystem: true,
  },
};

// Route definitions for each role
export interface RouteConfig {
  path: string;
  name: string;
  component: string;
  icon?: string;
  isDefault?: boolean; // Default route after login
}

export const ROLE_ROUTES: Record<UserRole, RouteConfig[]> = {
  candidate: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: 'CandidateDashboard',
      icon: 'Dashboard',
      isDefault: true,
    },
    {
      path: '/jobs',
      name: 'Tìm việc làm',
      component: 'Jobs',
      icon: 'Work',
    },
    {
      path: '/applications',
      name: 'Đơn ứng tuyển',
      component: 'Applications',
      icon: 'Assignment',
    },
    {
      path: '/resumes',
      name: 'Hồ sơ CV',
      component: 'Resumes',
      icon: 'Description',
    },
    {
      path: '/companies',
      name: 'Công ty',
      component: 'Companies',
      icon: 'Business',
    },
    {
      path: '/profile',
      name: 'Thông tin cá nhân',
      component: 'Profile',
      icon: 'Person',
    },
    {
      path: '/settings',
      name: 'Cài đặt',
      component: 'Settings',
      icon: 'Settings',
    },
  ],
  employer: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: 'EmployerDashboard',
      icon: 'Dashboard',
      isDefault: true,
    },
    {
      path: '/jobs',
      name: 'Quản lý việc làm',
      component: 'Jobs',
      icon: 'Work',
    },
    {
      path: '/applications',
      name: 'Đơn ứng tuyển',
      component: 'Applications',
      icon: 'Assignment',
    },
    {
      path: '/candidates',
      name: 'Ứng viên',
      component: 'Users',
      icon: 'People',
    },
    {
      path: '/company',
      name: 'Thông tin công ty',
      component: 'Company',
      icon: 'Business',
    },
    {
      path: '/reports',
      name: 'Báo cáo',
      component: 'Reports',
      icon: 'Assessment',
    },
    {
      path: '/profile',
      name: 'Thông tin cá nhân',
      component: 'Profile',
      icon: 'Person',
    },
    {
      path: '/settings',
      name: 'Cài đặt',
      component: 'Settings',
      icon: 'Settings',
    },
  ],
  admin: [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      component: 'AdminDashboard',
      icon: 'Dashboard',
      isDefault: true,
    },
    {
      path: '/admin/users',
      name: 'Quản lý người dùng',
      component: 'Users',
      icon: 'People',
    },
    {
      path: '/admin/companies',
      name: 'Quản lý công ty',
      component: 'Companies',
      icon: 'Business',
    },
    {
      path: '/admin/jobs',
      name: 'Quản lý việc làm',
      component: 'Jobs',
      icon: 'Work',
    },
    {
      path: '/admin/applications',
      name: 'Quản lý ứng tuyển',
      component: 'Applications',
      icon: 'Assignment',
    },
    {
      path: '/admin/job-categories',
      name: 'Danh mục công việc',
      component: 'JobCategories',
      icon: 'Category',
    },
    {
      path: '/admin/locations',
      name: 'Vị trí địa lý',
      component: 'Locations',
      icon: 'LocationOn',
    }
  ],
};

// Helper functions
export const getRolePermissions = (role: UserRole): RolePermissions => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.candidate;
};

export const getRoleRoutes = (role: UserRole): RouteConfig[] => {
  return ROLE_ROUTES[role] || ROLE_ROUTES.candidate;
};

export const getDefaultRoute = (role: UserRole): string => {
  const routes = getRoleRoutes(role);
  const defaultRoute = routes.find(route => route.isDefault);
  return defaultRoute?.path || '/dashboard';
};

export const hasPermission = (role: UserRole, permission: keyof RolePermissions): boolean => {
  const permissions = getRolePermissions(role);
  return permissions[permission] || false;
};

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  candidate: 'Ứng viên',
  employer: 'Nhà tuyển dụng',
  admin: 'Quản trị viên',
};

export const getRoleDisplayName = (role: UserRole): string => {
  return ROLE_DISPLAY_NAMES[role] || role;
};