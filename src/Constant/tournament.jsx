import { Link, useParams } from "react-router-dom";
import { listingIcon } from "../Assests";
import EventActions from "../Component/Common/EventActions";
import { GoDotFill } from "react-icons/go";
import { findFormatName } from "../utils/tournamentUtils";
const tournamentLimit = 10;
const tournamentDetails = {
  steps: ["basic info", "event", "acknowledgement"],
};

const rolesWithTournamentOwnerAccess = ["SUPER_ADMIN", "ADMIN"];
const bookingLimit = 10;
const playerLimit = 10;
const tournamentEventTypes = {
  format: [
    { type: "single_elimination", shortName: "SE" },
    { type: "double_elimination", shortName: "DE" },
    { type: "round_robin", shortName: "RR" },
  ],
};
const tournamentEvent = {
  format: [
    { name: "Select Event Format", shortName: "" },
    { name: "Single Elimination", shortName: "SE" },
    { name: "Double Elimination", shortName: "DE" },
    { name: "Round Robin", shortName: "RR" },
    { name: "Hybrid", shortName: "HYBRID" },
  ],
  hybridFormat: [
    { name: "Select Event Format", shortName: "" },
    { name: "Single Elimination", shortName: "SE" },
    { name: "Double Elimination", shortName: "DE" },
    { name: "Round Robin", shortName: "RR" },
  ],
  category: [
    { name: "Select Event Category", shortName: "" },
    { name: "Men's Open Singles", shortName: "MS" },
    { name: "Women's Open Singles", shortName: "WS" },
    { name: "Men's Doubles", shortName: "MD" },
    { name: "Women's Doubles", shortName: "WD" },
    { name: "Mix Singles", shortName: "MIS" },
    { name: "Mix Doubles", shortName: "MID" },
  ],
  grandFinalsDE: [
    { name: "Select Grand Finals Format", shortName: "" },
    { name: "None", shortName: "none" },
    { name: "Single Elimination", shortName: "simple" },
    { name: "Double Elimination", shortName: "double" },
  ],
  roundRobinMode: [
    { name: "Select Round Robin Mode", shortName: "" },
    { name: "Single Round Robin", shortName: "simple" },
    { name: "Double Round Robin", shortName: "double" },
  ],

  skillLevels: [
    "Select Skill Level",
    "Beginner",
    "Intermediate",
    "Advanced",
    "All Levels",
  ],
  grandFinales: [1, 2, 3],
  roundRobins: {
    playCount: [1, 2, 3],
    rankOptions: [
      "Match Win",
      "Games/Sets Win",
      "Games/Set Win Percentage",
      "Point Scored",
      "Point Difference",
    ],
  },
  numberOfSets: [
    { name: "Select Number of sets", shortName: "" },
    { name: "One", shortName: "1" },
    { name: "Three", shortName: "3" },
    { name:"Five" ,shortName:"5"}
  ],
};

const NotDoublesCategory = ["MS", "WS", "MIS"];
const AvailableDays = [
  "All",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const eventTableHeaders = [
  {
    key: "serial number",
    header: "S.No.",
    render: (_, index, currentPage) => (currentPage - 1) * 10 + (index + 1),
  },
  {
    key: "eventCategory",
    header: "Event Category",
    render: (item) => {
      const { tournamentId } = useParams();
      const formatName = findFormatName(tournamentEvent, item);
      return (
        <Link
          to={`/tournaments/${tournamentId}/event/${item?._id}?event=${formatName?.name}`}
          className="hover:text-blue-500"
        >
          {item?.categoryName}
        </Link>
      );
    },
  },
  {
    key: "eventFormat",
    header: "Event Format",
    render: (item) => {
      const formatName = findFormatName(tournamentEvent, item);

      if (!formatName) {
        return "";
      }

      return formatName?.name;
    },
  },
  {
    key: "date",
    header: "Date",
    render: (item) => item?.categoryStartDate?.split("/").join("-"),
  },
  {
    key: "tournament_venue",
    header: "Venue",
    render: (item) => item?.categoryLocation?.handle,
  },
  {
    key: "actions",
    header: "Actions",
    render: (item, index, currentPage, onClick, onDelete) => (
      <EventActions
        id={item?._id}
        index={index}
        eventName={item?.categoryName}
      />
    ),
  },
];

const tournamentListingTabs = [
  {
    name: "All",
    href: "#",
    current: true,
    search: "",
    path: "/tournaments",
  },
  {
    name: "Active",
    href: "#",
    current: false,
    search: "?tab=active",
    path: "/tournaments",
  },
  {
    name: "Draft",
    href: "#",
    current: false,
    search: "?tab=draft",
    path: "/tournaments",
  },
  {
    name: "Upcoming",
    href: "#",
    current: false,
    search: "?tab=upcoming",
    path: "/tournaments",
  },
  {
    name: "Archive",
    href: "#",
    current: false,
    search: "?tab=archive",
    path: "/tournaments",
  },
];

const TournamentTableHeaders = [
  {
    key: "tour_logo",
    render: () => {
      return (
        <div className="flex flex-row lg:flex-col justify-between w-full">
          <img
            src={listingIcon}
            width="60px"
            height="60px"
            alt="tounament logo"
          />
        </div>
      );
    },
  },
  {
    key: "tournamentName",
    render: (item) => {
      return (
        <div className="flex flex-row lg:flex-col justify-between w-full">
          <p className="text-customColor font-semibold">Tournament Name</p>
          <p className="text-tour_List_Color text-right lg:text-left">
            {item?.tournamentName}
          </p>
        </div>
      );
    },
  },
  {
    key: "events",
    render: (item) => {
      return (
        <div className="flex flex-row lg:flex-col justify-between w-full">
          <p className="text-customColor font-semibold">Events</p>
          <p className="text-tour_List_Color">{item?.categoryCount || 0}</p>
        </div>
      );
    },
  },
  {
    key: "startDate",
    render: (item) => {
      return (
        <div className="flex flex-row lg:flex-col justify-between w-full">
          <p className="text-customColor font-semibold">Start Date</p>
          <p className="text-tour_List_Color">{item?.startDate}</p>
        </div>
      );
    },
  },
  {
    key: "tour_status",
    render: (item) => {
      let tagColor = "";
      if (item?.status === "PUBLISHED") {
        tagColor = "bg-green-50 text-[#41C588] ring-green-600/20";
      } else if (item?.status === "DRAFT") {
        tagColor = "bg-orange-100 text-[#FF791A] ring-orange-600/20";
      } else {
        tagColor = "bg-gray-300 text-[#5D5D5D] ring-gray-600/20";
      }
      return (
        <div className="flex flex-row lg:flex-col justify-between w-full gap-1">
          <p className="text-customColor font-semibold">Approval Status</p>
          <p
            className={`inline-flex flex-1 max-w-fit items-center rounded-2xl  px-2 py-1 text-xs font-medium  ring-1 ring-inset  ${tagColor}`}
          >
            <span>
              <GoDotFill />
            </span>
            <span> {item?.status}</span>
          </p>
        </div>
      );
    },
  },
  {
    key: "button",
    render: (item) => {
      const { status = "" } = item;
      if (!status) return;

      const navigateToRoute =
        status !== "DRAFT"
          ? `/tournaments/${item?._id || ""}`
          : `/tournaments/${item?._id || ""}/add`;
      return (
        <Link
          className="text-[#718EBF] text-sm border-[1px] border-[#718EBF] px-[30px] py-2 rounded-md"
          to={navigateToRoute}
        >
          View Detail
        </Link>
      );
    },
  },
];

const tournamentStatusFilters = [
  { id: "all", title: "all" },
  { id: "PENDING_VERIFICATION", title: "Pending" },
  { id: "PUBLISHED", title: "Approved" },
];

const approvalBody = {
  action: "APPROVE",
  rejectionComments: "",
};

const hideActionButtons = ["Tournaments", "Add Tournament"];
export {
  tournamentDetails,
  tournamentEvent,
  AvailableDays,
  tournamentListingTabs,
  eventTableHeaders,
  TournamentTableHeaders,
  approvalBody,
  bookingLimit,
  tournamentStatusFilters,
  rolesWithTournamentOwnerAccess,
  hideActionButtons,
  tournamentEventTypes,
  NotDoublesCategory,
  tournamentLimit,
  playerLimit
};
