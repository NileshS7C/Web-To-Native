import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEvent, getAllEvents, searchEvents, updateEvent, getAllEventOwners, getSingleEventOwner, getEventById, verifyEvent, archiveEvent, publishEvent, getEventBookings, addEventPlayer, searchPlayers, cancelEventBooking, refundEventBooking, getEventOwners, createEventOwner, getEventOwnerById, updateEventOwner, changeEventStatus, exportEventBookings } from "../api/SocialEvents";
import { checkRoles } from "../utils/roleCheck";
import { ADMIN_ROLES, EVENT_OWNER_ROLES } from "../Constant/Roles";


export const useGetAllEvents = (page = 1, limit = 10, id, filters = {}, activeSearchTerm) => {
  return useQuery({
    queryKey: ["socialEvents", page, filters, activeSearchTerm],
    queryFn: () => getAllEvents(page, limit, id, filters, activeSearchTerm),
    enabled: true,
  });
};

export const useSearchEvents = ({ownerId, searchTitle, page = 1, limit = 10 , filters = {}}) => {
  return useQuery({
    queryKey: ["searchEvents", ownerId, searchTitle, page, limit, filters],
    queryFn: () => searchEvents({ownerId, searchTitle, page, limit, filters}),
    enabled: !!ownerId && !!searchTitle, // only run when both are available
  });
};

  export const useCreateEvent = () => {
    return useMutation({
      mutationFn: (payload) => createEvent(payload),
      onSuccess: (data) => {
        console.log("🚀 ~ useCreateEvent ~ data:", data);
      },
    });
  };

  export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (payload) => updateEvent(payload),
      onSuccess: (data) => {
        console.log("🚀 ~ useUpdateEvent ~ data:", data);
        // Invalidate both event details and events list queries
        queryClient.invalidateQueries(['eventDetails']);
        queryClient.invalidateQueries(['socialEvents']);
      },
    });
  };

// Hook for getting all event owners (Admin only)
export const useGetAllEventOwners = ({ currentPage = 1, limit = 100 } = {}) => {
  return useQuery({
    queryKey: ["eventOwners", currentPage, limit],
    queryFn: () => getAllEventOwners({ currentPage, limit }),
    enabled: checkRoles(ADMIN_ROLES), // Only run for admin users
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for getting single event owner details (Role-based)
export const useGetSingleEventOwner = () => {
  return useQuery({
    queryKey: ["singleEventOwner"],
    queryFn: () => getSingleEventOwner(),
    enabled: checkRoles(EVENT_OWNER_ROLES), // Only run for event owner users
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Combined hook that returns appropriate data based on user role
export const useEventOwnerData = ({ currentPage = 1, limit = 100 } = {}) => {
  const isAdmin = checkRoles(ADMIN_ROLES);
  const isEventOwner = checkRoles(EVENT_OWNER_ROLES);

  // Get all event owners for admin users
  const allEventOwnersQuery = useGetAllEventOwners({ currentPage, limit });

  // Get single event owner for event owner users
  const singleEventOwnerQuery = useGetSingleEventOwner();

  if (isAdmin) {
    return {
      eventOwners: allEventOwnersQuery.data?.owners || [],
      singleEventOwner: null,
      total: allEventOwnersQuery.data?.total || 0,
      isLoading: allEventOwnersQuery.isLoading,
      error: allEventOwnersQuery.error,
      isError: allEventOwnersQuery.isError,
      userRole: 'ADMIN'
    };
  } else if (isEventOwner) {
    return {
      eventOwners: [],
      singleEventOwner: singleEventOwnerQuery.data || null,
      total: 0,
      isLoading: singleEventOwnerQuery.isLoading,
      error: singleEventOwnerQuery.error,
      isError: singleEventOwnerQuery.isError,
      userRole: 'EVENT_OWNER'
    };
  } else {
    return {
      eventOwners: [],
      singleEventOwner: null,
      total: 0,
      isLoading: false,
      error: null,
      isError: false,
      userRole: null
    };
  }
};

// Hook for getting event details by ID
export const useGetEventById = (eventId, ownerId) => {
  return useQuery({
    queryKey: ["eventDetails", eventId, ownerId],
    queryFn: () => getEventById(eventId, ownerId),
    enabled: !!eventId && (checkRoles(ADMIN_ROLES) || (checkRoles(EVENT_OWNER_ROLES) && !!ownerId)),
    staleTime: 0, // Don't use stale data
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useVerifyEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, action, rejectionComments }) => 
      verifyEvent(eventId, action, rejectionComments),
    onSuccess: () => {
      queryClient.invalidateQueries(['eventDetails']);
    },
  });
};

export const useArchiveEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, ownerId }) => archiveEvent(eventId, ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries(['eventDetails']);
    },
  });
};

export const usePublishEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, ownerId }) => publishEvent(eventId, ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries(['eventDetails']);
    },
  });
};

export const useGetEventBookings = (eventId) => {
  return useQuery({
    queryKey: ["eventBookings", eventId],
    queryFn: () => getEventBookings(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddEventPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => addEventPlayer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['eventBookings']);
    },
  });
};

export const useSearchPlayers = (searchQuery) => {
  return useQuery({
    queryKey: ["searchPlayers", searchQuery],
    queryFn: () => searchPlayers(searchQuery),
    enabled: !!searchQuery && searchQuery.length >= 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCancelEventBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, ownerId, cancelReason }) => 
      cancelEventBooking(bookingId, ownerId, cancelReason),
    onSuccess: () => {
      queryClient.invalidateQueries(['eventBookings']);
    },
  });
};

export const useRefundEventBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, ownerId }) => refundEventBooking(bookingId, ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries(['eventBookings']);
    },
  });
};

export const useGetEventOwners = ({ page = 1, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ["eventOwners", page, limit],
    queryFn: () => getEventOwners({ page, limit }),
    enabled: checkRoles(ADMIN_ROLES), // Only run for admin users
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateEventOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createEventOwner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['eventOwners']);
    },
  });
};

export const useGetEventOwnerById = (ownerId) => {
  return useQuery({
    queryKey: ["eventOwner", ownerId],
    queryFn: () => getEventOwnerById(ownerId),
    enabled: !!ownerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateEventOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ownerId, payload }) => updateEventOwner(ownerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['eventOwners']);
    },
  });
};

export const useChangeEventStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, ownerId, status }) => changeEventStatus(eventId, ownerId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['eventDetails']);
    },
  });
};

export const useExportEventBookings = () => {
  return useMutation({
    mutationFn: ({ eventId, ownerId }) => exportEventBookings(eventId, ownerId),
  });
};

