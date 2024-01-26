import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentShoppingList } from "../../../redux/shoppingListSlice";
import "../shopping-list.scss";
import { useNavigate } from "react-router-dom";
import SupermarketTotals from "./View/SupermarketTotals";
import EditContainer from "./Edit/EditContainer";
import ViewContainer from "./View/ViewContainer";
import Header from "./Header";
import EmptyList from "./EmptyList";
import { MODE_EDIT, MODE_VIEW, getCheapestSupermarket } from "../../../utils/shoppingListUtils";
import { selectMissingProductsInList, selectProductsInList } from "../../../redux/dataSlice";
import { store } from "../../../redux/store";
import { storeHasChanged, syncShoppingList } from "../../../controllers/shoppingListController";

const ShoppingList = () => {
  const navigate = useNavigate();
  const [chosenSuperMarket, setChosenSuperMarket] = useState();
  const [interfaceMode, setInterfaceMode] = useState();

  // get current shopping list data from state
  const shoppingList = useSelector(selectCurrentShoppingList);
  const shoppingListItems = useSelector(selectProductsInList)(shoppingList);
  const cheapest = getCheapestSupermarket(shoppingListItems);
  const missingProductSearchTerms = useSelector(selectMissingProductsInList)(shoppingList) || [];

  // check for store changes and fire API sync
  useEffect(() => {
    syncShoppingList();
    const unsubscribe = store.subscribe(storeHasChanged);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // if there is no current shopping list, redirect immediately to the
    // shopping lists page.
    if (!shoppingList) {
      navigate("/shopping-lists");
      return;
    }
  }, [shoppingList]);

  if (!shoppingList || !shoppingListItems) return <></>;

  return (
    <>
      <div className="shopping-list">
        <Header
          shoppingList={shoppingList}
          onSetInterfaceMode={() =>
            setInterfaceMode(interfaceMode === MODE_EDIT ? MODE_VIEW : MODE_EDIT)
          }
          interfaceMode={interfaceMode}
        />
        {missingProductSearchTerms && missingProductSearchTerms.length > 0 && (
          <p className="shopping-list-loading">
            Loading product data ({missingProductSearchTerms.join(", ")})
          </p>
        )}

        {shoppingListItems.length === 0 && <EmptyList />}

        {interfaceMode === MODE_EDIT || shoppingListItems.length === 0 ? (
          <EditContainer items={shoppingListItems} />
        ) : (
          <>
            <SupermarketTotals
              shoppingListItems={shoppingListItems}
              superMarket={chosenSuperMarket || cheapest}
              onChooseSuperMarket={(superMarket) => setChosenSuperMarket(superMarket)}
            />
            <ViewContainer items={shoppingListItems} superMarket={chosenSuperMarket || cheapest} />
          </>
        )}
      </div>
    </>
  );
};

export default ShoppingList;
