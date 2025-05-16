import { useState, useEffect } from "react";
import RoundTabs from "./RoundTabs";
import { IoMdAdd } from "react-icons/io";
import TournamentHybridStandings from "../TournamentHybridStanding";
import { TournamentFixture } from "../tournamentFixture";
import RoundDetails from "./RoundDetails";
import Spinner from "../../Common/Spinner";
import RoundCreationModal from "./RoundCreationModal";
import { getFixtureById, getHybridFixtures } from "../../../redux/tournament/fixturesActions";
import { useDispatch, useSelector } from "react-redux";
import { HybridMatchesListing } from "../HybridMatchListing";
import { ErrorModal } from "../../Common/ErrorModal";
import { showError } from "../../../redux/Error/errorSlice";
import { MatchesListing } from "../MatchListing";
import { TournamentHybridFixture } from "../TournamentHybridFixture";
const options = () => [
  { name: "Details" },
  { name: "Fixture" },
  { name: "Matches" },
  { name: "Standing" },
];

const RoundsListingWrapper = ({ tournamentId, eventId, tournament }) => {
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Details");
  const dispatch = useDispatch();
  const [actionType, setActionType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabChange = (tabName) => setActiveTab(tabName);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleRoundAction = (type) => {
    setActionType(type);
    if (["add", "edit"].includes(type)) {
      toggleModal();
    }
  };
  const {
    fixtures,
    isFetchingHybridFixtures,
    isHybridFixtureSuccess,
    isHybridFetchingError,
    ErrorMessage,
  } = useSelector((state) => state.fixture);
  useEffect(() => {
    dispatch(getHybridFixtures({ tour_Id: tournamentId, eventId }));
  }, []);

  useEffect(() => {
    if (isHybridFixtureSuccess && ["add"].includes(actionType)) {
      setSelectedRoundIndex(fixtures?.length - 1);
      setActiveTab("Details");
    } else if (isHybridFixtureSuccess && ["delete"].includes(actionType)) {
      setSelectedRoundIndex(0);
      setActiveTab("Details");
    }
  }, [isHybridFixtureSuccess, fixtures]);

  useEffect(() => {
    if (fixtures?.[selectedRoundIndex]?._id?.toString()) {
      setTimeout(() => {
        dispatch(
          getFixtureById({
            tour_Id: tournamentId,
            eventId,
            fixtureId: fixtures?.[selectedRoundIndex]?._id?.toString(),
          })
        );
      }, 500);
    }
  }, [selectedRoundIndex]);
  useEffect(() => {
    if (isHybridFetchingError) {
      dispatch(
        showError({
          message:
            ErrorMessage ||
            "Oops! something went wrong while fetching fitures.",
          onClose: "hideError",
        })
      );
    }
  }, [isHybridFetchingError]);
  if (isFetchingHybridFixtures) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      {fixtures?.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 pt-4 sm:pt-8">
          <div className="text-md sm:text-xl text-black font-medium w-[60%] sm:w-[45%] text-center">
            <p>Looks like there are no rounds yet.</p>
            <p>Click below to create your first round.</p>
          </div>

          <button
            className="px-8 py-3 rounded-lg bg-richBlue-5 text-white font-medium text-md"
            onClick={() => {
              handleRoundAction("add");
            }}
          >
            Add New Round
          </button>
        </div>
      )}

      {fixtures?.length > 0 && (
        <div className="flex flex-col md:flex-row w-full">
          {/* Sidebar for Rounds */}
          <div className="flex md:flex-col w-full md:w-[20%] md:min-w-[200px] md:border-r md:p-4 md:space-y-2 gap-2 md:gap-0">
            {/* Mobile dropdown (only visible on small screens) */}
            <div className="block md:hidden w-full flex flex-col sm:flex-row sm:mb-2 md:mb-0 gap-2">
              <select
                className="w-full sm:w-[50%] py-2 pl-3 pr-8 border rounded-md text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#1570EF]"
                value={selectedRoundIndex}
                onChange={(e) => {
                  setSelectedRoundIndex(Number(e.target.value));
                  setActiveTab("Details");
                }}
              >
                {fixtures?.map((_, index) => (
                  <option key={index} value={index}>
                    {`Round ${index + 1}`}
                  </option>
                ))}
              </select>

              <button
                className="flex items-center gap-1 text-sm font-medium text-black text-richBlue-5 hover:text-richBlue-600 mt-4 mb-2 md:mb-0"
                onClick={() => handleRoundAction("add")}
              >
                <IoMdAdd className="text-lg" />
                Add New Round
              </button>
            </div>

            {/* Desktop round list (hidden on small screens) */}
            <div className="hidden md:flex md:flex-col w-full space-y-1">
              {fixtures?.map((_, index) => {
                const roundLabel = `Round ${index + 1}`;
                const isSelected = selectedRoundIndex === index;
                return (
                  <button
                    key={roundLabel}
                    onClick={() => {
                      setSelectedRoundIndex(index);
                      setActiveTab("Details");
                    }}
                    className={`font-medium w-full text-left px-3 py-[5px] rounded transition ${
                      isSelected ? "text-richBlue-5" : "text-black"
                    }`}
                  >
                    {roundLabel}
                  </button>
                );
              })}

              <button
                className="flex items-center gap-2 text-sm font-medium text-black hover:text-blue-800 mt-4"
                onClick={() => handleRoundAction("add")}
              >
                <IoMdAdd className="text-lg" />
                Add New Round
              </button>
            </div>

            <div className="sm:hidden  sm:p-0 sm:pt-1 rounded-md text-[#232323] w-full">
              <RoundTabs
                options={options()}
                selected={activeTab}
                onChange={handleTabChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:p-2 w-full md:w-[80%] gap-4">
            <div className="hidden sm:block bg-white p-0 pt-1 rounded-md text-[#232323] w-full">
              <RoundTabs
                options={options()}
                selected={activeTab}
                onChange={handleTabChange}
              />
            </div>

            {/* Content Area */}
            {isHybridFixtureSuccess && (
              <div>
                {activeTab.toLowerCase() === "details" && (
                  <RoundDetails
                    onRoundActionClick={handleRoundAction}
                    fixtureId={fixtures[selectedRoundIndex]?._id.toString()}
                    selectedRoundIndex={selectedRoundIndex}
                  />
                )}
                {activeTab.toLowerCase() === "fixture" && (
                  // <TournamentFixture tournament={tournament} />
                  <TournamentHybridFixture
                    tournament={tournament}
                    fixtureId={fixtures[selectedRoundIndex]?._id.toString()}
                  />
                )}
                {activeTab.toLowerCase() === "matches" && (
                  <HybridMatchesListing
                    fixtureId={fixtures[selectedRoundIndex]?._id.toString()}
                  />
                )}
                {activeTab.toLowerCase() === "standing" && (
                  <TournamentHybridStandings
                    tournamentId={tournamentId}
                    categoryId={eventId}
                    fixtureId={fixtures[selectedRoundIndex]?._id.toString()}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {isModalOpen && (
        <RoundCreationModal
          toggleModal={toggleModal}
          actionType={actionType}
          roundIndex={selectedRoundIndex}
          tournamentId={tournamentId}
          categoryId={eventId}
          fixtureId={fixtures[selectedRoundIndex]?._id.toString()}
        />
      )}
    </>
  );
};

export default RoundsListingWrapper;
