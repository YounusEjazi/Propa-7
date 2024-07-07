import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./exDetails.css";
import { Button, Card, Input, Space, Select, Modal, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import SelectableSection from "./selectable";
import SetDeadline from "./setDeadline";
import moment from "moment";

const { TextArea } = Input;

const ExerciseDetails = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState();
  const [exerciseDetails, setExerciseDetails] = useState("");
  const [predefinedAreas, setPredefinedAreas] = useState([]);
  const [boxes, setBoxes] = useState({});
  const [materials, setMaterials] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedElement, setSelectedElement] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [tip, setTip] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [deadlines, setDeadlines] = useState({});
  const [deadlineMessage, setDeadlineMessage] = useState("");

  useEffect(() => {
    fetchExercise();
    fetchPredefinedAreas();
    fetchMaterials();
    fetchDeadlines();
  }, []);

  const fetchExercise = () => {
    fetch(`http://localhost:3000/get-exercise/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setExercise(data.data);
          setExerciseDetails(data.data.details || "");
        } else {
          console.error("Failed to fetch exercise details");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const fetchPredefinedAreas = () => {
    fetch(`http://localhost:3000/get-predefined-areas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setPredefinedAreas(data.data);
        } else {
          console.error("Failed to fetch predefined areas");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const fetchMaterials = () => {
    fetch(`http://localhost:3000/get-materials/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setMaterials(data.data);
        } else {
          console.error("Failed to fetch materials");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const fetchDeadlines = () => {
    fetch(`http://localhost:3000/get-deadlines`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setDeadlines(data.data);
          if (data.data && data.data[exercise.id]) {
            setDeadlineMessage(
              `Deadline: ${moment(data.data[exercise.id]).format("YYYY-MM-DD")}`
            );
          }
        } else {
          console.error("Failed to fetch deadlines");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleElementClick = (item) => {
    // Handle element click logic
  };

  const handleAddMaterial = (material) => {
    // Handle add material logic
  };

  const deleteMaterial = (material) => {
    // Handle delete material logic
  };

  const handleSelectArea = (area) => {
    // Handle select area logic
  };

  const handleUnlock = () => {
    // Handle unlock logic
  };

  const handleElementChange = (value) => {
    // Handle element change logic
  };

  const handleSaveArea = () => {
    // Handle save area logic
  };

  const handleDetailsChange = (e) => {
    setExerciseDetails(e.target.value);
  };

  const handleSaveDetails = () => {
    // Handle save details logic
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSetDeadline = () => {
    setModalVisible(true);
  };

  if (!exercise) {
    return <div>Loading...</div>;
  }

  const elementOptions = Object.keys(boxes).flatMap((boxKey) =>
    boxes[boxKey].map((element) => ({
      value: element.id,
      label: element.name,
    }))
  );

  return (
    <section className="playlist-details">
      <h1 className="heading">Exercise Information</h1>
      <div className="row">
        <div className="column">
          <div style={{ position: "relative" }}>
            <SelectableSection
              predefinedAreas={predefinedAreas}
              onSelect={handleSelectArea}
              onUnlock={handleUnlock}
              userType={user.userType}
            >
              <div className="img-container">
                <img
                  src={exercise.img}
                  alt={exercise.title}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            </SelectableSection>
            {selectedSection && (
              <div
                className="selection-box locked-selection"
                style={{
                  position: "absolute",
                  left: `${selectedSection.startX}px`,
                  top: `${selectedSection.startY}px`,
                  width: `${selectedSection.endX - selectedSection.startX}px`,
                  height: `${selectedSection.endY - selectedSection.startY}px`,
                  backgroundColor: "rgba(0, 0, 255, 0.3)",
                  zIndex: 1000,
                }}
              />
            )}
            <span>{exercise.description}</span>
            {user.userType === "Admin" && (
              <div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-btn"
                >
                  {isEditing ? "Cancel Edit" : "Edit Exercise"}
                </Button>
                {isEditing && (
                  <div>
                    <Select
                      showSearch
                      placeholder="Select an element"
                      optionFilterProp="children"
                      onChange={handleElementChange}
                      options={elementOptions}
                      style={{ width: "100%", marginBottom: "1rem" }}
                      value={selectedElement || undefined}
                    />
                    <Button
                      onClick={handleSaveArea}
                      className="inline-btn"
                      block
                    >
                      Save Selected Area
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="column">
          {isEditing ? (
            <>
              <TextArea
                size="large"
                placeholder="Write Exercise Details"
                allowClear
                style={{ marginBottom: "1rem", height: "200px" }}
                value={exerciseDetails}
                onChange={handleDetailsChange}
                readOnly={!isEditing}
                className={isEditing ? "editing-textarea" : ""}
              />
              <Button onClick={handleSaveDetails} className="inline-btn" block>
                Save Details
              </Button>
            </>
          ) : (
            <Card
              title="Exercise Details"
              bordered={false}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              <p>{exerciseDetails}</p>
            </Card>
          )}
          <div className="tutor">
            <img
              src={
                exercise.tutorProfilePicture
                  ? `http://localhost:3000${exercise.tutorProfilePicture}`
                  : "/user.png"
              }
              alt="Tutor"
            />
            <div>
              <h3>{exercise.createdBy}</h3>
              <span>{new Date(exercise.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="details">
            <h3>{exercise.title}</h3>
            <p>{exercise.description}</p>
            <div>
              <FontAwesomeIcon icon={faPlay} /> <span>3 min</span>
            </div>
          </div>
          <div className="ex-videos">
            <h1 className="heading">Supportive Materials</h1>
            <div className="box-container">
              {materials.length > 0 ? (
                materials.map((material) => (
                  <div className="box" key={material.id}>
                    <div className="box-content">
                      {material.link ? (
                        <a
                          href={material.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`http://img.youtube.com/vi/${
                              material.link.split("v=")[1]
                            }/0.jpg`}
                            alt={material.title}
                          />
                          <i className="play-icon">
                            <FontAwesomeIcon icon={faPlay} />
                          </i>
                        </a>
                      ) : (
                        <a
                          href={`http://localhost:3000${material.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`http://localhost:3000${material.filePath}`}
                            alt={material.title}
                          />
                        </a>
                      )}
                      <h3>{material.title}</h3>
                    </div>
                    {user.userType === "Admin" && (
                      <Button
                        className="delete-button"
                        onClick={() => deleteMaterial(material)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p>No supportive materials available.</p>
              )}
            </div>
          </div>
          {deadlineMessage && (
            <div className="deadline-section">
              <h1 className="heading">Deadline</h1>
              <p>{deadlineMessage}</p>
            </div>
          )}
        </div>
      </div>
      {user.userType === "Admin" && (
        <div className="admin-controls">
          <Button onClick={handleSetDeadline} className="inline-btn">
            Set Deadline
          </Button>
        </div>
      )}
      <Modal
        title="Set Deadline"
        visible={modalVisible}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
      >
        <SetDeadline
          exerciseId={exercise.id}
          fetchDeadlines={fetchDeadlines}
          closeModal={handleCloseModal}
        />
      </Modal>
    </section>
  );
};

export default ExerciseDetails;
