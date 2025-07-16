import { checkRoles } from "../utils/roleCheck";
import { ADMIN_ROLES } from "../Constant/Roles";
import axiosInstance from "../Services/axios";

export const getAllEventBookings = async (tournamentId, eventId) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const endpoint = checkRoles(ADMIN_ROLES) 
  ? `/users/admin/tournaments/${tournamentId}/categories/${eventId}/bookings?categoryStatus=ACTIVE`
  : `/users/tournament-owner/tournaments/${tournamentId}/categories/${eventId}/bookings?categoryStatus=ACTIVE`;

  try {
    const response = await axiosInstance.get(`${baseURL}${endpoint}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
  }
}

export const swapEventBooking = async ({ tournamentId, categoryId, bookingId, bookingData, replace }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const endpoint = checkRoles(ADMIN_ROLES)
    ? `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/bookings/swap`
    : `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/bookings/swap`;

  try {
    const response = await axiosInstance.post(`${baseURL}${endpoint}`, {
      tournamentId,
      categoryId,
      bookingId,
      bookingData,
      replace,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Failed to swap booking';
    throw new Error(errorMsg);
  }
};

export const searchEventBookings = async (tournamentId, categoryId, search) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const endpoint = checkRoles(ADMIN_ROLES)
    ? `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/bookings/search?search=${encodeURIComponent(search)}&categoryStatus=ACTIVE`
    : `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/bookings/search?search=${encodeURIComponent(search)}&categoryStatus=ACTIVE`;

  try {
    const response = await axiosInstance.get(`${baseURL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search bookings');
  }
};
