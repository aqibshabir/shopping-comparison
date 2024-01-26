import { createSlice } from "@reduxjs/toolkit";
import { retrieveStore, saveStore } from "../storage";

const initialState = {
  isLoggedIn: true,
  email: null,
  password: null,
  hasNectarCard: false,
  hasTescoCard: false,
  hasAsdaCard: false,
  hasMorrisonsCard: false,
  hasWaitroseCard: false,
  hasIcelandCard: false,
};

const lSState = retrieveStore("userSlice");

const userSlice = createSlice({
  name: "user",
  initialState: lSState || initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
      saveStore("userSlice", state);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      saveStore("userSlice", state);
    },

    forgotPassword: (state) => {
      state.isLoggedIn = false;
      saveStore("userSlice", state);
    },

    createUser: (state, action) => {
      const {
        email,
        password,
        hasNectarCard,
        hasTescoCard,
        hasAsdaCard,
        hasMorrissonsCard,
        hasWaitroseCard,
        hasIcelandCard,
      } = action.payload;
      state.email = email;
      state.password = password;
      state.hasNectarCard = hasNectarCard || false;
      state.hasTescoCard = hasTescoCard || false;
      state.hasAsdaCard = hasAsdaCard || false;
      state.hasMorrisonsCard = hasMorrissonsCard || false;
      state.hasWaitroseCard = hasWaitroseCard || false;
      state.hasIcelandCard = hasIcelandCard || false;
      state.isLoggedIn = true;
      saveStore("userSlice", state);
    },
  },
});

export const { login, logout, createUser, forgotPassword } = userSlice.actions;
export const selectEmail = (state) => state.user.email;
export const selectPassword = (state) => state.user.password;
export const selectHasNectarCard = (state) => state.user.hasNectarCard;
export const selectHasTescoCard = (state) => state.user.hasTescoCard;
export const selectHasAsdaCard = (state) => state.user.hasAsdaCard;
export const selectHasMorrisonsCard = (state) => state.user.hasMorrisonsCard;
export const selectHasIcelandCard = (state) => state.user.hasIcelandCard;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;

export default userSlice.reducer;
