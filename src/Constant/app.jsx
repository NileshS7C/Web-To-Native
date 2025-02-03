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
  {
    name: "CMS",
    // icon: profileIcon,
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
          { name: "Journal" },
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
        ],
      },
    ],
  },
];

export const ActionButtonGroup = [
  { name: "Edit", icon: EditIcon, action: "edit" },
  { name: "Delete", icon: DeleteIcon, action: "delete" },
  { name: "View", icon: ViewIcon, action: "view" },
];

export const rowsInOnePage = 10;

export const venueImageSize = 1000 * 1024;

export const courtImageSize = 500 * 1024;
