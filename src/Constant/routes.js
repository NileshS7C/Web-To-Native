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

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];
const TOURNAMENT_OWNER_ROLES = ["TOURNAMENT_OWNER"];
export const API_END_POINTS = {
  tournament: {
    POST: {
      tournamentCreation: (type) => {
        if (ADMIN_ROLES.includes(type)) {
          return "/users/admin/tournaments";
        } else {
          return "/users/tournament-owner/tournaments";
        }
      },

      archiveTournament: (type, tour_Id, ownerId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tour_Id}/archive`;
        } else if (TOURNAMENT_OWNER_ROLES.includes(type)) {
          return `/users/tournament-owner/tournaments/${tour_Id}/owner/${ownerId}/archive`;
        } else return null;
      },

      verifyTournament: (tournamentId) => {
        return `/users/admin/tournaments/${tournamentId}/verify`;
      },

      createBooking: (type, ownerId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/bookings/owner/${ownerId}`;
        } else {
          return `/users/tournament-owner/bookings/owner/${ownerId}`;
        }
      },
      cancelAndRefundBooking: (type, ownerId, bookingId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/bookings/${bookingId}/owner/${ownerId}`;
        } else {
          return `/users/tournament-owner/bookings/${bookingId}/owner/${ownerId}`;
        }
      },

      createCategory: (type, tournamentId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories`;
        }
      },

      updateCategory: (type, tournamentId, categoryId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}`;
        }
      },

      deleteCategory: (type, tournamentId, categoryId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/delete`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/delete`;
        }
      },

      createFixture: (type, tournamentId, categoryId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        }
      },
      createHybridFixture: (type, tournamentId, categoryId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid`;
        }
      },
      updateHybridFixture: (type, tournamentId, categoryId,fixtureId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/${fixtureId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/${fixtureId}`;
        }
      },
      deleteHybridFixture: (type, tournamentId, categoryId,fixtureId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/${fixtureId}/delete`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/${fixtureId}/delete`;
        }
      },
      publishFixture: (type, tournamentId, categoryId, fixtureId) => {
        if (ADMIN_ROLES.includes(type)) {
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
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stages/${stageId}/seeding`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stages/${stageId}/seeding`;
        }
      },
      fixtureMatchSetUpdated: (type, tournamentId, categoryId, fixtureId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match-set`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match-set`;
        }
      },
      fixtureMatchUpdate: (type, tournamentId, categoryId, fixtureId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match`;
        }
      },

      fixtureMatchSetCount: (type, tournamentId, categoryId, fixtureId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/set-match-count`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/set-match-count`;
        }
      },
    },

    GET: {
      getAllVenues: (type) => {
        if (ADMIN_ROLES.includes(type)) {
          return "/users/admin/venues";
        } else {
          return "/users/tournament-owner/venues/all-venues";
        }
      },
      getAllTouranaments: (ownerId, type) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/`;
        } else {
          return `/users/tournament-owner/tournaments/owner/${ownerId}`;
        }
      },

      searchTournaments: (ownerId, type) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/search`;
        } else {
          return `/users/tournament-owner/tournaments/owner/${ownerId}/search`;
        }
      },
      tournamentById: (type, tournamentId, ownerId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/owner/${ownerId}`;
        }
      },

      getAllTags: (type) => {
        if (ADMIN_ROLES.includes(type)) {
          return "/users/admin/tournaments/tournament-tags";
        } else {
          return "/users/tournament-owner/tournaments/tournament-tags";
        }
      },

      getBookingByCategory: (type, tournamentId, categoryId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/bookings`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/bookings`;
        }
      },
      getBookingById: (type, bookingId, ownerId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/bookings/${bookingId}/owner/${ownerId}/bookings`;
        } else {
          return `/users/tournament-owner/bookings/${bookingId}/owner/${ownerId}`;
        }
      },
      getBookingByOwner: (type, ownerId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/bookings/owner/${ownerId}`;
        } else {
          return `/users/tournament-owner/bookings/owner/${ownerId}`;
        }
      },

      getCategoryById: (type, tournamentId, categoryId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}`;
        }
      },

      getAllCategoriesByTournament: (type, tournamentId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories`;
        }
      },

      getFixtureByTour_IdAndCategoryId: (type, tournamentId, categoryId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        }
      },

      getFixtureById: (type, tournamentId, categoryId, fixtureId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}`;
        }
      },

      getMatchStandings: (
        type,
        tournamentId,
        categoryId,
        fixtureId,
        stageId
      ) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stage/${stageId}/standings`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stage/${stageId}/standings`;
        }
      },
      downloadSheetOfPlayers: (tournamentId, ownerId, userRole) => {
        if (ADMIN_ROLES.includes(userRole)) {
          return `/users/admin/tournaments/${tournamentId}/export-bookings`;
        } else if (TOURNAMENT_OWNER_ROLES.includes(userRole)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/owner/${ownerId}/export-bookings`;
        } else {
          return null;
        }
      },
    },

    PATCH: {
      fixtureMatchSetCountUpdate: (
        type,
        tournamentId,
        categoryId,
        fixtureId
      ) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/set-match-count`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/set-match-count`;
        }
      },
    },

    DELETE: {
      deleteCategory: (type, tournamentId, categoryId) => {
        if (ADMIN_ROLES.includes(type)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}`;
        }
      },
    },

    PUT: {},
  },
  players: {
    GET: {
      getAllPlayers: () => {
        return "api/users/admin/players";
      },
    },
  },
};

export const parentRoutes = ["Tournaments", "Venues", "Users"];
