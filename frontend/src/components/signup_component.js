import React, { useState } from "react";
import styles from './Auth.module.css';

export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userType === "Admin" && secretKey !== "Tragkonstruktion") {
      alert("Invalid Admin Secret Key");
      return;
    }

    fetch("http://localhost:3000/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        fname,
        lname,
        email,
        password,
        userType,
        secretKey,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          window.location.href = "./sign-in";
        } else {
          alert(data.message || "Something went wrong");
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.glassLoginForm}>
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          <div className={styles.radioGroup}>
            Register As
            <div>
              <input
                type="radio"
                name="UserType"
                value="User"
                onChange={(e) => setUserType(e.target.value)}
              />
              User
            </div>
            <div>
              <input
                type="radio"
                name="UserType"
                value="Admin"
                onChange={(e) => setUserType(e.target.value)}
              />
              Admin
            </div>
          </div>
          {userType === "Admin" && (
            <div className={styles.inputGroup}>
              <label>Secret Key</label>
              <input
                type="text"
                className={styles.formControl}
                placeholder="Secret Key"
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
          )}
          <div className={styles.inputGroup}>
            <label>First name</label>
            <input
              type="text"
              className={styles.formControl}
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Last name</label>
            <input
              type="text"
              className={styles.formControl}
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email address</label>
            <input
              type="email"
              className={styles.formControl}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              className={styles.formControl}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Sign Up</button>
          <p className={styles.forgotPassword}>
            Already registered <a href="/sign-in">sign in?</a>
          </p>
        </form>
      </div>
    </div>
  );
}
