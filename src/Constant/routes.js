import { checkRoles } from "../utils/roleCheck";
import { ADMIN_ROLES,TOURNAMENT_OWNER_ROLES } from "./Roles";
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

export const API_END_POINTS = {
  tournament: {
    POST: {
      tournamentCreation: () => {
        if (checkRoles(ADMIN_ROLES)) {
          return "/users/admin/tournaments";
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return "/users/tournament-owner/tournaments";
        } else return null;
      },

      changeTournamentStatus: (tour_Id, ownerId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tour_Id}/change-status`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tour_Id}/owner/${ownerId}/change-status`;
        } else return null;
      },

      verifyTournament: (tournamentId) => {
        return `/users/admin/tournaments/${tournamentId}/verify`;
      },

      createBooking: (ownerId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/bookings/owner/${ownerId}`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/bookings/owner/${ownerId}`;
        } else return null;
      },
      cancelAndRefundBooking: ( ownerId, bookingId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/bookings/${bookingId}/owner/${ownerId}`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/bookings/${bookingId}/owner/${ownerId}`;
        }
        return null;
      },

      createCategory: (tournamentId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories`;
        } else return null;
      },

      updateCategory: (tournamentId, categoryId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}`;
        } else null;
      },

      deleteCategory: (tournamentId, categoryId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/delete`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/delete`;
        } else return null;
      },

      createFixture: (tournamentId, categoryId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        } else return null;
      },
      createHybridFixture: (tournamentId, categoryId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid`;
        } else return null;
      },
      updateHybridFixture: (tournamentId, categoryId, fixtureId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/${fixtureId}`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/${fixtureId}`;
        } else return null;
      },
      deleteHybridFixture: (tournamentId, categoryId, fixtureId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/${fixtureId}/delete`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/${fixtureId}/delete`;
        } else return null;
      },
      publishFixture: (tournamentId, categoryId, fixtureId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/publish`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/publish`;
        } else return null;
      },
      unPublishFixture: (tournamentId, categoryId, fixtureId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/unpublish`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)){
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/unpublish`;
        }
      },
      updatePlayerSeeding: (
        tournamentId,
        categoryId,
        fixtureId,
        stageId
      ) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stages/${stageId}/seeding`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stages/${stageId}/seeding`;
        } else return null;
      },
      fixtureMatchSetUpdated: (tournamentId, categoryId, fixtureId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match-set`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match-set`;
        } else return null;
      },
      fixtureMatchUpdate: (tournamentId, categoryId, fixtureId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-match`;
        } else return null;
      },

      fixtureMatchSetCount: (tournamentId, categoryId, fixtureId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/set-match-count`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/set-match-count`;
        } else return null;
      },
    },

    GET: {
      getAllVenues: () => {
        if (checkRoles(ADMIN_ROLES)) {
          return "/users/admin/venues";
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return "/users/tournament-owner/venues/all-venues";
        } else return null;
      },
      getAllTouranaments: (ownerId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/owner/${ownerId}`;
        } else return null;

      },

      searchTournaments: (ownerId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/search`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/owner/${ownerId}/search`;
        } else return null;
      },
      tournamentById: (tournamentId, ownerId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/owner/${ownerId}`;
        } else return null;
      },

      getAllTags: () => {
        if (checkRoles(ADMIN_ROLES)) {
          return "/users/admin/tournaments/tournament-tags";
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return "/users/tournament-owner/tournaments/tournament-tags";
        } else return null;
      },

      getBookingByCategory: (tournamentId, categoryId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/bookings`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/bookings`;
        } else return null;
      },
      searchBookingByCategory: (tournamentId, categoryId, search) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/bookings/search?search=${search}`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/bookings/search?search=${search}`;
        } else return null;
      },
      getBookingById: (bookingId, ownerId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/bookings/${bookingId}/owner/${ownerId}/bookings`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/bookings/${bookingId}/owner/${ownerId}`;
        } else return null;
      },
      getBookingByOwner: (ownerId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/bookings/owner/${ownerId}`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/bookings/owner/${ownerId}`;
        } else return null;
      },

      getCategoryById: (tournamentId, categoryId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}`;
        } else return null;
      },

      getAllCategoriesByTournament: (tournamentId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories`;
        } else return null;
      },

      getFixtureByTour_IdAndCategoryId: (tournamentId, categoryId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;
        } else return null;
      },

      getFixtureById: (tournamentId, categoryId, fixtureId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}`;
        } else return null;
      },
      getMatches: (tournamentId, categoryId, fixtureId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/matches`;
        } else {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/matches`;
        }
      },
      getMatchStandings: (
        tournamentId,
        categoryId,
        fixtureId,
        stageId
      ) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stage/${stageId}/standings`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stage/${stageId}/standings`;
        } else return null;
      },
      downloadSheetOfPlayers: (tournamentId, ownerId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/export-bookings`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/owner/${ownerId}/export-bookings`;
        } else {
          return null;
        }
      },
      fixtureDEFinal: (tournamentId, categoryId, fixtureId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/de-finals`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/de-finals`;
        } else return null;
      },
    },

    PATCH: {
      fixtureMatchSetCountUpdate: (
        tournamentId,
        categoryId,
        fixtureId
      ) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/set-match-count`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/set-match-count`;
        } else return null;
      },
    },

    DELETE: {
      deleteCategory: (tournamentId, categoryId) => {
        if (checkRoles(ADMIN_ROLES)) {
          return `/users/admin/tournaments/${tournamentId}/categories/${categoryId}`;
        } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
          return `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}`;
        } else return null;
      },
    },

    PUT: {},
  },
  players: {
    GET: {
      getAllPlayers: () => {
        return "/users/admin/players";
      },
    },
  },
  profile: {
    GET: {
      getProfile: () => {
        return "/users/get-details";
      },
    },
  },
};

export const parentRoutes = ["Tournaments", "Venues", "Users"];
