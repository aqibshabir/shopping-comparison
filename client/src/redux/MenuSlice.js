import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { saveStore } from "../storage";
import axios from "axios";
import { apiURL } from "../config";
const initialState = {
  favourites: [],
  ingredients: [],
  FavDetails: [],
};
export const getFavourites = createAsyncThunk(
  "getFavourites",
  async (thunkAPI) => {
    //http will change
    const { data } = await axios.get(`${apiURL()}/favourites`);
    return data;
  }
);
// const lSState = retrieveStore("counterSlice");
export const resetMeals = (state) => {
  state.meals = [];
};
export const counterSlice = createSlice({
  name: "counter",
  initialState: initialState, //put LLState back in later

  reducers: {
    setMeals: (state, { payload }) => {
      state.meals = payload;
    },
    setRecipes: (state, { payload }) => {
      state.recipe = payload;
    },

    setIngredients: (state, { payload }) => {
      if (state.ingredients.includes(payload)) {
        return;
      }
      state.ingredients.push(payload);
    },
    setFavourite: (state, { payload }) => {
      const index = state.favourites.findIndex((item) => {
        return item.id === payload.id;
      });
      // console.log(index);
      if (index !== -1) {
        return;
      } else {
        state.favourites.push(payload);
      }
    },
    setState: (state, { payload }) => {
      state.FavDetails.push(payload);
      saveStore("FavMenu", state.FavDetails);
    },
    deleteInput: (state, { payload }) => {
      const ingredients = [...state.ingredients];
      const index = ingredients.findIndex((item) => {
        return item === payload;
      });
      // console.log(payload);
      if (index > -1) {
        ingredients.splice(index, 1);
        state.ingredients = ingredients;
      }
    },
    setActive: (state, { payload }) => {
      const meals = [...state.meals];
      state.meals.forEach((item) => {
        item.active = false;
      });
      const index = meals.findIndex((item) => {
        return item.id === payload.id;
      });
      console.log(state.meals[index]);
      state.meals[index].active = payload.status;
    },
    setReset: (state, { payload }) => {
      const meals = [...state.meals];
      state.meals.forEach((item) => {
        item.active = false;
      });
      const favourites = [...state.favourites];
      state.favourites.forEach((item) => {
        item.active = false;
      });
    },
    // //repeat above - replace active with clicked - add to actions
    // setClicked: (state, { payload }) => {
    //   const meals = [...state.meals];
    //   const index = meals.findIndex((item) => {
    //     return item.id === payload;
    //   });
    //   state.meals[index].clicked = !meals[index].clicked;
    // },
    setActiveFavourites: (state, { payload }) => {
      const favourites = [...state.favourites];
      const index = favourites.findIndex((item) => {
        return item.id === payload;
      });
      state.favourites[index].active = !favourites[index].active;
    },

    deleteCard: (state, { payload }) => {
      const favourites = [...state.favourites];
      const index = favourites.findIndex((item) => {
        return item.id === payload;
      });
      // console.log(index);
      if (index > -1) {
        favourites.splice(index, 1);
        state.favourites = favourites;
      }
    },
  },
  extraReducers: {
    [getFavourites.fulfilled]: (state, { payload }) => {
      state.favourites = payload;
    },
  },
});

export const {
  setMeals,
  toggleWant,
  setIngredients,
  deleteInput,
  setRecipes,
  setFavourite,
  setState,
  deleteCard,
  setActive,
  setActiveFavourites,
  setClicked,
  setReset,
} = counterSlice.actions;
export const selectMeals = (state) => state.counter.meals;
export const selectRecipe = (state) => state.counter.recipe;

export const selectIngredients = (state) => state.counter.ingredients;
export const selectFavourites = (state) => state.counter.favourites;

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const selectCount = (state) => state.counter.value;

export default counterSlice.reducer;
