import React, { useMemo, useRef, useState } from 'react';
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
  Divider,
  Grow,
  alpha,
  useScrollTrigger
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
  Calculate as CalculateIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

/** =========================================
 *  ToolsButtonWithHoverMenu (tách riêng nút "Công cụ")
 *  Hover chuẩn xác, không nháy, xử lý delay mở/đóng,
 *  loại bỏ khoảng hở giữa nút & menu.
 *  =========================================
 */
type DropdownItem = {
  label: string;
  icon: React.ReactNode;
  path: string;
  category: 'cv' | 'finance' | 'learning';
};

interface ToolsButtonWithHoverMenuProps {
  items: DropdownItem[];
  navigate: (path: string) => void;
  isDarkMode?: boolean;
  label?: string;
  startIcon?: React.ReactNode;
}

const OPEN_DELAY = 60;
const CLOSE_DELAY = 140;

const ToolsButtonWithHoverMenu: React.FC<ToolsButtonWithHoverMenuProps> = ({
  items,
  navigate,
  isDarkMode,
  label = 'Công cụ',
  startIcon = <BuildIcon />
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const openWithDelay = () => {
    clearTimers();
    openTimer.current = window.setTimeout(() => setOpen(true), OPEN_DELAY);
  };

  const closeWithDelay = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  const handleToggleClick = () => {
    clearTimers();
    setOpen((v) => !v);
  };

  const cvItems = items.filter((d) => d.category === 'cv');
  const financeItems = items.filter((d) => d.category === 'finance');

  return (
    <Box
      sx={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={openWithDelay}
      onMouseLeave={closeWithDelay}
    >
      <Button
        ref={btnRef}
        startIcon={startIcon}
        onClick={handleToggleClick}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          position: 'relative',
          color: open ? 'primary.main' : 'text.primary',
          backgroundColor: open ? 'action.hover' : 'transparent',
          transition: 'all .2s ease',
          '&:hover': { backgroundColor: 'action.hover', color: 'primary.main' },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 6,
            height: 2,
            borderRadius: 1,
            backgroundColor: 'primary.main',
            transform: open ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform .2s ease'
          }
        }}
      >
        {label}
      </Button>

      <Menu
        anchorEl={btnRef.current}
        open={open}
        onClose={closeWithDelay}
        TransitionComponent={Grow}
        transitionDuration={140}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        MenuListProps={{
          onMouseEnter: openWithDelay,
          onMouseLeave: closeWithDelay,
          sx: { py: 1.25 }
        }}
        PaperProps={{
          sx: (theme) => ({
            mt: 0, // loại bỏ khoảng hở giữa nút và menu
            px: 1,
            minWidth: 560,
            maxHeight: 520,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
            backgroundImage: 'none',
            backdropFilter: 'saturate(120%) blur(8px)',
            backgroundColor: alpha(theme.palette.background.paper, isDarkMode ? 0.9 : 0.95),
            boxShadow: '0 8px 24px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.06)',
            '& .MuiMenuItem-root': {
              borderRadius: 1,
              px: 1.25,
              py: 1.1,
              minHeight: 44,
              transition: 'background-color .15s ease, transform .15s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.light, 0.25),
                transform: 'translateX(2px)'
              }
            }
          })
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25, p: 0.5, minHeight: 220 }}>
          {/* Cột trái: CV & Interview */}
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', px: 1.25 }}>
              CV & Phỏng vấn
            </Typography>
            {cvItems.map((d, i) => (
              <MenuItem
                key={`cv-${i}`}
                onClick={() => {
                  navigate(d.path);
                  setOpen(false);
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  {d.icon}
                  <Typography variant="body2">{d.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Box>

          {/* Cột phải: Finance */}
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', px: 1.25 }}>
              Công cụ tài chính
            </Typography>
            {financeItems.map((d, i) => (
              <MenuItem
                key={`finance-${i}`}
                onClick={() => {
                  navigate(d.path);
                  setOpen(false);
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  {d.icon}
                  <Typography variant="body2">{d.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

/** =========================================
 *  CandidateHeader (file đầy đủ)
 *  =========================================
 */
const CandidateHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleColorMode } = useCustomTheme();

  // Elevation & blur khi scroll
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 6 });

  // Profile menu
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/candidate/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navigationItems = useMemo(
    () => [
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
          { label: 'Đánh giá CV', icon: <AssignmentIcon />, path: '/candidate/cv-evaluation', category: 'cv' },
          { label: 'Giả lập phỏng vấn AI', icon: <PsychologyIcon />, path: '/candidate/interview-emulate', category: 'cv' },
          { label: 'Tính lương Gross/Net', icon: <CalculateIcon />, path: '/candidate/salary-calculator', category: 'finance' },
          { label: 'Tính thuế thu nhập cá nhân', icon: <MonetizationOnIcon />, path: '/candidate/personal-income-tax', category: 'finance' },
          { label: 'Tính lãi suất kép', icon: <TrendingUpIcon />, path: '/candidate/compound-interest', category: 'finance' },
          { label: 'Tính bảo hiểm thất nghiệp', icon: <SecurityIcon />, path: '/candidate/unemployment-insurance', category: 'finance' },
          { label: 'Tính bảo hiểm xã hội một lần', icon: <AccountBalanceIcon />, path: '/candidate/bhxh-calculator', category: 'finance' }
        ] as DropdownItem[]
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
    ],
    []
  );

  return (
    <AppBar
      position="sticky"
      elevation={trigger ? 6 : 0}
      sx={(theme) => ({
        color: 'text.primary',
        borderBottom: '1px solid',
        borderBottomColor: trigger ? 'transparent' : 'divider',
        backgroundColor: trigger
          ? alpha(theme.palette.background.paper, isDarkMode ? 0.8 : 0.7)
          : theme.palette.background.paper,
        backdropFilter: trigger ? 'saturate(120%) blur(10px)' : 'none',
        transition: 'background-color .2s ease, box-shadow .2s ease, backdrop-filter .2s ease'
      })}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 }, gap: 1 }}>
        {/* Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 1.5 }}
          onClick={() => navigate('/candidate/dashboard')}
        >
          <WorkIcon
            sx={{
              fontSize: 32,
              color: 'primary.main',
              mr: 1,
              transition: 'transform .2s ease',
              '&:hover': { transform: 'scale(1.05) rotate(-3deg)' }
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

        {/* Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mr: 'auto' }}>
          {navigationItems.map((item, index) =>
            // Dùng component riêng cho nút "Công cụ"
            item.hasDropdown ? (
              <ToolsButtonWithHoverMenu
                key={index}
                items={item.dropdownItems as DropdownItem[]}
                navigate={(p) => navigate(p)}
                isDarkMode={isDarkMode}
                label={item.label}
                startIcon={item.icon}
              />
            ) : (
              <Button
                key={index}
                startIcon={item.icon}
                onClick={() => item.path && navigate(item.path)}
                sx={{
                  color: 'text.primary',
                  position: 'relative',
                  '&:hover': { backgroundColor: 'action.hover', color: 'primary.main' },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 6,
                    height: 2,
                    borderRadius: 1,
                    backgroundColor: 'primary.main',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform .2s ease'
                  },
                  '&:hover::after': { transform: 'scaleX(1)' }
                }}
              >
                {item.label}
              </Button>
            )
          )}
        </Box>

        {/* Search */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={(theme) => ({
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            borderRadius: 999,
            px: 1.25,
            py: 0.35,
            mx: 1,
            minWidth: 220,
            border: '1px solid',
            borderColor: searchFocused ? 'primary.main' : 'divider',
            boxShadow: searchFocused ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}` : 'none',
            transition: 'all .18s ease',
            backgroundColor: alpha(theme.palette.background.default, isDarkMode ? 0.8 : 0.9),
            backdropFilter: 'blur(6px)'
          })}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Tìm việc làm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 0,
              '& .MuiInputBase-input': {
                padding: '6px 0',
                fontSize: '0.92rem',
                width: searchFocused ? 360 : 200,
                transition: 'width .18s ease'
              }
            }}
          />
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}>
            <IconButton
              onClick={toggleColorMode}
              sx={{ color: 'text.primary', '&:hover': { backgroundColor: 'action.hover' } }}
            >
              {isDarkMode ? (
                <LightModeIcon sx={{ transition: 'transform .18s ease', '&:active': { transform: 'rotate(20deg)' } }} />
              ) : (
                <DarkModeIcon sx={{ transition: 'transform .18s ease', '&:active': { transform: 'rotate(-20deg)' } }} />
              )}
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Profile */}
          <Tooltip title="Tài khoản">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ color: 'text.primary', '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileMenuClose}
            TransitionComponent={Grow}
            PaperProps={{
              sx: (theme) => ({
                mt: 1,
                minWidth: 240,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                backgroundImage: 'none',
                backdropFilter: 'blur(8px)',
                backgroundColor: alpha(theme.palette.background.paper, isDarkMode ? 0.95 : 0.98),
                '& .MuiMenuItem-root': { px: 2, py: 1 }
              })
            }}
          >
            <Box sx={{ px: 2, py: 1.25, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
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
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <PersonIcon fontSize="small" />
                <Typography variant="body2">Hồ sơ cá nhân</Typography>
              </Box>
            </MenuItem>

            <MenuItem
              onClick={() => {
                navigate('/candidate/settings');
                handleProfileMenuClose();
              }}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <SettingsIcon fontSize="small" />
                <Typography variant="body2">Cài đặt</Typography>
              </Box>
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{
                color: 'error.main',
                '&:hover': { backgroundColor: 'error.light', color: 'error.dark' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <LogoutIcon fontSize="small" />
                <Typography variant="body2">Đăng xuất</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* keyframes cho badge pulse */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </AppBar>
  );
};

export default CandidateHeader;
