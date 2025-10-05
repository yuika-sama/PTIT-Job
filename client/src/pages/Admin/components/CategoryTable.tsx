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
  CircularProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon
} from '@mui/icons-material';
import { JobCategory } from '../../../services/types';

interface CategoryTableProps {
  categories: JobCategory[];
  loading: boolean;
  page: number;
  itemsPerPage: number;
  onView: (category: JobCategory) => void;
  onEdit: (category: JobCategory) => void;
  onDelete: (categoryId: string) => void;
  onToggleStatus: (categoryId: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  loading,
  page,
  itemsPerPage,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Đang tải danh sách danh mục...
        </Typography>
      </Box>
    );
  }

  if (categories.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Không có danh mục nào
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell><strong>STT</strong></TableCell>
            <TableCell><strong>Tên danh mục</strong></TableCell>
            <TableCell><strong>Slug</strong></TableCell>
            <TableCell><strong>Số việc làm</strong></TableCell>
            <TableCell><strong>Thao tác</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow key={category.id} hover>
              <TableCell>
                {(page - 1) * itemsPerPage + index + 1}
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {category.name}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                  {category.slug || 'N/A'}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {category.job_count || 0}
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
                      onClick={() => onView(category)}
                      color="primary"
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(category)}
                      color="info"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                                    
                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(category.id)}
                      color="error"
                      disabled={(category.job_count || 0) > 0}
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

export default CategoryTable;