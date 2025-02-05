import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
import locationReducer from "./Location/locationSlice";
import getTourna_Reducer from "./tournament/getTournament";
import tourBookingReducer from "./tournament/bookingSlice";
import fixtureReducer from "./tournament/fixtureSlice";
import axiosInstance, { setupAxiosInterceptors } from "../Services/axios";
import { refreshTokens } from "./Authentication/authActions";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
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
  location: locationReducer,
  GET_TOUR: getTourna_Reducer,
  tourBookings: tourBookingReducer,
  fixture: fixtureReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["Tournament"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleWares = [];
if (process.env.NODE_ENV === "development") {
  middleWares.push(logger);
}

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(middleWares),
  devTools: true,
});

export const persistor = persistStore(store);

setupAxiosInterceptors(store.getState, store.dispatch, refreshTokens);

export default store;
