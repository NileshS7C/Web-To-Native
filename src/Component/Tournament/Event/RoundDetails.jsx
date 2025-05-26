import { useEffect, useState } from "react";
import PlayerPagination from "./PlayerPagination";
import { playerLimit } from "../../../Constant/tournament";
import { useDispatch, useSelector } from "react-redux";
import {
  resetConfirmationState,
  showConfirmation,
  onCancel,
  onConfirm,
} from "../../../redux/Confirmation/confirmationSlice";
import { ConfirmationModal } from "../../Common/ConfirmationModal";
import { useParams } from "react-router-dom";
import { useDeleteHybridFixture,useUpdateHybridFixture } from "../../../Hooks/useCatgeory";
import { getFixtureById, getHybridFixtures } from "../../../redux/tournament/fixturesActions";
import { showError } from "../../../redux/Error/errorSlice";
import { showSuccess } from "../../../redux/Success/successSlice";
import Spinner from "../../Common/Spinner";
import EmptyBanner from "../../Common/EmptyStateBanner";
const RoundDetails = ({
  fixtureId,
  onRoundActionClick,
  selectedRoundIndex
}) => {
  const formatMapping = {
    SE: "Single Elimination",
    DE: "Double Elimination",
    RR: "Round Robin",
  };
  const dispatch = useDispatch();
  const { tournamentId, eventId } = useParams();
  const {
    mutate: deleteHybridFixture,
    isSuccess: isDeleteFixtureSuccess,
    isError: isDeleteFixtureError,
    error: deleteFixtureError,
    isPending: isDeleteFixturePending,
  } = useDeleteHybridFixture();
  const { fixture, isFetchingFixture } = useSelector((state) => state.fixture);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedParticipants, setPaginatedParticipants] = useState([]);
  const { isOpen, message, onClose, isConfirmed, type, withComments } =
    useSelector((state) => state.confirm);
  const total = fixture?.bracketData?.participant?.length || 0;

  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };
  const isDisabled = fixture?.status === "PUBLISHED" ? true : false;
  useEffect(() => {
    setPaginatedParticipants(
      fixture?.bracketData?.participant?.slice(
        (currentPage - 1) * playerLimit,
        currentPage * playerLimit
      )
    );
  }, [currentPage, fixture]);
  
  useEffect(() => {
    if (isConfirmed && type === "Fixture") {
      deleteHybridFixture({
        tournamentId,
        categoryId: eventId,
        fixtureId
      });
      dispatch(resetConfirmationState());
    }
  }, [isConfirmed]);
  useEffect(() => {
    if (isDeleteFixtureSuccess) {
      dispatch(
        showSuccess({
          message: "Round Deleted Successfully",
          onClose: "hideSuccess",
        })
      );
      setTimeout(() => {
        dispatch(
          getHybridFixtures({
            tour_Id: tournamentId,
            eventId
          })
        );
      }, [1000]);
    }
  }, [isDeleteFixtureSuccess]);
  useEffect(() => {
    if (isDeleteFixtureError) {
      dispatch(
        showError({
          message: deleteFixtureError?.message || "Something went wrong",
          onClose: "hideError",
        })
      );
    }
  }, [isDeleteFixtureError]);
  useEffect(() => {
    if (fixtureId)
      dispatch(
        getFixtureById({
          tour_Id: tournamentId,
          eventId,
          fixtureId
        })
      );
  }, []);
  useEffect(()=>{
    setCurrentPage(1)
  },[selectedRoundIndex])
  useEffect(() => {
    () => {
      dispatch(resetConfirmationState());
    };
  }, []);
  if (isFetchingFixture) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }
  if (!fixture) {
    return (
      <EmptyBanner message="No fixture data available for this event yet." />
    );
  }
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base md:text-lg font-normal md:font-semibold text-grey-600 tracking-wide opacity-[90%]">
            Round Details
          </span>
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            <button
              className={`flex items-center justify-center gap-3 px-6 md:px-12 py-1  ml-auto rounded-lg border-2 transition-colors text-sm sm:text-base md:text-lg
                         ${
                           isDisabled
                             ? "bg-white border-blue-200 text-blue-300 cursor-not-allowed"
                             : "bg-white border-[#1570EF] text-[#1570EF] hover:bg-blue-50"
                         }
                       `}
              onClick={() => {
                onRoundActionClick("delete");
                dispatch(
                  showConfirmation({
                    message: "Are you sure you want to delete this fixture?",
                    type: "Fixture",
                  })
                );
              }}
              disabled={isDisabled}
            >
              Delete
            </button>

            <button
              className={`flex items-center justify-center gap-3 px-6 md:px-12 py-1  ml-auto bg-[#1570EF] shadow-lg text-white ml-auto rounded-lg transition-colors text-sm sm:text-base md:text-lg
                      ${
                        isDisabled
                          ? "bg-blue-400 cursor-not-allowed"
                          : "hover:bg-blue-700"
                      }
                       `}
              onClick={() => {
                onRoundActionClick("edit");
              }}
              disabled={isDisabled}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="flex flex-col py-6 rounded-xl bg-white gap-1 md:gap-3 px-3 sm:px-8 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-6 md:gap-8 justify-between w-full">
            <div className="flex flex-col gap-1 sm:gap-2 items-start w-full">
              <label className="text-sm sm:text-base md:text-lg font-normal md:semibold text-grey-300">
                Name
              </label>
              <input
                type="text"
                value={fixture?.name}
                readOnly
                className="cursor-pointer w-full px-2 border-2 border-[#DFEAF2] rounded-xl h-8 sm:h-11 focus:outline-none text-grey-100 text-sm sm:text-base md:text-lg font-normal md:semibold"
              />
            </div>
            <div className="flex flex-col gap-1 sm:gap-2 items-start w-full">
              <label className="text-sm sm:text-base md:text-lg font-normal md:semibold text-grey-300">
                Event Type
              </label>
              <input
                type="text"
                value={formatMapping[fixture?.format]}
                readOnly
                className="cursor-pointer w-full px-2 border-2 border-[#DFEAF2] rounded-xl h-8 sm:h-11 focus:outline-none text-grey-100 text-sm sm:text-base md:text-lg font-normal md:semibold"
              />
            </div>
          </div>

          <span className="text-left text-sm sm:text-base md:text-lg text-black font-medium tracking-wide">
            All Participants
          </span>
          <div className="rounded-xl border-2 border-[#DFEAF2]">
            {/* header */}
            <div className="flex items-center py-1.5 border-b-2 border-[#DFEAF2] bg-grey-200">
              <span className="flex-[30] text-center text-grey-500 font-medium text-sm sm:text-base md:text-lg">
                SI. No
              </span>
              <span className="flex-[35] text-left text-grey-500 font-medium text-sm sm:text-base md:text-lg">
                Player Name
              </span>
              <span className="flex-[35] text-left text-grey-500 font-medium text-sm sm:text-base md:text-lg">
                Phone No
              </span>
            </div>

            {paginatedParticipants?.map((participant, index) => {
              const isLast = index === paginatedParticipants.length - 1;
              return (
                <div
                  key={participant.id || `${participant.name}-${index}`}
                  className={`flex items-center py-1.5 ${
                    !isLast ? "border-b-2 border-[#DFEAF2]" : ""
                  }`}
                >
                  <span className="flex-[30] text-center text-grey-900 font-medium text-sm sm:text-base md:text-lg">
                    {((currentPage - 1) * playerLimit + index + 1)
                      .toString()
                      .padStart(2, "0")}
                    .
                  </span>
                  <span className="flex-[35] text-left text-grey-600 font-medium text-sm sm:text-base md:text-lg">
                    {participant?.players?.map((p) => p.name).join(" & ")}
                  </span>
                  <span className="flex-[35] text-left text-grey-500 font-medium text-sm sm:text-base md:text-lg">
                    {participant?.players?.map((p) => p.phone).join(", ")}
                  </span>
                </div>
              );
            })}

            {/* pagination */}
            {total > playerLimit && (
              <div className="py-1.5">
                <PlayerPagination
                  currentPage={currentPage}
                  total={total}
                  onPageChange={handleCurrentPageChange}
                  rowsInOnePage={playerLimit}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isOpen}
        onCancel={onCancel}
        onClose={onClose}
        onConfirm={onConfirm}
        isLoading={false}
        message={message}
        withComments={withComments}
      />
    </>
  );
};

export default RoundDetails;
