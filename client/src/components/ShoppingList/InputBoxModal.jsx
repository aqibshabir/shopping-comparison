import { useEffect, useRef, useState } from "react";

const InputBoxModal = ({ message, confirmCallback, cancelCallback }) => {
  // returns a floating modal with an input box.

  const modalRef = useRef(null);
  const inputRef = useRef(null);

  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState("");

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
    // set focus to input box
    inputRef && inputRef.current.focus();

    return () => {
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [cancelCallback]);

  const onInputChange = (e) => {
    setInputVal(e.target.value);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    onAddClick();
  };

  const onAddClick = () => {
    // do validation of shopping list name
    if (inputVal.length < 5) {
      setError("Too short (min 5 characters)");
      inputRef.current.focus();
      return;
    }
    if (inputVal.length > 20) {
      setError("Too long (max 20 characters)");
      inputRef.current.focus();
      return;
    }
    confirmCallback && confirmCallback(inputVal);
  };

  return (
    <div className="shopping-list-modal-overlay">
      <div className="shopping-list-modal" ref={modalRef}>
        <form onSubmit={(e) => onFormSubmit(e)}>
          <label htmlFor="shoppingList">{message}</label>
          <input id="shoppingList" type="text" onChange={onInputChange} placeholder="Shopping list name" value={inputVal} ref={inputRef}></input>
        </form>
        {error && <p>{error}</p>}
        <div className="shopping-list-modal-button-container">
          <button className="button-color-2" onClick={onAddClick}>
            Confirm
          </button>
          <button className="button-color-3" onClick={() => cancelCallback && cancelCallback()}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputBoxModal;
