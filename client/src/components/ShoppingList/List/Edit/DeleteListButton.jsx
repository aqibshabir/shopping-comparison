import { useNavigate } from "react-router-dom";
import { deleteCurrentShoppingList } from "../../../../redux/shoppingListSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

const DeleteListButton = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const doDeleteList = () => {
    setShowDeleteModal(false);
    dispatch(deleteCurrentShoppingList());
    navigate("/shopping-lists");
  };

  const closeModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteModal confirmCallback={doDeleteList} cancelCallback={closeModal} />
      )}
      <p className="shopping-list-buttons-delete" onClick={onDeleteClick}>
        Delete Shopping List
      </p>
    </>
  );
};

export default DeleteListButton;
