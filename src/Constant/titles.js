import { ROUTES } from "../Constant/routes.js";
export const getPageTitle = (pathname, params, venueData) => {
  const searchParams = new URLSearchParams(window.location.search);
  const name = searchParams.get("name");
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
      return `Edit Venue - ${venueData?.name || "Venue"}`;
    }

    if (pathname.includes("/add-court")) {
      return "Add Court";
    }
    // match the court and set the page title with the court name
    if (pathname.includes("/edit-court")) {
      return `Edit Court-${name}`;
    }
    return STATIC_TITLES[pathname] || "Dashboard";
  };

  return getDynamicTitle();
};
