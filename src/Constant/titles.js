import { ROUTES } from "../Constant/routes.js";

export const getPageTitle = (pathname, params, venueData) => {
  const STATIC_TITLES = {
    [ROUTES.HOME]: "Home",
    [ROUTES.VENUES.LIST]: "Venues",
    [ROUTES.VENUES.NEW]: "Add New Venue",
    [ROUTES.TOURNAMENTS]: "Tournaments",
  };

  const getDynamicTitle = () => {
    if (pathname.match(/^\/venues\/\d+$/)) {
      return venueData?.name || "Venue Details";
    }

    if (pathname.includes("/add-Court")) {
      return "Add Court";
    }

    return STATIC_TITLES[pathname] || "Dashboard";
  };

  return getDynamicTitle();
};
