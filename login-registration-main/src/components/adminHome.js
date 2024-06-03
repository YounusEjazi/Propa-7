import React, { useEffect, useState } from "react";
import { faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminHome() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [exercise, setExercise] = useState({ id: "", title: "", description: "", img: "" });

  useEffect(() => {
    getAllUser();
  }, [searchQuery]);

  const getAllUser = () => {
    fetch(`http://localhost:3000/getAllUser?search=${searchQuery}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  const deleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
      fetch("http://localhost:3000/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userid: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          getAllUser();
        });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setExercise((prev) => ({ ...prev, [name]: value }));
  };

  const addExercise = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/add-exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      body: JSON.stringify(exercise),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          alert("Exercise added successfully");
          setExercise({ id: "", title: "", description: "", img: "" });
        } else {
          alert("Failed to add exercise");
        }
      });
  };

  return (
    <div className="auth-wrapper" style={{ height: "auto", marginTop: 50 }}>
      <div className="auth-inner" style={{ width: "fit-content" }}>
        <h3>Welcome Admin</h3>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <FontAwesomeIcon
            icon={faSearch}
            style={{ position: "absolute", left: 10, top: 13, color: "black" }}
          />
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearch}
            style={{
              padding: "8px 32px 8px 32px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <span style={{ position: "absolute", right: 10, top: 8, color: "#aaa" }}>
            {searchQuery.length > 0 ? `Records Found ${data.length}` : `Total Records ${data.length}`}
          </span>
        </div>
        <table style={{ width: 700 }}>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((i) => (
              <tr style={{ textAlign: "center" }} key={i._id}>
                <td>{i.fname}</td>
                <td>{i.email}</td>
                <td>{i.userType}</td>
                <td>
                  <FontAwesomeIcon icon={faTrash} onClick={() => deleteUser(i._id, i.fname)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form onSubmit={addExercise} style={{ marginTop: 20 }}>
          <h4>Add Exercise</h4>
          <input
            type="text"
            name="id"
            placeholder="ID (optional)"
            value={exercise.id}
            onChange={handleExerciseChange}
            style={{ marginBottom: 10 }}
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={exercise.title}
            onChange={handleExerciseChange}
            style={{ marginBottom: 10 }}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={exercise.description}
            onChange={handleExerciseChange}
            style={{ marginBottom: 10 }}
          />
          <input
            type="text"
            name="img"
            placeholder="Image URL"
            value={exercise.img}
            onChange={handleExerciseChange}
            style={{ marginBottom: 10 }}
          />
          <button type="submit" className="btn btn-primary">
            Add Exercise
          </button>
        </form>
        <button onClick={logOut} className="btn btn-primary" style={{ marginTop: 10 }}>
          Log Out
        </button>
      </div>
    </div>
  );
}
