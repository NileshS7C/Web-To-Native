import { checkRoles } from "../utils/roleCheck";
import { ADMIN_ROLES } from "../Constant/Roles";

export const getAllEventBookings = async (tournamentId, eventId) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const endpoint = checkRoles(ADMIN_ROLES) 
  ? `/users/admin/tournaments/${tournamentId}/categories/${eventId}/bookings?categoryStatus=ACTIVE`
  : `/users/tournament-owner/tournaments/${tournamentId}/categories/${eventId}/bookings?categoryStatus=ACTIVE`;

  const response = await fetch(`${baseURL}${endpoint}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  const data = await response.json();
  return data;
}

export const swapEventBooking = async ({ tournamentId, categoryId, bookingId, bookingData, replace }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const endpoint = checkRoles(ADMIN_ROLES)
    ? `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/bookings/swap`
    : `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/bookings/swap`;

  const response = await fetch(`${baseURL}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tournamentId,
      categoryId,
      bookingId,
      bookingData,
      replace,
    }),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to swap booking';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch (e) {
      // ignore JSON parse error, use default message
    }
    throw new Error(errorMsg);
  }
  return await response.json();
};
