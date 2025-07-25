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

import Explore from "../Page/CMS/Homepage/Explore";
import FeaturedTournaments from "../Page/CMS/Homepage/FeaturedTournaments";
import FeaturedSocialEvents from "../Page/CMS/FeaturedSocialEvents";
import FeaturedWeek from "../Page/CMS/Homepage/FeaturedWeek";
import FeaturedVenues from "../Page/CMS/Homepage/FeaturedVenues";
import FAQ from "../Page/CMS/StaticPages/FAQ";

import BlogPosts from "../Page/CMS/BlogPage/BlogPosts";
import CreateBlogPost from "../Component/CMS/BlogPage/CreateBlogPost";
import EditBlogPost from "../Component/CMS/BlogPage/EditBlogPost";
import WhyChoosePickleBay from "../Page/CMS/Homepage/WhyChoosePickleBay";
import DestinationDink from "../Page/CMS/Homepage/DestinationDink";
import Journal from "../Page/CMS/Homepage/Journal";
import BuildCourts from "../Page/CMS/Homepage/BuildCourts";
import NewsUpdates from "../Page/CMS/Homepage/NewsUpdates";

import TournamentCreationForm from "../Component/Tournament/TournamentNav";
// import TournamentListing from "../Component/Tournament/TournamentListing";
import TournamentListingWrapper from "../Component/Tournament/TournamentListing";
import EventDetailPage from "../Component/Tournament/Event/EventDetails";
import NotFound from "../Component/Common/NotFound";
import WrapperLogin from "../Page/Login";
import { FormikContextProvider } from "../Providers/formikContext";
import TermsCondition from "../Page/CMS/StaticPages/TermsCondition";
import RefundCancellation from "../Page/CMS/StaticPages/RefundCancellation";
import PrivacyPolicy from "../Page/CMS/StaticPages/PrivacyPolicy";
import Guidelines from "../Page/CMS/StaticPages/PickleBayGuidelines";
import TournamentOrganisersPage from "../Page/TournamentOrganisers";
import FAQS from "../Page/CMS/Homepage/FAQ";
import ProfilePage from "../Page/Profile";
import SocialEvents from "../Page/SocialEvents";

import { UploadedImages } from "../Page/UploadedImages";
import TopBanner from "../Component/CMS/TourismPages/TopBanner/TopBanner";
import PackageSection from "../Page/CMS/Homepage/PackageSection";
import Instagram from "../Component/CMS/TourismPages/Instagram/Instagram";
import MediaGallery from "../Page/CMS/Homepage/MediaGallery";
import PlayersManager from "../Page/Player";
import { OwnerDetailContextProvider } from "../Providers/onwerDetailProvider";
import CreateCoupons from "../Component/Coupons/CreateCoupons";
import CouponDetails from "../Component/Coupons/CouponDetails";
import Coupons from "../Page/Coupons";
import { aboutUsNav } from "../Constant/Cms/aboutUsPage";
import DashBoard from '../Page/DashBoard'
import Admin from "../Page/Admin";
import AddSocialEvents from "../Component/SocialEvents/AddSocialEvents";
import EventDetails from "../Component/SocialEvents/EventDetails";
import EventOwners from "../Page/EventOwners";
import AddEventOwner from "../Component/EventOwners/AddEventOwner";
const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Authentication>
              <OwnerDetailContextProvider>
                <FormikContextProvider>
                  <Layout />
                </FormikContextProvider>
              </OwnerDetailContextProvider>
            </Authentication>
          }
        >
          <Route
            index
            path="/"
            element={
              <DashBoard/>
            }
          />

          <Route path="admin-users" element={<Admin />} />

          <Route path="tournaments">
            <Route index element={<TournamentListingWrapper />} />
            <Route path="add">
              <Route index element={<TournamentCreationForm />} />
            </Route>
            <Route path=":tournamentId">
              <Route index element={<TournamentCreationForm />} />
              <Route path="add" element={<TournamentCreationForm />} />
              <Route path="event">
                <Route path=":eventId" element={<EventDetailPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="event-organisers" element={<EventOwners />} />
          <Route path="event-organisers/add" element={<AddEventOwner />} />
          <Route path="social-events" element={<SocialEvents />} />
          <Route path="social-events/add" element={<AddSocialEvents />} />
          <Route path="social-events/:eventId" element={<EventDetails />} />
          <Route path="social-events/:eventId/acknowledgement" element={<AddSocialEvents />} />
          <Route path="home" element={<Home />} />
          <Route path="players" element={<PlayersManager />} />
          <Route path="coupons/new" element={<CreateCoupons />} />
          <Route path="coupons/:couponCode" element={<CouponDetails />} />
          <Route path="coupons" element={<Coupons />} />

          {/* CMS Routes */}
          <Route path="cms/homepage/explore" element={<Explore />} />
          <Route
            path="cms/homepage/featured-events"
            element={<FeaturedTournaments />}
          />
          <Route
            path="cms/social-events/featured-social-events"
            element={<FeaturedSocialEvents />}
          />
          <Route path="cms/homepage/featured-week" element={<FeaturedWeek />} />
          <Route
            path="cms/homepage/featured-venues"
            element={<FeaturedVenues />}
          />

          <Route path="cms/static-pages/help-&-faqs" element={<FAQ />} />
          <Route path="cms/blogs/blog-posts">
            <Route index element={<BlogPosts />} />
            <Route path="new" element={<CreateBlogPost />} />
            <Route path=":handle" element={<EditBlogPost />} />
          </Route>

          <Route
            path="cms/homepage/why-choose-picklebay"
            element={<WhyChoosePickleBay />}
          />
          <Route
            path="cms/homepage/destination-dink"
            element={<DestinationDink />}
          />
          <Route path="cms/homepage/build-courts" element={<BuildCourts />} />
          <Route path="cms/homepage/faqs" element={<FAQS />} />
          <Route path="cms/homepage/journal" element={<Journal />} />
          <Route path="cms/homepage/news-&-update" element={<NewsUpdates />} />
          <Route path="cms/static-pages/help-&-faqs" element={<FAQ />} />
          <Route
            path="cms/static-pages/terms-&-condition"
            element={<TermsCondition />}
          />
          <Route
            path="cms/static-pages/refunds-&-cancellation"
            element={<RefundCancellation />}
          />
          <Route
            path="cms/static-pages/privacy-policy"
            element={<PrivacyPolicy />}
          />
          <Route
            path="cms/static-pages/picklebay-guidelines"
            element={<Guidelines />}
          />

          {/* About us page routes */}

          <Route path="cms">
            <Route path="about-us-page">
              {aboutUsNav.map((nav) => (
                <Route key={nav.path} path={nav.path} element={nav.element} />
              ))}
            </Route>
          </Route>

          {/* Ends Here */}



          {/* Tourism page routes*/}
          <Route path="cms/tourism-page/top-banner" element={<TopBanner />} />
          <Route path="cms/tourism-page/package-section" element={<PackageSection/>}/>
          <Route path="cms/tourism-page/instagram" element={<Instagram/>}/>
          <Route path="cms/tourism-page/media-gallery" element={<MediaGallery/>}/>
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

          <Route path="venue-organisers">
            <Route
              index
              element={
                <NotCreated
                  message="Currently No venue organisers are present. Please create the venue organisers to get started."
                  buttonText="Add Venue Organiser"
                  disable={true}
                />
              }
            />
          </Route>
          <Route path="tournament-organisers">
            <Route index element={<TournamentOrganisersPage />} />
          </Route>
          <Route path="tournament-bookings">
            <Route
              index
              element={
                <NotCreated
                  message="Currently No tournament bookings are present."
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
                  message="Currently No court bookings are present."
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
                  message="Currently No users are present. Please create the users to get started."
                  buttonText="Add User"
                  disable={true}
                />
              }
            />
          </Route>

          <Route path="profile">
            <Route index element={<ProfilePage />} />
          </Route>
          <Route path="uploaded-images">
            <Route index element={<UploadedImages />} />
          </Route>
        </Route>

        <Route path="/login" element={<WrapperLogin />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

export default AllRoutes;
