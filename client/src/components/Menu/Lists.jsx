import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteInput,
  setFavourite,
  setState,
  setActive,
  getFavourites,
} from "../../redux/MenuSlice";
import DropDown from "./DropDown";
import { toast } from "react-toastify";
import { MenuList } from "@mui/material";
import axios from "axios";
import { apiURL } from "../../config";

const Lists = ({ ingredients, meals, recipe, infoRef, showInformation }) => {
  const dispatch = useDispatch();
  const [recipeActive, setRecipeActive] = useState(false);

  const handleAdd = async (recipe, meals) => {
    console.log(JSON.stringify(recipe.ingredients));
    const body = {
      recipeImage: recipe.image, //string
      mealTitle: meals.title, //string
      summary: recipe.summary, //string
      ingredients: JSON.stringify(recipe.ingredients), //JSON object as string
      instructions: recipe.instruction, //string
      recipe_id: meals.id, //number
    };
    // console.log(body);
    const { data } = await axios.post(`${apiURL()}/favourites`, body);
    dispatch(getFavourites());
    console.log(data);
  };

  return (
    <>
      {/* inputed ingredients */}
      <div className="inputContainer">
        {ingredients.map((ingredients, index) => {
          return (
            <h3
              key={index}
              onClick={() => {
                dispatch(deleteInput(ingredients));
              }}
              className="inputedIngredients"
              //   key={index}
            >
              {ingredients}
            </h3>
          );
        })}
      </div>
      {/* recommened meals */}
      <div ref={infoRef} className="recommendations">
        {meals &&
          meals.map((meals, index) => {
            return (
              <div
                onClick={() => {
                  showInformation(index, meals.id);
                  dispatch(setActive({ id: meals.id, status: !meals.active }));
                }}
                className="card"
                key={meals.id}
              >
                <div className="title">
                  <div className="setFavourite">
                    <input
                      onClick={() => {
                        dispatch(setFavourite(meals));
                        // console.log(meals);
                      }}
                      type="checkbox"
                      className="checkbox"
                    ></input>

                    <div>
                      <button
                        onClick={() => {
                          handleAdd(recipe, meals); // send handleadd(recipe, meals)
                          toast("Saved to favourties");
                        }}
                        className="saveButton"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <div className="mealsTitle">
                    <h2 className="mealsHeader">{meals.title}</h2>
                  </div>
                  <div className="saveButtonContainer"></div>
                </div>
                {/* drop down */}
                {meals.active ? <DropDown recipe={recipe} /> : <></>}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Lists;
