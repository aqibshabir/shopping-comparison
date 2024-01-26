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
      // console.log(data);
    });
    // 91e18b500ded42668c02659107ee051e kierans key
    // a074832c06c9473c8679c4aacbda8b9f;
    // 9d2426b2b6df4b12b914f9de719ba1bc
    // cc2762232c0b413aa1ffa70d4ed048b2

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
