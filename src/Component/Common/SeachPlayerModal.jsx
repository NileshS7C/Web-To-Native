import { SearchBox } from "./SearchBox";
import React, { useEffect, useState } from "react";
import useDebounce from "../../Hooks/useDebounce";
import usePlayerSearch from "../../Hooks/usePlayerSearch";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ImSpinner2 } from "react-icons/im";
import PropTypes from "prop-types";

const SearchedPlayerListing = ({
  players,
  selectedPlayerId,
  setSelectedPlayerId,
  setSelectedPlayerName,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100px] w-full">
        <ImSpinner2 className="animate-spin w-[30px] h-[30px]" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="inline-flex items-center justify-center border-2 border-red-500 p-3 text-red-500 rounded-md mt-4">
        An error occurred while processing your request. Please try again later.
      </p>
    );
  }
  return players?.length > 0 ? (
    players.map((player) => {
      const isSelected = selectedPlayerId === player?._id;

      return (
        <li
          key={player?.id}
          className={`relative list-none cursor-pointer py-2 pr-9 pl-3 select-none ${
            isSelected
              ? "bg-violet-200 text-indigo-700 font-semibold"
              : "text-gray-900"
          }  focus-visible:bg-indigo-600 focus-visible:text-white`}
          onClick={() => {
            setSelectedPlayerId(player?._id);
            setSelectedPlayerName(player);
          }}
        >
          <div className="flex gap-2.5 items-center ">
            <img
              src={player?.profilePic}
              className="w-[40px] h-[40px] object-contain rounded-md"
              alt="profile pic"
            />
            <span>{player?.name ?? ""}</span>
            <span>{player?.phone ?? ""}</span>
          </div>

          {isSelected && (
            <span className="absolute inset-y-0 right-0 top-1/2 transform -translate-y-1/2  items-center pr-4 text-indigo-600 group-data-focus:text-white group-data-selected:flex">
              <CheckIcon className="size-5" />
            </span>
          )}
        </li>
      );
    })
  ) : (
    <p className="inline-flex items-center w-full justify-center text-lg align-middle mt-4 p-2 border-2 border-blue-400 rounded-md ">
      No Player Found
    </p>
  );
};

export const SearchPlayer = ({ setChoosenPlayer }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const handleInputChange = (e) => {
    setSearchValue(e?.target?.value);
  };

  const debouncedValue = useDebounce(searchValue);

  const { loading, error, players } = usePlayerSearch(debouncedValue);

  return (
    <div className="flex flex-col items-center gap-2.5 justify-between w-full ">
      <div className="w-full">
        <SearchBox
          placeholder="Search Player"
          onInputChange={handleInputChange}
        />

        <div className="h-[20vh] overflow-auto mt-4">
          <SearchedPlayerListing
            players={players}
            selectedPlayerId={selectedPlayerId}
            setSelectedPlayerId={setSelectedPlayerId}
            setSelectedPlayerName={setChoosenPlayer}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

SearchedPlayerListing.propTypes = {
  players: PropTypes.array,
  selectedPlayerId: PropTypes.string,
  setSelectedPlayerId: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
};
