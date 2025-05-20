import { useMutation, useQuery } from '@tanstack/react-query';
import { createAdmin, getAllAdmins, updateAdmin } from './createadmin';

export const useGetAllAdmins = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: ['admins', page, limit],
    queryFn: () => getAllAdmins(page, limit),
  });
};

export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: (adminData) => createAdmin(adminData),
    onSuccess: () => {
      console.log('Admin created successfully');
    },
    onError: (error) => {
      console.error('Error creating admin:', error);
    },
  });
};

export const useUpdateAdmin = () => {
  return useMutation({
    mutationFn: ({ adminId, adminData }) => updateAdmin(adminId, adminData),
    onSuccess: () => {
      console.log('Admin updated successfully');
    },
    onError: (error) => {
      console.error('Error updating admin:', error);
    },
  });
};