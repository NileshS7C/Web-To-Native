import { useState } from "react";
import { useDispatch } from "react-redux";

export const useSubmitForm = () => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [data, setData] = useState(null);

  const submitFormData = async (action) => {
    try {
      setSubmitting(true);
      setIsSubmitted(false);
      setSubmissionError("");

      const response = await dispatch(action).unwrap();
      if (response?.responseCode === 0) {
        setIsSubmitted(true);
        setData(response.data);
      } else if (response?.error?.responseCode === 1) {
        setIsSubmitted(false);
        setSubmissionError(response.message);
      }
    } catch (err) {
      console.log(" Error occured while submitting the form", err);
      setSubmissionError(
        err?.data?.errors.map((error) => error.message).join(", ") ??
          "Something went wrong while submitting the form. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { submitFormData, submissionError, submitting, isSubmitted, data };
};
