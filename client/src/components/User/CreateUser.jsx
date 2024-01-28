import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  // selectUser,
  // selectPassword,
  // selectIsLoggedIn,
} from "../../redux/userSlice";
import { userSchema } from "../../utils/joiUtils";
import "./Login.scss";
import sha256 from "sha256";
import { setContent } from "../../redux/messageSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../../config";
import { FaUserCircle } from "react-icons/fa";

const CreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasTescoCard, setHasTescoCard] = useState(false);
  const [hasNectarCard, setHasNectarCard] = useState(false);
  const [hasAsdaCard, setHasAsdaCard] = useState(false);
  const [hasMorrisonsCard, setHasMorrisonsCard] = useState(false);
  const [hasWaitroseCard, setHasWaitroseCard] = useState(false);
  const [hasIcelandCard, setHasIcelandCard] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // const isLoggedIn = useSelector(selectIsLoggedIn);

  // const user = useSelector(selectUser);
  // const storedPassword = useSelector(selectPassword);

  const validateUser = (email) => {
    return userSchema.validate(email, { abortEarly: false });
  };

  const handleSignUp = async () => {
    const body = {
      email,
      password,
      confirmPassword,
      hasAsdaCard,
      hasIcelandCard,
      hasMorrisonsCard,
      hasNectarCard,
      hasTescoCard,
      hasWaitroseCard,
    };

    const { error } = validateUser(body);

    if (error) {
      setValidationError(error.details[0].message);
      return;
    }

    try {
      const { data } = await axios.post(`${apiURL()}/user/signup`, body);
      console.log(data);
      if (data.status === 1) {
        // dispatch(login());
        navigate("/");
      } else {
        dispatch(setContent({ text: "Error creating a user.", type: "error" }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {/* Create User Form */}
      <div className="user-container">
        <FaUserCircle className="user-icon" />
      </div>
      <form>
        <div className="user-form">
          <input
            type="text"
            id="email"
            className="input-create-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="email"
          />
          <input
            type="password"
            id="password"
            className="input-create-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            autoComplete="new-password"
          />

          <label htmlFor="confirmPassword"></label>
          <input
            type="password"
            id="confirmPassword"
            className="input-confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm password"
            autoComplete="new-password"
          />
        </div>
      </form>

      <div className="validation-error">
        {validationError && <p>{validationError}</p>}
      </div>

      <div className="userButtons">
        <button
          className="createUser"
          aria-label="createUser"
          onClick={handleSignUp}
        >
          Create User
        </button>
      </div>
    </>
  );
};

export default CreateUser;
