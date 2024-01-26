import EditItemQuantityButton from "./EditItemQuantityButton";
import { capitalizeFirstLetter } from "../../../../utils/shoppingListUtils";
import DeleteItemButton from "./DeleteItemButton";

const ItemEditLine = ({ item }) => {
  const { name, searchTerm } = item || {};

  const searchString = capitalizeFirstLetter(searchTerm);

  return (
    <div className="shopping-list-item">
      <div className="description">
        <p className="bolder">{searchString}</p>
        <p className="lighter">{name}</p>
      </div>
      <EditItemQuantityButton item={item} />
      <DeleteItemButton item={item} />
    </div>
  );
};

export default ItemEditLine;
