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
import { useDeleteHybridFixture } from "../../../Hooks/useCatgeory";
import { getFixture } from "../../../redux/tournament/fixturesActions";
const RoundDetails = ({fixtureId, name, format, participants, onRoundActionClick }) => {
  const formatMapping = {
    SE: "Single Elimination",
    DE: "Double Elimination",
    RR: "Round Robbin",
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
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedParticipants, setPaginatedParticipants] = useState([]);
  const { isOpen, message, onClose, isConfirmed, type, withComments } =
    useSelector((state) => state.confirm);
  const total = participants?.length || 0;

  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setPaginatedParticipants(
      participants?.slice(
        (currentPage - 1) * playerLimit,
        currentPage * playerLimit
      )
    );
  }, [currentPage, participants]);
  useEffect(() => {
    if (isConfirmed && type === "Fixture") {
      deleteHybridFixture({tournamentId,categoryId:eventId,fixtureId})
      dispatch(resetConfirmationState());
     
    }
  }, [isConfirmed]);
 useEffect(()=>{
  if(isDeleteFixtureSuccess){
      dispatch(getFixture({ tour_Id: tournamentId, eventId }));
  }
 },[isDeleteFixtureSuccess])
  useEffect(() => {
    () => {
      dispatch(resetConfirmationState());
    };
  }, []);
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-grey-600 tracking-wide opacity-[90%]">
            Round Details
          </span>
          <div className="flex gap-4">
            <button
              className="flex items-center justify-center gap-3 px-14 py-1.5 bg-white border-2 border-[#1570EF] text-[#1570EF] ml-auto rounded-lg hover:bg-blue-50 disabled:border-blue-200 disabled:text-blue-300"
              onClick={() => {
                dispatch(
                  showConfirmation({
                    message: "Are you sure you want to delete this fixture?",
                    type: "Fixture",
                  })
                );
              }}
            >
              Delete
            </button>
            <button
              className="flex items-center justify-center gap-3 px-16 py-1.5 bg-[#1570EF] shadow-lg text-white ml-auto rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              onClick={() => {
                onRoundActionClick("edit");
              }}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="flex flex-col py-6 rounded-xl bg-white gap-3 px-10">
          <div className="flex flex-row gap-8 justify-between w-full">
            <div className="flex flex-col gap-2 items-start flex-1">
              <label className="text-md font-normal text-grey-300">Name</label>
              <input
                type="text"
                value={name}
                readOnly
                className="cursor-pointer w-full px-2 border-2 border-[#DFEAF2] rounded-xl h-11 focus:outline-none text-grey-100"
              />
            </div>
            <div className="flex flex-col gap-2 items-start flex-1">
              <label className="text-md font-normal text-grey-300">
                Event Type
              </label>
              <input
                type="text"
                value={formatMapping[format] || ""}
                readOnly
                className="cursor-pointer w-full px-2 border-2 border-[#DFEAF2] rounded-xl h-11 focus:outline-none text-grey-100"
              />
            </div>
          </div>

          <span className="text-left text-md text-black font-medium tracking-wide">
            All Participants
          </span>
          <div className="rounded-xl border-2 border-[#DFEAF2]">
            {/* header */}
            <div className="flex items-center py-1.5 border-b-2 border-[#DFEAF2] bg-grey-200">
              <span className="flex-[30] text-center text-grey-500 font-medium">
                SI. No
              </span>
              <span className="flex-[35] text-left text-grey-500 font-medium">
                Player Name
              </span>
              <span className="flex-[35] text-left text-grey-500 font-medium">
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
                  <span className="flex-[30] text-center text-grey-900 font-medium">
                    {((currentPage - 1) * playerLimit + index + 1)
                      .toString()
                      .padStart(2, "0")}
                    .
                  </span>
                  <span className="flex-[35] text-left text-grey-600 font-medium">
                    {participant?.players?.map((p) => p.name).join(" & ")}
                  </span>
                  <span className="flex-[35] text-left text-grey-500 font-medium">
                    {participant?.players?.map((p) => p.phone).join(" , ")}
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
