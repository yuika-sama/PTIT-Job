import React from 'react';
import {
  Paper,
  Box,
  InputBase,
  IconButton,
  Divider,
  Button,
  useTheme,
  Popper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Fade,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Room as RoomIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Clear as ClearIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { Location } from '../../services/types';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  locations?: Location[];
  onSearch?: (params: { keyword: string; locationId?: number }) => void;
  isLoading?: boolean;
  initialKeyword?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  locations = [],
  onSearch,
  isLoading = false,
  initialKeyword = ''
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [keyword, setKeyword] = React.useState(initialKeyword);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = React.useState(false);
  const [locationAnchor, setLocationAnchor] = React.useState<null | HTMLElement>(null);
  const [searchHistory, setSearchHistory] = React.useState<string[]>([]);

  // Update keyword when initialKeyword changes
  React.useEffect(() => {
    if (initialKeyword) {
      setKeyword(initialKeyword);
    }
  }, [initialKeyword]);

  // Load search history from localStorage
  React.useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const handleSearch = () => {
    if (!keyword.trim() && !selectedLocation) return;

    // Save to search history
    if (keyword.trim()) {
      const newHistory = [keyword, ...searchHistory.filter(h => h !== keyword)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }

    // Navigate to job search page with params
    const searchParams = new URLSearchParams();
    if (keyword.trim()) {
      searchParams.set('keyword', keyword.trim());
    }
    if (selectedLocation) {
      searchParams.set('location', selectedLocation.id);
      searchParams.set('locationName', selectedLocation.city);
    }

    navigate(`/candidate/job-search?${searchParams.toString()}`);
    
    // Call parent callback if provided
    onSearch?.({
      keyword: keyword.trim(),
      locationId: selectedLocation ? parseInt(selectedLocation.id) : undefined
    });
  };

  const handleLocationClick = (event: React.MouseEvent<HTMLElement>) => {
    setLocationAnchor(event.currentTarget);
    setShowLocationDropdown(true);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
  };

  const handleLocationClose = () => {
    setShowLocationDropdown(false);
  };

  const handleClearSearch = () => {
    setKeyword('');
    setSelectedLocation(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistorySelect = (historyItem: string) => {
    setKeyword(historyItem);
  };

  return (
    <Paper 
      elevation={4} 
      sx={{ 
        p: 1, 
        pl: 3, 
        display: 'flex', 
        alignItems: 'center', 
        borderRadius: 12, 
        height: 64, 
        mb: 2,
        border: `2px solid ${theme.palette.primary.main}15`,
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
          borderColor: `${theme.palette.primary.main}30`
        },
        '&:focus-within': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`
        },
        transition: 'all 0.3s ease'
      }}
    >
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute',
        top: -20,
        left: -20,
        width: 80,
        height: 80,
        background: `${theme.palette.primary.main}05`,
        borderRadius: '50%'
      }} />

      {/* Search Input */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        <InputBase
          placeholder="Vị trí tuyển dụng, tên công ty, kỹ năng..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ 
            flex: 1, 
            fontSize: 16,
            fontWeight: 500,
            '& input::placeholder': {
              color: theme.palette.text.secondary,
              opacity: 0.7
            }
          }}
        />
        
        {/* Search History Dropdown */}
        {searchHistory.length > 0 && keyword === '' && (
          <Box sx={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1
          }}>
            <Paper sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <Box sx={{ p: 1, bgcolor: 'grey.50' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <HistoryIcon sx={{ fontSize: 14 }} />
                  Tìm kiếm gần đây
                </Typography>
              </Box>
              {searchHistory.map((item, index) => (
                <MenuItem 
                  key={index}
                  onClick={() => handleHistorySelect(item)}
                  sx={{ fontSize: '0.875rem' }}
                >
                  {item}
                </MenuItem>
              ))}
            </Paper>
          </Box>
        )}
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: theme.palette.divider }} />

      {/* Location Selector */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        pr: 2, 
        minWidth: 180, 
        position: 'relative' 
      }}>
        <RoomIcon sx={{ 
          fontSize: 22, 
          color: theme.palette.primary.main, 
          mr: 1.5 
        }} />
        <Box
          onClick={handleLocationClick}
          sx={{ 
            flex: 1, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: `${theme.palette.primary.main}08`
            },
            transition: 'background-color 0.2s ease'
          }}
        >
          <Typography variant="body2" sx={{ 
            fontSize: 15,
            fontWeight: 500,
            color: selectedLocation ? 'text.primary' : 'text.secondary' 
          }}>
            {selectedLocation ? selectedLocation.city : 'Chọn địa điểm'}
          </Typography>
          <ArrowDropDownIcon sx={{ 
            color: 'text.secondary',
            transform: showLocationDropdown ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease'
          }} />
        </Box>
        
        {/* Location Dropdown */}
        <Popper
          open={showLocationDropdown}
          anchorEl={locationAnchor}
          placement="bottom-start"
          transition
          sx={{ zIndex: 1300 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{ 
                mt: 1, 
                minWidth: 220, 
                maxHeight: 400, 
                overflow: 'auto',
                boxShadow: 4,
                border: `1px solid ${theme.palette.divider}`
              }}>
                <ClickAwayListener onClickAway={handleLocationClose}>
                  <MenuList sx={{ p: 1 }}>
                    <MenuItem 
                      onClick={() => {
                        setSelectedLocation(null);
                        setShowLocationDropdown(false);
                      }}
                      sx={{ 
                        borderRadius: 1,
                        mb: 1,
                        fontWeight: 500
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        🌍 Tất cả địa điểm
                      </Typography>
                    </MenuItem>
                    <Divider />
                    {locations.map((location) => (
                      <MenuItem 
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        selected={selectedLocation?.id === location.id}
                        sx={{ 
                          borderRadius: 1,
                          my: 0.5
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="body2">
                            📍 {location.city}
                          </Typography>
                          {location.job_count && (
                            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                              {location.job_count} jobs
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mr: 2 }} />

      {/* Search Button */}
      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={handleSearch}
        disabled={isLoading}
        sx={{ 
          textTransform: 'none', 
          fontWeight: 700, 
          borderRadius: 8, 
          px: 4, 
          height: 52,
          minWidth: 140,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow: `0 6px 20px ${theme.palette.primary.main}40`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            boxShadow: `0 8px 25px ${theme.palette.primary.main}50`,
            transform: 'translateY(-2px)'
          },
          '&:active': {
            transform: 'translateY(0px)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
      </Button>
      
      {/* Clear Button */}
      {(keyword || selectedLocation) && (
        <Tooltip title="Xóa tìm kiếm">
          <IconButton
            onClick={handleClearSearch}
            sx={{ 
              ml: 1,
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: `${theme.palette.primary.main}08`
              }
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );
};

export default SearchBar;