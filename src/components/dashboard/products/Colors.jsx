import React, { useRef, useState } from "react";
import "../../../components-css/dashboard/products/colors.css";

export default function Colors({
  colorsState,
  colorsList,
  setColorsList,
  noColorsList,
}) {
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const editForm = useRef(null);

  function handleEdit(id) {
    const prevData = colorsList;
    const newData = prevData.map((data) =>
      data.edit === true && data.color_id !== id
        ? { ...data, edit: false }
        : data.color_id === id
        ? { ...data, edit: !data.edit }
        : data
    );

    setColorsList(newData);

    const data = newData.filter((data) => data.edit === true);
    if (data.length > 0) {
      setEdit(...data);
    } else if (data.length === 0 && edit !== false) {
      setEdit(false);
    }
  }

  async function handleAddColor() {
    const form = editForm.current;

    if (form.checkValidity()) {
      const formData = new FormData(form);

      let name = formData.get("name");
      let color = formData.get("color");

      if (name === "") {
        return;
      }

      const data = {
        name: name,
        color: color,
      };

      handleAdd();

      fetch(
        "http://192.168.1.17:8000/src/dashboard-php/products/color/addColor.php",
        {
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(data),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data !== false) {
            setColorsList((prevData) => [
              ...prevData,
              {
                color_id: data,
                Name: name,
                "Color code": color,
                edit: false,
                delete: true,
              },
            ]);
          }
        });
    }
  }

  function handleAdd() {
    setAdd(!add);
  }

  async function handleEditColor(id) {
    const form = editForm.current;

    if (form.checkValidity()) {
      const formData = new FormData(form);

      let name = formData.get("name");
      let color = formData.get("color");

      handleEdit(id);

      const data = {
        id: id,
        name: name,
        color: color,
      };

      fetch(
        "http://192.168.1.17:8000/src/dashboard-php/products/color/editColor.php",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setColorsList((prevData) =>
              prevData.map((data) =>
                data.color_id === id && name !== ""
                  ? { ...data, Name: name, "Color code": color }
                  : data.color_id === id && name === ""
                  ? { ...data, "Color code": color }
                  : data
              )
            );
          }
        });
    }
  }

  async function handleDelete(id) {
    const response = await fetch(
      "http://192.168.1.17:8000/src/dashboard-php/products/color/deleteColor.php",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      }
    );

    const data = await response.json();
    if (data === true) {
      handleEdit(id);

      setColorsList((prevData) =>
        prevData.filter((data) => data.color_id !== id)
      );
    }
  }

  return (
    <>
      {colorsState === false || noColorsList === true ? (
        <div className="card-body contact-card-content">
          {add ? (
            <>
              <p className="text-secondary fw-medium text-center mb-3">
                Add here a new color!
              </p>
              <button
                onClick={() => handleAdd()}
                className="btn btn-danger badge rounded-pill fs-6 cursor-pointer fw-medium position-relative border-0 mb-2"
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

              <form
                ref={editForm}
                onSubmit={(event) => event.preventDefault()}
                className="d-flex w-75 align-items-center input-group"
                data-bs-theme="dark"
              >
                <input
                  className="form-control"
                  required
                  name="name"
                  placeholder="Name"
                />
                <input
                  type="color"
                  className="form-control form-control-color"
                  defaultValue="#ffffff"
                  name="color"
                  title="Choose color"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleAddColor(edit.color_id)}
                  className="btn btn-success fw-medium"
                >
                  Ok
                </button>
              </form>
            </>
          ) : (
            <>
              <h6
                className={`card-title fs-5 ${
                  !noColorsList && !colorsState
                    ? "text-danger opacity-75"
                    : "text-secondary"
                } mb-0 text-center`}
              >
                {!noColorsList && !colorsState
                  ? "An error has occur!"
                  : "There are no colors at the moment!"}
              </h6>

              {noColorsList && (
                <>
                  <p className="text-secondary fw-medium">Add one now!</p>

                  <button
                    onClick={() => handleAdd()}
                    className="btn btn-secondary badge rounded-pill fs-6 cursor-pointer fw-medium position-relative border-0 p-1"
                  >
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
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ) : colorsState ? (
        <>
          <div className="card-body d-flex align-items-center flex-column">
            {edit && !add ? (
              <>
                <p className="text-secondary fw-medium text-center mb-3">
                  Click the color name to cancel editing!
                </p>
                <button
                  onClick={() => handleEdit(edit.color_id)}
                  className="badge rounded-pill text-bg-secondary fs-6 cursor-pointer fw-medium position-relative border-0"
                >
                  {edit.Name}
                </button>

                <div className="d-flex align-items-center mt-3 gap-3">
                  <form
                    ref={editForm}
                    onSubmit={(event) => event.preventDefault()}
                    className="d-flex align-items-center input-group"
                    data-bs-theme="dark"
                  >
                    <input
                      className="form-control"
                      name="name"
                      placeholder="New Name"
                    />
                    <input
                      type="color"
                      className="form-control form-control-color"
                      defaultValue={edit["Color code"]}
                      name="color"
                      title="Choose color"
                    />
                    <button
                      type="button"
                      onClick={() => handleEditColor(edit.color_id)}
                      className="btn btn-success fw-medium"
                    >
                      Ok
                    </button>
                  </form>
                  <p className="mb-0 fw-medium text-white">or</p>
                  <button
                    onClick={() => handleDelete(edit.color_id)}
                    className="btn btn-danger fw-medium"
                    disabled={!edit.delete ? true : false}
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : !edit && add ? (
              <>
                <p className="text-secondary fw-medium text-center mb-3">
                  Add here a new color!
                </p>
                <button
                  onClick={() => handleAdd()}
                  className="btn btn-danger badge rounded-pill fs-6 cursor-pointer fw-medium position-relative border-0 mb-2"
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

                <form
                  ref={editForm}
                  onSubmit={(event) => event.preventDefault()}
                  className="d-flex w-75 align-items-center input-group"
                  data-bs-theme="dark"
                >
                  <input
                    className="form-control"
                    required
                    name="name"
                    placeholder="Name"
                  />
                  <input
                    type="color"
                    className="form-control form-control-color"
                    defaultValue="#ffffff"
                    name="color"
                    title="Choose color"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleAddColor(edit.color_id)}
                    className="btn btn-success fw-medium"
                  >
                    Ok
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-secondary fw-medium text-center mb-4">
                  The colors that are in use can't be{" "}
                  <span className="text-danger">deleted</span>!
                </p>
                <div className="d-flex column-gap-3 row-gap-3 flex-wrap justify-content-center">
                  <button
                    onClick={() => handleAdd()}
                    className="btn btn-secondary badge rounded-pill fs-6 cursor-pointer fw-medium position-relative border-0 p-1"
                  >
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
                  </button>
                  {colorsList.map((color) => (
                    <button
                      key={color.color_id}
                      onClick={() => handleEdit(color.color_id)}
                      className="badge rounded-pill text-bg-secondary fs-6 cursor-pointer fw-medium position-relative border-0"
                    >
                      {color.Name}
                      <span
                        className={`transition-all position-absolute ${
                          color.delete ? "top-30" : "top-0"
                        } start-100 translate-middle badge rounded-pill bg-primary p-1`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
                          className="bi bi-pencil-fill d-flex justify-content-center align-items-center"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                        </svg>
                      </span>

                      {color.delete && (
                        <span className="transition-all position-absolute top-0 start-80 translate-middle badge rounded-pill bg-danger p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            className="bi bi-trash-fill d-flex justify-content-center align-items-center"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="card-body d-flex flex-column align-items-center row-gap-2">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary fw-medium fs-5 mb-0">Loading...</p>
        </div>
      )}
    </>
  );
}
