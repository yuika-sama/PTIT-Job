import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  LocationOn as LocationOnIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRoleRoutes } from '../utils/roleConfig';

interface RoleBasedSidebarProps {
  open: boolean;
  onClose: () => void;
  width?: number;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType> = {
  Dashboard: DashboardIcon,
  Work: WorkIcon,
  Assignment: AssignmentIcon,
  People: PeopleIcon,
  Business: BusinessIcon,
  Description: DescriptionIcon,
  Category: CategoryIcon,
  LocationOn: LocationOnIcon,
  Assessment: AssessmentIcon,
  Settings: SettingsIcon,
  Person: PersonIcon,
};

const RoleBasedSidebar: React.FC<RoleBasedSidebarProps> = ({ 
  open, 
  onClose, 
  width = 280 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const userRoutes = getRoleRoutes(user.role);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <Box sx={{ width, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto', pt: 2 }}>
        <List>
          {userRoutes.map((route) => {
            const IconComponent = iconMap[route.icon || 'Dashboard'];
            const isActive = location.pathname === route.path;
            
            return (
              <ListItem key={route.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(route.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#1976d2' : 'inherit' }}>
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText 
                    primary={route.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: isActive ? '#1976d2' : 'inherit',
                        fontWeight: isActive ? 600 : 400
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider />
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          marginTop: '64px', // Height of AppBar/Header
          height: 'calc(100vh - 64px)', // Subtract header height from full height
          zIndex: (theme) => theme.zIndex.appBar - 1, // Below AppBar
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default RoleBasedSidebar;