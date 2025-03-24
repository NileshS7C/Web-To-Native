import { useState, useEffect, useRef } from "react";
import { searchIcon } from "../../Assests";
import usePlayerSearch from "../../Hooks/usePlayerSearch";
import useAllPlayers from "../../Hooks/useAllPlayers";
import { nanoid } from "@reduxjs/toolkit";

const AddPlayers = ({ setAddedPlayers }) => {
    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [allPlayersList, setAllPlayersList] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // State for filtering players in modal

    const dropdownRef = useRef(null);
    const modalRef = useRef(null);

    const { loading, error, players } = usePlayerSearch(inputValue);
    const { loading: isLoadingPlayers, error: isErrorPlayers, players: allPlayers } = useAllPlayers();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setShowDropdown(true);
    };

    const handleSelectPlayer = (player) => {
        setSelectedPlayers((prev) => {
            const isAlreadySelected = prev.some((p) => p._id === player._id);
            const updatedPlayers = isAlreadySelected
                ? prev.filter((p) => p._id !== player._id) // Remove player
                : [...prev, player];
            setAddedPlayers(updatedPlayers);
            return updatedPlayers;
        });
    };

    const handleBrowsingPlayers = () => {
        setAllPlayersList([...allPlayers]); // Ensure all players are stored
        setShowPopup(true);
    };

    const handleSearchModalPlayers = (e) => {
        setSearchQuery(e.target.value); // Update search query
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close modal when clicking outside
    const handleOverlayClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowPopup(false);
        }
    };

    // Filter players based on searchQuery inside the modal
    const filteredPlayers = allPlayersList.filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="relative flex items-center justify-between mt-5">
                <div ref={dropdownRef} className="flex items-center gap-2 border w-full px-3 py-2 mr-5 rounded-lg relative">
                    <img src={searchIcon} alt="Search Icon" className="w-5 h-5" />
                    <input
                        type="text"
                        className="w-full focus:outline-none"
                        placeholder="Search customers"
                        value={inputValue}
                        onChange={handleInputChange}
                    />

                    {/* Dropdown */}
                    {showDropdown && inputValue && (
                        <div className="absolute left-0 top-12 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 divide-y divide-gray-300">
                            {loading && <p className="p-2 text-gray-500">Loading...</p>}
                            {error && <p className="p-2 text-red-500">Error fetching players</p>}

                            {!loading && !error && players.length === 0 && (
                                <p className="p-2 text-gray-500">No results found</p>
                            )}

                            {!loading &&
                                !error &&
                                players.map((player) => (
                                    <div
                                        key={nanoid()}
                                        className="p-2 hover:bg-gray-100 cursor-pointer flex flex-col gap-2 items-start"
                                    >
                                        <div className="flex gap-4 items-center">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectPlayer(player)}
                                                checked={selectedPlayers.some((p) => p._id === player._id)}
                                            />
                                            <div className="flex flex-col items-start">
                                                <p className="font-medium text-sm uppercase">{player.name}</p>
                                                <p className="font-regular text-sm opacity-50">{player.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Browse Button */}
                <button
                    className="bg-white text-383838 font-medium font-general border shadow-sm py-1 px-3 cursor-pointer rounded-lg"
                    onClick={handleBrowsingPlayers}
                >
                    Browse
                </button>
            </div>

            {/* Selected Players */}
            {selectedPlayers.length > 0 && (
                <div className="mt-4">
                    {selectedPlayers.map((player) => (
                        <div key={nanoid()} className="flex items-center justify-between bg-white p-2 rounded-lg mt-2 border">
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-sm capitalize">{player.name}</p>
                                <p className="font-medium text-xs opacity-50">{player.email}</p>
                            </div>
                            <button
                                className="text-red-500 font-bold text-lg"
                                onClick={() => handleSelectPlayer(player)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Browsing Players */}
            {showPopup && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20 flex items-center justify-center"
                    onClick={handleOverlayClick} // Close modal when clicking outside
                >
                    <div
                        ref={modalRef}
                        className="bg-white rounded-lg shadow-lg w-[550px] max-w-full relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                            onClick={() => setShowPopup(false)}
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-medium mb-3 py-5 bg-gray-200 rounded-t-lg">All Players</h2>

                        {/* Search Bar Inside Modal */}
                        <div className="relative mb-3 px-5">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                                placeholder="Search Customers..."
                                value={searchQuery}
                                onChange={handleSearchModalPlayers}
                            />
                        </div>

                        {/* Filtered Players */}
                        {filteredPlayers.length > 0 ? (
                            <div className="max-h-[450px] overflow-y-auto divide-y divide-gray-300">
                                {filteredPlayers.map((player) => (
                                    <div
                                        key={nanoid()}
                                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer flex flex-col gap-2 items-start"
                                    >
                                        <div className="flex gap-4 items-center">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectPlayer(player)}
                                                checked={selectedPlayers.some((p) => p._id === player._id)}
                                            />
                                            <div className="flex flex-col items-start">
                                                <p className="font-medium text-sm uppercase">{player.name}</p>
                                                <p className="font-regular text-sm opacity-50">{player.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No players found.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AddPlayers;
