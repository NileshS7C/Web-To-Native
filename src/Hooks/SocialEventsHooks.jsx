import { useMutation, useQuery } from "@tanstack/react-query";
import { createEvent, getAllEvents, searchEvents } from "../api/SocialEvents"

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