import axiosInstance from "../Services/axios";

export const getAllAdmins = async (page = 1, limit = 50) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  try {
    const response = await axiosInstance.get(`${baseURL}/users/admin/admins?page=${page}&limit=${limit}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export const createAdmin = async (adminObj) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  try {
    const response = await axiosInstance.post(`${baseURL}/users/admin/admins`, adminObj ,{
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data?.data;
  } catch (error) {
    throw error;
  }
}

export const getAdminById = async (id) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  try {
    const response = await axiosInstance.get(`${baseURL}/users/admin/admins/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data?.data;
  } catch (error) {
    throw error;
  }
}

export const updateAdmin = async (id, adminObj) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  try {
    const response = await axiosInstance.post(`${baseURL}/users/admin/admins/${id}`, adminObj ,{
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data?.data;
  } catch (error) {
    throw error;
  }
}