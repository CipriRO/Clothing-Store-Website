import React from "react";

export default function ProductRow({
  id,
  img,
  name,
  categories,
  state,
  qnt,
  remove,
  product,
  sizeColor,
  expand,
  expandProduct,
  setExpand,
  deletable,
  handleDeleteProduct,
  handleEditProduct,
  handleCancelDeleteProduct,
}) {
  return (
    <div className={`${product ? 'list-group-item bg-dark-lighter' : 'bg-light-subtle'}  text-white border-secondary d-flex justify-content-around align-items-center flex-wrap row-gap-2 column-gap-3`}>
      {!expandProduct && <img className={product ? "product-image" : 'product-image-sm'} src={`../../../products photo/${img}`} /> }
      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
        <p className="fw-semibold mb-0 fs-6">{name}</p>
        {expandProduct && <p className={`mb-0 fw-medium text-center text-secondary ${ !expandProduct && 'categories-text'} text-nowrap`}>
          {sizeColor}
        </p> } 
        <p className={`mb-0 fw-medium text-center text-secondary ${ !expandProduct && 'categories-text'} text-nowrap`}>
          {categories}
        </p>
      </div>

      <div
        className="d-flex flex-column align-items-center"
        data-bs-theme="dark"
      >
        <span
          className={`fw-semibold badge rounded-pill ${
            state === "active"
              ? "bg-success-subtle text-success-emphasis border-success-subtle"
              : state === "pactive"
              ? "bg-warning-subtle text-warning-emphasis border-warning-subtle"
              : "bg-danger-subtle text-danger-emphasis border-danger-subtle"
          } border border-2`}
        >
          {state === "active"
            ? "Active"
            : state === "pactive"
            ? "Partial Active"
            : "Inactive"}
        </span>
        <p className="fs-6 fw-semibold mb-0 text-secondary">{qnt} left</p>
      </div>

      <div className="d-flex flex-wrap gap-2 flex-basis-20 mw-50">
        {!remove ? (
          <>
            {product && (
              <button
              type="button"
              onClick={() => setExpand(!expand ? id : false)}
              className="btn btn-sm btn-secondary d-flex justify-content-center align-items-center flex-basis-34"
            >
              {!expand ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrows-angle-expand d-flex justify-content-center align-items-center"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrows-angle-contract d-flex justify-content-center align-items-center"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M.172 15.828a.5.5 0 0 0 .707 0l4.096-4.096V14.5a.5.5 0 1 0 1 0v-3.975a.5.5 0 0 0-.5-.5H1.5a.5.5 0 0 0 0 1h2.768L.172 15.121a.5.5 0 0 0 0 .707zM15.828.172a.5.5 0 0 0-.707 0l-4.096 4.096V1.5a.5.5 0 1 0-1 0v3.975a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 0-1h-2.768L15.828.879a.5.5 0 0 0 0-.707z"
                  />
                </svg>
              )}
            </button>
            )}


            {!product && deletable ? (
              <button
              onClick={() => handleDeleteItem(id)}
              type="button"
              className="btn btn-sm btn-danger d-flex justify-content-center align-items-center flex-basis-34"
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
            ) : product && (
              <button
              onClick={() => handleDeleteProduct(id)}
              type="button"
              className="btn btn-sm btn-danger d-flex justify-content-center align-items-center flex-basis-34"
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
            
            <button
              type="button"
              onClick={() => handleEditProduct(id)}
              className="btn btn-sm btn-primary d-flex justify-content-center align-items-center flex-basis-34"
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
          </>
        ) : (
          <>
            <button
              onClick={() => handleDeleteProduct(id)}
              type="button"
              className="btn btn-sm btn-danger fw-medium d-flex justify-content-center align-items-center flex-basis-34"
            >
              Confirm
            </button>

            <button
              type="button"
              onClick={() => handleCancelDeleteProduct(id)}
              className="btn btn-sm btn-secondary fw-medium d-flex justify-content-center align-items-center flex-basis-34"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-x-lg d-flex justify-content-center align-items-center"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
