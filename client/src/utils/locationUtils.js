import axios from "axios";
import jsonData from "../components/Map/retailpoints.json";

export const shortenString = (longString, maxChars) => {
  const numDots = 3;
  if (longString.length < maxChars) return longString;

  return String(longString)
    .substring(0, maxChars - numDots)
    .padEnd(maxChars, ".");
};

export const getNearestSupermarkets = (userLat, userLon) => {
  // returns an object with the closest supermarket for each brand in the JSon database
  // results in the format {tesco: { distance: 23, address: xxx, lat: 34, lon }}
  const _results = {};

  jsonData.forEach((dataItem) => {
    const { Retailer: retailer, Street: street, Town: town, Postcode: postcode, Longitude: lon, Latitude: lat } = dataItem;
    const superMarket = retailer.toLowerCase();
    const address = [street, town, postcode].join(", ");
    const distance = Number.parseFloat(_calculateDistance(userLat, userLon, lat, lon)).toFixed(1);

    if (!(superMarket in _results)) {
      _results[superMarket] = { distance, address, lat, lon };
    } else {
      if (_results[superMarket].distance > distance) {
        // replace with closer supermarket
        _results[superMarket] = { distance, address, lat, lon };
      }
    }
  });

  return _results;
};

function _calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}
