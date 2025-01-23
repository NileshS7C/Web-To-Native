const formattedDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const parseDate = (date) => {
  const [day, month, year] = date.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export { formattedDate, parseDate };
