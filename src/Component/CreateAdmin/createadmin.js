import axios from "axios";

// Get all admins
export const getAllAdmins = async (page = 1, limit = 50) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  try {
    const response = await axios.get(`${baseURL}/users/admin/admins?page=${page}&limit=${limit}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new admin
export const createAdmin = async (adminData) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  try {
    const response = await axios.post(`${baseURL}/users/admin/admins`, adminData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update admin
export const updateAdmin = async (adminId, adminData) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  try {
    const response = await axios.post(`${baseURL}/users/admin/admins/${adminId}`, adminData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};