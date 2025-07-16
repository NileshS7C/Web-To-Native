import { useEffect, useState } from "react";
import axiosInstance from "../Services/axios";
import { useSearchDebounce } from "./useSearchDebounce";

function usePlayerSearch(value) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const debouncedValue = useSearchDebounce(value, 500);

  useEffect(() => {
    const getPlayers = async (player) => {
      try {
        setLoading(true);
        setError("");
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL}/search-players?search=${player}`
        );

        setPlayers(response?.data?.data?.players || []);
      } catch (err) {
        console.log("Error in getting the player information", err);
        setError("Failed to get the players.");
      } finally {
        setLoading(false);
      }
    };
    if (debouncedValue) {
      getPlayers(debouncedValue);
    }
  }, [debouncedValue]);

  return { loading, error, players };
}

export default usePlayerSearch;
