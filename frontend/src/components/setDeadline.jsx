import React, { useState, useEffect } from "react";
import { Select, Button, DatePicker, message } from "antd";
import moment from "moment";

const { Option } = Select;

const SetDeadline = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    // Fetch exercises from backend when component mounts
    fetchExercises();
  }, []);

  const fetchExercises = () => {
    fetch("http://localhost:3000/exercises", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setExercises(data.data);
        } else {
          console.error("Failed to fetch exercises");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleExerciseChange = (value) => {
    setSelectedExercise(value);
  };

  const handleDateChange = (date) => {
    setDeadline(date);
  };

  const handleSubmit = () => {
    if (!selectedExercise) {
      message.error("Please select an exercise");
      return;
    }
    if (!deadline) {
      message.error("Please select a deadline");
      return;
    }

    const formattedDeadline = moment(deadline).format("YYYY-MM-DD");

    fetch(`http://localhost:3000/set-deadline/${selectedExercise}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ deadline: formattedDeadline }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          message.success("Deadline set successfully");
          // Optionally, update state or handle success action
        } else {
          message.error("Failed to set deadline");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div style={{ width: "300px" }}>
      <h2>Set Deadline for Exercise</h2>
      <Select
        placeholder="Select an exercise"
        onChange={handleExerciseChange}
        style={{ marginBottom: "1rem", width: "100%" }}
        value={selectedExercise}
      >
        {exercises.map((exercise) => (
          <Option key={exercise._id} value={exercise._id}>
            {exercise.title}
          </Option>
        ))}
      </Select>
      <DatePicker
        placeholder="Select deadline"
        onChange={handleDateChange}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      <Button type="primary" onClick={handleSubmit} style={{ width: "100%" }}>
        Set Deadline
      </Button>
    </div>
  );
};

export default SetDeadline;
