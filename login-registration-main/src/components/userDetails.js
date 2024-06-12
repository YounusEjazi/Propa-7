// src/components/UserDetails.js
import React, { useEffect, useState } from "react";
import UserHome from "./userHome";

export default function UserDetails() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/userData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setUserData(data.data);
        } else {
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        window.localStorage.clear();
        window.location.href = "./sign-in";
      });
  }, []);

  return userData ? <UserHome userData={userData} /> : <div>Loading...</div>;
}
