import React, { useState } from "react";
import './userHome.css'; // Import custom CSS for styling

export default function UserHome({ userData }) {
  const [fname, setFname] = useState(userData.fname);
  const [lname, setLname] = useState(userData.lname);
  const [email, setEmail] = useState(userData.email);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(userData.profilePicture);

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/update-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        fname,
        lname,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          // alert("User details updated successfully");
          window.localStorage.setItem("user", JSON.stringify(data.data));
          setIsEditing(false); // Exit edit mode after successful update
        } else {
          // alert("Failed to update user details");
        }
      })
      .catch((error) => {
        console.error("Error during update:", error);
        // alert("An error occurred. Please try again later.");
      });
  };

  const handleProfilePictureChange = (e) => {
    const formData = new FormData();
    formData.append('profilePicture', e.target.files[0]);

    fetch("http://localhost:3000/upload-profile-picture", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          // alert("Profile picture updated successfully");
          setProfilePicture(data.data.profilePicture);
          window.localStorage.setItem("user", JSON.stringify(data.data));
        } else {
          // alert("Failed to update profile picture");
        }
      })
      .catch((error) => {
        console.error("Error during profile picture update:", error);
        // alert("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="user-profile">
      <div className="info">
        {isEditing ? (
          <form className="form-container" onSubmit={handleSubmit} enctype="multipart/form-data">
            <h3>Update Profile</h3>
            <p>Update Name</p>
            <input
              type="text"
              name="name"
              placeholder={fname}
              maxLength="50"
              className="box"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
            <p>Update Email</p>
            <input
              type="email"
              name="email"
              placeholder={email}
              maxLength="50"
              className="box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p>Previous Password</p>
            <input
              type="password"
              name="old_pass"
              placeholder="Enter your old password"
              maxLength="20"
              className="box"
            />
            <p>New Password</p>
            <input
              type="password"
              name="new_pass"
              placeholder="Enter your new password"
              maxLength="20"
              className="box"
            />
            <p>Confirm Password</p>
            <input
              type="password"
              name="c_pass"
              placeholder="Confirm your new password"
              maxLength="20"
              className="box"
            />
            <p>Update Pic</p>
            <input
              type="file"
              accept="image/*"
              className="box"
              onChange={handleProfilePictureChange}
            />
            <input
              type="submit"
              value="Update Profile"
              name="submit"
              className="btn"
            />
            <button type="button" className="btn btn-secondary" onClick={toggleEdit}>
              Cancel
            </button>
          </form>
        ) : (
          <div className="user">
            <img src={`http://localhost:3000${profilePicture}`} className="image" alt="Profile" />
            <h3 className="name">{fname} {lname}</h3>
            <p className="role">{email}</p>
            <div className="box-container">
              <button className="btn btn-primary" onClick={toggleEdit}>
                Edit Profile
              </button>
              <button onClick={logOut} className="btn btn-secondary">
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
