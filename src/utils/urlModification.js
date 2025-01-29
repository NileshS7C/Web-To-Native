const updateQueryString = (value) => {
  console.log("query string values", value);
  const searchParams = new URLSearchParams(window.location.search);
  Object.entries(value).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  return searchParams.toString();
};

export { updateQueryString };
