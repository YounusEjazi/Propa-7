import React, { useEffect, useState } from "react";
import { faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button } from "antd";

export default function AdminHome() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ id: null, name: "" });

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

  const showDeleteModal = (id, name) => {
    setDeleteInfo({ id, name });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    deleteUser(deleteInfo.id, deleteInfo.name);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const deleteUser = (id, name) => {
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
        if (data.status === "ok") {
          getAllUser(); // Refresh the list after deletion
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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
                  <FontAwesomeIcon icon={faTrash} onClick={() => showDeleteModal(i._id, i.fname)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button onClick={logOut} className="btn btn-primary" style={{ marginTop: 10 }}>
          Log Out
        </Button>
      </div>

      <Modal
        title="Delete User"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete {deleteInfo.name}?</p>
      </Modal>
    </div>
  );
}
