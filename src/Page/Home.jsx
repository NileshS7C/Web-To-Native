import React from "react";
import NotCreated from "../Component/Common/NotCreated";
import { NavBar } from "../Component/SideNavBar/NavBar";
import TournamentCreationForm from "../Component/Tournament/TournamentNav";
import VenueNavBar from "../Component/Venue/VenueNavBar";
import { useDispatch, useSelector } from "react-redux";
const renderSelectedComponent = (selected, tounrnaments) => {
  switch (selected) {
    case "Tournaments":
      return tounrnaments.length > 0 ? (
        <TournamentCreationForm />
      ) : (
        <NotCreated
          message="You haven't created any tournaments yet! Start by adding a new tournament."
          buttonText="Add Tournament"
        />
      );
    case "Venues":
      return true ? (
        <VenueNavBar />
      ) : (
        <NotCreated
          message="You haven't created any Venue yet! Start by adding a new Venue."
          buttonText="Add Venue"
          type="court"
        />
      );
    case "Overview":
      return (
        <NotCreated
          message="You haven't created any Venue yet! Start by adding a new Venue."
          buttonText="Add Venue"
          type="court"
        />
      );
    default:
      return <div>Please select a valid option.</div>;
  }
};

function Home() {
  const dispatch = useDispatch();
  const { tounrnaments, error, isLoading, currentStep, selected } = useSelector(
    (state) => ({
      tounrnaments: state.Tournament.tounrnaments,
      error: state.Tournament.error,
      isLoading: state.Tournament.isLoading,
      currentStep: state.Tournament.currentStep,
      selected: state.Nav.selected,
    })
  );

  return (
    <div
      className="grid h-screen bg-[#F5F7FA]"
      style={{ gridTemplateColumns: "minmax(200px, 250px) 1fr" }}
    >
      <div className="bg-[#FFFFFF]">
        <NavBar />
      </div>
      <div className="p-[50px] rounded-3xl">
        {renderSelectedComponent(selected, tounrnaments)}
      </div>
    </div>
  );
}

export default Home;
