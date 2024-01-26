/// Stores the current location for the user
// used to find nearest supermarkets.

import { createSlice } from "@reduxjs/toolkit";
import { retrieveStore, saveStore } from "../storage";

const lSState = retrieveStore("location");
const initialState = { location: {}, uiSearchResults: [], uiError: "", locationLastChanged: 0 };

const locationSlice = createSlice({
  name: "location",
  initialState: lSState || initialState,
  reducers: {
    setLocation: (state, { payload }) => {
      state.location = payload;
      state.locationLastChanged = new Date().getTime();
      saveStore("location", state);
    },
    setSearchResults: (state, { payload }) => {
      state.uiSearchResults = payload;
    },
    setError: (state, { payload }) => {
      state.uiError = payload;
    },
    setFullLocationState: (state, { payload }) => {
      state.location = payload.location;
      state.locationLastChanged = payload.locationLastChanged;
      state.uiSearchResults = payload.uiSearchResults;
      state.uiError = payload.uiError;
    },
  },
});

export const { setLocation, setSearchResults, setError, setFullLocationState } =
  locationSlice.actions;

export default locationSlice.reducer;

export const selectLocation = (state) => state.location.location;
export const selectSearchResults = (state) => state.location.uiSearchResults;
export const selectError = (state) => state.location.uiError;
