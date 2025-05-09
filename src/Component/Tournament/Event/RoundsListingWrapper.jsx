import { useState, useEffect } from "react";
import RoundTabs from "./RoundTabs";
import { IoMdAdd } from "react-icons/io";
import TournamentStandings from "../TournamentStandings";
import { TournamentFixture } from "../tournamentFixture";
import { MatchesListing } from "../MatchListing";
import RoundDetails from "./RoundDetails";
import RoundCreationModal from "./RoundCreationModal";
import { getFixture } from "../../../redux/tournament/fixturesActions";
import { useDispatch, useSelector } from "react-redux";
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
    toggleModal();
  };

  const {
    fixture,
    isFixtureSuccess,
    isCreatingFixture,
    FixtureCreatedSuccess,
    FixtureCreationError,
    isFetchingFixture,
    ErrorMessage,
    isPublishing,
    isPublished,
    publishError,
  } = useSelector((state) => state.fixture);
  useEffect(() => {
    dispatch(getFixture({ tour_Id: tournamentId, eventId }));
  }, []);
  useEffect(()=>{
    setSelectedRoundIndex(0);
  },[fixture])
  return (
    <div className="flex w-full">
      {/* Sidebar for Rounds */}
      <div className="w-[20%] min-w-[200px] border-r p-4 space-y-2">
        {fixture?.fixtures?.map((_, index) => {
          const roundLabel = `Round ${index + 1}`;
          const isSelected = selectedRoundIndex === index;
          return (
            <button
              key={roundLabel}
              onClick={() => {
                setSelectedRoundIndex(index);
                setActiveTab("Details");
              }}
              className={`font-medium w-full text-left px-3 py-2 rounded transition ${
                isSelected ? "text-richBlue-5" : "text-black"
              }`}
            >
              {roundLabel}
            </button>
          );
        })}

        <button
          className="flex items-center gap-2 text-sm font-medium text-black hover:text-blue-800 mt-4"
          onClick={() => {
            handleRoundAction("add");
          }}
        >
          <IoMdAdd className="text-lg" />
          Add New Round
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col p-2 w-[80%] gap-4">
        <div className="bg-white p-0 pt-1 rounded-md text-[#232323] w-full">
          <RoundTabs
            options={options()}
            selected={activeTab}
            onChange={handleTabChange}
          />
        </div>

        {/* Content Area */}
        <div>
          {activeTab.toLowerCase() === "details" && (
            <RoundDetails
              name={fixture?.fixtures[selectedRoundIndex]?.name || ""}
              format={fixture?.fixtures[selectedRoundIndex]?.format || ""}
              participants={
                fixture?.fixtures[selectedRoundIndex]?.bracketData
                  ?.participant || []
              }
              onRoundActionClick={handleRoundAction}
              fixtureId={fixture?.fixtures[selectedRoundIndex]?._id.toString()}
            />
          )}
          {activeTab.toLowerCase() === "fixture" && (
            <TournamentFixture tournament={tournament} />
          )}
          {activeTab.toLowerCase() === "matches" && <MatchesListing />}
          {activeTab.toLowerCase() === "standing" && (
            <TournamentStandings
              tournamentId={tournamentId}
              categoryId={eventId}
            />
          )}
        </div>
      </div>

      <div>
        {isModalOpen && (
          <RoundCreationModal
            toggleModal={toggleModal}
            actionType={actionType}
            roundDetails={
              actionType === "edit"
                ? fixture?.fixtures[selectedRoundIndex] || {}
                : {}
            }
            roundIndex={selectedRoundIndex}
            tournamentId={tournamentId}
            categoryId={eventId}
          />
        )}
      </div>
    </div>
  );
};

export default RoundsListingWrapper;
