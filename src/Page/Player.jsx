import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../Services/axios";
import Spinner from "../Component/Common/Spinner";
import DataTable from "../Component/Common/DataTable";
import tableHeaders from "../Constant/players";
import FilterPlayer from "../Component/Player/FilterPlayer";

const Player = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gender, setGender] = useState("");
  const [skill, setSkill] = useState("");

  let currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = 20;

  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 });
    }
  }, []);

  const getAllPlayers = async (page, genderFilter, skillFilter) => {
    try {
      setLoading(true);

      let queryParams = `?page=${page}&limit=${limit}`;
      if (genderFilter) queryParams += `&gender=${genderFilter.toLowerCase()}`;
      if (skillFilter) queryParams += `&skillLevel=${skillFilter.toLowerCase()}`;

      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/users/admin/players${queryParams}`
      );

      setPlayers(response.data.data);
    } catch (error) {
      console.error("Error fetching players:", error);
      setError("Failed to load players.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getAllPlayers(currentPage, gender, skill);
  }, [currentPage, gender, skill]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center h-full w-full">
          <Spinner />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-baseline gap-5">
        <p className="text-sm text-[#667085]">Fitlers: </p>
        <div className="flex space-x-4 mb-4">
          <FilterPlayer
            label="Gender"
            options={["Male", "Female", "Other"]}
            selectedValue={gender}
            onChange={setGender}
          />
          <FilterPlayer
            label="Skill"
            options={["Beginner", "Intermediate", "Advanced"]}
            selectedValue={skill}
            onChange={setSkill}
          />
        </div>
      </div>

      <DataTable
        columns={tableHeaders}
        data={players.players}
        currentPage={currentPage}
        totalPages={players.total}
        onPageChange={handlePageChange}
        pathName="/players"
        evenRowColor="[#FFFFFF]"
        oddRowColor="blue-400"
        alternateRowColors={true}
      />
    </div>
  );
};

export default Player;
