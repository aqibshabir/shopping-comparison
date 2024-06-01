import { gsap } from "gsap";
import React, { useEffect, useLayoutEffect, useRef } from "react";
// import { setState } from "../../redux/MenuSlice";
import { useDispatch } from "react-redux";

const DropDown = ({ recipe }) => {
  const dispatch = useDispatch();

  const dropDownRef = useRef();
  useLayoutEffect(() => {
    // console.log("useEfeect ran");
    if (recipe.summary) {
      gsap.fromTo(
        dropDownRef.current,
        { height: 0, duration: 0.1 },
        { height: "auto", duration: 0 }
      );
    }
  }, [recipe]);
  console.log(recipe);
  return (
    <>
      {recipe.summary && (
        <div ref={dropDownRef} className="dropDownInformation">
          <div className="recipeImageContainer">
            {recipe && recipe.image && (
              <img
                className="recipeImage"
                src={recipe.image}
                alt="recipe-image"
              />
            )}
          </div>

          <div className="summary">
            <p className="summaryHeader">Summary</p>
            {recipe && recipe.summary && (
              <p
                className="summaryPara"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              ></p>
            )}
          </div>

          <div className="ingredientsNeeded">
            <p className="ingredientsHeader">Ingredients</p>
            <ul className="lists">
              {recipe &&
                recipe.ingredients.map((ingredients, index) => {
                  return (
                    <li key={index} className="ingredientList">
                      {ingredients.originalName}
                    </li>
                  );
                })}
            </ul>
          </div>

          <div className="instructions">
            <p className="instructionsHeader">Instructions</p>
            {recipe && recipe.instruction && (
              <p
                className="instructionPara"
                dangerouslySetInnerHTML={{
                  __html: recipe.instruction,
                }}
              ></p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DropDown;
