import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const sendEmail = () => {
    console.log("Sending email to:", email);
  };

  return (
    <>
      <label htmlFor="email">Email address:</label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

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
