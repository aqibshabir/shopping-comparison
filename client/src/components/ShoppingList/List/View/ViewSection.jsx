import { useSelector } from "react-redux";
import { getNearestSupermarkets } from "../../../../utils/locationUtils";
import { capitalizeFirstLetter } from "../../../../utils/shoppingListUtils";
import ViewItemLine from "./ViewItemLine";
import { selectLocation } from "../../../../redux/locationSlice";

const ViewSection = ({ items, superMarket }) => {
  // takes a list of product items and a supermarket and displays
  // some header data and loops through the items to create a nice table.
  const superMarketClassName = `${superMarket}-text-style`;
  const superMarketText = capitalizeFirstLetter(superMarket);
  const { place, lat, lon } = useSelector(selectLocation);

  let _closestSuperMarkets = {};

  if (place) {
    _closestSuperMarkets = getNearestSupermarkets(lat, lon);
  }

  return (
    <>
      <h3 className={superMarketClassName}>{superMarketText}</h3>
      {_closestSuperMarkets[superMarket] && (
        <p className="lighter">
          {_closestSuperMarkets[superMarket].address} ({_closestSuperMarkets[superMarket].distance} km)
        </p>
      )}
      {items.map((item, i) => (
        <ViewItemLine key={i} item={item} superMarket={superMarket} />
      ))}
    </>
  );
};

export default ViewSection;
