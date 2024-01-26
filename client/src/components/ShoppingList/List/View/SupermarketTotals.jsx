import {
  formatNumberAsPounds,
  getCheapestSupermarket,
  getMissingPriceInfoSupermarketList,
  getTotalShoppingListPricePerSupermarket,
} from "../../../../utils/shoppingListUtils";

const SupermarketTotals = ({ shoppingListItems, superMarket, onChooseSuperMarket }) => {
  // check for validity of passes shoppingListItems
  if (!shoppingListItems || (shoppingListItems && shoppingListItems.length === 0)) {
    return;
  }

  // get data
  const superMarketTotals = getTotalShoppingListPricePerSupermarket(shoppingListItems) || {};
  const cheapest = getCheapestSupermarket(shoppingListItems);
  const missingData = getMissingPriceInfoSupermarketList(shoppingListItems);

  const superMarketTotalsJSX = [];

  for (const [key, value] of Object.entries(superMarketTotals)) {
    let containerStyleTag =
      key === superMarket
        ? "shopping-list-supermarket-selected"
        : "shopping-list-supermarket-not-selected";
    // add the cheapest badge if there is no missing data
    if (key === cheapest && missingData && missingData.length === 0)
      containerStyleTag += "  shopping-list-supermarket-cheapest";

    const superMarketTextValue = String(key).toUpperCase();
    const superMarketStyleTag = `${String(key).toLowerCase()}-text-style`;

    let totalPriceString = formatNumberAsPounds(value);

    if (missingData.includes(key)) totalPriceString += " *";

    superMarketTotalsJSX.push(
      <p key={key} onClick={() => onChooseSuperMarket(key)} className={containerStyleTag}>
        <span className={superMarketStyleTag}>{superMarketTextValue}</span> {totalPriceString}
      </p>
    );
  }
  return (
    <>
      <div className="shopping-list-supermarket-totals">{superMarketTotalsJSX}</div>
      {missingData && missingData.length > 0 && (
        <div className="shopping-list-supermarket-totals-missing-data">
          * Missing price information for some items in this supermarket.
        </div>
      )}
    </>
  );
};

export default SupermarketTotals;
