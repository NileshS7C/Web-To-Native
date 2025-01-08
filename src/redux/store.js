import { configureStore } from "@reduxjs/toolkit";
import tournamentReducer from "./tournament/addTournament";
import authReducer from "./Authentication/authSlice";
import tournamentFormReducer from "./tournament/formSlice";
import venueReducer from "./Venue/addVenue";
import eventReducer from "./tournament/eventSlice";
import navReducer from "./NavBar/navSlice";
import logger from "redux-logger";
import getAllVenues from "./Venue/getVenues";
import addCourtReducers from "./Venue/addCourt";
import errorReducer from "./Error/errorSlice";
import successReducer from "./Success/successSlice";
import confirmReducer from "./Confirmation/confirmationSlice";
import deleteVenueReducer from "./Venue/deleteVenue";
import uploadReducer from "./Upload/uploadImage";
import axiosInstance, { setupAxiosInterceptors } from "../Services/axios";
import { refreshTokens } from "./Authentication/authActions";

const middleWares = [];
if (process.env.NODE_ENV === "development") {
  middleWares.push(logger);
}

const store = configureStore({
  reducer: {
    auth: authReducer,
    Tournament: tournamentReducer,
    tournamentForm: tournamentFormReducer,
    event: eventReducer,
    Venue: venueReducer,
    Nav: navReducer,
    getVenues: getAllVenues,
    addCourt: addCourtReducers,
    error: errorReducer,
    success: successReducer,
    confirm: confirmReducer,
    deleteVenue: deleteVenueReducer,
    upload: uploadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleWares),
  devTools: true,
});

setupAxiosInterceptors(store.getState, store.dispatch, refreshTokens);

export default store;
