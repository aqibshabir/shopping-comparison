import { useDispatch, useSelector } from "react-redux";
import {
  addNewShoppingList,
  selectCurrentShoppingList,
  selectShoppingLists,
} from "../../../redux/shoppingListSlice";
import ShoppingListsItem from "./ShoppingListsItem";
import { useState } from "react";
import InputBoxModal from "../InputBoxModal";
import { useNavigate } from "react-router-dom";

const ShoppingLists = () => {
  const _allShoppingLists = useSelector(selectShoppingLists);
  const _currentShoppingList = useSelector(selectCurrentShoppingList);

  // filter the current shopping list from the all shopping lists
  const _allExceptCurrentShoppingLists = _allShoppingLists.filter(
    (list) => list.id !== _currentShoppingList.id
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addNewModalOpen, setAddNewListModelOpen] = useState(false);

  const doAddNewShoppingList = (nameOfList) => {
    setAddNewListModelOpen(false);
    dispatch(addNewShoppingList(nameOfList));
    // navigate("/shopping-list");
  };

  const closeModal = () => {
    setAddNewListModelOpen(false);
  };

  return (
    <>
      <div className="shopping-lists">
        {addNewModalOpen && (
          <InputBoxModal
            message="Add a new shopping list"
            confirmCallback={doAddNewShoppingList}
            cancelCallback={closeModal}
          />
        )}
        {_allShoppingLists.length === 0 && <h3>No Shopping Lists</h3>}
        {_currentShoppingList && (
          <>
            <h3>Current Shopping List</h3>
            <div className="shopping-lists-items-current">
              <ShoppingListsItem list={_currentShoppingList} />
            </div>
          </>
        )}
        {_allExceptCurrentShoppingLists && _allExceptCurrentShoppingLists.length > 0 && (
          <>
            <h3>Other Shopping Lists</h3>
            <div className="shopping-lists-items-all">
              {_allExceptCurrentShoppingLists.map((list, i) => (
                <ShoppingListsItem list={list} key={i} />
              ))}
            </div>
          </>
        )}

        <div className="shopping-lists-buttons">
          <button onClick={() => setAddNewListModelOpen(true)}>Add New Shopping List</button>
        </div>
      </div>
    </>
  );
};

export default ShoppingLists;
