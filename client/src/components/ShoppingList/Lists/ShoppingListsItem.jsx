import { useDispatch, useSelector } from "react-redux";
import { setCurrentShoppingListId } from "../../../redux/shoppingListSlice";
import { useNavigate } from "react-router-dom";
import { makeListSummary } from "../../../utils/shoppingListUtils";
import { selectProductsInList } from "../../../redux/dataSlice";

const ShoppingListsItem = ({ list }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!list) return;

  const items = useSelector(selectProductsInList)(list);

  const { name, id } = list;

  const onListClick = (id) => {
    dispatch(setCurrentShoppingListId(id));
    navigate("/shopping-list");
  };

  if (items && items.length === 0) {
    return (
      <div onClick={() => onListClick(id)}>
        <h3>{name}</h3>
        <p>Empty shopping list</p>
      </div>
    );
  }

  const { summary, prices } = makeListSummary(items);

  return (
    <div onClick={() => onListClick(id)}>
      <h3>{name}</h3>
      <p>{summary}</p>
    </div>
  );
};

export default ShoppingListsItem;
