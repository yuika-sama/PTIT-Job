import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { userService } from '../../services/userService';
import { User } from '../../services/types';
import UserStatsCards from './components/UserStatsCards';
import UserSearchFilters from './components/UserSearchFilters';
import UserTable from './components/UserTable';
import UserDialog from './components/UserDialog';

interface UserFormData {
  email: string;
  full_name: string;
  phone_number: string;
  role: 'admin' | 'employer' | 'candidate';
  company_id?: string;
  is_active: boolean;
  password?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    full_name: '',
    phone_number: '',
    role: 'candidate',
    is_active: true
  });

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers();

      if (response.success && response.data) {
        console.log('✅ Users loaded successfully:', response.data.length, 'users');
        setUsers(response.data);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách người dùng');
      }
    } catch (err: any) {
      console.error('❌ Error fetching users:', err);
      setError(err.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone_number && user.phone_number.includes(searchTerm))
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.is_active === true);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => user.is_active === false);
      }
    }

    setFilteredUsers(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Calculate paginated users
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    setDialogMode('add');
    setFormData({
      email: '',
      full_name: '',
      phone_number: '',
      role: 'candidate',
      is_active: true
    });
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user: User) => {
    setDialogMode('edit');
    setFormData({
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number || '',
      role: user.role,
      company_id: user.company_id,
      is_active: user.is_active
    });
    setSelectedUser(user);
    setOpenDialog(true);
    console.log(user.id)
  };

  const handleViewUser = (user: User) => {
    setDialogMode('view');
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        setLoading(true);
        const response = await userService.deleteUser(userId);
        if (response.success) {
          console.log('✅ User deleted successfully');
          await fetchUsers(); // Refresh users list
        } else {
          throw new Error(response.message || 'Không thể xóa người dùng');
        }
      } catch (err: any) {
        console.error('❌ Error deleting user:', err);
        setError(err.message || 'Không thể xóa người dùng');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      const response = await userService.toggleUserStatus(userId);
      if (response.success) {
        console.log('✅ User status updated successfully');
        await fetchUsers();
      } else {
        throw new Error(response.message || 'Không thể cập nhật trạng thái người dùng');
      }
    } catch (err: any) {
      console.error('❌ Error updating user status:', err);
      setError(err.message || 'Không thể cập nhật trạng thái người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      setError(null);

      if (dialogMode === 'add') {
        if (!formData.password) {
          setError('Vui lòng nhập mật khẩu');
          return;
        }
        const userData = {
          email: formData.email,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          role: formData.role,
          company_id: formData.company_id,
          is_active: formData.is_active,
          password_hash: formData.password
        }
        console.log("New User Data: ", userData)
        const response = await userService.createUser(userData);
        if (response.success) {
          console.log('✅ User created successfully');
          await fetchUsers();
          setOpenDialog(false);
        } else {
          throw new Error(response.message || 'Không thể tạo người dùng');
        }
      } else if (dialogMode === 'edit' && selectedUser) {
        console.log("Current User: ", selectedUser)
        const response = await userService.updateUser(selectedUser.id, formData);
        console.log(selectedUser.id)
        if (response.success) {
          console.log('✅ User updated successfully');
          await fetchUsers();
          setOpenDialog(false);
        } else {
          throw new Error(response.message || 'Không thể cập nhật người dùng');
        }
      }
    } catch (err: any) {
      console.error('❌ Error saving user:', err);
      setError(err.message || 'Không thể lưu thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Quản lý người dùng
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            disabled={loading}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Thêm người dùng
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && (
        <>
          {/* Statistics Cards */}
          <UserStatsCards users={users} />

          {/* Search and Filters */}
          <UserSearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredCount={filteredUsers.length}
            totalCount={users.length}
          />

          {/* Users Table */}
          <UserTable
            users={paginatedUsers}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleUserStatus}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalCount={filteredUsers.length}
            pageSize={pageSize}
          />

          {/* User Dialog */}
          <UserDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            mode={dialogMode}
            user={selectedUser}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveUser}
          />
        </>
      )}
    </Container>
  );
};

export default Users;