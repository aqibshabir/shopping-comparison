import { useDispatch } from "react-redux";
import { addItemToCurrentShoppingList } from "../../../../redux/shoppingListSlice";

const TEMPDebug = () => {
  const dispatch = useDispatch();

  return (
    <p
      onClick={() => {
        dispatch(addItemToCurrentShoppingList(484291));
        dispatch(addItemToCurrentShoppingList(19081));
        dispatch(addItemToCurrentShoppingList(19081));
        dispatch(addItemToCurrentShoppingList(19081));
        dispatch(addItemToCurrentShoppingList(910002634444));
        dispatch(addItemToCurrentShoppingList(910002634444));
        dispatch(addItemToCurrentShoppingList(910002524713));
      }}
    >
      [DEBUGGING - add a bunch of products]
    </p>
  );
};

export default TEMPDebug;
