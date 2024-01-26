import { useDispatch } from "react-redux";
import { deleteCurrentShoppingListItem } from "../../../../redux/shoppingListSlice";

const DeleteItemButton = ({ item }) => {
  const dispatch = useDispatch();
  const { productId } = item;

  return (
    <p className="delete" onClick={() => dispatch(deleteCurrentShoppingListItem(productId))}>
      Delete
    </p>
  );
};

export default DeleteItemButton;
