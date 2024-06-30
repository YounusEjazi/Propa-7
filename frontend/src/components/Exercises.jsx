import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "antd";
import "./Exercises.css";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:3000/get-exercises", {
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
  }, []);

  const showDeleteModal = (id) => {
    setDeleteId(id);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    deleteExercise(deleteId);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const deleteExercise = (id) => {
    fetch(`http://localhost:3000/delete-exercise/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setExercises(exercises.filter((exercise) => exercise.id !== id));
          alert("Exercise deleted successfully");
        } else {
          alert("Failed to delete exercise");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid Date" : date.toLocaleDateString();
  };

  return (
    <section className="courses">
      <h1 className="heading">Our Exercises</h1>
      <div className="box-container">
        {exercises.map((exercise) => (
          <div className="box" key={exercise.id}>
            <div className="tutor">
              <img
                src={
                  exercise.creatorImg
                    ? `http://localhost:3000${exercise.creatorImg}`
                    : "/user.png"
                }
                alt="Creator"
                className="creator-img"
              />
              <div className="info">
                <h3>{exercise.title}</h3>
                <span>{formatDate(exercise.date)}</span>
              </div>
            </div>
            <div className="thumb">
              <img src={exercise.img} alt={exercise.title} />
              <span>{exercise.description}</span>
            </div>
            <h3 className="title">{exercise.title}</h3>
            <Link to={`/exDetails/${exercise.id}`} className="inline-btn">
              View Exercise
            </Link>
            {user && user.userType === "Admin" && (
              <button
                className="delete-btn"
                onClick={() => showDeleteModal(exercise.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <Modal
        title="Delete Exercise"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this exercise?</p>
      </Modal>
    </section>
  );
};

export default Exercises;
