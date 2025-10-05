import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import {TextField, Button, Box, Typography} from '@mui/material';
import AdminTable from '../../components/AdminTable';
import { useResumes } from '../../hooks/useApi';
const Resumes = () => {
    const { data: resumes, loading, error } = useResumes();
    const fields = ['id', 'file_name', 'file_url', 'user_id', 'is_default', 'uploaded_at'];
    const field_name = ['ID', 'File Name', 'File URL', 'User ID', 'Is Default', 'Uploaded At'];
    const data = resumes || [];
    console.log(data)

    return (
        <>
            <AdminLayout>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
                </Box>
                <Box mb={2}>
                    <TextField label="Search Resumes" variant="outlined" fullWidth />
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4">Resumes</Typography>
                        <Button variant="contained" color="primary">Add Resumes</Button>
                    </Box>
                </Box>
                <AdminTable 
                    fields={fields}
                    data={data}         
                    loading={loading}
                    error={error}
                    field_name={field_name}
                />
            </AdminLayout>            
        </>
    )
}

export default Resumes;