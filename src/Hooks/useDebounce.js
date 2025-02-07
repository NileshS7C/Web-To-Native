import { useEffect, useState } from "react";

function useDebounce(value, delay) {
  const [debouncedRange, setDebouncedRange] = useState(value);

  useEffect(() => {
    if (value) {
      const timerId = setTimeout(() => {
        setDebouncedRange(value);
      }, [delay]);
      return () => {
        clearTimeout(timerId);
      };
    } else {
      setDebouncedRange(undefined);
    }
  }, [value, delay]);

  return debouncedRange;
}

export default useDebounce;
