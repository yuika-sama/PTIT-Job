import React, { useState } from 'react';
import { 
  Container, 
  Box
} from '@mui/material';
import { JobListCardData } from '../../components/candidate/JobListCard';
import CompanyHeader, { CompanyData } from '../../components/candidate/CompanyHeader';
import CompanyIntroduction from '../../components/candidate/CompanyIntroduction';
import CompanyJobSearch from '../../components/candidate/CompanyJobSearch';
import CompanyContactInfo from '../../components/candidate/CompanyContactInfo';
import ProCompanySection, { ProCompany } from '../../components/candidate/ProCompanySection';

// Mock company data
const companyData: CompanyData = {
  id: 1,
  name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TRUYỀN THÔNG AWING VIỆT NAM',
  logo: 'https://via.placeholder.com/120',
  website: 'http://awing.vn/',
  employeeCount: '25-99 nhân viên',
  followers: 36
};

const companyDetails = {
  address: 'HN: Tầng 11 tòa nhà King Building, số 7 Chùa Bộc, quận Đống Đa, Hà Nội',
  description: `Sự Xuất Sắc Đổi Mới trong Công Nghệ Quảng Cáo: AWING dẫn đầu trong lĩnh vực marketing dựa trên vị trí di động (mobile location-based marketing), biến Wi-Fi miễn phí thành một kênh quảng cáo mạnh mẽ. Nền tảng tiên tiến của chúng tôi đã có thể xác định vị trí với hơn 40 triệu người dùng, mở ra những cơ hội kinh doanh chưa từng có trong lĩnh vực quảng cáo di động. AWING đang tiên phong trong các giải pháp quảng cáo dựa trên công nghệ và dữ liệu, nhận được sự tin tưởng và đánh giá cao từ khách hàng cũng như nhà đầu tư chiến lược của chúng tôi – NTT e-Asia, một công ty thuộc tập đoàn NTT (Nhật Bản), chuyên cung cấp các giải pháp công nghệ và viễn thông hàng đầu khu vực châu Á. Sự hợp tác này không chỉ thăng định uy tín của AWING mà còn hỗ trợ chúng tôi đẩy nhanh chiến lược mở rộng toàn cầu.`,
  websiteLink: 'https://www.topcv.vn/cong-ty/cong...'
};

// Mock job data for this company
const companyJobs: JobListCardData[] = [
  {
    id: 1,
    title: 'Business Development Manager - Sales B2B (Up To 2000$)',
    company: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TRUYỀN THÔNG...',
    companyLogo: 'https://via.placeholder.com/80',
    salary: 'Thỏa thuận',
    location: 'Hà Nội, Hồ Chí Minh',
    postedTime: '24 ngày để ứng tuyển',
    isUrgent: true,
    tags: ['Nổi bật'],
    salaryColor: '#4caf50'
  },
  {
    id: 2,
    title: 'Senior Global Talent Acquisition Executive (7+ Years Experience)',
    company: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TRUYỀN THÔNG...',
    companyLogo: 'https://via.placeholder.com/80',
    salary: 'Tới 1,200 USD',
    location: 'Hà Nội',
    postedTime: '24 ngày để ứng tuyển',
    salaryColor: '#2196f3'
  },
  {
    id: 3,
    title: 'Chuyên Viên Tích Hợp Hệ Thống',
    company: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TRUYỀN THÔNG...',
    companyLogo: 'https://via.placeholder.com/80',
    salary: '10 - 14 triệu',
    location: 'Hà Nội',
    postedTime: '22 ngày để ứng tuyển',
    isUrgent: true,
    tags: ['HOT'],
    salaryColor: '#009a3e'
  },
  {
    id: 4,
    title: 'Trưởng Nhóm Tích Hợp Hệ Thống (Upto 1400$)',
    company: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TRUYỀN THÔNG...',
    companyLogo: 'https://via.placeholder.com/80',
    salary: 'Tới 1,400 USD',
    location: 'Hà Nội',
    postedTime: '15 ngày để ứng tuyển',
    salaryColor: '#2196f3'
  }
];

// Mock pro companies data
const proCompanies: ProCompany[] = [
  { id: 1, name: 'CÔNG TY CỔ PHẦN TRUYỀN THÔNG VMG', logo: 'https://via.placeholder.com/60', industry: 'Marketing / Truyền thông /' },
  { id: 2, name: 'CÔNG TY CỔ PHẦN TRUYỀN THÔNG IRIS', logo: 'https://via.placeholder.com/60', industry: 'IT - Phần mềm' },
  { id: 3, name: 'CÔNG TY CỔ PHẦN TIN HỌC VIỄN THÔNG...', logo: 'https://via.placeholder.com/60', industry: 'IT - Phần mềm' },
  { id: 4, name: 'CÔNG TY CỔ PHẦN DỊCH VỤ KỸ THUẬT MOBIFONE', logo: 'https://via.placeholder.com/60', industry: 'Viễn thông' },
  { id: 5, name: 'TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO...', logo: 'https://via.placeholder.com/60', industry: 'Viễn thông' },
  { id: 6, name: 'CÔNG TY CỔ PHẦN HẠ TẦNG VIỄN THÔNG CMC...', logo: 'https://via.placeholder.com/60', industry: 'Viễn thông' },
  { id: 7, name: 'CÔNG TY CP ĐẦU TƯ THƯƠNG MẠI VÀ PHÁT...', logo: 'https://via.placeholder.com/60', industry: 'IT - Phần mềm' },
  { id: 8, name: 'CÔNG TY CỔ PHẦN RIKKEISOFT', logo: 'https://via.placeholder.com/60', industry: 'IT - Phần mềm' },
  { id: 9, name: 'TẬP ĐOÀN FPT', logo: 'https://via.placeholder.com/60', industry: 'IT - Phần mềm' },
  { id: 10, name: 'CÔNG TY CỔ PHẦN MÁY TÍNH VĨNH XUÂN', logo: 'https://via.placeholder.com/60', industry: 'IT - Phần mềm' }
];

const CompanyDetailPage: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  const [jobLocation, setJobLocation] = useState('');

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleJobSearch = () => {
    console.log('Searching jobs:', jobSearchTerm, jobLocation);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleApplyJob = (jobId: number) => {
    console.log('Applying to job:', jobId);
  };

  const handleSaveJob = (jobId: number) => {
    console.log('Saving job:', jobId);
  };

  const handleShowMore = () => {
    console.log('Show more company info');
  };

  const handleViewMap = () => {
    console.log('View map');
  };

  const handleViewMoreCompanies = () => {
    console.log('View more companies');
  };

  return (
    <Box>
      {/* Company Header */}
      <CompanyHeader
        company={companyData}
        isFollowing={isFollowing}
        onFollow={handleFollow}
      />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          {/* Left Column */}
          <Box>
            {/* Company Introduction */}
            <CompanyIntroduction
              description={companyDetails.description}
              onShowMore={handleShowMore}
            />

            {/* Job Search */}
            <CompanyJobSearch
              jobs={companyJobs}
              searchTerm={jobSearchTerm}
              location={jobLocation}
              onSearchTermChange={setJobSearchTerm}
              onLocationChange={setJobLocation}
              onSearch={handleJobSearch}
              onApplyJob={handleApplyJob}
              onSaveJob={handleSaveJob}
            />
          </Box>

          {/* Right Column */}
          <Box>
            <CompanyContactInfo
              address={companyDetails.address}
              websiteLink={companyDetails.websiteLink}
              onViewMap={handleViewMap}
              onCopyLink={handleCopyLink}
            />
          </Box>
        </Box>

        {/* Pro Company Section */}
        <ProCompanySection
          companies={proCompanies}
          onViewMore={handleViewMoreCompanies}
        />
      </Container>
    </Box>
  );
};

export default CompanyDetailPage;