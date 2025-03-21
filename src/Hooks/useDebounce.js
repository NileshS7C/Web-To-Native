import { useEffect, useState } from "react";

function useDebounce(value, delay) {
  const [debouncedRange, setDebouncedRange] = useState(value?.trim());

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
  }, [value?.trim(), delay]);

  return debouncedRange;
}

export default useDebounce;
