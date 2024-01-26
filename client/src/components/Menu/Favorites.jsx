import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFavourites,
  deleteCard,
  setActive,
  setActiveFavourites,
  selectRecipe,
  getFavourites,
} from "../../redux/MenuSlice";
import DropDown from "./DropDown";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { TiDeleteOutline } from "react-icons/ti";
import { apiURL } from "../../config";

const Favourites = ({ showInformation }) => {
  const favourites = useSelector(selectFavourites);
  const recipe = useSelector(selectRecipe);
  const dispatch = useDispatch();
  console.log(favourites);
  const handleDelete = async (id) => {
    const { data } = await axios.delete(`${apiURL()}/favourites`, {
      data: { id: id },
    });
    dispatch(getFavourites());
    console.log(data);
  };
  return (
    <>
      <div className="favHeaderContainer">
        <h2 className="favHeaders">Your Favourites</h2>
      </div>
      {favourites.map((item, index) => {
        console.log(item);
        return (
          <div
            key={index}
            onClick={() => {
              dispatch(setActiveFavourites(item.id));
              showInformation(index, item.id);
            }}
            className="card"
          >
            <div className="favCard">
              <div className="mealsTitle">
                <h2 className="mealsHeader">{item.mealTitle}</h2>
                <button
                  className="favDeleteButton"
                  onClick={() => {
                    handleDelete(item.id);
                    toast("Deleted Favourites");
                  }}
                >
                  Delete
                </button>
              </div>
              {item.active ? <DropDown recipe={recipe} /> : <></>}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Favourites;
