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
import TournamentCreationForm from "../Component/Tournament/TournamentNav";
import TournamentListing from "../Component/Tournament/TournamentListing";

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
            <Route path="add" element={<TournamentCreationForm />} />
            <Route path=":id">
              <Route
                path="edit"
                element={<TournamentCreationForm />}
              />
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
      </Routes>
    </div>
  );
};

export default AllRoutes;
