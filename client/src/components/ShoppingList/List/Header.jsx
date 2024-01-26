import { Link } from "react-router-dom";
import { MODE_EDIT } from "../../../utils/shoppingListUtils";

const Header = ({ onSetInterfaceMode, shoppingList, interfaceMode }) => {
  const { name } = shoppingList || {};

  return (
    <div className="shopping-list-header">
      <div className="shopping-list-header-name-container">
        <h3>{name}</h3>
        <p>
          <Link to={"/shopping-lists"}>(Switch List)</Link>
        </p>
      </div>
      {shoppingList && shoppingList.items.length > 0 && (
        <div className={interfaceMode === MODE_EDIT ? "mode-select mode-select-edit" : "mode-select mode-select-view"}>
          <span>View</span>
          <div onClick={onSetInterfaceMode}>
            <div></div>
          </div>
          <span>Edit</span>
        </div>
      )}
    </div>
  );
};

export default Header;
