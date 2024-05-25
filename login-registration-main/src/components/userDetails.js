import React, { useEffect, useState } from "react";
import AdminHome from "./adminHome";
import UserHome from "./userHome";

export default function UserDetails() {
  const [userData, setUserData] = useState("");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/userData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: window.localStorage.getItem("token"),
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          if (data.data.userType === "Admin") {
            setAdmin(true);
          }
          setUserData(data.data);
        } else {
          alert("Failed to fetch user data. Please login again.");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("An error occurred. Please try again later.");
        window.localStorage.clear();
        window.location.href = "./sign-in";
      });
  }, []);

  return admin ? <AdminHome /> : <UserHome userData={userData} />;
}
