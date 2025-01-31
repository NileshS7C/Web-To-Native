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
  { name: "DashBoard", icon: overviewIcon },
  { name: "Tournament Organiser", icon: tournamentIcon },
  { name: "Venue Organisers", icon: eventsIcon },
  { name: "Tournament Bookings", icon: bookingIcon },
  { name: "Court Bookings", icon: bookingIcon },
  { name: "Tournaments", icon: tournamentIcon },
  { name: "Venues", icon: venueIcon },
  { name: "User", icon: profileIcon },
];

export const TOURNAMENT_OWNER_NAVIGATION = [
  { name: "DashBoard", icon: overviewIcon },
  { name: "Tournament Organiser", icon: tournamentIcon },
  { name: "Tournament Bookings", icon: bookingIcon },
  { name: "Tournaments", icon: tournamentIcon },
  { name: "User", icon: profileIcon },
];

export const VENUE_OWNER_NAVIGATION = [
  { name: "DashBoard", icon: overviewIcon },
  { name: "Venue Organisers", icon: eventsIcon },
  { name: "Court Bookings", icon: bookingIcon },
  { name: "Venues", icon: venueIcon },
  { name: "User", icon: profileIcon },
];

export const ActionButtonGroup = [
  { name: "Edit", icon: EditIcon, action: "edit" },
  { name: "Delete", icon: DeleteIcon, action: "delete" },
  { name: "View", icon: ViewIcon, action: "view" },
];

export const rowsInOnePage = 10;

export const venueImageSize = 1000 * 1024;

export const courtImageSize = 500 * 1024;
export const notHaveBackButton = ["Tournaments", "Venues", "Bookings"];

export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "TOURNAMENT_OWNER",
  "VENUE_OWNER",
];
