import axios from "axios";
import {
  setError,
  setFullLocationState,
  setLocation,
  setSearchResults,
} from "../redux/locationSlice";
import { store } from "../redux/store.js";
import { setContent } from "../redux/messageSlice.js";
import { apiURL } from "../config.js";

let currentTimeStamp;
let _timerID;

export const syncLocation = async () => {
  let _localData = store.getState().location;

  const axiosInstance = axios.create({
    baseURL: apiURL(),
    headers: { token: localStorage.getItem("token") },
  });

  try {
    // 1. get the current data from the server
    let { data: _serverData } = await axiosInstance.get("/location");

    // If no data returned for this user, save the local data to the server and quit.
    if (_serverData && Object.keys(_serverData).length === 0) {
      await axiosInstance.post("/location", _localData);
      return;
    }

    const { locationLastChanged: _serverTime } = _serverData;
    const { locationLastChanged: _localTime } = _localData;

    // 2. is the server data more recent?  If so, replace local state with server data
    if (_serverTime > _localTime) {
      store.dispatch(setFullLocationState(_serverData));
      _localData = _serverData;
    }

    // 3. is local state more recent?  If so, update server state with local data.
    if (_localTime > _serverTime) {
      await axiosInstance.post("/location", _localData);
    }
  } catch (error) {
    store.dispatch(setContent({ text: "Error: API is possibly down.", type: "error" }));
  }
};

export const locationHasChanged = async () => {
  let previousTimeStamp = currentTimeStamp;

  currentTimeStamp = store.getState().location.locationLastChanged;

  if (previousTimeStamp === currentTimeStamp) return;

  // schedule a server sync in 5 seconds. Clear any existing scheduled syncs first.
  if (_timerID) clearTimeout(_timerID);
  _timerID = setTimeout(async () => await syncLocation(), 1000);
};

const _getBrowserLocation = async () => {
  return new Promise(function (resolve, reject) {
    // GET BROWSER LOCATION //

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 2000,
    });

    function success({ coords }) {
      resolve(coords);
    }

    function error({ message }) {
      reject(`${message}. Enable location services in your browser.`);
    }
  });
};

export const getBrowserLocation = async () => {
  try {
    const { latitude: lat, longitude: lon } = await _getBrowserLocation();
    const { data } = await axios.get(
      `https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}&limit=1`
    );
    const { result } = data;
    const place = (result && result[0].admin_ward) || "(Unknown place)";
    store.dispatch(setLocation({ place, lat, lon }));
  } catch (e) {
    // console.log(e);
    store.dispatch(setError(e));
  }
};

export const getPostcodesFromQuery = async (query) => {
  if (query.length < 2) {
    store.dispatch(setSearchResults([]));
    return;
  }

  try {
    const { data } = await axios.get(`https://api.postcodes.io/postcodes?q=${query}`);
    const { result } = data;

    if (result) {
      store.dispatch(setError(""));
      store.dispatch(setSearchResults(result));
      return;
    }

    store.dispatch(setSearchResults([]));
    store.dispatch(setError("Postcode not found."));
  } catch (e) {
    store.dispatch(setSearchResults([]));
    store.dispatch(setError(e.message));
  }
};

export const getPlaceFromLatLong = async (lat, lon) => {
  try {
    const { data } = await axios.get(
      `https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}&limit=1`
    );
    const { result } = data;
    return result[0].admin_ward;
  } catch (e) {
    // console.log("getPlaceFromLatLong", e);
    return [];
  }
};
