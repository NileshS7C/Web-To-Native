import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

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
const options = (tournamentId, eventId, categoryFormat) => {
  const baseTabs = [
    {
      name: "Overview",
      href: "#",
      current: true,
      search: "",
      path: `/tournaments/${tournamentId}/event/${eventId}`,
    },
    {
      name: "Players",
      href: "#",
      current: false,
      search: "?tab=players",
      path: `/tournaments/${tournamentId}/event/${eventId}`,
    },
    {
      name: "Matches",
      href: "#",
      current: false,
      search: "?tab=matches",
      path: `/tournaments/${tournamentId}/event/${eventId}`,
    },
    {
      name: "Staff",
      href: "#",
      current: false,
      search: "?tab=staff",
      path: `/tournaments/${tournamentId}/event/${eventId}`,
    },
    {
      name: "Report",
      href: "#",
      current: false,
      search: "?tab=report",
      path: `/tournaments/${tournamentId}/event/${eventId}`,
    },
  ];

  const hybridTabs = [
    {
      name: "Rounds",
      href: "#",
      current: false,
      search: "?tab=rounds",
      path: `/tournaments/${tournamentId}/event/${eventId}`,
    },
  ];

  const nonHybridTabs = [
    {
      name: "Fixture",
      href: "#",
      current: false,
      search: "?tab=fixture",
      path: `/tournaments/${tournamentId}/event/${eventId}`,
    },
    {
      name: "Standing",
      href: "#",
      current: false,
      search: "?tab=standing",
      path: `/tournaments/${tournamentId}/event/${eventId}`,
    },
  ];

  return categoryFormat === "HYBRID"
    ? [...baseTabs.slice(0, 2), ...hybridTabs, ...baseTabs.slice(3)]
    : [...baseTabs.slice(0, 2), ...nonHybridTabs, ...baseTabs.slice(2)];
};

function EventDetailPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tournamentId, eventId } = useParams();
  const [eventData, setEventData] = useState({});
  const [selectedTab, setSelectedTab] = useState("");

  const currentTab = searchParams.get("tab");
  const { tournament, isSuccess, hasErrorInTournament, isGettingTournament } =
    useSelector((state) => state.GET_TOUR);
  const { singleTournamentOwner = {} } = useOwnerDetailsContext();
 useEffect(() => {
   const event = tournament?.categories?.find((tmt) => {
     return tmt._id.toString() === eventId;
   });
   setEventData(event || {});
 }, [tournament, eventId]);
 
  useEffect(() => {
    if (tournamentId && singleTournamentOwner) {
      dispatch(
        getSingleTournament({
          tournamentId,
          ownerId: singleTournamentOwner?.id,
        })
      );
    }
  }, [tournamentId]);

  useEffect(() => {
    setSelectedTab(currentTab);
    if (currentTab !== "rounds") {
      searchParams.delete("round");
      searchParams.delete("view");
      setSearchParams(searchParams);
    }
  }, [currentTab]);
   useEffect(() => {
     if (tournamentId && singleTournamentOwner) {
       dispatch(
         getSingleTournament({
           tournamentId,
           ownerId: singleTournamentOwner?.id,
         })
       );
     }
   }, [singleTournamentOwner]);
  if (isGettingTournament) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }
  return (
    <div>
      <div className="bg-[#FFFFFF] p-[10px] rounded-md text-[#232323] mb-4">
        <Tabs options={options(tournamentId, eventId, eventData?.format || "")} hasLink={true} />
      </div>

      {(!selectedTab || selectedTab === "overview") && <EventDescription />}
      {selectedTab === "players" && (
        <EventRegistrations tournament={tournament} />
      )}

      {selectedTab === "fixture" && (
        <TournamentFixture tournament={tournament} />
      )}

      {selectedTab === "matches" && <MatchesListing />}
      {selectedTab === "standing" && (
        // <MatchStandings tournamentId={tournamentId} eventId={eventId} />
        <TournamentStandings tournamentId={tournamentId} categoryId={eventId} />
      )}
      {selectedTab === "rounds" && (
        <RoundsListingWrapper
          tournamentId={tournamentId}
          eventId={eventId}
          tournament={tournament}
        />
      )}
    </div>
  );
}

export default EventDetailPage;
