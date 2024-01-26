import React from "react";
import { logout } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setContent } from "../../redux/messageSlice";
import { MdOutlineLogout } from "react-icons/md";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate("/");
      dispatch(
        setContent({ text: "Successfully logged out.", type: "success" })
      );
    } catch (error) {
      console.error("Error logging out:", error);
      dispatch(setContent({ text: "Error logging out", type: "error" }));
    }
  };

  // console.log("logout component rendered");

  return (
    <button className="logout" aria-label="logout" onClick={handleLogout}>
      <MdOutlineLogout style={{ fontSize: "20px" }} />
    </button>
  );
};

export default Logout;
