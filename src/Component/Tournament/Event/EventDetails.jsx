import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { getSingleTournament } from "../../../redux/tournament/tournamentActions";
import Tabs from "../../Common/Tabs";
import EventDescription from "./EventDescription";
import EventRegistrations from "./EventRegistration";

const options = (tournamentId, eventId) => {
  return [
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
      name: "Fixture",
      href: "#",
      current: false,
      search: "?tab=fixture",
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
      name: "Standing",
      href: "#",
      current: false,
      search: "?tab=standing",
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
};

function EventDetailPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tournamentId, eventId } = useParams();
  const [selectedTab, setSelectedTab] = useState("");
  const eventTabOptions = options(tournamentId, eventId);
  const currentTab = searchParams.get("tab");
  const { tournament } = useSelector((state) => state.GET_TOUR);

  useEffect(() => {
    if (tournamentId) {
      dispatch(getSingleTournament(tournamentId));
    }
  }, [tournamentId]);

  useEffect(() => {
    setSelectedTab(currentTab);
  }, [currentTab]);
  return (
    <div>
      <div className="bg-[#FFFFFF] p-[10px] rounded-md text-[#232323] mb-4">
        <Tabs options={eventTabOptions} hasLink={true} />
      </div>
      {(!selectedTab || selectedTab === "overview") && <EventDescription />}
      {selectedTab === "players" && (
        <EventRegistrations tournament={tournament} />
      )}
    </div>
  );
}

export default EventDetailPage;
