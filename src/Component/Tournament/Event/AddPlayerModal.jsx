import { useEffect, useState, useMemo, useCallback } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Button from "../../Common/Button";
import { Formik, Form } from "formik";
import { searchIcon } from "../../../Assests";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../../../redux/tournament/tournamentActions";
import Spinner from "../../Common/Spinner";
import ErrorBanner from "../../Common/ErrorBanner";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
const initialValues = {
  player: [],
};

const AddPlayerModal = ({
  toggleModal,
  participants,
  handleUpdateParticipant,
}) => {
  const dispatch = useDispatch();
  const { tournamentId, eventId } = useParams();
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
      playerId: bookingData.player.playerId
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
      { phone: bookingData.player.phone, playerId: bookingData.player.playerId },
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


  const handleSave = useCallback(() => {
    handleUpdateParticipant(updatedParticipants);
    toggleModal();
  }, [updatedParticipants, handleUpdateParticipant, toggleModal]);


  useEffect(() => {
    if (tournamentId && eventId) {
      dispatch(
        getAllBookings({
          currentPage: 1,
          limit: 200,
          tour_Id: tournamentId,
          eventId,
        })
      );
    }
  }, [tournamentId, eventId, dispatch]);


  const selectedPlayersCount = useMemo(() => {
    return selectedPlayers.size;
  }, [selectedPlayers]);

  const bookingsList = useMemo(() => {
    return bookingData?.bookings || [];
  }, [bookingData?.bookings]);

  if (isGettingBookings) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        {/* <Spinner /> */}
      </div>
    );
  }

  if (bookingError) {
    return (
      <ErrorBanner message="We're having trouble loading bookings information right now. Please try again later." />
    );
  }

  return (
    <Dialog open={true} onClose={toggleModal} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center px-4 pt-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden scrollbar-hide rounded-lg bg-white px-2 pb-2 pt-3 text-left shadow-xl transition-all w-full max-w-[80%] sm:max-w-[40%] max-h-[90vh] overflow-y-auto">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={handleSave}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="relative h-full flex flex-col">
                    {/* Search + Header */}
                    <div className="sticky top-0 z-20 bg-white px-4 pt-4 ">
                      <div className="relative w-full mb-3">
                        <input
                          placeholder="Search Player..."
                          className="w-full px-4 border border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <img
                          src={searchIcon}
                          alt="Search Players"
                          className="absolute right-[20px] top-1/2 transform -translate-y-1/2"
                        />
                      </div>
                      <div className="flex items-center rounded-t-lg bg-grey-200 py-2">
                        <span className="flex-[20] text-center"></span>
                        <span className="flex-[40] text-left">Name</span>
                        <span className="flex-[35] text-left">Phone No</span>
                      </div>
                    </div>

                    {/* Player list */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide px-4">
                      {bookingsList.map((booking, index) => {
                        const isChecked = selectedPlayers.has(
                          booking._id.toString()
                        );
                        return (
                          <div
                            key={booking._id.toString()}
                            className={`flex items-center py-3 ${
                              index !== bookingsList.length - 1
                                ? "border-b-[1.5px] border-[#DFEAF2]"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="flex-[20] text-center cursor-pointer w-4 h-4"
                              checked={isChecked}
                              onChange={() => handlePlayerToggle(booking)}
                            />
                            <div className="flex flex-col flex-[35] text-left">
                              {extractNames(booking).map((player) => (
                                <span
                                  key={nanoid()}
                                  className="text-md text-grey-500 font-medium"
                                >
                                  {player.name}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-col flex-[35] text-left">
                              {extractPhones(booking).map((player) => (
                                <span
                                  key={nanoid()}
                                  className="text-md text-grey-500 font-medium"
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
                    <div className="sticky bottom-0 z-20 bg-white px-4 pt-3 pb-4 ">
                      <div className="flex justify-between items-center">
                        <span className="text-[#718EBF] font-medium text-md">{`${selectedPlayersCount} Players Selected`}</span>
                        <div className="flex gap-2 justify-end">
                          <Button
                            type="button"
                            onClick={toggleModal}
                            className="px-10 py-1.5 bg-white border-2 border-[#1570EF] text-[#1570EF] rounded-[8px] hover:bg-blue-50"
                          >
                            Close
                          </Button>
                          <Button
                            type="submit"
                            loading={isSubmitting}
                            className="px-12 py-1.5 bg-[#1570EF] text-white rounded-[8px] hover:bg-blue-700"
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
