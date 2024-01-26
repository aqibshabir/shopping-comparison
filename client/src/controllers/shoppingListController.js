import axios from "axios";
import { store } from "../redux/store";
import { apiURL } from "../config";
import { setShoppingLists } from "../redux/shoppingListSlice";
import { setContent } from "../redux/messageSlice";
import { selectAllSkusInStore } from "../redux/dataSlice";
import { getSingleProductData } from "./dataController";

// Controls the saving/loading of shopping list state from the back end API.

let currentTimeStamp;
let _timerID;

export const syncShoppingList = async () => {
  // create Axios instance
  const axiosInstance = axios.create({
    baseURL: apiURL(),
    headers: { token: localStorage.getItem("token") },
  });

  let _localData = store.getState().shoppinglists;

  try {
    // 1. get the current data from the server
    let { data: _serverData } = await axiosInstance.get("/shoppinglist");

    // If no data returned for this user, save the local data to the server and quit.
    if (_serverData && Object.keys(_serverData).length === 0) {
      await axiosInstance.post("/shoppinglist", _localData);
      return;
    }

    const { timeLastChanged: _serverTime } = _serverData;
    const { timeLastChanged: _localTime } = _localData;

    // 2. is the server data more recent?  If so, replace local state with server data
    if (_serverTime > _localTime) {
      store.dispatch(setShoppingLists(_serverData));
      _localData = _serverData;
    }

    // 3. is local state more recent?  If so, update server state with local data.
    if (_localTime > _serverTime) {
      await axiosInstance.post("/shoppinglist", _localData);
    }

    // 4. check all shopping list items in all local shopping lists
    // local data, and call API to retrieve any missing product data.
    const allSkus = selectAllSkusInStore(store.getState());
    const missingSearchTerms = [];
    _localData.lists.forEach((list) => {
      list.items.forEach((item) => {
        if (!allSkus.includes(Number(item.productId))) {
          if (!missingSearchTerms.includes(item.searchTerm))
            missingSearchTerms.push(item.searchTerm);
        }
      });
    });

    // fire an API call for the missing search terms, delay by 50ms for each call
    let delay = 50;
    missingSearchTerms.forEach((term) => {
      setTimeout(async () => await getSingleProductData(term, 5), delay);
      delay += 50;
    });
  } catch (error) {
    store.dispatch(setContent({ text: "Error: API is possibly down.", type: "error" }));
  }
};

export const storeHasChanged = async () => {
  let previousTimeStamp = currentTimeStamp;

  currentTimeStamp = store.getState().shoppinglists.timeLastChanged;

  if (previousTimeStamp === currentTimeStamp) return;

  // schedule a server sync in 5 seconds. Clear any existing scheduled syncs first.
  if (_timerID) clearTimeout(_timerID);
  _timerID = setTimeout(async () => await syncShoppingList(), 1000);
};

export const subscribeToStore = () => {
  return store.subscribe(storeHasChanged);
};
