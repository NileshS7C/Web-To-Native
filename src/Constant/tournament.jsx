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

export { tournamentDetails, tournamentEvent, AvailableDays };
