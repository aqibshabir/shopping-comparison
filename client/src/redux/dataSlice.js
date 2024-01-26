import { createSelector, createSlice } from "@reduxjs/toolkit";
import { retrieveStore, saveStore } from "../storage";
import { shortenString } from "../utils/locationUtils";
import { getSingleProductData } from "../controllers/dataController";

const lSState = retrieveStore("dataSlice");
const initialState = { productData: {} };

export const dataSlice = createSlice({
  name: "data",
  initialState: lSState || initialState,
  reducers: {
    setSearchData: (state, { payload }) => {
      // just keep the simplified data
      // (remove these lines if you need the complete data)
      const data = Object.values(payload)[0];
      data.forEach((entry) => delete entry.complete);

      state.productData = { ...state.productData, ...payload };
      saveStore("dataSlice", state);
    },
  },
});

export const selectProductData = (state) => state.data.productData;

export default dataSlice.reducer;
export const { setSearchData } = dataSlice.actions;

////// SHOPPING LIST PRODUCT FETCHING //////

// const searchTerm = useSelector(selectSearchTermFromSku)(sku);

export const selectSearchTermFromSku = createSelector(
  [(state) => state.data.productData],
  (productDataStore) => (sku) => {
    // Get search term for this sku
    for (const key of Object.keys(productDataStore)) {
      // now loop through the array of results
      const _idx = productDataStore[key].findIndex(
        (item) => Number(item.simplified.sku_id) === Number(sku)
      );
      if (_idx !== -1) {
        return key;
      }
    }
    return null;
  }
);

export const selectAllSkusInStore = (state) => {
  // returns an array of all available SKUs in the product data store
  const _allSkus = [];

  const productDataStore = state.data.productData;
  for (const key of Object.keys(productDataStore)) {
    productDataStore[key].forEach((item) => _allSkus.push(Number(item.simplified.sku_id)));
  }
  return _allSkus;
};

export const selectProductsInList = createSelector(
  [(state) => state.data.productData],
  (productDataStore) => (list) => {
    // const productsInThisList = useSelector(selectProductsInList)(shoppingList);
    if (!list) return [];

    const _productData = [];

    // console.log(productDataStore);
    for (const key of Object.keys(productDataStore)) {
      // now loop through the array of results
      productDataStore[key].forEach((item) => {
        const { simplified } = item;

        let _prices = {};

        for (const [superMarket, { price }] of Object.entries(simplified.price_info)) {
          _prices = { ..._prices, [superMarket]: Number(price) / 100 };
        }

        const _productLine = {
          id: Number(simplified.sku_id),
          name: shortenString(simplified.name, 50),
          searchTerm: key,
          price: _prices,
        };
        _productData.push(_productLine);
      });
    }

    const _shoppingListProducts = [];
    list.items.forEach((item) => {
      const productData = _productData.find(
        (product) => Number(product.id) === Number(item.productId)
      );

      // Has product data
      productData &&
        _shoppingListProducts.push({
          productId: item.productId,
          searchTerm: item.searchTerm,
          name: productData.name,
          quantity: item.quantity,
          price: productData.price,
          ticked: item.ticked,
        });
    });

    // console.log(_shoppingListProducts);
    return _shoppingListProducts;
  }
);

export const selectMissingProductsInList = createSelector(
  [(state) => state.data.productData],
  (productDataStore) => (list) => {
    // returns an array of search terms of missing product data... which should be in
    // the process of loading.

    // const productsInThisList = useSelector(selectProcuctsForShoppingList)(shoppingList);
    if (!list) return [];

    // returns an array of all available SKUs in the product data store
    const _allSkus = [];
    // const productDataStore = state.data.productData;

    for (const key of Object.keys(productDataStore)) {
      productDataStore[key].forEach((item) => _allSkus.push(Number(item.simplified.sku_id)));
    }

    const _missingProducts = [];
    list.items.forEach((item) => {
      if (!_allSkus.includes(Number(item.productId))) {
        _missingProducts.push(item.searchTerm);
      }
    });

    return _missingProducts;
  }
);
