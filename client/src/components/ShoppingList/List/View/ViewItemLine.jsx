import { formatNumberAsPounds, capitalizeFirstLetter } from "../../../../utils/shoppingListUtils";
import { useDispatch } from "react-redux";
import { updateCurrentShoppingListItemTicked } from "../../../../redux/shoppingListSlice";

const ViewItemLine = ({ item, superMarket }) => {
  if (!item) return;
  const { productId, name, searchTerm, quantity, price, ticked } = item;

  const itemPrice = price[superMarket] ? formatNumberAsPounds(price[superMarket]) : "-----";
  const totalPrice = price[superMarket]
    ? formatNumberAsPounds(price[superMarket] * quantity)
    : "-----";
  const searchString = capitalizeFirstLetter(searchTerm);

  const dispatch = useDispatch();

  const onTickedToggle = (e) => {
    // when tickbox is ticked
    // const ticked = e.target.checked;
    dispatch(updateCurrentShoppingListItemTicked({ productId, ticked: !ticked }));
  };

  return (
    <div className="shopping-list-item" onClick={onTickedToggle}>
      <input type="checkbox" checked={ticked} onChange={onTickedToggle} />
      <div className="description">
        <p className="bolder">{searchString}</p>
        <p className="lighter">{name}</p>
      </div>
      <p className="quantity">x {quantity}</p>
      <p className="price-per-item">{itemPrice}</p>
      <p className="price-total">{totalPrice}</p>
    </div>
  );
};

export default ViewItemLine;
