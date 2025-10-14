import { SvgIconComponent } from '@mui/icons-material';
export interface Company {
  id: number;
  name: string;
  logo: string;
  industry: string;
  size?: string;
  address?: string;
  jobCount?: number;
}

export interface Job {
  id: number;
  title: string;
  company: Company;
  salary: string;
  location: string;
  experience: string;
  deadline: string;
  tags?: ('TIN MỚI' | 'NỔI BẬT')[];
  category: string;
  description: string[];
  requirements: string[];
  benefits: string[];
  workLocation: string;
  level: string;
  education: string;
  quantity: string;
  format: string;
}

export type JobSummary = Pick<Job, 'id' | 'title' | 'company' | 'salary' | 'location' | 'tags'>;


export interface Category {
  name: string;
  jobCount: number;
  icon: string | SvgIconComponent | null;
}

export interface GeneralInfo {
  level: string;
  education: string;
  quantity: string;
  format: string;
}

export interface RelatedJob {
  title: string;
  company: string;
  salary: string;
  location: string;
}