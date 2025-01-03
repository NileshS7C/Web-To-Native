const tournamentDetails = {
  steps: ["basic info", "event", "acknowledgement"],
};

const tournamentEvent = {
  format: [
    "Select Event Format",
    "Single Elimination",
    "Double Elimination",
    "Round Robin",
  ],
  category: [
    "Men's Open Singles",
    "Women's Open Singles",
    "Men's Doubles",
    "Women's Doubles",
    "Mix Singles",
    "Mix Doubles",
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
