import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  InputBase,
  Badge,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Work as WorkIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Psychology as PsychologyIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Calculate as CalculateIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const CandidateHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleColorMode } = useCustomTheme();
  
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [toolsAnchorEl, setToolsAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

 const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleToolsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    clearCloseTimeout();
    setToolsAnchorEl(event.currentTarget);
  };

  const handleToolsMenuClose = () => {
    clearCloseTimeout();
    setToolsAnchorEl(null);
  };

  const handleToolsHover = (event: React.MouseEvent<HTMLElement>) => {
    clearCloseTimeout();
    if (!toolsAnchorEl) {
      setToolsAnchorEl(event.currentTarget);
    }
  };

  const handleToolsLeave = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setToolsAnchorEl(null);
    }, 300);
  };

  const handleMenuEnter = () => {
    clearCloseTimeout();
  };

  const handleMenuLeave = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setToolsAnchorEl(null);
    }, 300);
  };

  React.useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, []);

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/auth/login');
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/candidate/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navigationItems = [
    {
      label: 'Tìm việc làm',
      icon: <WorkIcon />,
      path: '/candidate/jobs'
    },
    {
      label: 'Công cụ',
      icon: <BuildIcon />,
      hasDropdown: true,
      dropdownItems: [
        // CV & Interview Tools
        { 
          label: 'Tạo CV', 
          icon: <AssignmentIcon />, 
          path: '/candidate/cv-builder',
          category: 'cv'
        },
        { 
          label: 'Đánh giá CV', 
          icon: <AssignmentIcon />, 
          path: '/candidate/cv-evaluation',
          category: 'cv'
        },
        { 
          label: 'Giả lập phỏng vấn AI', 
          icon: <PsychologyIcon />, 
          path: '/candidate/interview-emulate',
          category: 'cv'
        },
        { 
          label: 'Tính lương Gross/Net', 
          icon: <CalculateIcon />, 
          path: '/candidate/salary-calculator',
          category: 'finance'
        },
        { 
          label: 'Tính thuế thu nhập cá nhân', 
          icon: <MonetizationOnIcon />, 
          path: '/candidate/personal-income-tax',
          category: 'finance'
        },
        { 
          label: 'Tính lãi suất kép', 
          icon: <TrendingUpIcon />, 
          path: '/candidate/compound-interest',
          category: 'finance'
        },
        { 
          label: 'Tính bảo hiểm thất nghiệp', 
          icon: <SecurityIcon />, 
          path: '/candidate/unemployment-insurance',
          category: 'finance'
        },
        { 
          label: 'Tính bảo hiểm xã hội một lần', 
          icon: <AccountBalanceIcon />, 
          path: '/candidate/bhxh-calculator',
          category: 'finance'
        }
      ]
    },
    {
      label: 'Đánh giá CV',
      icon: <AssignmentIcon />,
      path: '/candidate/cv-evaluation'
    },
    {
      label: 'Giả lập phỏng vấn',
      icon: <PsychologyIcon />,
      path: '/candidate/interview-emulate'
    }
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Logo */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            mr: 3
          }}
          onClick={() => navigate('/candidate/dashboard')}
        >
          <WorkIcon 
            sx={{ 
              fontSize: 32, 
              color: 'primary.main',
              mr: 1
            }} 
          />
          <Typography 
            variant="h6" 
            fontWeight="bold"
            sx={{ 
              background: 'linear-gradient(135deg, #DE221A 0%, #0A4D8C 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            PTIT Job
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 'auto' }}>
          {navigationItems.map((item, index) => (
            item.hasDropdown ? (
              <Box key={index}>
                <Button
                  startIcon={item.icon}
                  onClick={handleToolsMenuOpen}
                  onMouseEnter={handleToolsHover}
                  onMouseLeave={handleToolsLeave}
                  sx={{
                    backgroundColor: Boolean(toolsAnchorEl) ? 'primary.light' : 'transparent',
                    color: Boolean(toolsAnchorEl) ? 'primary.main' : 'text.primary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.main'
                    }
                  }}
                >
                  {item.label}
                </Button>
                <Menu
                  anchorEl={toolsAnchorEl}
                  open={Boolean(toolsAnchorEl)}
                  onClose={handleToolsMenuClose}
                  onMouseEnter={handleMenuEnter}
                  onMouseLeave={handleMenuLeave}
                  MenuListProps={{
                    onMouseEnter: handleMenuEnter,
                    onMouseLeave: handleMenuLeave,
                    sx: { py: 1 }
                  }}
                  PaperProps={{
                    sx: {
                      mt: 0.5,
                      minWidth: 560,
                      maxHeight: 500,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
                        minHeight: 48
                      }
                    }
                  }}
                >
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, p: 1 }}>
                    {/* Left Column */}
                    <Box>
                      {/* CV & Interview Tools */}
                      <Box sx={{ px: 1, py: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          CV & Phỏng vấn
                        </Typography>
                      </Box>
                      {item.dropdownItems?.filter(dropdownItem => dropdownItem.category === 'cv').map((dropdownItem, dropdownIndex) => (
                        <MenuItem
                          key={`cv-${dropdownIndex}`}
                          onClick={() => {
                            navigate(dropdownItem.path);
                            handleToolsMenuClose();
                          }}
                          sx={{
                            mx: 1,
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'primary.light'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {dropdownItem.icon}
                            <Typography variant="body2">
                              {dropdownItem.label}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                      {item.dropdownItems?.filter(dropdownItem => dropdownItem.category === 'learning').map((dropdownItem, dropdownIndex) => (
                        <MenuItem
                          key={`learning-${dropdownIndex}`}
                          onClick={() => {
                            navigate(dropdownItem.path);
                            handleToolsMenuClose();
                          }}
                          sx={{
                            mx: 1,
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'primary.light'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {dropdownItem.icon}
                            <Typography variant="body2">
                              {dropdownItem.label}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Box>

                    {/* Right Column */}
                    <Box>
                      {/* Financial Tools */}
                      <Box sx={{ px: 1, py: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Công cụ tài chính
                        </Typography>
                      </Box>
                      {item.dropdownItems?.filter(dropdownItem => dropdownItem.category === 'finance').map((dropdownItem, dropdownIndex) => (
                        <MenuItem
                          key={`finance-${dropdownIndex}`}
                          onClick={() => {
                            navigate(dropdownItem.path);
                            handleToolsMenuClose();
                          }}
                          sx={{
                            mx: 1,
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'primary.light'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {dropdownItem.icon}
                            <Typography variant="body2">
                              {dropdownItem.label}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Box>
                  </Box>
                </Menu>
              </Box>
            ) : (
              <Button
                key={index}
                startIcon={item.icon}
                onClick={() => item.path && navigate(item.path)}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.main'
                  }
                }}
              >
                {item.label}
              </Button>
            )
          ))}
        </Box>

        {/* Search Bar */}
        <Box 
          component="form"
          onSubmit={handleSearch}
          sx={{ 
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            backgroundColor: 'background.default',
            borderRadius: 25,
            px: 2,
            py: 0.5,
            mx: 2,
            minWidth: 200,
            border: '1px solid',
            borderColor: 'divider',
            '&:focus-within': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 2px rgba(222, 34, 26, 0.1)'
            }
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Tìm việc làm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              '& .MuiInputBase-input': {
                padding: '4px 0',
                fontSize: '0.875rem'
              }
            }}
          />
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <Tooltip title="Thông báo">
            <IconButton
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'primary.light'
                }
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Dark Mode Toggle */}
          <Tooltip title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}>
            <IconButton 
              onClick={toggleColorMode}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'primary.light'
                }
              }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Profile Menu */}
          <Tooltip title="Tài khoản">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'primary.light'
                }
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 220,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1
                }
              }
            }}
          >
            {/* User Info */}
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {user?.full_name || 'Người dùng'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>

            <MenuItem
              onClick={() => {
                navigate('/candidate/profile');
                handleProfileMenuClose();
              }}
              sx={{ '&:hover': { backgroundColor: 'primary.light' } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PersonIcon fontSize="small" />
                <Typography variant="body2">Hồ sơ cá nhân</Typography>
              </Box>
            </MenuItem>

            <MenuItem
              onClick={() => {
                navigate('/candidate/settings');
                handleProfileMenuClose();
              }}
              sx={{ '&:hover': { backgroundColor: 'primary.light' } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SettingsIcon fontSize="small" />
                <Typography variant="body2">Cài đặt</Typography>
              </Box>
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{ 
                color: 'error.main',
                '&:hover': { 
                  backgroundColor: 'error.light',
                  color: 'error.dark'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LogoutIcon fontSize="small" />
                <Typography variant="body2">Đăng xuất</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CandidateHeader;