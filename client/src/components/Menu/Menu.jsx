import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIngredients, setMeals } from "../../redux/MenuSlice";
import Interface from "./Interface";

const Menu = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const getMeals = async (ingredients) => {
    const recipesIngredients = ingredients.join(",+");
    const { data } = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${recipesIngredients}&apiKey=cc2762232c0b413aa1ffa70d4ed048b2`
    );
    data.forEach((item) => {
      item["active"] = false;
      item["clicked"] = false;
    });

    dispatch(setMeals(data));
  };

  useEffect(() => {
    getMeals(ingredients);
  }, [ingredients]);

  return (
    <div className="menu">
      <Interface />
    </div>
  );
};

export default Menu;
