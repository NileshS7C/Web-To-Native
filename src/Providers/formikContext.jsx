import { createContext, useContext, useMemo, useState } from "react";

const FormikContext = createContext(null);

export const useFormikContextFunction = () => {
  return useContext(FormikContext);
};

export const FormikContextProvider = ({ children }) => {
  const [submitForm, setSubmitForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const value = useMemo(
    () => ({
      submitForm,
      setSubmitForm,
      isSubmitting,
      setIsSubmitting,
    }),
    [submitForm, isSubmitting]
  );

  return (
    <FormikContext.Provider value={value}>{children}</FormikContext.Provider>
  );
};
