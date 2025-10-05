// deceparated
import React from 'react';
import {Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, Typography, Box} from '@mui/material';
import { useSidebar } from '../contexts/SidebarContext';
import {useCreateUser, useUpdateUser} from '../hooks/useApi';
type AdminTableProps = {
    fields: string[];
    data: any[];
    loading: boolean;
    error: string | null;
    field_name: string[];
}
const AdminTable = ({fields, data, loading, error, field_name}: AdminTableProps) => {
    const { sidebarOpen, isMobile, drawerWidth } = useSidebar();
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();

    const handleEdit = (id: string) => {
        updateUser.updateUser(id, { full_name: "Updated Name" })
            .then(updatedUser => {
                console.log('User updated:', updatedUser);
            })
            .catch(err => {
                console.error('Update error:', err);
            });
    }

    const handleDelete = (id: number) => {
        console.log('Delete', id);
    }

    const getTableWidth = () => {
        const padding = 48; // padding from main content (24px * 2)
        
        if (isMobile) {
            return '100%';
        }
        
        if (sidebarOpen) {
            return `calc(100vw - ${drawerWidth}px - ${padding}px)`;
        } else {
            return `calc(100vw - ${padding}px)`;
        }
    };

    // Get responsive table container style
    const getTableContainerStyle = () => ({
        width: getTableWidth(),
        transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms', // Match MUI transition
        overflow: 'auto'
    });

    console.log('Sidebar open:', sidebarOpen, 'Is mobile:', isMobile, 'Table width:', getTableWidth());
    return (
        <TableContainer component={Paper} sx={getTableContainerStyle()}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress /> 
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : (
                <Table sx={{minWidth: 650}} aria-label="admin table">
                    <TableHead>
                        <TableRow>
                            {fields.map((field, index) => (
                                <TableCell key={field} sx={{fontWeight: 'bold', backgroundColor: '#f5f5f5'}}>{field_name[index]}</TableCell>
                            ))}
                            <TableCell sx = {{backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                {fields.map((field) => (
                                    <TableCell key={field}>{row[field] === true ? '✔️' : row[field] === false ? '❌' : row[field] === null ? 'N/A' : row[field]}</TableCell>
                                ))}
                                <TableCell>
                                    <Button onClick={() => handleEdit(row.id)}>✎</Button>
                                    <Button onClick={() => handleDelete(row.id)}>🗑️</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    )
}

export default AdminTable;