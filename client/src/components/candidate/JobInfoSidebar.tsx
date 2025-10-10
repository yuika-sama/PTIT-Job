import React, { FC } from 'react';
import { Box, Typography, Stack, Divider, Paper } from '@mui/material';
import { WorkOutline, School, Group, AccessTime } from '@mui/icons-material';
import { GeneralInfo } from './types';

const greenColor = '#00b14f';

interface JobInfoSidebarProps {
  generalInfo: GeneralInfo;
}

const JobInfoSidebar: FC<JobInfoSidebarProps> = ({ generalInfo }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
      {/* ...Nội dung component giữ nguyên... */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>Thông tin chung</Typography>
        <Divider />
        <Stack spacing={2} mt={2}>
            <Box display="flex" alignItems="center"><WorkOutline sx={{ mr: 1.5, color: greenColor }} /> <Box><Typography fontWeight="bold">Cấp bậc</Typography><Typography variant="body2">{generalInfo.level}</Typography></Box></Box>
            <Box display="flex" alignItems="center"><School sx={{ mr: 1.5, color: greenColor }} /> <Box><Typography fontWeight="bold">Học vấn</Typography><Typography variant="body2">{generalInfo.education}</Typography></Box></Box>
            <Box display="flex" alignItems="center"><Group sx={{ mr: 1.5, color: greenColor }} /> <Box><Typography fontWeight="bold">Số lượng tuyển</Typography><Typography variant="body2">{generalInfo.quantity}</Typography></Box></Box>
            <Box display="flex" alignItems="center"><AccessTime sx={{ mr: 1.5, color: greenColor }} /> <Box><Typography fontWeight="bold">Hình thức làm việc</Typography><Typography variant="body2">{generalInfo.format}</Typography></Box></Box>
        </Stack>
    </Paper>
  );
}

export default JobInfoSidebar;