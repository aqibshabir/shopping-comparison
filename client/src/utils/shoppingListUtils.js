export const MODE_EDIT = "mode_edit";
export const MODE_VIEW = "mode_view";

export const capitalizeFirstLetter = (stringToCapitalize) => {
  const words = stringToCapitalize.split(" ");

  const capitalized = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  });

  return capitalized.join(" ");
};

export const formatNumberAsPounds = (num) => {
  const pounds = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  return pounds.format(num);
};

const _getTotalShoppingListPrice = (shoppingListProducts, superMarket) => {
  // takes a shopping list and returns the total price for a passed supermarket
  let _totalPrice = 0;
  shoppingListProducts.forEach((item) => {
    if (item.price[superMarket]) {
      _totalPrice += item.price[superMarket] * item.quantity;
    }
  });
  return _totalPrice;
};

const hasMissingPrice = (shoppingListProducts, superMarket) => {
  // returns true if these shopping list products have a missing price for the
  // passed supermarket.
  let _missing = false;
  shoppingListProducts.forEach((item) => {
    if (!item.price[superMarket]) _missing = true;
  });
  return _missing;
};

export const superMarketsInProductList = (shoppingListProducts) => {
  // takes array of shopping list product info and returns array
  // with all unique supermarket names present in the data
  const _superMarkets = [];
  shoppingListProducts.forEach((item) => {
    for (const [key, value] of Object.entries(item.price)) {
      if (!_superMarkets.includes(key)) _superMarkets.push(key);
    }
  });
  return _superMarkets;
};

export const getTotalShoppingListPricePerSupermarket = (shoppingListProducts) => {
  // takes a shopping list products object as created in the product slice
  // returns an object with supermarket name as keys, and total shopping cart price
  // as value.
  const _totalPrices = {};
  // get list of unique supermarkets in this data
  const _superMarkets = superMarketsInProductList(shoppingListProducts);
  if (_superMarkets.length === 0) return;

  // get total prices of items for each supermarket
  _superMarkets.forEach((superMarket) => {
    _totalPrices[superMarket] = _getTotalShoppingListPrice(shoppingListProducts, superMarket);
  });

  // add the filtered price for all supermarkets
  _totalPrices["all"] = getTotalShoppingListPriceAllSupermarkets(
    filterProductsByPrice(shoppingListProducts)
  );

  return _totalPrices;
};

export const getMissingPriceInfoSupermarketList = (shoppingListProducts) => {
  // returns an array of supermarket names that have missing price data, and thus should
  // be flagged accordingly in the UI.
  const _missingData = [];
  // get list of unique supermarkets in this data
  const _superMarkets = superMarketsInProductList(shoppingListProducts);
  if (_superMarkets.length === 0) return;

  // get total prices of items for each supermarket
  _superMarkets.forEach((superMarket) => {
    if (hasMissingPrice(shoppingListProducts, superMarket)) _missingData.push(superMarket);
  });

  return _missingData;
};

export const getCheapestSupermarket = (shoppingListProducts) => {
  // takes a shopping list products object as created in the product slice
  // returns a string of the cheapest supermarket.
  const _totalPrices = getTotalShoppingListPricePerSupermarket(shoppingListProducts);

  if (!_totalPrices) return;
  // remove the key for 'all' supermarkets
  delete _totalPrices.all;

  let sortByPrice = [];

  for (const [key, value] of Object.entries(_totalPrices)) {
    sortByPrice.push([key, value]);
  }
  sortByPrice.sort((itemA, itemB) => itemA[1] - itemB[1]);

  return sortByPrice[0][0];
};

export const getTotalShoppingListPriceAllSupermarkets = (filteredProductList) => {
  // takes a filtered product list and returns a the total price

  let _totalPrice = 0;

  for (const [key, value] of Object.entries(filteredProductList)) {
    _totalPrice += _getTotalShoppingListPrice(value, key);
  }

  return _totalPrice;
};

export const makeListSummary = (items) => {
  // takes and array of shopping list items with keys:
  // name, unit, quantity, price, ticked
  // and generates an object with various summary stuff for the view components

  let _summary = "";

  // make summary of all products
  _summary = items.map((item) => item.searchTerm).join(", ");
  _summary = capitalizeFirstLetter(_summary);

  // truncate if over 30 characters
  const maxSummaryLength = 60;
  if (_summary.length > maxSummaryLength) {
    _summary = _summary.substring(0, maxSummaryLength - 5).padEnd(maxSummaryLength, ".");
  }

  const superMarketTotals = getTotalShoppingListPricePerSupermarket(items);

  const superMarketPriceArray = [];
  for (const [key, value] of Object.entries(superMarketTotals)) {
    superMarketPriceArray.push(
      capitalizeFirstLetter(String(key)) + ": " + formatNumberAsPounds(value)
    );
  }

  const superMarketPriceString = superMarketPriceArray.join(", ");

  return {
    summary: _summary,
    prices: superMarketPriceString,
  };
};

export const filterProductsByPrice = (productItems) => {
  const _filteredProducts = {};

  productItems.forEach((item) => {
    let sortByPrice = [];
    // convert prices object to sortable array
    for (const [key, value = 0] of Object.entries(item.price)) {
      sortByPrice.push([key, value]);
    }
    sortByPrice.sort((itemA, itemB) => itemA[1] - itemB[1]);
    // get lowest price and add to array
    const _cheapestSupermarket = sortByPrice[0][0];
    if (!_filteredProducts[_cheapestSupermarket]) _filteredProducts[_cheapestSupermarket] = [];
    _filteredProducts[_cheapestSupermarket].push(item);
  });
  return _filteredProducts;
};

export const getSKUCountInItems = (sku, items) => {
  // takes array of items in shopping list, returns the quantity in the list
  // of this sku.

  // if (!sku || !items || (items && items.length === 0)) return 0;
  // console.log("items", items);
  // console.log("sku", sku);
  const _indexOfSku = items.findIndex((item) => Number(item.productId) === Number(sku));
  // console.log("indexsku", _indexOfSku);
  if (_indexOfSku === -1) return 0;

  return items[_indexOfSku].quantity;
};
