import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./exDetails.css";
import { Button, Card, Input, Space, Select, Modal } from "antd"; // Import Modal from Ant Design
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import SelectableSection from "./selectable";

const { TextArea } = Input;

const ExerciseDetails = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState();
  const [exerciseDetails, setExerciseDetails] = useState("");
  const [predefinedAreas, setPredefinedAreas] = useState([]);
  const [boxes, setBoxes] = useState({
    box1: [
      { id: 1, src: "/Tragwerkelemente/le/Bögen.png", name: "Bögen" },
      { id: 2, src: "/Tragwerkelemente/le/Seil.png", name: "Seil" },
      { id: 3, src: "/Tragwerkelemente/le/Biegträger.png", name: "Biegträger" },
      { id: 4, src: "/Tragwerkelemente/le/Stab.png", name: "Stab" },
      { id: 5, src: "/Tragwerkelemente/le/Rahmen.png", name: "Rahmen" },
      { id: 6, src: "/Tragwerkelemente/le/Druckstab.png", name: "Druckstab" },
      { id: 7, src: "/Tragwerkelemente/le/Zugstab.png", name: "Zugstab" },
      {
        id: 8,
        src: "/Tragwerkelemente/le/Fachwerkträger.png",
        name: "Fachwerkträger",
      },
      {
        id: 9,
        src: "/Tragwerkelemente/le/Rahmenträger.png",
        name: "Rahmenträger",
      },
      {
        id: 10,
        src: "/Tragwerkelemente/le/Eingespannter Rahmen.png",
        name: "Eingespannter Rahmen",
      },
      {
        id: 11,
        src: "/Tragwerkelemente/le/Zweigelenkrahmen.png",
        name: "Zweigelenkrahmen",
      },
    ],
    box2: [
      { id: 12, src: "/Tragwerkelemente/fügung/ecke.png", name: "Ecke" },
      { id: 13, src: "/Tragwerkelemente/fügung/fügung.png", name: "Fügung" },
      { id: 14, src: "/Tragwerkelemente/fügung/gelenk.png", name: "Gelenk" },
      {
        id: 15,
        src: "/Tragwerkelemente/fügung/gelenkigefügung.png",
        name: "Gelenkigefügung",
      },
    ],
    box3: [
      { id: 16, src: "/Tragwerkelemente/auflager/fest.png", name: "Fest" },
      {
        id: 17,
        src: "/Tragwerkelemente/auflager/gespannt.png",
        name: "Gespannnt",
      },
      {
        id: 18,
        src: "/Tragwerkelemente/auflager/verschieblich.png",
        name: "Verschieblich",
      },
    ],
    box4: [],
  });
  const [materials, setMaterials] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedElement, setSelectedElement] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [tip, setTip] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalContent, setModalContent] = useState(""); // State to set modal content dynamically

  useEffect(() => {
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
  }, [id]);

  useEffect(() => {
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
  }, [id]);

  useEffect(() => {
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
          console.log("Materials fetched:", data.data);
          setMaterials(data.data);
        } else {
          console.error("Failed to fetch materials");
        }
      })
      .catch((error) => console.error("Error:", error));
  }, [id]);

  const handleElementClick = (item) => {
    if (!selectedSection) {
      setModalContent("Please select an area first.");
      setModalVisible(true);
      return;
    }

    const predefinedArea = predefinedAreas.find(
      (area) =>
        area.elementId === item.id &&
        area.startX === selectedSection.startX &&
        area.startY === selectedSection.startY &&
        area.endX === selectedSection.endX &&
        area.endY === selectedSection.endY
    );

    const box = document.getElementById("box4");

    if (predefinedArea) {
      setModalContent("Correct Answer!");
      setModalVisible(true);
      box.classList.add("correct");
      setTip("Great job!");
      setTimeout(() => {
        box.classList.remove("correct");
      }, 1000);
    } else {
      setModalContent(
        "The selected area does not match the predefined area for the item."
      );
      setModalVisible(true);
      box.classList.add("incorrect");
      setIncorrectAttempts((prev) => prev + 1);
      const tips = [
        "Wrong answer, try again!",
        "Need tips?",
        "Incorrect, keep trying!",
        "Almost there, try again!",
      ];
      setTip(tips[Math.floor(Math.random() * tips.length)]);
      setTimeout(() => {
        box.classList.remove("incorrect");
      }, 1000);
    }
  };

  const handleAddMaterial = (material) => {
    fetch("http://localhost:3000/add-materials", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: material,
    })
      .then((response) => response.json())
      .then((data) => setMaterials([...materials, data.data]));
  };

  const deleteMaterial = (material) => {
    fetch("http://localhost:3000/delete-material", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: material._id }),
    })
      .then((response) => response.json())
      .then(() =>
        setMaterials(materials.filter((mat) => mat._id !== material._id))
      );
  };

  const handleSelectArea = (area) => {
    setSelectedSection(area);
    setIsLocked(true);
  };

  const handleUnlock = () => {
    setIsLocked(false);
    setSelectedSection(null);
  };

  const handleElementChange = (value) => {
    setSelectedElement(value);
  };

  const handleSaveArea = () => {
    if (!selectedElement) {
      setModalContent("Please select an element to save.");
      setModalVisible(true);
      return;
    }

    const elementId = parseInt(selectedElement, 10);
    const newArea = {
      exerciseId: id,
      elementId,
      startX: selectedSection.startX,
      startY: selectedSection.startY,
      endX: selectedSection.endX,
      endY: selectedSection.endY,
    };

    fetch("http://localhost:3000/add-predefined-area", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newArea),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setPredefinedAreas([...predefinedAreas, newArea]);
          setSelectedSection(null);
          setSelectedElement("");
        } else {
          console.error("Failed to save predefined area");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDetailsChange = (e) => {
    setExerciseDetails(e.target.value);
  };

  const handleSaveDetails = () => {
    fetch(`http://localhost:3000/update-exercise/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ details: exerciseDetails }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setModalContent("Exercise details updated successfully");
          setModalVisible(true);
          setIsEditing(false);
        } else {
          console.error("Failed to update exercise details");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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
    <section>
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
                    height: `${
                      selectedSection.endY - selectedSection.startY
                    }px`,
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
                <Button
                  onClick={handleSaveDetails}
                  className="inline-btn"
                  block
                >
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
            </div>
          </div>
        </div>
      </section>

      <section className="ex-elements">
        <h1 className="heading">Exercise Elements</h1>
        <div className="box-container1">
          <div className="box-header">
            <h2>Lineare Tragwerkelemente</h2>
            <div className="droppable-box" id="box1">
              {boxes.box1.map((img) => (
                <div
                  key={img.id}
                  id={`box1-${img.id}`}
                  className="image-wrapper"
                  onClick={() => handleElementClick(img)}
                >
                  <div className="circular-border">
                    <img
                      src={img.src}
                      alt={img.name}
                      className="draggable-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="box-header">
            <h2>Fügungen</h2>
            <div className="droppable-box" id="box2">
              {boxes.box2.map((img) => (
                <div
                  key={img.id}
                  id={`box2-${img.id}`}
                  className="image-wrapper"
                  onClick={() => handleElementClick(img)}
                >
                  <div className="circular-border">
                    <img
                      src={img.src}
                      alt={img.name}
                      className="draggable-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="box-header">
            <h2>Auflager</h2>
            <div className="droppable-box" id="box3">
              {boxes.box3.map((img) => (
                <div
                  key={img.id}
                  id={`box3-${img.id}`}
                  className="image-wrapper"
                  onClick={() => handleElementClick(img)}
                >
                  <div className="circular-border">
                    <img
                      src={img.src}
                      alt={img.name}
                      className="draggable-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="box-header">
            <h2>Zuordnung</h2>
            <div className="droppable-box" id="box4">
              {boxes.box4.map((img) => (
                <div
                  key={img.id}
                  id={`box4-${img.id}`}
                  className="image-wrapper"
                  onClick={() => handleElementClick(img)}
                >
                  <div className="circular-border">
                    <img
                      src={img.src}
                      alt={img.name}
                      className="draggable-image"
                    />
                  </div>
                </div>
              ))}
              <div className="tip-box">
                <p>{tip}</p>
                {incorrectAttempts >= 10 && (
                  <Button
                    className="tip-button"
                    onClick={() => navigate("/help-page")}
                  >
                    Get Help
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ex-videos">
        <h1 className="heading">Supportive Materials</h1>
        <div className="box-containerp">
          {materials.length > 0 ? (
            materials.map((material) => (
              <div className="box" key={material._id}>
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
      </section>

      <Modal
        title="Message"
        visible={modalVisible}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        footer={[
          <Button key="ok" type="primary" onClick={handleCloseModal}>
            OK
          </Button>,
        ]}
      >
        <p>{modalContent}</p>
      </Modal>
    </section>
  );
};

export default ExerciseDetails;
