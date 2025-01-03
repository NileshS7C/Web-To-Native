import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Page/Home";
import Authentication from "../Authentication/Authentication";
import Login from "../Page/Login";
import Tournament from "../Page/Tournament";
import Layout from "../Component/Layout";
import Court from "../Page/Venue";
import VenueInfo from "../Component/Venue/CreateVenue";
import VenueDescription from "../Component/Venue/VenueDetails";
import { CourtCreation } from "../Component/Venue/CreateCourt";
import VenueListing from "../Component/Venue/VenueListing";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="tournaments" element={<Tournament />} />
          <Route path="home" element={<Home />} />
          <Route path="venues">
            <Route index element={<VenueListing />} />
            <Route path="add" element={<VenueInfo />} />
            <Route path=":id">
              <Route index element={<VenueDescription />} />
              <Route path="add-court" element={<CourtCreation />} />
              {/* <Route path="courts/:courtId" element={<CourtDetails />} /> */}
            </Route>
          </Route>
          {/* <Route path="venues" element={<Court />}></Route>
          <Route path="venues/create" element={<VenueInfo />}></Route>
          <Route path="venues/:id" element={<VenueDescription />}></Route>
          <Route
            path="venues/:id/createCourt"
            element={<CourtCreation />}
          ></Route> */}
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
