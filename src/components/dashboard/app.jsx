import React, { useState, useEffect } from "react";
import UsersCard from "./UsersCard";
import ContactCard from "./Contact";
import HomepageCateg from "./HomepageCateg";
import Products from "./Products";
import "../../components-css/dashboard/app.css";

export default function App() {
  const [state, setState] = useState();
  const [id, setId] = useState();
  const [username, setUsername] = useState();

  function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  useEffect(() => {
    async function getUserInfo() {
      const sessionCookie = getCookie("session_id");
      if (sessionCookie === null) {
        setState(false);
        return;
      }

      try {
        const response = await fetch(
          "http://192.168.1.17:8000/src/products%20php/dashboardVerification.php",
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sessionCookie),
          }
        );
        const data = await response.json();
        if (data.status === false) {
          setState(false);
          window.location.href = data.url;
        } else {
          setState(true);
          setUsername(data.username);
          setId(data.id);
        }
      } catch {
        setState(false);
      }
    }

    getUserInfo();
  }, []);

  function handleAdminEdit(username) {
    setUsername(username);
  }

  function handleLogOut() {
    fetch("http://192.168.1.17:8000/src/dashboard-php/logOut.php", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = data;
      });
  }

  return (
    <>
      {state === true ? (
        <>
          <nav className="navbar navbar-expand-lg border-bottom border-secondary border-2">
            <div className="container-fluid">
              <div className="d-flex flex-column">
                <a className="navbar-brand text-white fw-semibold fs-1">
                  Dashboard
                </a>
                <p className="fw-bold fs-5 text-secondary mb-0">
                  Welcome back,{" "}
                  <span className="text-capitalize">{username}</span>!
                </p>
              </div>

              <button
                onClick={() => handleLogOut()}
                className="btn btn-outline-danger fw-semibold"
                type="button"
              >
                Log Out
              </button>
            </div>
          </nav>

          <div className="cards d-flex justify-content-center align-items-start flex-wrap gap-3 my-4 mx-4">
            <Products />
            <ContactCard />
            <UsersCard id={id} handleAdminEdit={handleAdminEdit} />
            <HomepageCateg />
          </div>
        </>
      ) : (
        state === false && (
          <p className="fs-1 mt-5 text-danger opacity-75 fw-semibold text-center">
            You are logged out!
          </p>
        )
      )}
    </>
  );
}
