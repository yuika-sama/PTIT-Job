import React, { FC } from 'react';
import {
  Container,
  Box,
  Paper,
  Link,
  Breadcrumbs,
  Typography,
  Stack,
} from '@mui/material';

// Import các component con
import JobHeader from '../../components/candidate/JobHeader';
import JobDescription from '../../components/candidate/JobDescription';
import CompanySidebar from '../../components/candidate/CompanySidebar';
import JobInfoSidebar from '../../components/candidate/JobInfoSidebar';
import RelatedJobs from '../../components/candidate/RelatedJobs';

// Local type definitions for this page
interface CompanyInfo {
  id: number;
  logo: string;
  name: string;
  size: string;
  industry: string;
  address: string;
}

interface CompanyBasic {
  id: number;
  name: string;
  logo: string;
  industry: string;
}

interface GeneralInfo {
  level: string;
  education: string;
  quantity: string;
  format: string;
}

interface LocalJob {
  title: string;
  company: CompanyBasic;
  salary: string;
  location: string;
  experience: string;
  deadline: string;
  category: string;
  description: string[];
  requirements: string[];
  benefits: string[];
  workLocation: string;
  companyInfo: CompanyInfo;
  generalInfo: GeneralInfo;
}

interface RelatedJob {
  title: string;
  company: string;
  salary: string;
  location: string;
}

// --- Dữ liệu mẫu (Được gán kiểu dữ liệu) ---
const jobData: LocalJob = {
  title: 'Live Streaming Host',
  company: { 
    id: 1,
    name: 'CÔNG TY TNHH AGARI',
    logo: 'https://i.imgur.com/your-logo.png',
    industry: 'Sản xuất'
  },
  salary: 'Thỏa thuận',
  location: 'Hồ Chí Minh',
  experience: '1 năm',
  deadline: '29/10/2025',
  category: 'Host Livestream/Streamer',
  description: [ 'Bán hàng qua phát trực tiếp...', 'Làm việc 6 ngày/tuần...'],
  requirements: [ 'Có khả năng nói chuyện...', 'Biết sử dụng phần mềm OBS...'],
  benefits: [ 'Lương: Thỏa Thuận + Lương T13.', 'Môi trường làm việc năng động...'],
  workLocation: '61 Hoàng Trọng Mậu kdc himlam, Tân Hưng, Quận 7',
  companyInfo: {
    id: 1,
    logo: 'https://i.imgur.com/your-logo.png',
    name: 'CÔNG TY TNHH AGARI',
    size: '25-99 nhân viên',
    industry: 'Sản xuất',
    address: '30A Trần Cao Vân, Phường Đô Vinh, TP. Phan Rang-Tháp...',
  },
  generalInfo: {
    level: 'Nhân viên',
    education: 'Trung cấp trở lên',
    quantity: '1 người',
    format: 'Toàn thời gian',
  },
};

const relatedJobsData: RelatedJob[] = [
    { title: 'TikTok Livestream Game Streamer/Idol', company: 'KUA SHIDAI NETWORK TECHNOLOGY', salary: '15 - 30 triệu', location: 'Hồ Chí Minh' },
    { title: 'Nhân Viên Livestream Ngành Du Lịch (Biết Tiếng Trung)', company: 'YING YING', salary: '35 - 45 triệu', location: 'Hồ Chí Minh' },
    { title: 'Host Livestream (MC Bán Hàng Online)', company: 'CAO SỸ OAI', salary: '20 - 50 triệu', location: 'Hồ Chí Minh' },
];

const JobDetailPage: FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* ...Phần Breadcrumbs giữ nguyên... */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">Trang chủ</Link>
        <Link underline="hover" color="inherit" href="/jobs">Việc làm tại Hồ Chí Minh, Quận 7 - TP HCM</Link>
        <Typography color="text.primary">Tuyển Live Streaming Host</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3
        }}
      >
        <Box>
          <Stack spacing={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <JobHeader job={jobData} />
            </Paper>

            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <JobDescription job={jobData} />
            </Paper>
          </Stack>
        </Box>
        
        <Box>
            <Stack spacing={3}>
              <CompanySidebar companyInfo={jobData.companyInfo} />
              <JobInfoSidebar generalInfo={jobData.generalInfo} />
            </Stack>
        </Box>
      </Box>
      
      <RelatedJobs jobs={relatedJobsData} />
    </Container>
  );
}

export default JobDetailPage;