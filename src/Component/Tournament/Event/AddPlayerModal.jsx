import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Button from "../../Common/Button";
import { Formik, Form } from "formik";
import { searchIcon } from "../../../Assests";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookings,
  getSearchBookings,
} from "../../../redux/tournament/tournamentActions";
import Spinner from "../../Common/Spinner";
import ErrorBanner from "../../Common/ErrorBanner";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import useDebounce from "../../../Hooks/useDebounce";

const initialValues = {
  player: [],
};

const SearchBookings = ({
  dispatch,
  page,
  limit,
  searchInput,
  setSearchInput,
  eventId,
  tournamentId,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchValue(e?.target?.value);
    setSearchInput(e?.target?.value);
  };

  useEffect(() => {
    if (debouncedValue) {
      dispatch(
        getSearchBookings({
          tour_Id: tournamentId,
          eventId,
          page: page || 1,
          limit: limit,
          search: debouncedValue,
          status: "CONFIRMED",
        })
      );
    }
  }, [debouncedValue, page]);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative w-full mb-3">
      <input
        placeholder="Search Player..."
        className="cursor-pointer w-full px-2 border-[1px] border-[#DFEAF2] rounded-[15px] h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base md:text-lg"
        ref={inputRef}
        onChange={handleInputChange}
        value={searchInput}
      />
      <img
        src={searchIcon}
        alt="Search Players"
        className="absolute right-[20px] top-1/2 transform -translate-y-1/2"
      />
    </div>
  );
};

const AddPlayerModal = ({
  toggleModal,
  participants,
  handleUpdateParticipant,
}) => {
  const dispatch = useDispatch();
  const { tournamentId, eventId } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const {
    bookings: bookingData,
    bookingError,
    isGettingBookings,
  } = useSelector((state) => state.GET_TOUR);

  const initialSelectedPlayers = useMemo(() => {
    const initialSet = new Set();
    participants.forEach((participant) => {
      initialSet.add(participant.bookingId);
    });
    return initialSet;
  }, [participants]);

  const [selectedPlayers, setSelectedPlayers] = useState(
    initialSelectedPlayers
  );
  const [updatedParticipants, setUpdatedParticipants] = useState([
    ...participants,
  ]);

  const formatData = useCallback((bookingData) => {
    const data = {
      bookingId: bookingData._id.toString(),
      players: [],
    };

    data.players.push({
      name: bookingData.player.name,
      phone: bookingData.player.phone,
      playerId: bookingData.player.playerId,
    });

    bookingData?.bookingItems?.forEach((item) => {
      if (item?.partnerDetails) {
        data.players.push({
          name: item.partnerDetails.name,
          phone: item.partnerDetails.phone,
          playerId: bookingData.player.playerId,
        });
      }
    });

    return data;
  }, []);

  const extractNames = useCallback((bookingData) => {
    const names = [
      { name: bookingData.player.name, playerId: bookingData.player.playerId },
    ];
    bookingData?.bookingItems?.forEach((item) => {
      if (item?.partnerDetails?.name) {
        names.push({
          name: item.partnerDetails.name,
          playerId: item.partnerDetails.playerId,
        });
      }
    });
    return names;
  }, []);

  const extractPhones = useCallback((bookingData) => {
    const phones = [
      {
        phone: bookingData.player.phone,
        playerId: bookingData.player.playerId,
      },
    ];
    bookingData?.bookingItems?.forEach((item) => {
      if (item?.partnerDetails?.phone) {
        phones.push({
          phone: item.partnerDetails.phone,
          playerId: item.partnerDetails.playerId,
        });
      }
    });
    return phones;
  }, []);

  // Memoized calculation for bookings list
  const bookingsList = useMemo(() => {
    return bookingData?.bookings || [];
  }, [bookingData?.bookings]);

  // Calculate if all players are selected
  const areAllPlayersSelected = useMemo(() => {
    if (bookingsList.length === 0) return false;
    return bookingsList.every((booking) =>
      selectedPlayers.has(booking._id.toString())
    );
  }, [bookingsList, selectedPlayers]);

  const handlePlayerToggle = useCallback(
    (booking) => {
      const player = formatData(booking);

      setSelectedPlayers((prevSelected) => {
        const newSet = new Set(prevSelected);

        if (newSet.has(player.bookingId)) {
          newSet.delete(player.bookingId);
          setUpdatedParticipants((prev) =>
            prev.filter((part) => part.bookingId !== player.bookingId)
          );
        } else {
          newSet.add(player.bookingId);
          setUpdatedParticipants((prev) => [...prev, player]);
        }

        return newSet;
      });
    },
    [formatData]
  );

  const handleSelectAllPlayers = useCallback(() => {
    if (areAllPlayersSelected) {
      // Unselect all
      setSelectedPlayers(new Set());
      setUpdatedParticipants([]);
    } else {
      // Select all
      const allPlayerData = bookingsList.map((booking) => formatData(booking));
      setUpdatedParticipants(allPlayerData);
      setSelectedPlayers(
        new Set(allPlayerData.map((player) => player.bookingId))
      );
    }
  }, [areAllPlayersSelected, bookingsList, formatData]);

  const handleSave = useCallback(() => {
    handleUpdateParticipant(updatedParticipants);
    toggleModal();
  }, [updatedParticipants, handleUpdateParticipant, toggleModal]);

  useEffect(() => {
    if (tournamentId && eventId && !searchInput) {
      dispatch(
        getAllBookings({
          currentPage: 1,
          limit: 200,
          tour_Id: tournamentId,
          eventId,
          status: "CONFIRMED",
        })
      );
    }
  }, [tournamentId, eventId, dispatch, searchInput]);

  const selectedPlayersCount = useMemo(() => {
    return selectedPlayers.size;
  }, [selectedPlayers]);

  if (bookingError) {
    return (
      <ErrorBanner message="We're having trouble loading bookings information right now. Please try again later." />
    );
  }

  return (
    <Dialog open={true} onClose={toggleModal} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center px-4 py-2 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden scrollbar-hide rounded-lg bg-white px-2 text-left shadow-xl transition-all w-full max-w-[85%] sm:max-w-[65%] md:max-w-[60%] lg:max-w-[40%] min-h-[65vh] max-h-[90vh] overflow-y-auto">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={handleSave}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="relative min-h-[65vh] flex flex-col">
                    {/* Search + Header */}
                    <div className="sticky top-0 z-20 bg-white px-4 pt-6">
                      <SearchBookings
                        dispatch={dispatch}
                        page={1}
                        limit={20}
                        tournamentId={tournamentId}
                        eventId={eventId}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                      />
                      <div
                        className="flex gap-3 items-center px-2 cursor-pointer"
                        onClick={handleSelectAllPlayers}
                      >
                        <input
                          type="checkbox"
                          checked={areAllPlayersSelected}
                          readOnly
                          className="w-4 sm:w-5 h-4 sm:h-5"
                        />
                        <span className="text-base md:text-lg font-semibold">
                          Select All Players
                        </span>
                      </div>

                      {bookingsList?.length > 0 && (
                        <div className="flex items-center rounded-t-lg bg-grey-200 py-2 md:py-3">
                          <span className="flex-[20] text-center"></span>
                          <span className="text-sm sm:text-base md:text-lg flex-[40] text-left text-grey-500">
                            Name
                          </span>
                          <span className="text-sm sm:text-base md:text-lg flex-[35] text-left text-grey-500">
                            Phone No
                          </span>
                        </div>
                      )}
                    </div>

                    {isGettingBookings && (
                      <div className="flex items-center justify-center h-full w-full">
                        <Spinner />
                      </div>
                    )}

                    {/* Player list */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide px-4">
                      {bookingsList.map((booking, index) => {
                        const isChecked = selectedPlayers.has(
                          booking._id.toString()
                        );
                        return (
                          <div
                            key={nanoid()}
                            className={`flex items-center py-2 md:py-3 gap-[2px] ${
                              index !== bookingsList.length - 1
                                ? "border-b-[1.5px] border-[#DFEAF2]"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="flex-[20] text-center cursor-pointer w-3 sm:w-4 h-3 sm:h-4"
                              checked={isChecked}
                              onChange={() => handlePlayerToggle(booking)}
                            />
                            <div className="flex flex-col flex-[35] text-left">
                              {extractNames(booking).map((player) => (
                                <span
                                  key={`${booking._id}-${player.playerId}-name`}
                                  className="text-sm sm:text-base md:text-lg text-black font-medium"
                                >
                                  {player.name}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-col flex-[35] text-left">
                              {extractPhones(booking).map((player) => (
                                <span
                                  key={nanoid()}
                                  className="text-sm sm:text-base md:text-lg text-grey-500 font-medium"
                                >
                                  {player.phone}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 z-20 bg-white px-4 pt-3 pb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[#718EBF] font-medium text-xs sm:text-sm md:text-base lg:text-lg">
                          {`${selectedPlayersCount} Players Selected`}
                        </span>
                        <div className="flex gap-2 justify-end">
                          <Button
                            type="button"
                            onClick={toggleModal}
                            className="px-3 py-1 sm:px-4 md:px-6 lg:px-8 lg:py-1.5 bg-white border-2 border-[#1570EF] text-[#1570EF] rounded-[8px] hover:bg-blue-50 text-sm sm:text-base md:text-lg"
                          >
                            Close
                          </Button>
                          <Button
                            type="submit"
                            loading={isSubmitting}
                            className="px-3 py-1 sm:px-4 md:px-6 lg:px-8 lg:py-1.5 bg-[#1570EF] text-white rounded-[8px] hover:bg-blue-700 text-sm sm:text-base md:text-lg"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddPlayerModal;
