import { useEffect, useState } from "react";
import axiosInstance from "../Services/axios";

function useAllPlayers() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const getAllPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/users/admin/players?limit=500`);

        setPlayers(response?.data?.data?.players || []);
      } catch (err) {
        console.error("Error fetching all players:", err);
        setError("Failed to fetch players.");
      } finally {
        setLoading(false);
      }
    };

    getAllPlayers();
  }, []);

  return { loading, error, players };
}

export default useAllPlayers;
