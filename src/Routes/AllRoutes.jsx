import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Page/Home";
import Authentication from "../Authentication/Authentication";
import Layout from "../Component/Layout";
import VenueInfo from "../Component/Venue/CreateVenue";
import VenueDescription from "../Component/Venue/VenueDetails";
import { CourtCreation } from "../Component/Venue/CreateCourt";
import VenueListing from "../Component/Venue/VenueListing";
import NotCreated from "../Component/Common/NotCreated";
import TournamentCreationForm from "../Component/Tournament/TournamentNav";
import TournamentListing from "../Component/Tournament/TournamentListing";
import EventDetailPage from "../Component/Tournament/Event/EventDetails";
import NotFound from "../Component/Common/NotFound";
import WrapperLogin from "../Page/Login";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Authentication>
              <Layout />
            </Authentication>
          }
        >
          <Route
            index
            element={<NotCreated message="Welcome to oms of the picklebay" />}
          ></Route>
          <Route path="tournaments">
            <Route index element={<TournamentListing />} />
            <Route path="add">
              <Route index element={<TournamentCreationForm />} />
            </Route>
            <Route path=":tournamentId">
              <Route path="add" element={<TournamentCreationForm />} />
              <Route path="edit" element={<TournamentCreationForm />} />
              <Route path="event">
                <Route path=":eventId" element={<EventDetailPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="home" element={<Home />} />
          <Route path="venues">
            <Route index element={<VenueListing />} />
            <Route path="new" element={<VenueInfo />} />

            <Route path=":id">
              <Route index element={<VenueDescription />} />
              <Route path="add-court" element={<CourtCreation />} />
              <Route path="edit-court" element={<CourtCreation />} />
              <Route path="edit" element={<VenueInfo />} />
            </Route>
          </Route>

          <Route path="venue-organisers">
            <Route
              index
              element={
                <NotCreated
                  message="Currenlty No venue organisers are present. Please create the venue organisers to get started."
                  buttonText="Add Venue Organiser"
                  disable={true}
                />
              }
            />
          </Route>
          <Route path="tournament-organisers">
            <Route
              index
              element={
                <NotCreated
                  message="Currenlty No tournament organisers are present. Please create the tournament organisers to get started."
                  buttonText="Add Tournament Organiser"
                  disable={true}
                />
              }
            />
          </Route>
          <Route path="tournament-bookings">
            <Route
              index
              element={
                <NotCreated
                  message="Currenlty No tournament bookings are present."
                  buttonText=""
                  disable={true}
                />
              }
            />
          </Route>
          <Route path="court-bookings">
            <Route
              index
              element={
                <NotCreated
                  message="Currenlty No court bookings are present."
                  buttonText=""
                  disable={true}
                />
              }
            />
          </Route>
          <Route path="users">
            <Route
              index
              element={
                <NotCreated
                  message="Currenlty No users are present. Please create the users to get started."
                  buttonText="Add User"
                  disable={true}
                />
              }
            />
          </Route>

          <Route path="dashboard">
            <Route
              index
              element={
                <NotCreated
                  message="Currenlty Nothing to display. Will update soon!"
                  buttonText=""
                  disable={true}
                />
              }
            />
          </Route>
        </Route>

        <Route path="/login" element={<WrapperLogin />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

export default AllRoutes;
