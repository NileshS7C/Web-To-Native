import { Link } from "react-router-dom";
import { listingIcon } from "../Assests";
import EventActions from "../Component/Common/EventActions";
import { GoDotFill } from "react-icons/go";

const tournamentDetails = {
  steps: ["basic info", "event", "acknowledgement"],
};

const tournamentEvent = {
  format: [
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
    { name: "Mix Singles", shortName: "MS" },
    { name: "Mix Doubles", shortName: "MD" },
  ],

  skillLevels: ["Select Skill Level", "Beginner", "Intermediate", "Advance"],
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
};

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
    render: (item) => item.categoryName,
  },
  {
    key: "eventFormat",
    header: "Event Format",
    render: (item) => {
      const formatName = tournamentEvent.format.find(
        (event) => event.shortName === item.format
      );

      if (!formatName) {
        return "";
      }

      return formatName.name;
    },
  },
  {
    key: "date",
    header: "Date",
    render: (item) => item?.categoryStartDate.split("/").join("-"),
  },
  {
    key: "tournament_venue",
    header: "venue",
    render: (item) => item?.categoryLocation.name,
  },
  {
    key: "actions",
    header: "Actions",
    render: (item, index) => <EventActions id={item._id} index={index} />,
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
        <div className="flex flex-col">
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
        <div className="flex flex-col">
          <p className="text-customColor font-semibold">Tournament Name</p>
          <p className="text-tour_List_Color">{item.tournamentName}</p>
        </div>
      );
    },
  },
  {
    key: "events",
    render: (item) => {
      return (
        <div className="flex flex-col">
          <p className="text-customColor font-semibold">Events</p>
          <p className="text-tour_List_Color">{item?.events || 0}</p>
        </div>
      );
    },
  },
  {
    key: "startDate",
    render: (item) => {
      return (
        <div className="flex flex-col">
          <p className="text-customColor font-semibold">Start Date</p>
          <p className="text-tour_List_Color">{item.startDate}</p>
        </div>
      );
    },
  },
  {
    key: "tour_status",
    render: (item) => {
      return (
        <div className="flex flex-col gap-1">
          <p className="text-customColor font-semibold">Approval Status</p>
          <p className="inline-flex w-[100px] items-center rounded-2xl bg-green-50 px-2 py-1 text-xs font-medium text-[#41C588] ring-1 ring-inset ring-green-600/20">
            <span>
              <GoDotFill />
            </span>
            <span> {item.status}</span>
          </p>
        </div>
      );
    },
  },
  {
    key: "button",
    render: (item) => {
      return (
        <Link
          className="text-[#718EBF] text-sm border-[1px] border-[#718EBF] px-[30px] py-2 rounded-md"
          to={`/tournaments/${item?.handle || ""}`}
        >
          View Detail
        </Link>
      );
    },
  },
];

export {
  tournamentDetails,
  tournamentEvent,
  AvailableDays,
  eventTableHeaders,
  tournamentListingTabs,
  TournamentTableHeaders,
};
