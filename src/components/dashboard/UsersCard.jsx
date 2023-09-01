import React, { useEffect, useRef, useState } from "react";
import "../../components-css/dashboard/usersCard.css";

export default function UsersCard({ id, handleAdminEdit }) {
  const [state, setState] = useState();
  const [usersData, setUsersData] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const editUserForm = useRef(null);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch(
          "http://192.168.1.17:8000/src/dashboard-php/getUsers.php",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data === false) {
          setState(false);
        } else {
          setState(true);
          const users = data.map((user) => ({
            ...user,
            edit: false,
            delete: false,
          }));
          setUsersData(users);
        }
      } catch {
        setState(false);
      }
    }

    getUsers();
  }, []);

  function handleAddUser() {
    if (!addUser) {
      const prevData = [...usersData];
      const data = { id: "i", username: "--", edit: true, delete: false };
      const newData = [...prevData, data];

      setUsersData(newData);
    } else {
      setUsersData((prevData) => prevData.filter((user) => user.id !== "i"));
    }

    setAddUser(!addUser);
  }

  async function handleDelete(userId) {
    setUsersData((prevData) =>
      prevData.map((user) =>
        user.id === userId && user.delete === false
          ? { ...user, delete: true }
          : user
      )
    );

    const userToDelete = usersData.find(
      (user) => user.id === userId && user.delete === true
    );
    if (userToDelete) {
      const response = await fetch(
        "http://192.168.1.17:8000/src/dashboard-php/deleteUser.php",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userId),
        }
      );

      const data = await response.json();
      if (data === true) {
        setUsersData((prevData) =>
          prevData.filter((user) => user.id !== userId)
        );
      }
    }
  }

  function handleCancelDelete(userId) {
    setUsersData((prevData) =>
      prevData.map((user) =>
        user.id === userId && user.delete === true
          ? { ...user, delete: false }
          : user
      )
    );
  }

  function handleEdit(userId) {
    setUsersData((prevData) =>
      prevData.map((user) =>
        user.id === userId ? { ...user, edit: !user.edit } : user
      )
    );
  }

  async function handleEditUser(userId) {
    const form = editUserForm.current;

    if (form.checkValidity()) {
      const formData = new FormData(form);

      let username = formData.get("username");
      let password = formData.get("password");

      if (username === "" && password === "") {
        return;
      }

      if (userId !== "i") {
        handleEdit(userId);

        const data = {
          id: userId,
          username: username,
          password: password,
        };

        fetch("http://192.168.1.17:8000/src/dashboard-php/editUser.php", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (username !== "") {
          setUsersData((prevData) =>
            prevData.map((user) =>
              user.id === userId ? { ...user, username: username } : user
            )
          );

          userId == id && handleAdminEdit(username);
        }
      } else {
        const data = {
          id: userId,
          username: username,
          password: password,
        };

        fetch("http://192.168.1.17:8000/src/dashboard-php/editUser.php", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((newId) => {
          setUsersData((prevData) =>
            prevData.map((user) =>
              user.id === "i" ? { ...user, username: username, edit: false, id: newId } : user
            )
          );

          setAddUser(false);
        })

        
      }
    }
  }

  return (
    <>
      <div className="card users-card flex-grow-1 bg-dark-lighter">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="text-white fs-4 mb-0 fw-bolder">Users</h4>
          {addUser === false && (
            <button
              onClick={() => handleAddUser()}
              className="btn btn-sm btn-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-person-fill-add d-flex justify-content-center align-items-center"
                viewBox="0 0 16 16"
              >
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
              </svg>
            </button>
          )}
        </div>

        {state === false ? (
          <div className="card-body users-card-content">
            <h6 className="card-title fs-5 text-danger opacity-75 text-capitalize mb-0 text-center">
              An error has occur!
            </h6>
          </div>
        ) : (
          state === true && (
            <ul className="list-group list-group-flush">
              {usersData.map((user) => (
                <li
                  key={user.id}
                  className={`list-group-item bg-dark-lighter text-white border-secondary d-flex align-items-center ${
                    user.delete === false
                      ? "justify-content-around"
                      : "justify-content-center"
                  } flex-wrap column-gap-2 row-gap-2`}
                >
                  {user.edit === false && user.delete === false ? (
                    <>
                      <p className="mb-0 fw-medium">{user.username}</p>
                      <div className="dots d-flex column-gap-1">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                      <div className="d-flex column-gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleEdit(user.id)}
                          className="btn btn-sm btn-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil-fill d-flex justify-content-center align-items-center"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                          </svg>
                        </button>
                        {id != user.id && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            type="button"
                            className="btn btn-sm btn-danger"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-trash-fill d-flex justify-content-center align-items-center"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </>
                  ) : user.edit === true && user.delete === false ? (
                    <div className="d-flex flex-column align-items-center row-gap-2">
                      <form ref={editUserForm} className="input-group" data-bs-theme="dark">
                        <input
                          placeholder={
                            user.id === "i" ? "Username" : "New Username"
                          }
                          className="form-control"
                          name="username"
                          type="text"
                          maxLength="20"
                          autoComplete="username"
                          required={user.id === "i" ? true : false}
                        />

                        <input
                          placeholder={
                            user.id === "i" ? "Password" : "New Password"
                          }
                          className="form-control"
                          name="password"
                          type="password"
                          maxLength="20"
                          autoComplete="new-password"
                          required={user.id === "i" ? true : false}
                        />
                      </form>

                      <div className="d-flex column-gap-2 flex-wrap">
                        <button
                          type="submit"
                          onClick={() => handleEditUser(user.id)}
                          className="btn btn-sm btn-success"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-check-lg d-flex justify-content-center align-items-center"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={
                            user.id !== "i"
                              ? () => handleEdit(user.id)
                              : () => handleAddUser()
                          }
                          className="btn btn-sm btn-danger"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-box-arrow-right d-flex justify-content-center align-items-center"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                            />
                            <path
                              fillRule="evenodd"
                              d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-sm btn-danger fw-medium"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelDelete(user.id)}
                        className="btn btn-sm btn-secondary fw-medium"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </>
  );
}
