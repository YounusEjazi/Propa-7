import React from "react";

export default function UserHome({ userData }) {
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div>
          <div>
            Name <h1>{userData.fname}</h1>
          </div>
          <div>
            Email <h1>{userData.email}</h1>
          </div>
          <br />
          <button onClick={logOut} className="btn btn-primary">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
