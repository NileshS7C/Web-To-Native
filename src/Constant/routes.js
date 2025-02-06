export const ROUTES = {
  HOME: "/home",
  VENUES: {
    LIST: "/venues",
    NEW: "/venues/new",
    DETAILS: (id) => `/venues/${id}`,
    ADD_COURT: (id) => `/venues/${id}/courts/add-court`,
    EDIT_VENUE: (id) => `/venues/${id}/edit`,
    EDIT_COURT: (id) => `/venues/${id}/edit-court`,
  },
  TOURNAMENTS: "/tournaments",
};

export const backButtonRoutes = [
  {
    path: "/tournaments",
    children: ["/event"],
    id: "tournamentId",
  },

  {
    path: "/venues",
    children: ["/add-court", "/edit-court", "/edit"],
    id: "id",
  },
];

export const parentRoutes = ["Tournaments", "Venues", "Users"];
