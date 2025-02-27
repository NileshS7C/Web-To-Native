import { useEffect, useState } from "react";
import axiosInstance from "../Services/axios";

function usePlayerSearch(value) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const getPlayers = async (player) => {
      try {
        setLoading(true);
        setError("");
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL}/search-players?search=${value}`
        );

        setPlayers(response?.data?.data);
      } catch (err) {
        console.log("Error in getting the player information", err);
        setError("Failed to get the players.");
      } finally {
        setLoading(false);
      }
    };
    if (value) {
      getPlayers(value);
    }
  }, [value]);

  return { loading, error, players };
}

export default usePlayerSearch;
