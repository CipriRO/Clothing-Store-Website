import React, { useState, useEffect } from "react";
import Categories from "./products/categories";
import Sizes from "./products/Sizes";
import Colors from "./products/Colors";
import ProductRow from "./products/ProductRow";
import "../../components-css/dashboard/products.css";

export default function Products() {
  const [categoriesState, setCategoriesState] = useState();
  const [categories, setCategories] = useState([]);
  const [noCategories, setNoCategories] = useState(false);

  const [state, setState] = useState(true);
  const [add, setAdd] = useState(false);
  const [expand, setExpand] = useState(false);
  const [noProducts, setNoProducts] = useState(false);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Fluffy Hoodie",
      img: "hoodie.jpg",
      categories: "Men, Children, Hoodie",
      size: 'S',
      color: 'Dark Blue',
      qnt: 43,
      state: "active",
      delete: false,
      items: [
        {
          id: 1,
          color: "Dark Blue",
          size: "S",
          price: "12.1",
          img: "hoodie 2.jpg",
          state: "active",
          deletable: false,
          qnt: 8,
        },
        {
          id: 2,
          color: "Dark Blue",
          size: "M",
          price: "12.15",
          img: "hoodie 2M.jpg",
          deletable: true,
          state: "active",
          qnt: 12,
        },
      ],
    },
    {
      id: 2,
      name: "Nike Hoodie",
      img: "hoodie 2M.jpg",
      categories: "Men, Hoodie",
      size: 'S',
      color: 'Gray',
      qnt: 21,
      state: "pactive",
      delete: false,
      items: [
        {
          id: 3,
          color: "Gray",
          size: "S",
          price: "12.1",
          img: "hoodie.jpg",
          deletable: false,
          state: "active",
          qnt: 8,
        },
        {
          id: 4,
          color: "Dark Blue",
          size: "M",
          price: "12.15",
          img: "hoodie 2M.jpg",
          deletable: true,
          state: "active",
          qnt: 12,
        },
        {
          id: 5,
          color: "Gray",
          size: "M",
          price: "12",
          img: "hoodieM.jpg",
          deletable: true,
          state: "active",
          qnt: 32,
        },
      ],
    },
    {
      id: 3,
      name: "Addidas Hoodie",
      img: "hoodie 3.jpg",
      categories: "Men, Women, Hoodie",
      size: 'S',
      color: 'Light Gray',
      qnt: 0,
      state: "inactive",
      delete: false,
      items: [
        {
          id: 6,
          color: "Light Gray",
          size: "S",
          deletable: false,
          price: "11.6",
          img: "hoodie 3.jpg",
          state: "active",
          qnt: 2,
        },
      ],
    },
  ]);

  const [colorsState, setColorsState] = useState();
  const [colors, setColors] = useState([]);
  const [noColors, setNoColors] = useState(false);

  const [sizesState, setSizesState] = useState();
  const [sizes, setSizes] = useState([]);
  const [noSizes, setNoSizes] = useState(false);

  const [navPage, setNavPage] = useState(1);

  useEffect(() => {
    async function getSizes() {
      try {
        const response = await fetch(
          "http://192.168.1.17:8000/src/dashboard-php/products/size/getSizes.php",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data !== "empty") {
          setSizesState(true);
          setSizes(data);
        } else {
          setSizesState(false);
          setNoSizes(true);
        }
      } catch {
        setSizesState(false);
        setNoSizes(false);
      }
    }

    if (navPage === 2) {
      sizes.length == 0 && getSizes();
    }

    async function getColors() {
      try {
        const response = await fetch(
          "http://192.168.1.17:8000/src/dashboard-php/products/color/getColors.php",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data !== "empty") {
          setColorsState(true);
          setColors(data);
        } else {
          setColorsState(false);
          setNoColors(true);
        }
      } catch {
        setColorsState(false);
        setNoColors(false);
      }
    }

    if (navPage === 3) {
      colors.length == 0 && getColors();
    }

    async function getCategories() {
      try {
        const response = await fetch(
          "http://192.168.1.17:8000/src/dashboard-php/products/category/getCategories.php",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data !== "empty") {
          setCategoriesState(true);
          setCategories(data);
        } else {
          setCategoriesState(false);
          setNoCategories(true);
        }
      } catch {
        setCategoriesState(false);
        setNoCategories(false);
      }
    }

    if (navPage === 4) {
      categories.length == 0 && getCategories();
    }
  }, [navPage]);

  useEffect(() => {
    categories.length === 0 && noCategories == false
      ? setNoCategories(true)
      : categories.length !== 0 &&
        noCategories == true &&
        setNoCategories(false);
  }, [categories]);

  useEffect(() => {
    sizes.length === 0 && noSizes == false
      ? setNoSizes(true)
      : sizes.length !== 0 && noSizes == true && setNoSizes(false);
  }, [sizes]);

  useEffect(() => {
    colors.length === 0 && noColors == false
      ? setNoColors(true)
      : colors.length !== 0 && noColors == true && setNoColors(false);
  }, [colors]);

  useEffect(() => {
    products.length === 0 && noProducts == false
      ? setNoProducts(true)
      : products.length !== 0 && noProducts == true && setNoProducts(false);
  }, [products]);

  async function handleDeleteProduct(id) {
    setProducts((prevData) =>
      prevData.map((product) =>
        product.id === id && product.delete === false
          ? { ...product, delete: true }
          : product
      )
    );

    const productToDelete = products.find(
      (product) => product.id === id && product.delete === true
    );

    if (productToDelete) {
      // const response = await fetch(
      //   "http://192.168.1.17:8000/src/dashboard-php/products/products/deleteProduct.php",
      //   {
      //     method: "post",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(id),
      //   }
      // );

      // const data = await response.json();
      // if (data === true) {
      setProducts((prevData) =>
        prevData.filter((product) => product.id !== id)
      );
      // }
    }
  }

  function handleCancelDeleteProduct(id) {
    setProducts((prevData) =>
      prevData.map((product) =>
        product.id === id ? { ...product, delete: false } : product
      )
    );
  }

  return (
    <>
      <div className="card products-card flex-grow-1 bg-dark-lighter">
        <div className="card-header nav-bg d-flex column-gap-3">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                onClick={() => setNavPage(1)}
                className={`nav-link text-white fw-medium ${
                  navPage === 1 && "active"
                }`}
              >
                Products
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => setNavPage(2)}
                className={`nav-link text-white fw-medium ${
                  navPage === 2 && "active"
                }`}
              >
                Sizes
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => setNavPage(3)}
                className={`nav-link text-white fw-medium ${
                  navPage === 3 && "active"
                }`}
              >
                Colors
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => setNavPage(4)}
                className={`nav-link text-white fw-medium ${
                  navPage === 4 && "active"
                }`}
              >
                Categories
              </button>
            </li>
          </ul>
        </div>
        {navPage === 1 ? (
          <>
            {state === false || noProducts === true ? (
              <div className="card-body contact-card-content">
                {add ? (
                  <>
                    <p className="text-secondary fw-medium text-center mb-3">
                      Add here a new product!
                    </p>
                    <button
                      onClick={() => handleAdd()}
                      className="btn btn-danger badge rounded-pill fs-6 cursor-pointer fw-medium position-relative border-0"
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
                        !noProducts && !colorsState
                          ? "text-danger opacity-75"
                          : "text-secondary"
                      } mb-0 text-center`}
                    >
                      {!noProducts && !colorsState
                        ? "An error has occur!"
                        : "There are no products at the moment!"}
                    </h6>

                    {noProducts && (
                      <>
                        <p className="text-secondary fw-medium">Add one now!</p>

                        <button
                          onClick={() => handleAdd()}
                          className="btn btn-secondary fw-medium btn-sm py-0 w-50 mt-2 d-flex align-items-center justify-content-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            fill="currentColor"
                            className="bi bi-plus d-flex justify-content-center align-items-center"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                          </svg>
                          Add a new product!
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            ) : state ? (
              <div className="card-body p-0 d-flex flex-column align-items-center">
                <button
                  onClick={() => handleAdd()}
                  className="btn btn-secondary fw-medium btn-sm py-0 w-50 mt-2 d-flex align-items-center justify-content-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-plus d-flex justify-content-center align-items-center"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                  Add a new product!
                </button>
                <ul className="list-group list-group-flush w-100 align-items-center">
                  {!expand ? (
                    products.map((product) => (
                      <ProductRow
                        key={product.id}
                        id={product.id}
                        img={product.img}
                        name={product.name}
                        categories={product.categories}
                        state={product.state}
                        qnt={product.qnt}
                        expandProduct={false}
                        deletable={false}
                        remove={product.delete}
                        product={true}
                        expand={expand}
                        setExpand={setExpand}
                        handleDeleteProduct={handleDeleteProduct}
                        handleEditProduct={handleDeleteProduct /* modify */}
                        handleCancelDeleteProduct={handleCancelDeleteProduct}
                      />
                    ))
                  ) : (
                    <React.Fragment>
                      {/* expand expand expand expand */}
                      {products.map(
                        (product) =>
                          product.id === expand && (
                            <React.Fragment key={product.id}>
                              <ProductRow
                                id={product.id}
                                img={product.img}
                                name={product.name}
                                categories={product.categories}
                                state={product.state}
                                sizeColor={product.size + ", " + product.color}
                                qnt={product.qnt}
                                remove={product.delete}
                                deletable={false}
                                product={true}
                                expandProduct={true}
                                expand={expand}
                                setExpand={setExpand}
                                handleDeleteProduct={handleDeleteProduct}
                                handleEditProduct={
                                  handleDeleteProduct /* modify */
                                }
                                handleCancelDeleteProduct={
                                  handleCancelDeleteProduct
                                }
                              />

                              <div
                                className="shadow d-flex flex-column w-90 row-gap-2 bg-light-subtle py-2 px-3 my-2 rounded-4"
                                data-bs-theme="dark"
                              >
                                {product.items.map((item) => (
                                  <ProductRow
                                    key={item.id}
                                    id={item.id}
                                    img={item.img}
                                    name={item.size + ", " + item.color}
                                    categories={"$" + item.price}
                                    state={item.state}
                                    qnt={item.qnt}
                                    deletable={item.deletable}
                                    remove={item.delete}
                                    expandProduct={false}
                                    product={false}
                                    handleDeleteProduct={handleDeleteProduct}
                                    handleEditProduct={
                                      handleDeleteProduct /* modify */
                                    }
                                    handleCancelDeleteProduct={
                                      handleCancelDeleteProduct
                                    }
                                  />
                                ))}
                              </div>
                            </React.Fragment>
                          )
                      )}
                    </React.Fragment>
                  )}
                </ul>
              </div>
            ) : (
              <div className="card-body d-flex flex-column align-items-center row-gap-2">
                <div className="spinner-border text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-secondary fw-medium fs-5 mb-0">Loading...</p>
              </div>
            )}
          </>
        ) : navPage === 2 ? (
          <Sizes
            sizesState={sizesState}
            sizesList={sizes}
            setSizesList={setSizes}
            noSizesList={noSizes}
          />
        ) : navPage === 3 ? (
          <Colors
            colorsState={colorsState}
            colorsList={colors}
            setColorsList={setColors}
            noColorsList={noColors}
          />
        ) : (
          navPage === 4 && (
            <Categories
              categoriesState={categoriesState}
              categoriesList={categories}
              setCategoriesList={setCategories}
              noCategoriesList={noCategories}
            />
          )
        )}
      </div>
    </>
  );
}
