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
  School as SchoolIcon
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

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleToolsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setToolsAnchorEl(event.currentTarget);
  };

  const handleToolsMenuClose = () => {
    setToolsAnchorEl(null);
  };

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
        { label: 'Tạo CV', icon: <AssignmentIcon />, path: '/candidate/cv-builder' },
        { label: 'Đánh giá CV', icon: <AssignmentIcon />, path: '/candidate/cv-review' },
        { label: 'Luyện tập phỏng vấn', icon: <PsychologyIcon />, path: '/candidate/interview-practice' },
        { label: 'Tìm khóa học', icon: <SchoolIcon />, path: '/candidate/courses' }
      ]
    },
    {
      label: 'Đánh giá CV',
      icon: <AssignmentIcon />,
      path: '/candidate/cv-review'
    },
    {
      label: 'Giả lập phỏng vấn',
      icon: <PsychologyIcon />,
      path: '/candidate/interview-simulator'
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
                <Menu
                  anchorEl={toolsAnchorEl}
                  open={Boolean(toolsAnchorEl)}
                  onClose={handleToolsMenuClose}
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
                  {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                    <MenuItem
                      key={dropdownIndex}
                      onClick={() => {
                        navigate(dropdownItem.path);
                        handleToolsMenuClose();
                      }}
                      sx={{
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