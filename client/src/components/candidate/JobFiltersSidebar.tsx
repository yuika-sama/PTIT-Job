import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  TextField,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

interface JobFiltersSidebarProps {
  onFiltersChange?: (filters: JobFilters) => void;
}

interface JobFilters {
  categories: string[];
  levels: string[];
  salaryRange: string;
  locations: string[];
  experience: string;
}

const JobFiltersSidebar: React.FC<JobFiltersSidebarProps> = ({ onFiltersChange }) => {
  const theme = useTheme();
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = React.useState<string[]>([]);
  const [salaryRange, setSalaryRange] = React.useState('Tất cả');
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);

  const categories = [
    { name: 'Marketing', count: 5497 },
    { name: 'Kế toán', count: 5304 },
    { name: 'Sales Bán lẻ/Dịch vụ tiêu dùng', count: 1928 },
    { name: 'Chăm sóc khách hàng...', count: 1806 },
    { name: 'Nhân sự', count: 1693 }
  ];

  const levels = [
    'Tất cả',
    'Nhân viên',
    'Trương nhóm',
    'Trưởng/Phó phòng',
    'Quản lý / Giám sát',
    'Trưởng chi nhánh',
    'Phó giám đốc',
    'Giám đốc',
    'Thực tập sinh'
  ];

  const salaryRanges = [
    'Tất cả',
    '10 - 15 triệu',
    '15 - 20 triệu',
    '20 - 25 triệu',
    '25 - 30 triệu',
    '30 - 50 triệu',
    'Thỏa thuận',
    'Dưới 10 triệu',
    'Trên 50 triệu'
  ];

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    updateFilters(newCategories, selectedLevels, salaryRange, selectedLocations);
  };

  const handleLevelChange = (level: string) => {
    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.filter(l => l !== level)
      : [...selectedLevels, level];
    setSelectedLevels(newLevels);
    updateFilters(selectedCategories, newLevels, salaryRange, selectedLocations);
  };

  const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSalary = event.target.value;
    setSalaryRange(newSalary);
    updateFilters(selectedCategories, selectedLevels, newSalary, selectedLocations);
  };

  const updateFilters = (categories: string[], levels: string[], salary: string, locations: string[]) => {
    onFiltersChange?.({
      categories,
      levels,
      salaryRange: salary,
      locations,
      experience: ''
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSalaryRange('Tất cả');
    setSelectedLocations([]);
    updateFilters([], [], 'Tất cả', []);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 320 }}>
      {/* Advanced Filter Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
          p: 2,
          backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
          borderRadius: 2
        }}
      >
        <TrendingUpIcon sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" fontWeight={600}>
          Lọc nâng cao
        </Typography>
      </Box>

      {/* Categories Filter */}
      <Accordion defaultExpanded sx={{ 
        mb: 2, 
        boxShadow: 'none', 
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Theo danh mục nghề
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {categories.map((category) => (
              <FormControlLabel
                key={category.name}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryChange(category.name)}
                    sx={{
                      color: theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main
                      }
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="body2">{category.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({category.count})
                    </Typography>
                  </Box>
                }
              />
            ))}
            <Button
              variant="text"
              sx={{ 
                alignSelf: 'flex-start', 
                color: theme.palette.primary.main,
                fontSize: '0.875rem',
                textTransform: 'none'
              }}
            >
              Xem thêm
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Level Filter */}
      <Accordion defaultExpanded sx={{ 
        mb: 2, 
        boxShadow: 'none', 
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Cấp bậc
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {levels.map((level) => (
              <FormControlLabel
                key={level}
                control={
                  <Radio
                    checked={selectedLevels.includes(level)}
                    onChange={() => handleLevelChange(level)}
                    sx={{
                      color: theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main
                      }
                    }}
                  />
                }
                label={<Typography variant="body2">{level}</Typography>}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Salary Filter */}
      <Accordion defaultExpanded sx={{ 
        mb: 2, 
        boxShadow: 'none', 
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Mức lương
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RadioGroup value={salaryRange} onChange={handleSalaryChange}>
            {salaryRanges.map((range) => (
              <FormControlLabel
                key={range}
                value={range}
                control={
                  <Radio
                    sx={{
                      color: theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main
                      }
                    }}
                  />
                }
                label={<Typography variant="body2">{range}</Typography>}
              />
            ))}
          </RadioGroup>
          
          {/* Custom Salary Range */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              placeholder="Từ"
              size="small"
              sx={{ flex: 1 }}
            />
            <Typography>-</Typography>
            <TextField
              placeholder="Đến"
              size="small"
              sx={{ flex: 1 }}
            />
            <Typography variant="caption">triệu</Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{ 
              mt: 1,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}08`,
                borderColor: theme.palette.primary.main
              }
            }}
          >
            Xóa lọc
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Clear All Filters */}
      <Button
        variant="contained"
        fullWidth
        onClick={clearFilters}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        }}
      >
        Xóa tất cả bộ lọc
      </Button>

      {/* Applied Filters */}
      {(selectedCategories.length > 0 || selectedLevels.length > 0 || salaryRange !== 'Tất cả') && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Bộ lọc đang áp dụng:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                size="small"
                onDelete={() => handleCategoryChange(category)}
                color="primary"
              />
            ))}
            {selectedLevels.map((level) => (
              <Chip
                key={level}
                label={level}
                size="small"
                onDelete={() => handleLevelChange(level)}
                color="primary"
              />
            ))}
            {salaryRange !== 'Tất cả' && (
              <Chip
                label={salaryRange}
                size="small"
                onDelete={() => setSalaryRange('Tất cả')}
                color="primary"
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default JobFiltersSidebar;