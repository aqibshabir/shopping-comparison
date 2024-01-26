import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  selectIsLoggedIn,
  // selectEmail,
  // selectPassword,
} from "../../redux/userSlice";
// import Joi from "joi";
// import { userSchema } from "../../utils/joiUtils";
import SVG from "../Logos/SVG";
import animateText from "./Animation";
// import sha256 from "sha256";
import { setContent } from "../../redux/messageSlice";
import axios from "axios";
import { apiURL } from "../../config";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState(null);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  // const storedEmail = useSelector(selectEmail);
  // const storedPassword = useSelector(selectPassword);
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/search");
    }
  }, []);

  useLayoutEffect(() => {
    animateText(ref1, ref2, ref3);
  }, []);

  const handleUserLogin = async () => {
    const body = { email, password };

    try {
      const { data } = await axios.post(`${apiURL()}/user/login`, body);
      if (data.status === 1) {
        localStorage.setItem("token", data.token);
        dispatch(login());
        navigate("/search");
      } else {
        dispatch(
          setContent({
            text: "Error logging in, please check user/password",
            type: "error",
          })
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      <div className="login-logo">
        <SVG ref1={ref1} ref2={ref2} ref3={ref3} />
      </div>

      {validationError && (
        <div className="validation-error">
          <p>{validationError}</p>{" "}
        </div>
      )}

      <div className="userButtons">
        {!isLoggedIn && (
          <>
            {/* Login Form */}

            <form>
              <div className="login-form">
                <label htmlFor="email">Email:</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />

                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </form>
            <button
              className="login"
              aria-label="login"
              onClick={handleUserLogin}
            >
              Login
            </button>

            <Link
              to="/create-user"
              className="createUser"
              aria-label="createUser"
            >
              Create Account
            </Link>

            <Link
              to="/forgot-password"
              className="forgotPassword"
              aria-label="forgotpassword"
            >
              Forgot Password
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Login;
