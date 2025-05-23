import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAdmin, getAdminById, getAllAdmins, updateAdmin } from "../api/Admin";

export const useGetAllAdmins = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: ['admins', page, limit],
    queryFn: () => getAllAdmins(page, limit),
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation ({
    mutationFn: (adminObj) => createAdmin(adminObj),
    onSuccess: (data) => {
      // Invalidate and refetch the admins list
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
    onError: () => {
      console.error('Error creating admin');
    }
  });
};

export const useGetAdminById = (id) => {
  return useQuery({
    queryKey: ['admin', id],
    queryFn: () => getAdminById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

export const useUpdateAdmin = (id) => {
  const queryClient = useQueryClient();
  
  return useMutation ({
    mutationFn: (adminObj) => updateAdmin(id, adminObj),
    onSuccess: (data) => {
      // Invalidate and refetch the admins list and the specific admin
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin', id] });
    },
    onError: () => {
      console.error('Error updating admin');
    }
  });
};