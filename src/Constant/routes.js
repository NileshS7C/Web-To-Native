export const ROUTES = {
  HOME: "/home",
  VENUES: {
    LIST: "/venues",
    NEW: "/venues/new",
    DETAILS: (id) => `/venues/${id}`,
    ADD_COURT: (id) => `/venues/${id}/courts/add-court`,
  },
  TOURNAMENTS: "/tournaments",
};
