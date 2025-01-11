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
  { name: "Tournament Org", icon: tournamentIcon },
  { name: "Venue Org", icon: eventsIcon },
  { name: "Tournament Bookings", icon: bookingIcon },
  { name: "Court Bookings", icon: bookingIcon },
  { name: "Tournaments", icon: tournamentIcon },
  { name: "Venues", icon: venueIcon },
  { name: "User", icon: profileIcon },
];

export const ActionButtonGroup = [
  { name: "Edit", icon: EditIcon, action: "edit" },
  { name: "Delete", icon: DeleteIcon, action: "delete" },
  { name: "View", icon: ViewIcon, action: "view" },
];

export const rowsInOnePage = 10;
