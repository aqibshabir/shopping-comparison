import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/userSlice";
import Logout from "../User/Logout";
import React, { useEffect, useRef, useState } from "react";
import "./Nav.scss";
import { FaCartShopping } from "react-icons/fa6";

const Nav = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [menuOpen, setMenuOpen] = useState(false);
  const refHamburger = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (refHamburger && !refHamburger.current.contains(e.target)) {
        // a click has occurred outside of the hamburger menu, close it.
        setMenuOpen(false);
      }
    };
    const handleResize = (e) => {
      setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMenuClick = (e) => {
    if (menuOpen) {
      refHamburger && refHamburger.current.blur();
      setMenuOpen(false);
    } else {
      setMenuOpen(true);
    }
  };

  return (
    <nav>
      <div>
        <FaCartShopping
          className="trolley"
          style={{
            height: "30px",
            width: "30px",
            color: "white",
            marginLeft: "20px",
            marginTop: "5px",
          }}
        />
      </div>
      <div className="nav-menu">
        <div
          className="nav-hamburger"
          tabIndex={0}
          ref={refHamburger}
          onClick={handleMenuClick}
        >
          <div></div>
        </div>
        <div className={menuOpen ? "nav-links nav-links-show" : "nav-links"}>
          <div className="nav-links-links">
            <Link to="/search">Search</Link>
            <Link to="/shopping-list">Shopping List</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/map">Map</Link>
          </div>
          <Logout />
        </div>
      </div>
    </nav>
  );
};
export default Nav;
