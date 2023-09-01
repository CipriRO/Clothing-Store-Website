import React, { useEffect, useState } from "react";
import "../../components-css/dashboard/contact.css";

export default function ContactCard() {
  const [state, setState] = useState();
  const [formsData, setFormsData] = useState([]);
  const [noData, setNoData] = useState();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    async function getForms() {
      try {
        const response = await fetch(
          "http://192.168.1.17:8000/src/dashboard-php/getForms.php",
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
          const forms = data.map((form) => ({
            ...form,
            opened: false,
          }));
          setFormsData(forms);
        } else {
          setState(false);
          setNoData(true);
        }
      } catch {
        setState(false);
        setNoData(false);
      }
    }

    getForms();
  }, []);

  function handleOpen(id) {
    setFormsData((prevData) =>
      prevData.map((form) =>
        form.id === id
          ? { ...form, opened: !form.opened }
          : form.opened === true
          ? { ...form, opened: false }
          : form
      )
    );
  }

  function getDateDifference(date) {
    const currentDate = new Date();

    const pastDate = new Date(date);

    const timeDifference = currentDate - pastDate;

    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (daysDifference < 0 || hoursDifference < 0 || minutesDifference < 0) {
      return "--";
    } else if (
      minutesDifference > 59 &&
      hoursDifference <= 23 &&
      daysDifference === 0
    ) {
      return hoursDifference + "h ago";
    } else if (
      minutesDifference > 59 &&
      hoursDifference > 23 &&
      daysDifference !== 0
    ) {
      return daysDifference + "d ago";
    } else if (
      daysDifference === 0 &&
      hoursDifference === 0 &&
      minutesDifference === 0
    ) {
      return "Now";
    } else if (minutesDifference <= 59 && daysDifference === 0) {
      return minutesDifference + "m ago";
    } else {
      return daysDifference + "d ago";
    }
  }

  async function handleDelete(dataId) {
    const response = await fetch(
      "http://192.168.1.17:8000/src/dashboard-php/deleteForm.php",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataId),
      }
    );

    const data = await response.json();
    if (data === true) {
      const formData = formsData.filter((data) => data.id !== dataId);
      formData.length === 0 && setEdit(false);
      setFormsData(formData);
    }
  }

  return (
    <>
      <div className="card contact-card flex-grow-1 bg-dark-lighter">
        <div className="card-header d-flex justify-content-between">
          <h4 className="text-white fs-4 mb-0 fw-bolder">Contact Forms</h4>
          {formsData.length !== 0 && (
            <button
            onClick={() => setEdit(!edit)}
            className={`btn btn-sm ${edit ? "btn-success" : "btn-primary"}`}
          >
            {edit ? (
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
            ) : (
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
            )}
          </button>
          )}
          
        </div>

        {state === false || formsData.length === 0 ? (
          <div className="card-body contact-card-content">
            <h6
              className={`card-title fs-5 ${
                !noData && formsData.length !== 0 ? "text-danger opacity-75" : "text-secondary"
              } mb-0 text-center`}
            >
              {!noData && formsData.length !== 0 ? "An error has occur!" : "There are no forms at the moment!"}
            </h6>
            { noData && <p className="text-secondary fw-medium mb-0">Please check back later.</p> }
          </div>
        ) : (
          <>
            <ul className="list-group list-group-flush">
              {formsData.map((data) => (
                <li
                  key={data.id}
                  className="list-group-item bg-dark-lighter text-white border-secondary d-flex flex-column align-items-start justify-content-around flex-wrap column-gap-3 row-gap-3"
                >
                  <div className="d-flex flex-wrap justify-content-between w-100 align-items-center column-gap-1">
                    <div className="d-flex flex-column flex-wrap">
                      <p className="mb-0 fs-5 fw-semibold">
                        {data.first_name + " " + data.last_name}
                      </p>
                      <p className="fs-6 mb-0 text-secondary fw-medium text-break">
                        {data.email}
                      </p>
                    </div>
                    {edit === false ? (
                      <p className="mb-0 fw-medium text-secondary">
                        {getDateDifference(data.date)}
                      </p>
                    ) : (
                      <button onClick={() => handleDelete(data.id)} className="btn btn-sm btn-danger">
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
                  <p
                    onClick={() => handleOpen(data.id)}
                    className={`${data.opened !== true && "text-nowrap"} ${
                      data.opened !== true && "form-content"
                    } mb-0 fs-6 form-content`}
                  >
                    {data.message_content}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
