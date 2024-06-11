import { Button, Card, Input, Space, Select } from "antd";
import { useState, useEffect } from "react";

const FeedbackPage = () => {
  const [commentText, setCommentText] = useState({});
  const [feedbackText, setFeedbackText] = useState("");
  const [allFeedback, setAllFeedback] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem("user"))
  );
  const [users, setUsers] = useState([]);
  const [feedbackUser, setFeedbackUser] = useState(null);

  useEffect(() => {
    if (user.userType === "Admin") {
      fetch(`http://localhost:3000/getAllUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.data);
        });
    }
  }, []);

  const getAllFeedback = async () => {
    await fetch(`http://localhost:3000/get-feedback`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setAllFeedback(data.data);
        } else {
          console.error("Failed to fetch feedback details");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleFeedbackChange = (event) => {
    setFeedbackText(event.target.value);
  };

  const addFeedback = async () => {
    await fetch("http://localhost:3000/add-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        feedbackUserId: feedbackUser._id,
        firstName: user.fname,
        lastName: user.lname,
        feedback: feedbackText,
      }),
    });

    await getAllFeedback();
    setFeedbackText("");
  };

  useEffect(() => {
    getAllFeedback();
  }, []);

  const handleCommentChange = (feedbackId, event) => {
    setCommentText({
      ...commentText,
      [feedbackId]: event.target.value,
    });
  };

  const addComment = async (feedbackId) => {
    await fetch(`http://localhost:3000/add-comment/${feedbackId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        firstName: user.fname,
        lastName: user.lname,
        comment: commentText[feedbackId],
        feedbackId: feedbackId,
      }),
    });

    await getAllFeedback();
    setCommentText({ ...commentText, [feedbackId]: "" });
  };

  const selectFeedbackUser = (event) => {
    setFeedbackUser(users.find((user) => user._id === event));
  };

  const deleteFeedback = (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      fetch(`http://localhost:3000/delete-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "ok") {
            setAllFeedback(
              allFeedback.filter((feedback) => feedback._id !== id)
            );
          } else {
            console.error("Failed to delete feedback");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  return (
    <Space
      direction="vertical"
      size={[8, 20]}
      style={{ width: "50%", marginTop: "1rem" }}
    >
      {user.userType === "Admin" ? (
        <div>
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={(event) => selectFeedbackUser(event)}
            onSearch={() => {}}
            // filterOption={filterOption}
            options={users.map((user) => {
              return {
                value: user._id,
                label: `${user.fname} ${user.lname}`,
              };
            })}
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <Input.TextArea
            size="large"
            placeholder="Write New Feedback"
            allowClear
            style={{ marginBottom: "1rem" }}
            value={feedbackText}
            onChange={handleFeedbackChange}
          />

          <Button
            iconPosition="end"
            type="primary"
            onClick={addFeedback}
            block
            disabled={!feedbackUser || !feedbackText}
          >
            Add Feedback
          </Button>
        </div>
      ) : null}

      {allFeedback &&
        allFeedback
          .filter((feedback) => {
            if (user.userType === "Admin") {
              return feedback;
            } else {
              if (
                feedback.feedbackUserId &&
                user.id.toString() === feedback.feedbackUserId.toString()
              ) {
                return feedback;
              }
              return undefined;
            }
          })
          .map((feedback) => {
            return (
              <Card
                key={feedback._id}
                title={`${feedback.firstName} ${feedback.lastName}`}
                bordered={false}
                style={{ width: "100%" }}
              >
                <h4>{feedback.feedback}</h4>
                {feedback.comments.map((comment) => {
                  return (
                    <div
                      key={comment._id}
                      style={{
                        backgroundColor: "rgb(224, 233, 236, 0.7)",
                        opacity: 0.7,
                        marginBottom: "1rem",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        padding: "0 1.2rem 0 1.2rem",
                      }}
                    >
                      <span
                        style={{ fontSize: "14px", float: "left" }}
                      >{`${comment.firstName} ${comment.lastName}`}</span>
                      <span style={{ fontSize: "10px" }}>
                        {comment.comment}
                      </span>
                    </div>
                  );
                })}
                <Input.TextArea
                  size="large"
                  placeholder="Write Comment"
                  allowClear
                  style={{ marginBottom: "1rem" }}
                  value={commentText[feedback._id] || ""}
                  onChange={(event) => handleCommentChange(feedback._id, event)}
                />

                <Button
                  type="primary"
                  onClick={() => addComment(feedback._id)}
                  block
                  disabled={!commentText[feedback._id]}
                >
                  Add Comment
                </Button>
                {user.userType === "Admin" && (
                  <Button
                    type="primary"
                    danger
                    onClick={() => deleteFeedback(feedback._id)}
                    block
                    style={{ marginTop: "1rem" }}
                  >
                    Delete Feedback
                  </Button>
                )}
              </Card>
            );
          })}
    </Space>
  );
};

export default FeedbackPage;
