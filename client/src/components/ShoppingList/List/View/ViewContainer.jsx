import { filterProductsByPrice, superMarketsInProductList } from "../../../../utils/shoppingListUtils";
import ViewSection from "./ViewSection";

const ViewContainer = ({ items, superMarket }) => {
  // decides whether to show a single supermarket or multiple supermarkets
  // depending if superMarket is "all" or a supermarket brand.

  if (!items || (items && items.length === 0)) {
    return;
  }

  const superMarketsInList = superMarketsInProductList(items);
  const filteredShoppingListItems = filterProductsByPrice(items);

  if (superMarket === "all") {
    return (
      <div className="shopping-list-items">
        {superMarketsInList.map(
          (sm, i) => filteredShoppingListItems[sm] && <ViewSection key={i} items={filteredShoppingListItems[sm]} superMarket={sm} />
        )}
      </div>
    );
  } else {
    return (
      <div className="shopping-list-items">
        <ViewSection items={items} superMarket={superMarket} />
      </div>
    );
  }
};

export default ViewContainer;
