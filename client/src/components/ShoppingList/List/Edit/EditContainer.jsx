import DeleteListButton from "./DeleteListButton";
import RenameListButton from "./RenameListButton";
import ItemEditLine from "./EditItemLine";

const EditContainer = ({ items }) => {
  // take list of product items, loops through and creates a shopping
  // item edit component for each.
  return (
    <>
      <div className="shopping-list-items">
        {items && items.map((item, i) => <ItemEditLine key={i} item={item} />)}
      </div>
      <div className="shopping-list-buttons">
        <RenameListButton />
        <DeleteListButton />
      </div>
    </>
  );
};
export default EditContainer;
