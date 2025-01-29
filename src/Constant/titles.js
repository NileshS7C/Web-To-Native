import { ROUTES } from "./routes.js";

export const getPageTitle = (pathname, params, venueData) => {
  const STATIC_TITLES = {
    [ROUTES.HOME]: "Home",
    [ROUTES.VENUES.LIST]: "Venues",
    [ROUTES.VENUES.NEW]: "Add New Venue",
    [ROUTES.TOURNAMENTS]: "Tournaments",
  };

  const getDynamicTitle = () => {
    if (pathname.match(/^\/venues\/[\w-]+$/)) {
      return venueData?.name || "Venue Details";
    }

    // Match for venue edit page: /venues/:id/edit
    if (pathname.match(/^\/venues\/\w+\/edit$/)) {
      return `Edit Venue - ${venueData?.venue?.name || "Venue"}`;
    }

    if (pathname.includes("/add-Court")) {
      return "Add Court";
    }

    if (pathname.match(/^\/tournaments\/\w+\/edit$/)) {
      return `Edit Tournament - ${venueData?.tournament?.tournamentName || ""}`;
    }

    if (
      pathname.match(/^\/tournaments\/\w+\/add$/) ||
      pathname.match(/^\/tournaments\/add$/)
    ) {
      return "Add Tournament";
    }

    //for matching /tournaments/:id/event/:id

    if (pathname.match(/^\/tournaments\/\w+\/event\/\w+$/)) {
      return `${venueData?.tournament?.tournamentName || ""}  >`;
    }

    return STATIC_TITLES[pathname] || "Dashboard";
  };

  return getDynamicTitle();
};
