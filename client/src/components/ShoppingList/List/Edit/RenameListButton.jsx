import { useState } from "react";
import { renameCurrentShoppingList } from "../../../../redux/shoppingListSlice";
import InputBoxModal from "../../InputBoxModal";
import { useDispatch } from "react-redux";

const RenameListButton = () => {
  const [showRenameModal, setShowRenameModal] = useState(false);

  const dispatch = useDispatch();

  const onRenameClick = () => {
    setShowRenameModal(true);
  };

  const doRenameList = (value) => {
    dispatch(renameCurrentShoppingList(value));
    setShowRenameModal(false);
  };

  const closeModal = () => {
    setShowRenameModal(false);
  };

  return (
    <>
      {showRenameModal && (
        <InputBoxModal
          message="Rename Shopping List"
          confirmCallback={doRenameList}
          cancelCallback={closeModal}
        />
      )}
      <p onClick={onRenameClick}>Rename Shopping List</p>
    </>
  );
};

export default RenameListButton;
