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
import Explore from "../Page/CMS/Homepage/Explore";
import FeaturedTournaments from "../Page/CMS/Homepage/FeaturedTournaments";
import FeaturedWeek from "../Page/CMS/Homepage/FeaturedWeek";
import FeaturedVenues from "../Page/CMS/Homepage/FeaturedVenues";
import FAQ from "../Page/CMS/StaticPages/FAQ";
import WhyChoosePickleBay from "../Page/CMS/Homepage/WhyChoosePickleBay";
import DestinationDink from "../Page/CMS/Homepage/DestinationDink";
import Journal from "../Page/CMS/Homepage/Journal";
import BuildCourts from "../Page/CMS/Homepage/BuildCourts";
import NewsUpdates from "../Page/CMS/Homepage/NewsUpdates";


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
          <Route path="tournaments" element={<Tournament />} />
          <Route path="home" element={<Home />} />

          {/* CMS Routes */}
          <Route path="cms/homepage/explore" element={<Explore />} />
          <Route path="cms/homepage/featured-tournaments" element={<FeaturedTournaments />} />
          <Route path="cms/homepage/featured-week" element={<FeaturedWeek />} />
          <Route path="cms/homepage/featured-venues" element={<FeaturedVenues />} />
          <Route path="cms/homepage/why-choose-picklebay" element={<WhyChoosePickleBay />} />
          <Route path="cms/homepage/destination-dink" element={<DestinationDink />} />
          <Route path="cms/homepage/build-courts" element={<BuildCourts />} />
          <Route path="cms/homepage/journal" element={<Journal />} />
          <Route path="cms/homepage/news-&-update" element={<NewsUpdates />} />
          <Route path="cms/static-pages/help-&-faqs" element={<FAQ />} />
          {/* Ends Here */}

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
          <Route
            path="*"
            element={
              <NotCreated
                message="You have not created any tournaments yet. Create the tournament to get started."
                buttonText="Add Tournament"
                type="text"
              />
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
