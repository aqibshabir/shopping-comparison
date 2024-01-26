import { useDispatch, useSelector } from "react-redux";
import {
  selectIngredients,
  selectMeals,
  setIngredients,
  setRecipes,
  selectRecipe,
  setReset,
  getFavourites,
} from "../../redux/MenuSlice";
import { selectCurrentShoppingList } from "../../redux/shoppingListSlice";
import { selectProductsInList } from "../../redux/dataSlice";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Favourites from "./Favorites";
import Lists from "./Lists";
import { ingredientSchema } from "../../utils/joiUtils";
import { ToastContainer, toast } from "react-toastify";
import { FaShoppingBasket } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const Interface = () => {
  const shoppingList = useSelector(selectCurrentShoppingList);
  const shoppingListItems = useSelector(selectProductsInList)(shoppingList);
  const meals = useSelector(selectMeals);
  const ingredients = useSelector(selectIngredients);
  const recipe = useSelector(selectRecipe);
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState("");
  const [mode, setMode] = useState(true);
  const onAdd = async () => {
    try {
      const value = await ingredientSchema.validateAsync({
        ingredientInput: userInput,
      });
      dispatch(setIngredients(userInput));
      setUserInput("");
    } catch (error) {
      toast("Incorrect input");
    }
  };

  // drop down
  const infoRef = useRef();
  const showInformation = async (index, id) => {
    //fine
    dispatch(
      setRecipes({
        summary: "",
        instruction: "",
        ingredients: [],
        image: "",
      })
    );
    const { data } = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=cc2762232c0b413aa1ffa70d4ed048b2`
    );
    dispatch(
      setRecipes({
        summary: data.summary,
        instruction: data.instructions,
        ingredients: data.extendedIngredients,
        image: data.image,
      })
    );
  };
  //   console.log(shoppingListItems);
  useEffect(() => {
    dispatch(getFavourites());
  }, []);
  return (
    <>
      {/* input box */}
      <div className="searchContainer">
        <input
          className="searchInput"
          type="text"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onAdd();
            }
          }}
          onInput={(e) => {
            setUserInput(e.target.value);
          }}
          value={userInput}
          placeholder="&#x1F50D; Enter Ingredients.."
        ></input>

        <div className="addButton">
          <button onClick={onAdd}>Add</button>
        </div>
      </div>
      <div className="menuButtons">
        <button
          onClick={() => {
            shoppingListItems.forEach((item) => {
              dispatch(setIngredients(item.searchTerm));
            });
          }}
          className="shoppingListButton"
        >
          <FaShoppingBasket />
        </button>

        <button
          onClick={() => {
            setMode(!mode);
            dispatch(
              setRecipes({
                summary: "",
                instruction: "",
                ingredients: [],
                image: "",
              })
            );
            dispatch(setReset());
          }}
          className="favouriteButton"
        >
          <FaHeart />
        </button>
      </div>

      {mode ? (
        <Lists
          ingredients={ingredients}
          meals={meals}
          recipe={recipe}
          infoRef={infoRef}
          showInformation={showInformation}
        />
      ) : (
        <Favourites showInformation={showInformation} /> //
      )}
      <ToastContainer />
    </>
  );
};

export default Interface;
