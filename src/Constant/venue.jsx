import VenueActions from "../Component/Common/VenueActions";
import { EditIcon, DeleteIcon } from "../Assests";
import CourtActions from "../Component/Common/CourtActions";
import { Link } from "react-router-dom";
const Amenities = [
  "Drinking",
  "Locker Rooms",
  "Parking",
  "Rental Equipment",
  "Seating Lounge",
  "Washrooms",
  "Changing Rooms",
  "Artificial Turf",
  "Warm Up",
  "Flood Lights",
];

const venueLimit = 10;

const Equipment = ["Paddles", "First Aid Box", "Shoes", "Balls", "Rackets"];
const venueFilters = [
  { id: "all", title: "All" },
  { id: "draft", title: "Draft" },
  { id: "published", title: "Published" },
];

const venueTabs = [
  { name: "Overview", href: "#", current: true, path: "/overview" },
  { name: "Courts", href: "/courts", current: false, path: "/courts" },
];

const tableHeaders = [
  {
    key: "serial number",
    header: "S.No.",
    render: (_, index, currentPage) => (currentPage - 1) * 10 + (index + 1),
  },
  {
    key: "venueName",
    header: "Venue Name",
    render: (item) => (
      <Link to={`/venues/${item._id}`} className="hover:text-blue-600">
        {item.name}
      </Link>
    ),
  },
  {
    key: "courts",
    header: "Total Courts",
    render: (item) => item.courts.length,
  },
  {
    key: "status",
    header: "Status",
    render: (item) => (
      <span
        className={`inline-flex items-center rounded-2xl ${
          item.status === "PUBLISHED"
            ? "bg-gray-300 text-black-800"
            : "bg-green-50 text-[#41C588]"
        }  px-2 py-1 text-xs font-medium  ring-1 ring-inset ring-green-600/20`}
      >
        {item.status}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    render: (item, index) => <VenueActions id={item._id} index={index} />,
  },
];

const courtTableContent = [
  {
    key: "serial number",
    header: "S.No.",
    render: (_, index, currentPage) => (currentPage - 1) * 10 + (index + 1),
  },
  {
    key: "courtName",
    header: "Court Name",
    render: (court) => court.courtName || "",
  },
  {
    key: "courts",
    header: "Court No.",
    render: (court) => court.courtNumber || "",
  },
  {
    key: "features",
    header: "Feature",
    render: (courts) => courts.features?.join(", "),
  },

  {
    key: "rate",
    header: "Rate (Per hour)",
    render: (court) => court.price || "",
  },
  {
    key: "actions",
    header: "Actions",
    render: (item) => <CourtActions id={item?._id} name={item?.courtName} />,
  },
];

const ActionButtonCourt = [
  { name: "Edit", icon: EditIcon, action: "edit" },
  { name: "Delete", icon: DeleteIcon, action: "delete" },
];

const courtFeatures = [
  "Air conditioning",
  "Non-Air conditioning",
  "Indoor",
  "Outdoor",
];

const fixedDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const fixedDaysLower = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export {
  Amenities,
  Equipment,
  venueFilters,
  venueTabs,
  tableHeaders,
  courtTableContent,
  courtFeatures,
  ActionButtonCourt,
  fixedDays,
  fixedDaysLower,
  venueLimit
};
