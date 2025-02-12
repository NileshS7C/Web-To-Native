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

const ADMINROLES = ["SUPER_ADMIN", "ADMIN"];

export const API_END_POINTS = {
  tournament: {
    POST: {
      tournamentCreation: (type) => {
        if (ADMINROLES.includes(type)) {
          return "/users/admin/tournaments";
        } else {
          return "/users/tournament-owner/tournaments";
        }
      },

      verifyTournament: (tournamentId) => {
        return `/users/admin/tournaments/${tournamentId}/verify`;
      },

      createBooking: (type, ownerId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/bookings/owner/${ownerId}`;
        } else {
          return `/users/tournament-owner/bookings/owner/${ownerId}`;
        }
      },
      cancelAndRefundBooking: (type, ownerId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/bookings/owner/${ownerId}`;
        } else {
          return `/users/tournament-owner/bookings/owner/${ownerId}`;
        }
      },

      createCategory: (type, tournamentId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories`;
        }
      },

      createFixture: (type, tournamentId, categoryId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        }
      },
      publishFixture: (type, tournamentId, categoryId, fixtureId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/publish`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/publish`;
        }
      },
      updatePlayerSeeding: (
        type,
        tournamentId,
        categoryId,
        fixtureId,
        stageId
      ) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stages/${stageId}/seeding`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stages/${stageId}/seeding`;
        }
      },
      fixtureMatchSetUpdated: (type, tournamentId, categoryId, fixtureId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match-set`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match-set`;
        }
      },
      fixtureMatchUpdate: (type, tournamentId, categoryId, fixtureId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match`;
        }
      },
    },

    GET: {
      getAllVenues: (type) => {
        if (ADMINROLES.includes(type)) {
          return "/users/admin/venues";
        } else {
          return "/users/tournament-owner/venues/all-venues";
        }
      },
      getAllTouranaments: (ownerId, type) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/`;
        } else {
          return `/users/tournament-owner/tournaments/owner/${ownerId}`;
        }
      },
      tournamentById: (type, tournamentId, ownerId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/owner/${ownerId}`;
        }
      },

      getAllTags: (type) => {
        if (ADMINROLES.includes(type)) {
          return "/users/admin/tournaments/tournament-tags";
        } else {
          return "users/tournament-owner/tournaments/tournament-tags";
        }
      },

      getBookingByCategory: (type, tournamentId, categoryId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/bookings`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/bookings`;
        }
      },
      getBookingById: (type, bookingId, ownerId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/bookings/${bookingId}/owner/${ownerId}/bookings`;
        } else {
          return `/users/tournament-owner/bookings/${bookingId}/owner/${ownerId}`;
        }
      },
      getBookingByOwner: (type, ownerId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/bookings/owner/${ownerId}`;
        } else {
          return `/users/tournament-owner/bookings/owner/${ownerId}`;
        }
      },

      getCategoryById: (type, tournamentId, categoryId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}`;
        }
      },

      getAllCategoriesByTournament: (type, tournamentId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories`;
        }
      },

      getFixtureByTour_IdAndCategoryId: (type, tournamentId, categoryId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        }
      },

      getFixtureById: (type, tournamentId, categoryId, fixtureId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}`;
        }
      },
    },

    PATCH: {
      updateCategory: (type, tournamentId, categoryId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}`;
        }
      },
      fixtureMatchSetCountUpdate: (
        type,
        tournamentId,
        categoryId,
        fixtureId
      ) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/set-match-count`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/set-match-count`;
        }
      },
    },

    DELETE: {
      deleteCategory: (type, tournamentId, categoryId) => {
        if (ADMINROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}`;
        }
      },
    },

    PUT: {},
  },
};

export const parentRoutes = ["Tournaments", "Venues", "Users"];
