import { months } from "../Constant/app";

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const parseDate = (date) => {
  const [day, month, year] = date?.split("/")?.map(Number);
  return new Date(year, month - 1, day);
};

const splitDate = (date) => {
  const [day, month, year] = date?.split("/")?.map(Number);
  return [day, month, year];
};

const dateAndMonth = (date) => {
  const [day, month] = splitDate(date) || [];
  if (!day || !month) return { day: "", month: "" };

  const monthName = months[month - 1] || "";
  return { day, month: monthName };
};


const formatURL = (params) => {
  return Object.entries(params)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");
};

const timeInMins = (value) => {
  if (!value) return;
  const parseTime = value.split(":").map((item) => Number(item));

  const totalTime = parseTime[0] * 60 + parseTime[1];
  return totalTime;
};

export { formattedDate, parseDate, formatURL, timeInMins, dateAndMonth };
