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

const PlayersManager = () => {
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
    setPlayerName("");
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
  return (
    <div>
      <PlayersQueryTools
        totalPlayer={players?.total}
        setPlayers={setPlayers}
        playerName={playerName}
        setPlayerName={setPlayerName}
        setLoading={setLoading}
        setError={setError}
        gender={gender}
        setGender={setGender}
        skill={skill}
        setSkill={setSkill}
        currentPage={currentPage}
        limit={limit}
      />
      <Player
        players={players}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        loading={loading}
        error={error}
        limit={limit}
      />
    </div>
  );
};

const Player = (props) => {
  const { players, handlePageChange, currentPage, loading, error, limit } =
    props;
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
      <DataTable
        columns={tableHeaders}
        data={players?.players}
        currentPage={currentPage}
        totalPages={players.total}
        onPageChange={handlePageChange}
        pathName="/players"
        evenRowColor="[#FFFFFF]"
        oddRowColor="blue-400"
        alternateRowColors={true}
        pageLimit={limit}
      />
    </div>
  );
};

const PlayersQueryTools = (props) => {
  const {
    totalPlayer,
    playerName,
    setPlayerName,
    setPlayers,
    setLoading,
    setError,
    currentPage,
    gender,
    setGender,
    skill,
    setSkill,
    limit,
  } = props;
  return (
    <div className="flex flex-col justify-between mb-2 gap-2 tab:flex-row tab:gap-0">
      <SearchPlayers
        playerName={playerName}
        setPlayerName={setPlayerName}
        setPlayers={setPlayers}
        setLoading={setLoading}
        setError={setError}
        currentPage={currentPage}
        limit={limit}
      />
      <div className="flex items-baseline justify-between items-center gap-4 relative z-0">
        <div>
          <p className="text-xs md:text-sm lg:text-base">
            Total Players : {totalPlayer}
          </p>
        </div>
        <div className="flex justify-between items-center gap-1 max-w-full">
          <p className="text-xs md:text-sm lg:text-base text-[#b8c8eb]">
            Filters:
          </p>
          <div className="flex space-x-2 md:space-x-4 min-w-max z-50">
            <FilterPlayer
              label="Gender"
              options={["Male", "Female", "Other"]}
              selectedValue={gender}
              onChange={setGender}
            />
            <FilterPlayer
              label="Skill"
              options={["Beginner", "Amateur", "Intermediate", "Advanced"]}
              selectedValue={skill}
              onChange={setSkill}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchPlayers = ({
  playerName,
  setPlayerName,
  setPlayers,
  setLoading,
  setError,
  currentPage,
  limit,
}) => {
  const [searchPlayer, setSearchPlayer] = useState("");
  const debouncedValue = useDebounce(searchPlayer, 300);
  const inputRef = useRef(null);

  useEffect(() => {
    const getPlayers = async (player) => {
      try {
        setLoading(true);
        setError("");
        const response = await axiosInstance.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/search-players?search=${player}&page=${currentPage}&limit=${limit}`
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
  }, [debouncedValue, currentPage]);

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
    <div className="relative flex items-center">
      <img
        src={searchIcon}
        alt="players"
        className="absolute left-6 top-1/2 transform -translate-y-1/2"
      />
      <input
        ref={inputRef}
        placeholder="Search Players"
        className=" w-full px-12 border-[1px] border-[#DFEAF2] rounded-[15px] h-10 md:h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleSearch}
        value={playerName}
      />
    </div>
  );
};

PlayersQueryTools.propTypes = {
  playerName: PropTypes.string,
  setPlayerName: PropTypes.func,
  setPlayers: PropTypes.func,
  setLoading: PropTypes.func,
  setError: PropTypes.func,
  currentPage: PropTypes.number,
  gender: PropTypes.string,
  setGender: PropTypes.func,
  skill: PropTypes.string,
  setSkill: PropTypes.func,
  limit: PropTypes.number,
};

Player.propTypes = {
  players: PropTypes.array,
  handlePageChange: PropTypes.func,
  currentPage: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
  limit: PropTypes.number,
};

SearchPlayers.propTypes = {
  playerName: PropTypes.string,
  setPlayerName: PropTypes.func,
  setPlayers: PropTypes.func,
  setLoading: PropTypes.bool,
  setError: PropTypes.func,
  currentPage: PropTypes.number,
  limit: PropTypes.number,
};

export default PlayersManager;
