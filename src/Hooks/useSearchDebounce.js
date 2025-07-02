// src/Hooks/useSearchDebounce.js
import { useEffect, useState } from 'react';

export const useSearchDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      console.log(`🚀 || useSearchDebounce.js:5 || useSearchDebounce || value:`, value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
