import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCurrentShoppingList,
  selectCurrentShoppingList,
} from "../../../../redux/shoppingListSlice";
import { useEffect, useState } from "react";
import { getSKUCountInItems } from "../../../../utils/shoppingListUtils";
import { selectProductsInList, selectSearchTermFromSku } from "../../../../redux/dataSlice";
import { setContent } from "../../../../redux/messageSlice";
import { storeHasChanged, syncShoppingList } from "../../../../controllers/shoppingListController";
import { store } from "../../../../redux/store";
import "./AddNewItemButton.scss";

const AddNewItemButton = ({ sku_id }) => {
  // check for store changes and fire API sync
  useEffect(() => {
    syncShoppingList();
    const unsubscribe = store.subscribe(storeHasChanged);
    return () => {
      unsubscribe();
    };
  }, []);

  const BUTTON_ADD = "Add Item";
  const BUTTON_ADDED = "Added!";

  const dispatch = useDispatch();
  const [buttonMessage, setButtonMessage] = useState(BUTTON_ADD);

  const productsInThisList = useSelector(selectProductsInList)(
    useSelector(selectCurrentShoppingList)
  );
  const skuQuantity = getSKUCountInItems(sku_id, productsInThisList);
  const searchTerm = useSelector(selectSearchTermFromSku)(sku_id);

  const onAddItemClick = () => {
    console.log("BUTTON CLICKED");
    if (skuQuantity === 0) {
      dispatch(setContent({ text: "Product added!", type: "success" }));
    } else {
      dispatch(setContent({ text: `Another added, now: ${skuQuantity + 1}`, type: "success" }));
    }

    dispatch(addItemToCurrentShoppingList({ sku_id, searchTerm }));
    setButtonMessage(BUTTON_ADDED);
    setTimeout(() => {
      setButtonMessage(BUTTON_ADD);
    }, 700);
  };

  return (
    <>
      {
        <p className="shoppingListNumber">
          {skuQuantity > 0 ? skuQuantity : "0"} of these in your shopping list
        </p>
      }
      <button className="button-color-1" onClick={onAddItemClick}>
        {buttonMessage || BUTTON_ADD}
      </button>
    </>
  );
};

export default AddNewItemButton;
