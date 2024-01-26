import { configureStore } from "@reduxjs/toolkit";
import shoppingListReducer from "./shoppingListSlice";
import counterReducer from "./MenuSlice";
import userReducer from "./userSlice";
import dataReducer from "./dataSlice";
import locationReducer from "./locationSlice";
import messageReducer from "./messageSlice";

export const store = configureStore({
  reducer: {
    shoppinglists: shoppingListReducer,
    counter: counterReducer,
    user: userReducer,
    data: dataReducer,
    location: locationReducer,
    message: messageReducer,
  },
});
