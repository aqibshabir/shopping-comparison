import React, { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import BarcodeScanner from "./components/BarcodeScanner/BarcodeScanner";
import Map from "./components/Map/Map";
import Menu from "./components/Menu/Menu";
import "./components/Menu/menu.scss";
import SearchBar from "./components/Search/SearchBar";
import Login from "./components/User/login";
import CreateUser from "./components/User/CreateUser";
import ForgotPassword from "./components/User/ForgotPassword";
import Nav from "./components/Navigation/Nav";
import "./css/App.scss";
import ProductInfoPage from "./components/Search/ProductInfo";
import { selectIsLoggedIn } from "./redux/userSlice";
import { useSelector, useDispatch } from "react-redux";
import Error from "./components/Error/Error";
import { ToastContainer, toast } from "react-toastify";
import "./generic/ReactToastify.min.css";
import { selectContent, setContent } from "./redux/messageSlice";
import ShoppingList from "./components/ShoppingList/List/ShoppingList";
import ShoppingLists from "./components/ShoppingList/Lists/ShoppingLists";
import { apiURL } from "./config";
import { FaUser } from "react-icons/fa";

export default function App() {
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const content = useSelector(selectContent);
  const dispatch = useDispatch();

  useEffect(() => {
    if (content.text) {
      if (content.type == "success") {
        toast.success(content.text);
      }
      if (content.type == "error") {
        toast.error(content.text);
      }
      dispatch(setContent(""));
    }
  }, [content]);

  return (
    <>
      <div className="app-container">
        {/* {_apiURL.includes("localhost") && <Debug />} */}
        <ToastContainer />
        <>{location.pathname !== "/"}</>

        {!isLoggedIn ? (
          <>
            <nav>
              {location.pathname !== "/" && (
                <Link to="/">
                  <FaUser className="nav-icon" />
                </Link>
              )}
            </nav>
          </>
        ) : (
          <>
            <Nav />
          </>
        )}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {isLoggedIn ? (
            <>
              <Route path="/recipe" element={<Menu />} />
              <Route path="/shopping-list" element={<ShoppingList />} />
              <Route path="/shopping-lists" element={<ShoppingLists />} />
              <Route path="/map" element={<Map />} />
              <Route path="/barcode" element={<BarcodeScanner />} />
              <Route path="/search" element={<SearchBar />} />
              <Route path="/product/:sku" element={<ProductInfoPage />} />{" "}
            </>
          ) : (
            <Route path="*" element={<Error />} />
          )}
        </Routes>
      </div>
    </>
  );
}
