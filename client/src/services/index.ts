// Export all services
export { userService } from './userService';
export { companyService } from './companyService';
export { jobService } from './jobService';
export { jobApplicationService } from './jobApplicationService';
export { resumeService } from './resumeService';
export { jobCategoryService, locationService } from './categoryLocationService';

// Export base service and types
export { BaseApiService } from './baseApi';
export type { ApiResponse } from './baseApi';

// Export all types
export * from './types';

// Export default api client
export { BaseApiService as apiClient } from './baseApi';