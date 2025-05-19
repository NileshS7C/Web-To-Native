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
      return `Venue Details - ${venueData?.venue?.name}`;
    }

    if (pathname.match(/^\/venues\/\w+\/edit$/)) {
      // Match for venue edit page: /venues/:id/edit
      return `Edit Venue - ${venueData?.venue?.name || "Venue"}`;
    }
    if (pathname === "/cms/homepage/explore") {
      return "Explore Picklebay";
    }
    if (pathname === "/cms/homepage/why-choose-picklebay") {
      return "Why Choose Picklebay";
    }
    if (pathname === "/cms/homepage/journal") {
      return "The Picklebay Journal";
    }
    if (pathname === "/cms/homepage/news-&-update") {
      return "News & Update";
    }
    if (pathname === "/cms/homepage/faqs") {
      return "Frequently asked questions";
    }
    if (pathname === "/cms/homepage/destination-dink") {
      return "Why Choose Picklebay";
    }
    if (pathname === "/cms/homepage/build-courts") {
      return "Build Courts";
    }
    if (pathname === "/cms/homepage/featured-tournaments") {
      return "Featured Tournaments";
    }
    if (pathname === "/cms/homepage/featured-week") {
      return "Featured This Week";
    }
    if (pathname === "/cms/homepage/featured-venues") {
      return "Featured This Week";
    }
    if (pathname.startsWith("/cms/blogs/blog-posts")) {
      return "Blog Posts";
    }
    if (pathname === "/cms/about-us-page/meet-the-team") {
      return "Meet The Team";
    }
    if (pathname === "/cms/about-us-page/key-section") {
      return "Key Section";
    }
    if (pathname === "/cms/about-us-page/picklebay-in-india") {
      return "Picklebay In India";
    }
    if (pathname === "/cms/about-us-page/picklebay-in-news") {
      return "Picklebay In News";
    }
    if (pathname === "/cms/about-us-page/bottom-section") {
      return "Bottom Section";
    }
    if (pathname === "/cms/tourism-page/package-section") {
      return "Package Section";
    }
    if (pathname === "/cms/tourism-page/instagram") {
      return "Instagram";
    }
    if (pathname === "/cms/tourism-page/top-banner") {
      return "Top Banner";
    }
    if (pathname === "/cms/about-us-page/founder-section") {
      return "Founder Section";
    }
    if (pathname === "/cms/about-us-page/top-section") {
      return "Top Section";
    }
    if (pathname === "/cms/about-us-page/how-it-works") {
      return "How It Works";
    }
    if (pathname.startsWith("/cms/static-pages")) {
      return "Static Pages";
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
      return `${venueData?.tournament?.tournamentName || ""}  > ${venueData?.category?.categoryName}`;
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
    if (pathname.includes("/cms/about-us-page/mission-and-vision")) {
      return "Mission & Vision";
    }
    return STATIC_TITLES[pathname] || "DASHBOARD";
  };

  return getDynamicTitle();
};
