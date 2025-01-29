const formattedDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const parseDate = (date) => {
  console.log(" date in the utils", date);
  const [day, month, year] = date?.split("/")?.map(Number);
  return new Date(year, month - 1, day);
};

const formatURL = (params) => {
  return Object.entries(params)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");
};

export { formattedDate, parseDate, formatURL };
