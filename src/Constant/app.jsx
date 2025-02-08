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
} from "../Assests";

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

  { name: "DashBoard", icon: overviewIcon, path: "" },
  {
    name: "Tournament Organiser",
    icon: tournamentIcon,
    path: "tournament-organisers",
  },
  { name: "Venue Organisers", icon: eventsIcon, path: "venue-organisers" },
  {
    name: "Tournament Bookings",
    icon: bookingIcon,
    path: "tournament-bookings",
  },
  { name: "Court Bookings", icon: bookingIcon, path: "court-bookings" },
  { name: "Tournaments", icon: tournamentIcon, path: "tournaments" },
  { name: "Venues", icon: venueIcon, path: "venues" },
  { name: "User", icon: profileIcon, path: "users" },
  {
    name: "CMS",
    // icon: profileIcon,
    children: [
      {
        name: "Homepage",
        children: [
          { name: "Explore"},
          { name: "Featured Tournaments"},
          { name: "Featured Week"},
          { name: "Featured Venues"},
          { name: "Why Choose Picklebay"},
          { name: "Destination Dink"},
          { name: "Build Courts"},
          { name: "Journal"},
          { name: "News & Update"},
        ],
      },
      {
        name: "Blogs",
        children: [
          { name: "Test"},
        ],
      },
      {
        name: "Static Pages",
        children: [
          { name: "Help & Faqs"},
          { name: "Terms & Condition"},
          { name: "Refunds & Cancellation"},
          { name: "Privacy Policy"},
          { name: "Picklebay Guidelines"},
        ],
      },
    ],
  },
];

export const TOURNAMENT_OWNER_NAVIGATION = [
  { name: "DashBoard", icon: overviewIcon, path: "" },
  {
    name: "Tournament Organiser",
    icon: tournamentIcon,
    path: "tournament-organisers",
  },
  {
    name: "Tournament Bookings",
    icon: bookingIcon,
    path: "tournament-bookings",
  },
  { name: "Tournaments", icon: tournamentIcon, path: "tournaments" },
  { name: "User", icon: profileIcon, path: "users" },
];

export const VENUE_OWNER_NAVIGATION = [
  { name: "DashBoard", icon: overviewIcon, path: "" },
  { name: "Venue Organisers", icon: eventsIcon, path: "venue-organisers" },
  { name: "Court Bookings", icon: bookingIcon, path: "court-bookings" },
  { name: "Venues", icon: venueIcon, path: "venues" },
  { name: "User", icon: profileIcon, path: "users" },

];

export const ActionButtonGroup = [
  { name: "Edit", icon: EditIcon, action: "edit" },
  { name: "Delete", icon: DeleteIcon, action: "delete" },
  { name: "View", icon: ViewIcon, action: "view" },
];

export const rowsInOnePage = 10;

export const venueImageSize = 1000 * 1024;

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
];

export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "TOURNAMENT_OWNER",
  "VENUE_OWNER",
];
