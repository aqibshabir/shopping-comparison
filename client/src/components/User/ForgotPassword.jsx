import React, { useState } from "react";
import { MdOutlinePassword } from "react-icons/md";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const sendEmail = () => {
    console.log("Sending email to:", email);
  };

  return (
    <>
      <div className="icon-container">
        <MdOutlinePassword className="password-reset-icon" />
      </div>
      <div className="container-forgot-password">
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="enter email address..."
          className="forgot-password"
        />
      </div>

      <div className="userButtons">
        <button
          className="emailpassword"
          aria-label="emailpassword"
          onClick={sendEmail}
        >
          Reset Password
        </button>
      </div>
    </>
  );
};

export default ForgotPassword;
