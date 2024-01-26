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
      <form>
        <div className="user-form">
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
            autoComplete="new-password"
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <label htmlFor="email" id="loyalty-head">
            {" "}
            Loyalty cards
          </label>
        </div>
      </form>

      <div className="loyalty-container">
        <div className="user-form loyalty tesco">
          <label htmlFor="tescoCard">Tesco Club Card:</label>
          <input
            type="checkbox"
            id="tescoCard"
            checked={hasTescoCard}
            onChange={() => setHasTescoCard(!hasTescoCard)}
          />
        </div>
        <div className="user-form loyalty sainsburys">
          <label htmlFor="nectarCard">Sainsbury's Nectar </label>
          <input
            type="checkbox"
            id="nectarCard"
            checked={hasNectarCard}
            onChange={() => setHasNectarCard(!hasNectarCard)}
          />
        </div>
        <div className="user-form loyalty asda">
          <label htmlFor="asdaCard">Asda Rewards</label>
          <input
            type="checkbox"
            id="asdaCard"
            checked={hasAsdaCard}
            onChange={() => setHasAsdaCard(!hasAsdaCard)}
          />
        </div>
        <div className="user-form loyalty morrisons">
          <label htmlFor="morrisonsCard">Morrison's More</label>
          <input
            type="checkbox"
            id="morrisonsCard"
            checked={hasMorrisonsCard}
            onChange={() => setHasMorrisonsCard(!hasMorrisonsCard)}
          />
        </div>
        <div className="user-form loyalty waitrose">
          <label htmlFor="waitroseCard">My Waitrose</label>
          <input
            type="checkbox"
            id="waitroseCard"
            checked={hasWaitroseCard}
            onChange={() => setHasWaitroseCard(!hasWaitroseCard)}
          />
        </div>{" "}
        <div className="user-form loyalty iceland">
          <label htmlFor="icelandCard">Iceland Bonus:</label>
          <input
            type="checkbox"
            id="icelandCard"
            checked={hasIcelandCard}
            onChange={() => setHasIcelandCard(!hasIcelandCard)}
          />
        </div>
      </div>

      <div className="validation-error">{validationError && <p>{validationError}</p>}</div>

      <div className="userButtons">
        <button className="createUser" aria-label="createUser" onClick={handleSignUp}>
          Create User
        </button>
      </div>
    </>
  );
};

export default CreateUser;
