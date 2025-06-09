import { useMutation, useQuery } from "@tanstack/react-query";
import { createEvent, getAllEvents, searchEvents, updateEvent, getAllEventOwners, getSingleEventOwner } from "../api/SocialEvents";
import { checkRoles } from "../utils/roleCheck";
import { ADMIN_ROLES, EVENT_OWNER_ROLES } from "../Constant/Roles";

export const useGetAllEvents = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["socialEvents", page],
    queryFn: () => getAllEvents(page, limit),
    enabled: true,
  })
}

export const useSearchEvents = ({ownerId, searchTitle}) => {
  // console.log(`🚀 || SocialEventsHooks.jsx:13 || useSearchEvents || searchTitle:`, searchTitle);
  // console.log(`🚀 || SocialEventsHooks.jsx:13 || useSearchEvents || ownerId:`, ownerId);
  return useQuery({
    queryKey: ["searchEvents", ownerId, searchTitle],
    queryFn: () => searchEvents({ownerId, searchTitle}),
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
    return useMutation({
      mutationFn: (payload) => updateEvent(payload),
      onSuccess: (data) => {
        console.log("🚀 ~ useUpdateEvent ~ data:", data);
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

