import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setContent: (state, { payload }) => {
      state.content = payload;
    },
  },
});

export const { setContent } = messageSlice.actions;
export const selectContent = (state) => state.message.content;

export default messageSlice.reducer;
