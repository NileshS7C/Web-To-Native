import EventActions from "../Component/Common/EventActions";

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
    key: "actions",
    header: "Actions",
    render: (item, index) => <EventActions id={item._id} index={index} />,
  },
];

export { tournamentDetails, tournamentEvent, AvailableDays, eventTableHeaders };
