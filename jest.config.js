module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Transpile JavaScript/JSX files using Babel
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)", // Ensure Jest transpiles axios (or any ESM library)
  ],
};
