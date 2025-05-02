import {
  downArrow,
  tournamentIcon,
  profileIcon,
  eventsIcon,
  teamIcon,
  venueIcon,
  overviewIcon,
  bookingIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
  cmsIcon,
  uploadedImageIcon,
  PlayerIcon,
  couponsIcon,
} from "../Assests";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const menus = [
  { name: "Overview", icon: overviewIcon },
  { name: "Tournaments", icon: tournamentIcon },
  { name: "Bookings", icon: bookingIcon },
  { name: "Venues", icon: venueIcon },
  {
    name: "Team/Staff",
    icon: teamIcon,
    dropdown: true,
    dropdownIcon: downArrow,
  },
  { name: "Profile", icon: profileIcon },
];

export const ADMIN_NAVIGATION = [
  { name: "Dashboard", icon: overviewIcon, path: "" },
  {
    name: "Tournament Organisers",
    icon: tournamentIcon,
    path: "tournament-organisers",
  },
  { name: "Tournaments", icon: tournamentIcon, path: "tournaments" },
  { name: "Venues", icon: venueIcon, path: "venues" },

  { name: "Uploaded Images", icon: uploadedImageIcon, path: "images" },

  { name: "Players", icon: PlayerIcon, path: "players" },
  { name: "Coupons", icon: couponsIcon, path: "coupons" },

  // { name: "User", icon: profileIcon, path: "users" },
  {
    name: "CMS",
    icon: cmsIcon,
    children: [
      {
        name: "Homepage",
        children: [
          { name: "Explore" },
          { name: "Featured Tournaments" },
          { name: "Featured Week" },
          { name: "Featured Venues" },
          { name: "Why Choose Picklebay" },
          { name: "Destination Dink" },
          { name: "Build Courts" },
          { name: "Journal" },
          { name: "News & Update" },
          { name: "FAQS" },
        ],
      },
      {
        name: "About Us Page",
        children: [
          { name: "Top section" },
          { name: "Mission and vision" },
          { name: "Banner section" },
          { name: "How it works" },
          { name: "Founder section" },
          { name: "Meet the team" },
          { name: "Key section" },
          { name: "Picklebay in India" },
          { name: "Picklebay in news" },
          { name: "Bottom section" },
        ],
      },
      {
        name: "Blogs",
        children: [{ name: "Blog Posts" }],
      },
      {
        name: "Static Pages",
        children: [
          { name: "Help & Faqs" },
          { name: "Terms & Condition" },
          { name: "Refunds & Cancellation" },
          { name: "Privacy Policy" },
          { name: "Picklebay Guidelines" },
        ],
      },
      {
        name: "Tourism Page",
        children: [
          { name: "Top Banner" },
          { name: "Package Section" },
          { name: "Instagram" },
          { name: "Media Gallery" },
        ],
      },
    ],
  },
];

export const TOURNAMENT_OWNER_NAVIGATION = [
  { name: "Dashboard", icon: overviewIcon, path: "" },
  { name: "Tournaments", icon: tournamentIcon, path: "tournaments" },
  { name: "Profile", icon: profileIcon, path: "profile" },
];

export const VENUE_OWNER_NAVIGATION = [
  { name: "Dashboard", icon: overviewIcon, path: "" },
  { name: "Venues", icon: venueIcon, path: "venues" },
];

export const ActionButtonGroup = [
  { name: "Edit", icon: EditIcon, action: "edit" },
  { name: "Delete", icon: DeleteIcon, action: "delete" },
  { name: "View", icon: ViewIcon, action: "view" },
];

export const TournamentOrganiserActionButtons = [
  { name: "Edit", icon: EditIcon, action: "edit" },
];

export const rowsInOnePage = 10;

export const uploadedImageLimit = 20;

export const venueImageSize = 5 * 1024 * 1024; //5 mb


export const packageImageSize = 5 * 1024 * 1024; //5 mb
export const TournamentOragniserModalTitle = "Tournament Organiser Creation Form";

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const phoneRegex = /^\d{10}$/;
export const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const courtImageSize = 500 * 1024;
export const notHaveBackButton = [
  "Tournaments",
  "Venues",
  "Bookings",
  "Court Bookings",
  "Tournament Bookings",
  "Venue Organisers",
  "Tournament Organisers",

  "Users",
  "DASHBOARD",
  "User Details",
  "Explore Picklebay",
  "Featured Tournaments",
  "Featured This Week",
  "Featured Venues",
  "Why Choose Picklebay",
  "Build Courts",
  "The Picklebay Journal",
  "News & Update",
  "Uploaded Images",

  "Players",
  "Coupons",
  "Banner Section",
  "Mission & Vision",
];

export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "TOURNAMENT_OWNER",
  "VENUE_OWNER",
];
