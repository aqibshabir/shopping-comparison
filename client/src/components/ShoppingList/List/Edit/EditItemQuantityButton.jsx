import { useDispatch } from "react-redux";
import {
  deleteCurrentShoppingListItem,
  updateCurrentShoppingListItemQuantity,
} from "../../../../redux/shoppingListSlice";

const EditItemQuantityButton = ({ item }) => {
  const dispatch = useDispatch();

  let { quantity, productId } = item;

  const onQuantityChange = (val, productId) => {
    quantity += val;

    if (quantity > 0) {
      dispatch(updateCurrentShoppingListItemQuantity({ productId, quantity }));
    } else {
      dispatch(deleteCurrentShoppingListItem(productId));
    }
  };

  return (
    <div className="shopping-list-edit-quantity">
      <div
        className="shopping-list-edit-quantity-control"
        onClick={() => onQuantityChange(-1, productId)}
      >
        <span>-</span>
      </div>
      <div className="shopping-list-edit-quantity-value">{quantity}</div>
      <div
        className="shopping-list-edit-quantity-control"
        onClick={() => onQuantityChange(1, productId)}
      >
        <span>+</span>
      </div>
    </div>
  );
};

export default EditItemQuantityButton;
