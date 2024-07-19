import React, { useState } from "react";
import { notification } from 'antd';
import styles from './Auth.module.css';

export default function Login() {
  const [api, contextHolder] = notification.useNotification();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:3000/login-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          notification.success({ message: "Login successful" });
          window.localStorage.setItem("token", data.data.token);
          window.localStorage.setItem("user", JSON.stringify(data.data.user));
          window.localStorage.setItem("loggedIn", true);
          window.location.href = "./dashboard";
        } else {
          notification.error({ message: "Login failed. Please check your credentials and try again." });
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.glassLoginForm}>
        <form onSubmit={handleSubmit}>
          <h3>Sign In</h3>
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
          <button type="submit">Submit</button>
          <p className={styles.forgotPassword}>
            <a href="/sign-up">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
