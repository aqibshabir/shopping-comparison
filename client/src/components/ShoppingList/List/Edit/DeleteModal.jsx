import { useEffect, useRef } from "react";

const DeleteModal = ({ confirmCallback, cancelCallback }) => {
  // returns a floating modal for confirmation of
  // desctructive actions.

  const modalRef = useRef(null);

  // detect click outside the main model section
  useEffect(() => {
    const onDocumentClick = (e) => {
      const element = e.target;
      if (modalRef && !modalRef.current.contains(element)) {
        cancelCallback && cancelCallback();
      }
    };
    // register an event handler on the window
    document.addEventListener("click", onDocumentClick, true);
    return () => {
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [cancelCallback]);

  return (
    <div className="shopping-list-modal-overlay">
      <div className="shopping-list-modal" ref={modalRef}>
        <p className="bolder">Are you sure you want to delete this shopping list?</p>
        <div className="shopping-list-modal-button-container">
          <button className="button-color-2" onClick={() => confirmCallback && confirmCallback()}>
            Yes
          </button>
          <button className="button-color-3" onClick={() => cancelCallback && cancelCallback()}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
