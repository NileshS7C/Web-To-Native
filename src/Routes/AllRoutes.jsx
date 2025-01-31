import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Page/Home";
import Authentication from "../Authentication/Authentication";
import Login from "../Page/Login";
import Tournament from "../Page/Tournament";
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

import { useCookies } from "react-cookie";

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
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

export default AllRoutes;
