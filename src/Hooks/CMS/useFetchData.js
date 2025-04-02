import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const useFetchData = (actionMethod, isSubmitted) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getData = async () => {
    try {
      setLoading(true);
      setSuccess(false);
      setError(false);
      setErrorMessage("");

      const response = await dispatch(actionMethod).unwrap();

      if (response?.responseCode === 0) {
        setSuccess(true);
        setData(response.data);
      } else if (response?.error?.responseCode === 1) {
        setSuccess(false);
        setError(true);
        setErrorMessage(response.message);
      }
    } catch (err) {
      console.log(
        `Error occured in getting the data through this ${actionMethod} action`,
        err
      );
      setError(true);
      setErrorMessage(
        err?.data?.message ??
          "Something went wrong while getting the data. Please try again later."
      );
    } finally {
      setLoading(false);
      setSuccess(false);
    }
  };

  useEffect(() => {
    if (actionMethod || isSubmitted) {
      getData();
    }
  }, [isSubmitted]);

  return { success, loading, error, errorMessage, data };
};
