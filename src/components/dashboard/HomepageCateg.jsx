import React, { useState, useEffect } from "react";
import "../../components-css/dashboard/homepageCateg.css";

export async function getCategories(setState, setNoCategories, setCategories) {
  try {
    const response = await fetch(
      "http://192.168.1.17:8000/src/dashboard-php/getCategories.php",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data !== "empty") {
      setState(true);
      setCategories(data);
    } else {
      setState(false);
      setNoCategories(true);
    }
  } catch {
    setState(false);
    setNoCategories(false);
  }
}

export default function HomepageCateg() {
  const [state, setState] = useState();
  const [noCategories, setNoCategories] = useState();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories(setState, setNoCategories, setCategories);
  }, []);

  function handleAdd(id) {
    const prevData = categories;
    const newdata = prevData.map((category) =>
      category.id === id
        ? { ...category, displayed: !category.displayed }
        : category
    );
    setCategories(newdata);

    const editCateg = prevData.filter((categ) => categ.id === id);
    const data = {
      id: editCateg[0].id,
      add: editCateg[0].displayed ? "yes" : "no",
    };

    fetch("http://192.168.1.17:8000/src/dashboard-php/addHomeCateg.php", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  return (
    <div className="card home-categ-card flex-grow-1 bg-dark-lighter">
      <h4 className="card-header text-white fs-4 fw-bolder">
        Homepage Categories
      </h4>
      {/* <div className='card-body home-categ-card-content'>
        <h6 className='card-title fs-4 text-white text-capitalize text-break'>Hello</h6>
      </div> */}
      {state === false || categories.length === 0 ? (
        <div className="card-body contact-card-content">
          <h6
            className={`card-title fs-5 ${
              !noCategories ? "text-danger opacity-75" : "text-secondary"
            } mb-0 text-center`}
          >
            {!noCategories
              ? "An error has occur!"
              : "There are no categories at the moment!"}
          </h6>

          { noCategories && <p className="text-secondary fw-medium mb-0">Add one now!</p> }
        </div>
      ) : (
        <div className="card-body d-flex align-items-center flex-column">
          <p className="text-secondary fw-medium text-center mb-4">
            <span className="text-success fw-bold">Add</span> or{" "}
            <span className="text-danger fw-bold">Remove</span> categories on
            the website's homepage!
          </p>
          <div className="d-flex column-gap-2 row-gap-3 flex-wrap justify-content-center">
            {categories.map((categ) => (
              <button
                key={categ.id}
                onClick={() => handleAdd(categ.id)}
                className="badge rounded-pill text-bg-secondary fs-6 cursor-pointer fw-medium position-relative border-0"
              >
                {categ.name}
                <span
                  className={`transition-all position-absolute top-0 start-100 translate-middle badge rounded-pill ${
                    categ.displayed ? "bg-danger" : "bg-success"
                  } p-0`}
                >
                  {categ.displayed ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      fill="currentColor"
                      className="bi bi-dash d-flex justify-content-center align-items-center"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      fill="currentColor"
                      className="bi bi-plus d-flex justify-content-center align-items-center"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
