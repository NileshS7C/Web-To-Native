import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { getSingleTournament } from "../../../redux/tournament/tournamentActions";
import Tabs from "../../Common/Tabs";
import EventDescription from "./EventDescription";
import EventRegistrations from "./EventRegistration";
import { TournamentFixture } from "../tournamentFixture";
import { MatchesListing } from "../MatchListing";
import { MatchStandings } from "../MatchStandings";
import { useOwnerDetailsContext } from "../../../Providers/onwerDetailProvider";
import TournamentStandings from "../TournamentStandings";
import Spinner from "../../Common/Spinner";
import RoundsListingWrapper from "./RoundsListingWrapper";
import ErrorBanner from "../../Common/ErrorBanner";
import { eventTabs } from "../../../Constant/event";
import EventAccessWrapper from "./EventAccessWrapper";
const options = ({ tournamentId, eventId, categoryFormat, role }) => {
  if (!categoryFormat || !role) return [];

  const formatKey = categoryFormat === "HYBRID" ? "HYBRID" : "DEFAULT";
  const baseTabs = eventTabs?.[role]?.[formatKey] || [];
  return baseTabs.map((tab, index) => ({
    ...tab,
    search: index === 0 ? "" : `?tab=${tab.name?.toLowerCase()}`,
    path: `/tournaments/${tournamentId}/event/${eventId}`,
  }));
 
};

function EventDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tournamentId, eventId } = useParams();
  const [categoryData, setcategoryData] = useState({});
  const [selectedTab, setSelectedTab] = useState("");
  const currentTab = searchParams.get("tab");
  const { tournament, isSuccess, hasErrorInTournament, isGettingTournament } =
    useSelector((state) => state.GET_TOUR);
  const { singleTournamentOwner = {},rolesAccess } = useOwnerDetailsContext();

  useEffect(() => {
    const event = tournament?.categories?.find((tmt) => {
      return tmt._id.toString() === eventId;
    });
    setcategoryData(event || {});
  }, [tournament, eventId]);

  useEffect(() => {
    if (tournamentId && singleTournamentOwner) {
      console.log("singletournamentId", tournamentId);
      console.log("singleTournamentOwner", singleTournamentOwner?.id);
      dispatch(
        getSingleTournament({
          tournamentId,
          ownerId: singleTournamentOwner?.id
        })
      );
    }
  }, [tournamentId, singleTournamentOwner]);

  useEffect(() => {
    setSelectedTab(currentTab);
    if (currentTab !== "rounds") {
      searchParams.delete("round");
      searchParams.delete("view");
      setSearchParams(searchParams);
    }
  }, [currentTab]);

  useEffect(() => {
    if (categoryData?.format !== "HYBRID" && currentTab === "rounds") {
      navigate(`/tournaments/${tournamentId}/event/${eventId}`);
    }
  }, [currentTab]);

  if (isGettingTournament) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  if (hasErrorInTournament) {
    return (
      <ErrorBanner message="We're having trouble loading category information right now. Please try again later." />
    );
  }
 
  const tabComponents = {
    fixture: <TournamentFixture tournament={tournament} />,
    matches: <MatchesListing />,
    standing: (
      <TournamentStandings tournamentId={tournamentId} categoryId={eventId} />
    ),
    rounds: (
      <RoundsListingWrapper
        tournamentId={tournamentId}
        eventId={eventId}
        tournament={tournament}
      />
    )
  };

  return (
    <div>
      <div className="bg-[#FFFFFF] p-[10px] rounded-md text-[#232323] mb-4">
        <Tabs
          options={options({
            tournamentId,
            eventId,
            categoryFormat: categoryData?.format || false,
            role: rolesAccess?.tournament || "DEFAULT",
          })}
          hasLink={true}
        />
      </div>

      {(!selectedTab || selectedTab === "overview") && (
        <EventDescription categoryData={categoryData} />
      )}

      {selectedTab === "players" && <EventRegistrations />}

      {tabComponents[selectedTab] && (
        <EventAccessWrapper>{tabComponents[selectedTab]}</EventAccessWrapper>
      )}
    </div>
  );
}


export default EventDetailPage;
