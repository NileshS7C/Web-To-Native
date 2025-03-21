import { SearchBox } from "./SearchBox";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useDebounce from "../../Hooks/useDebounce";
import usePlayerSearch from "../../Hooks/usePlayerSearch";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ImSpinner2 } from "react-icons/im";
import PropTypes from "prop-types";
import { CreateTags } from "./CreateTags";
import { dummmyProfileIcon } from "../../Assests";

const SearchedPlayerListing = ({
  players,
  setSelectedPlayer,
  selectedPlayerId,
  setSelectedPlayerId,
  setSelectedPlayerName,
  loading,
  error,
  id,
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
        <button
          key={player?.id}
          type="button"
          onClick={() => {
            setSelectedPlayerId(player?._id);
            setSelectedPlayerName(player);
            setSelectedPlayer({ name: player?.name, id, key: player?._id });
          }}
          className="w-full text-left p-2"
        >
          <li
            className={`relative list-none cursor-pointer py-2 pr-9 pl-3 select-none ${
              isSelected
                ? "bg-violet-200 text-indigo-700 font-semibold"
                : "text-gray-900"
            }  focus-visible:bg-indigo-600 focus-visible:text-white`}
          >
            <div className="flex justify-between items-center ">
              <div className="flex items-center gap-2.5">
                <img
                  src={player?.profilePic || dummmyProfileIcon}
                  className="w-[30px] h-[30px] object-contain rounded-md"
                  alt="profile pic"
                />
                <span>{player?.name ?? ""}</span>
              </div>

              <span>{player?.phone ?? ""}</span>
            </div>

            {isSelected && (
              <span className="absolute inset-y-0 right-0 top-1/2 transform -translate-y-1/2  items-center pr-4 text-indigo-600 group-data-focus:text-white group-data-selected:flex">
                <CheckIcon className="size-5" />
              </span>
            )}
          </li>
        </button>
      );
    })
  ) : (
    <p className="inline-flex items-center w-full justify-center text-lg align-middle mt-4 p-2 rounded-md ">
      No Player Found
    </p>
  );
};

export const SearchPlayer = ({ id, setChoosenPlayer, setRemovedPlayer }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [removed, setRemoved] = useState(null);
  const searchPlayerRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchValue(e?.target?.value);
  };

  const debouncedValue = useDebounce(searchValue);
  const { loading, error, players } = usePlayerSearch(debouncedValue);

  useEffect(() => {
    if (selectedPlayerId) {
      setIsFocused(false);
    }
  }, [selectedPlayerId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchPlayerRef.current &&
        !searchPlayerRef.current.contains(e.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemoveTags = useCallback(
    (tagId) => {
      setRemovedPlayer(selectedPlayer);
      setRemoved(selectedPlayer);
      setSelectedPlayer("");
      if (tagId === selectedPlayerId) {
        setSelectedPlayerId(null);
      }
    },
    [selectedPlayerId]
  );

  useEffect(() => {
    if (selectedPlayer) {
      setSearchValue("");
    }
  }, [selectedPlayer]);

  return (
    <div
      className="flex flex-col items-center gap-2.5 justify-between w-full "
      ref={searchPlayerRef}
    >
      <div className="w-full relative">
        <SearchBox
          placeholder="Search Player"
          onInputChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          value={searchValue}
        />

        {isFocused && (
          <div className="absolute z-10 h-[20vh] overflow-auto mt-4 w-full shadow-lg bg-[#FFFFFF] border-2 border-blue-100 rounded-lg scrollbar-hide">
            <SearchedPlayerListing
              players={players}
              setSelectedPlayer={setSelectedPlayer}
              selectedPlayerId={selectedPlayerId}
              setSelectedPlayerId={setSelectedPlayerId}
              setSelectedPlayerName={setChoosenPlayer}
              loading={loading}
              error={error}
              id={id}
            />
          </div>
        )}
      </div>

      <div className="flex items-start justify-start w-full">
        {selectedPlayer && (
          <CreateTags
            selectedTag={[selectedPlayer]}
            handleRemoveTag={handleRemoveTags}
          />
        )}
      </div>
    </div>
  );
};

SearchPlayer.propTypes = {
  id: PropTypes.string,
  setChoosenPlayer: PropTypes.func,
  setRemovedPlayer: PropTypes.func,
};

SearchedPlayerListing.propTypes = {
  players: PropTypes.array,
  setSelectedPlayer: PropTypes.func,
  selectedPlayerId: PropTypes.string,
  setSelectedPlayerId: PropTypes.func,
  setSelectedPlayerName: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string,
};
