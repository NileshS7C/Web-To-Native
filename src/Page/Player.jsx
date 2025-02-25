import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../Services/axios";
import Spinner from "../Component/Common/Spinner";
import DataTable from "../Component/Common/DataTable";
import tableHeaders from "../Constant/players";
import FilterPlayer from "../Component/Player/FilterPlayer";
import { searchIcon } from "../Assests";
import useDebounce from "../Hooks/useDebounce";
import ErrorBanner from "../Component/Common/ErrorBanner";
import PropTypes from "prop-types";

const SearchPlayers = ({ setPlayerName, setPlayers, setLoading, setError }) => {
  const [searchPlayer, setSearchPlayer] = useState("");
  const debouncedValue = useDebounce(searchPlayer, 300);
  const inputRef = useRef(null);
  useEffect(() => {
    const getPlayers = async (player) => {
      try {
        setLoading(true);
        setError("");
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL}/search-players?search=${player}`
        );

        setPlayers(response.data.data);
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

  const handleSearch = useCallback(
    (e) => {
      setPlayerName(e.target.value);
      setSearchPlayer(e.target.value);
    },
    [setPlayerName]
  );

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <div className="relative ">
      <img
        src={searchIcon}
        alt="players"
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        ref={inputRef}
        placeholder="Search Players"
        className=" w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleSearch}
        value={searchPlayer}
        // onFocus={() => inputRef?.current?.focus()}
      />
    </div>
  );
};
const Player = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gender, setGender] = useState("");
  const [skill, setSkill] = useState("");
  const [playerName, setPlayerName] = useState("");

  let currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = 20;

  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 });
    }
  }, []);

  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [skill, gender]);

  const getAllPlayers = async (page, genderFilter, skillFilter) => {
    try {
      setLoading(true);
      setError("");

      let queryParams = `?page=${page}&limit=${limit}`;
      if (genderFilter) queryParams += `&gender=${genderFilter.toLowerCase()}`;
      if (skillFilter)
        queryParams += `&skillLevel=${skillFilter.toLowerCase()}`;

      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/users/admin/players${queryParams}`
      );

      setPlayers(response?.data?.data);
    } catch (error) {
      console.error("Error fetching players:", error);
      setError("Failed to load players.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!playerName) {
      getAllPlayers(currentPage, gender, skill);
    }
  }, [currentPage, gender, skill, playerName]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={error} />;
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex justify-between mb-2">
        <SearchPlayers
          setPlayerName={setPlayerName}
          setPlayers={setPlayers}
          setLoading={setLoading}
          setError={setError}
        />
        <div className="flex items-baseline gap-5">
          <p className="text-sm text-[#b8c8eb]">Fitlers: </p>
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
      </div>

      <DataTable
        columns={tableHeaders}
        data={players?.players || players}
        currentPage={currentPage}
        totalPages={players.total}
        onPageChange={handlePageChange}
        pathName="/players"
        evenRowColor="[#FFFFFF]"
        oddRowColor="blue-400"
        alternateRowColors={true}
        rowsInOnePage={20}
      />
    </div>
  );
};

SearchPlayers.propTypes = {
  playerName: PropTypes.string,
  setPlayerName: PropTypes.func,
  setPlayers: PropTypes.func,
  setLoading: PropTypes.bool,
  setError: PropTypes.func,
};

export default Player;
