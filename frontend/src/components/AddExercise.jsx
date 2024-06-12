import React, { useState } from "react";

const AddExercise = () => {
  const [exercise, setExercise] = useState({ id: "", title: "", description: "", img: "" });

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setExercise((prev) => ({ ...prev, [name]: value }));
  };

  const addExercise = (e) => {
    e.preventDefault();

    const exerciseWithDate = { ...exercise, date: new Date().toISOString() };

    fetch("http://localhost:3000/add-exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      body: JSON.stringify(exerciseWithDate),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          // alert("Exercise added successfully");
          setExercise({ id: "", title: "", description: "", img: "" });
        } else {
          // alert("Failed to add exercise");
        }
      });
  };

  return (
    <div className="auth-wrapper" style={{ height: "auto", marginTop: 50 }}>
      <div className="auth-inner" style={{ width: "fit-content" }}>
        <form onSubmit={addExercise}>
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
      </div>
    </div>
  );
};

export default AddExercise;
