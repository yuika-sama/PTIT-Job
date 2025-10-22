import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Location } from '../../../services/types';

interface LocationTableProps {
  locations: Location[];
  loading: boolean;
  page: number;
  itemsPerPage: number;
  onView: (location: Location) => void;
  onEdit: (location: Location) => void;
  onDelete: (locationId: string) => void;
  onToggleStatus: (locationId: string) => void;
}

const LocationTable: React.FC<LocationTableProps> = ({
  locations,
  loading,
  page,
  itemsPerPage,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const theme = useTheme();
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Đang tải danh sách địa điểm...
        </Typography>
      </Box>
    );
  }

  if (locations.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Không có địa điểm nào
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[200] === 'light' ? 'grey.50' : 'grey.850' }}>
            <TableCell><strong>STT</strong></TableCell>
            <TableCell><strong>Địa chỉ</strong></TableCell>
            <TableCell><strong>Slug</strong></TableCell>
            <TableCell><strong>Số việc làm</strong></TableCell>
            <TableCell><strong>Thao tác</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.map((location, index) => (
            <TableRow key={location.id} hover>
              <TableCell>
                {(page - 1) * itemsPerPage + index + 1}
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="medium">
                    {location.city}
                  </Typography>
                </Box>
              </TableCell>
              
              
              <TableCell>
                <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                  {location.slug || 'N/A'}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {location.job_count || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    việc làm
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      size="small"
                      onClick={() => onView(location)}
                      color="primary"
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(location)}
                      color="info"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(location.id)}
                      color="error"
                      disabled={(location.job_count || 0) > 0}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LocationTable;