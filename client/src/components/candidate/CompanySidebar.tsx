import React, { FC } from 'react';
import { Box, Typography, Link, Avatar, Stack, Divider, Paper } from '@mui/material';
import { People, Category, Apartment } from '@mui/icons-material';
import { Company } from './types';

interface CompanySidebarProps {
  companyInfo: Company;
}

const CompanySidebar: FC<CompanySidebarProps> = ({ companyInfo }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
      {/* ...Nội dung component giữ nguyên... */}
        <Box display="flex" alignItems="center" mb={2}>
            <Avatar src={companyInfo.logo} variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} />
            <Typography variant="h6" fontWeight="bold">{companyInfo.name}</Typography>
        </Box>
        <Divider />
        <Stack spacing={1.5} mt={2}>
            <Box display="flex" alignItems="center"><People sx={{ mr: 1.5, color: 'text.secondary' }} /> <Typography variant="body2">Quy mô: {companyInfo.size}</Typography></Box>
            <Box display="flex" alignItems="center"><Category sx={{ mr: 1.5, color: 'text.secondary' }} /> <Typography variant="body2">Lĩnh vực: {companyInfo.industry}</Typography></Box>
            <Box display="flex"><Apartment sx={{ mr: 1.5, color: 'text.secondary', mt: '3px' }} /> <Typography variant="body2">Địa điểm: {companyInfo.address}</Typography></Box>
        </Stack>
        <Link href="#" underline="none" sx={{ mt: 2, display: 'block', textAlign: 'center', fontWeight: 'bold' }}>
            Xem trang công ty
        </Link>
    </Paper>
  );
}

export default CompanySidebar;