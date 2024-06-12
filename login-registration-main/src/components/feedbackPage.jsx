import { Button, Card, Input, Space } from "antd";
import { useState, useEffect } from "react";

const FeedbackPage = () => {
  const [commentText, setCommentText] = useState();
  const [feedbackText, setFeedbackText] = useState();

  const [allFeedback, setAllFeedback] = useState();

  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem("user"))
  );

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
          console.error("Failed to fetch exercise details");
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
        firstName: user.fname,
        lastName: user.lname,
        feedback: feedbackText,
      }),
    });

    await getAllFeedback();

    setFeedbackText(null);
  };

  useEffect(() => {
    getAllFeedback();
  }, []);

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const addComment = () => {};

  return (
    <Space
      direction="vertical"
      size={[8, 20]}
      style={{ width: "50%", marginTop: "1rem" }}
    >
      {user.userType === "Admin" ? (
        <div>
          <Input.TextArea
            size="large"
            placeholder="Write New Feedback"
            allowClear
            style={{ marginBottom: "1rem" }}
            value={feedbackText}
            onChange={handleFeedbackChange}
          />

          <Button type="primary" onClick={addFeedback} block>
            Add Feedback
          </Button>
        </div>
      ) : null}

      {allFeedback &&
        allFeedback.map((feedback) => {
          return (
            <Card
              title={`${feedback.firstName} ${feedback.lastName}`}
              bordered={false}
              style={{ width: "100%" }}
            >
              <h4>{feedback.feedback}</h4>
              {feedback.comments.map((comment) => {
                return (
                  <div
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
                    <span style={{ fontSize: "10px" }}>{comment.comment}</span>
                  </div>
                );
              })}
              <Input.TextArea
                size="large"
                placeholder="Write Comment"
                allowClear
                style={{ marginBottom: "1rem" }}
                onChange={handleCommentChange}
              />

              <Button type="primary" onClick={addComment} block>
                Add Comment
              </Button>
            </Card>
          );
        })}
    </Space>
  );
};

export default FeedbackPage;
