import { createSlice } from "@reduxjs/toolkit";
import { retrieveStore, saveStore } from "../storage";

// item product schema:
// items: [{ productId: 484291, quantity: 2, ticked: false },]
//     {
//  name: "My Shopping List",
//  id: 12323,
//  lastactive: 1699370420000,
//  items: [
//    { productId: 484291, quantity: 2, ticked: false },
//    { productId: 19081, quantity: 1, ticked: false },
//    { productId: 910002634444, quantity: 3, ticked: false },
//  ],
// },

// timeLastChanged is updates with the current timestamp whenever anything
// changes in the state.  Use in shoppingListController to control the
// syncing with the back-end api.

const initialState = {
  lists: [
    {
      name: "My Shopping List",
      id: 1,
      lastactive: 0,
      items: [],
    },
  ],
  currentlist: 1,
  timeLastChanged: 0,
};

const lSState = retrieveStore("shoppinglists");

export const shoppingListSlice = createSlice({
  name: "shoppinglists",
  initialState: lSState || initialState,
  reducers: {
    addNewShoppingList: (state, { payload }) => {
      // payload is the name of the new list to create
      const newListID = Math.round(Date.now() + Math.random() * 1000000);
      state.lists.push({
        name: payload,
        id: newListID,
        lastactive: new Date().getTime(),
        items: [],
      });
      state.timeLastChanged = new Date().getTime();
      state.currentlist = newListID;
      saveStore("shoppinglists", state);
    },
    addItemToCurrentShoppingList: (state, { payload }) => {
      // takes the sku as a payload and adds an item to the current
      // shopping list with quantity = 1.  If no current list, make a new list
      const _currentListIndex = state.lists.findIndex((list) => list.id === state.currentlist);
      const { sku_id, searchTerm } = payload;

      const _newItem = {
        productId: Number(sku_id),
        searchTerm,
        quantity: 1,
        ticked: false,
      };

      if (_currentListIndex === -1) {
        // make a new default shopping list and set the current list to this
        const newListID = Math.round(Math.random() * 1000000);
        state.lists.push({
          name: "My Shopping List",
          id: newListID,
          lastactive: new Date().getTime(),
          items: [_newItem],
        });
        state.currentlist = newListID;
      } else {
        // check to see if the item is already on the list, if so increase the quantity by 1
        const _currentListItems = state.lists[_currentListIndex].items;
        const _itemIndex = _currentListItems.findIndex((item) => item.productId === Number(sku_id));

        if (_itemIndex === -1) {
          // item isn't already in the list
          _currentListItems.push(_newItem);
        } else {
          _currentListItems[_itemIndex].quantity = _currentListItems[_itemIndex].quantity + 1;
        }
      }
      state.timeLastChanged = new Date().getTime();
      saveStore("shoppinglists", state);
    },
    setShoppingLists: (state, { payload }) => {
      const { timeLastChanged, lists, currentlist } = payload;
      state.timeLastChanged = timeLastChanged;
      state.lists = lists;
      state.currentlist = currentlist;
      saveStore("shoppinglists", state);
    },
    setCurrentShoppingListId: (state, { payload }) => {
      state.currentlist = Number(payload);
      // update the last active on this list
      const _curListIndex = state.lists.findIndex((list) => list.id === Number(payload));
      if (_curListIndex !== -1) state.lists[_curListIndex].lastactive = new Date().getTime();
      state.timeLastChanged = new Date().getTime();
      saveStore("shoppinglists", state);
    },
    deleteCurrentShoppingList: (state) => {
      state.lists = state.lists.filter((list) => list.id !== state.currentlist);
      // set current list to another list (if available)
      const _shoppingLists = [...state.lists];
      _shoppingLists.sort((listA, listB) => {
        if (listA.lastactive < listB.lastactive) return -1;
        if (listA.lastactive > listB.lastactive) return 1;
        return 0;
      });
      state.currentlist = _shoppingLists.length > 0 ? _shoppingLists[0].id : 0;
      state.timeLastChanged = new Date().getTime();
      saveStore("shoppinglists", state);
    },
    renameCurrentShoppingList: (state, { payload }) => {
      const _currentListIndex = state.lists.findIndex((list) => list.id === state.currentlist);
      state.lists[_currentListIndex].name = payload;
      state.timeLastChanged = new Date().getTime();
      saveStore("shoppinglists", state);
    },
    updateCurrentShoppingListItemQuantity: (state, { payload }) => {
      // assume we can use productId as a unique identifier
      const { productId, quantity } = payload;
      const _currentListIndex = state.lists.findIndex((list) => list.id === state.currentlist);

      state.lists[_currentListIndex].items.forEach((item) => {
        if (item.productId === productId) item.quantity = quantity;
      });
      state.timeLastChanged = new Date().getTime();
      saveStore("shoppinglists", state);
    },
    updateCurrentShoppingListItemTicked: (state, { payload }) => {
      // assume we can use productId as a unique identifier
      const { productId, ticked } = payload;
      const _currentListIndex = state.lists.findIndex((list) => list.id === state.currentlist);

      state.lists[_currentListIndex].items.forEach((item) => {
        if (item.productId === productId) item.ticked = ticked;
      });
      state.timeLastChanged = new Date().getTime();
      saveStore("shoppinglists", state);
    },
    deleteCurrentShoppingListItem: (state, { payload }) => {
      // deletes the item from this list
      const _currentListIndex = state.lists.findIndex((list) => list.id === state.currentlist);
      state.lists[_currentListIndex].items = state.lists[_currentListIndex].items.filter(
        (item) => item.productId !== Number(payload)
      );
      state.timeLastChanged = new Date().getTime();
      saveStore("shoppinglists", state);
    },
  },
});

export const {
  addNewShoppingList,
  addItemToCurrentShoppingList,
  setShoppingLists,
  deleteCurrentShoppingList,
  updateCurrentShoppingListItemQuantity,
  deleteCurrentShoppingListItem,
  setCurrentShoppingListId,
  renameCurrentShoppingList,
  updateCurrentShoppingListItemTicked,
} = shoppingListSlice.actions;
export default shoppingListSlice.reducer;

export const selectShoppingLists = (state) => {
  // returns full array of shopping lists with all data
  // ordered by lastactive
  const _shoppinglists = [...state.shoppinglists.lists];
  _shoppinglists.sort((listA, listB) => listB.lastactive - listA.lastactive);
  return _shoppinglists;
};

export const selectCurrentList = (state) => state.shoppinglists.currentlist;

export const selectCurrentShoppingList = (state) => {
  const _currentList = state.shoppinglists.lists.find(
    (list) => list.id === state.shoppinglists.currentlist
  );
  if (_currentList === -1) return null;
  return _currentList;
};
