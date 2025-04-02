import { ROUTES } from "./routes.js";

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
    if (pathname.includes("/venues/new")) {
      return "Add Venue";
    }
    if (pathname.match(/^\/venues\/[\w-]+$/)) {
      return venueData?.name || "Venue Details";
    }

    if (pathname.match(/^\/venues\/\w+\/edit$/)) {
      // Match for venue edit page: /venues/:id/edit
      return `Edit Venue - ${venueData?.venue?.name || "Venue"}`;
    }

    if (pathname.includes("/add-court")) {
      return "Add Court";
    }

    if (pathname.includes("/court-bookings")) {
      return "Court Bookings";
    }

    if (pathname.includes("/tournament-bookings")) {
      return "Tournament Bookings";
    }

    if (pathname.includes("/tournament-organisers")) {
      return "Tournament Organisers";
    }

    if (pathname.includes("/users")) {
      return "Users";
    }

    if (pathname.includes("/dashboard")) {
      return "Dashboard";
    }

    if (pathname.includes("/venue-organisers")) {
      return "Venue Organisers";
    }
    if (pathname.includes("/edit-court")) {
      // match the court and set the page title with the court name
      return `Edit Court-${name}`;
    }

    if (pathname.match(/^\/tournaments\/\w+\/add$/)) {
      return `${venueData?.tournament?.tournamentName || ""}`;
    }

    if (pathname.match(/^\/tournaments\/add$/)) {
      return "Add Tournament";
    }

    if (pathname.match(/^\/tournaments\/\w+$/)) {
      return `${venueData?.tournament?.tournamentName || ""}`;
    }

    //for matching /tournaments/:id/event/:id

    if (pathname.match(/^\/tournaments\/\w+\/event\/\w+$/)) {
      return `${venueData?.tournament?.tournamentName || ""}  > ${
        venueData?.category?.categoryName
      }`;
    }

    if (pathname.includes("profile")) {
      return "User Details";
    }
    if (pathname.includes("images")) {
      return "Uploaded Images";
    }
    if (pathname.includes("players")) {
      return "Players";
    }
    if (pathname == "/coupons") {
      return "Coupons";
    }
    if (pathname.includes("/coupons/")) {
      return "Coupon Detail";
    }
    if (pathname.includes("/cms/about-us-page/banner-section")) {
      return "Banner Section";
    }

    return STATIC_TITLES[pathname] || "DASHBOARD";
  };

  return getDynamicTitle();
};
