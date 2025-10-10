import React from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Whatshot as WhatshotIcon,
  Star as StarIcon
} from '@mui/icons-material';

interface SearchSuggestionsProps {
  onSuggestionClick?: (keyword: string) => void;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  { keyword: 'Chuyên viên chăm sóc khách hàng', isHot: true, category: 'Chăm sóc KH' },
  { keyword: 'Frontend Developer', isHot: true, category: 'IT' },
  { keyword: 'ReactJS', isHot: false, category: 'IT' },
  { keyword: 'Java Developer', isHot: true, category: 'IT' },
  { keyword: 'Data Analyst', isHot: false, category: 'Phân tích' },
  { keyword: 'Marketing Executive', isHot: false, category: 'Marketing' },
  { keyword: 'Content Writer', isHot: true, category: 'Content' },
  { keyword: 'UI/UX Designer', isHot: true, category: 'Thiết kế' }
];

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSuggestionClick,
  suggestions = []
}) => {
  const theme = useTheme();

  // Use default suggestions if none provided
  const displaySuggestions = suggestions.length > 0 
    ? suggestions.map(s => ({ keyword: s, isHot: false, category: 'General' }))
    : DEFAULT_SUGGESTIONS;

  const handleSuggestionClick = (keyword: string) => {
    onSuggestionClick?.(keyword);
  };

  return (
    <Paper sx={{ 
      p: 3, 
      borderRadius: 3,
      background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 1
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <StarIcon sx={{ color: '#ffc107', fontSize: 24 }} />
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Từ khóa phổ biến
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Khám phá những vị trí việc làm được tìm kiếm nhiều nhất
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: 1.5 
      }}>
        {displaySuggestions.map((suggestion, index) => (
          <Tooltip 
            key={index}
            title={`Tìm kiếm việc làm: ${suggestion.keyword}`}
            placement="top"
          >
            <Chip 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {suggestion.isHot && (
                    <WhatshotIcon sx={{ fontSize: 14, color: '#ff5722' }} />
                  )}
                  <span>{suggestion.keyword}</span>
                  <Typography 
                    component="span" 
                    variant="caption" 
                    sx={{ 
                      ml: 0.5,
                      px: 0.5,
                      py: 0.25,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      borderRadius: 1,
                      fontSize: '0.65rem'
                    }}
                  >
                    {suggestion.category}
                  </Typography>
                </Box>
              }
              onClick={() => handleSuggestionClick(suggestion.keyword)}
              variant={suggestion.isHot ? "filled" : "outlined"}
              color={suggestion.isHot ? "primary" : "default"}
              sx={{ 
                cursor: 'pointer',
                fontSize: '0.875rem',
                height: 36,
                '&:hover': {
                  backgroundColor: suggestion.isHot 
                    ? theme.palette.primary.dark 
                    : `${theme.palette.primary.main}08`,
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px ${theme.palette.primary.main}20`
                },
                transition: 'all 0.2s ease'
              }}
            />
          </Tooltip>
        ))}
      </Box>

      {/* Additional info */}
      <Box sx={{ 
        mt: 3, 
        pt: 2, 
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          💡 Mẹo: Nhấn vào từ khóa để tìm kiếm nhanh
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WhatshotIcon sx={{ fontSize: 16, color: '#ff5722' }} />
          <Typography variant="caption" color="text.secondary">
            Từ khóa hot
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchSuggestions;