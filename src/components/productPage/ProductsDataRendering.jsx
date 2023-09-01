import React, { useState, useEffect, useRef } from "react";
import ShowCategories from "./ShowCategories";
import ProductsDescription from "./productsDescription";
import "../../components-css/productPage/ShowCategories.css";
import {
  addItemToCart,
  colors,
  sizes,
  prevImage,
  nextImage,
} from "../../js/javascript product pages.js";

export default function productsDataRendering() {
  const [productsData, setProductsData] = useState([]);
  const colorSelect = useRef(null);
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id"); 

  useEffect(() => {
    async function getProductsInfo() {
      const response = await fetch(
        "http://192.168.1.17:8000/src/products%20php/products.php",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(id),
        }
      );
      const data = await response.json();
      setProductsData(data);
    }

    getProductsInfo();
  }, []);

  useEffect(() => {
    if (productsData["products"] && productsData["products"][0] !== "") {
      document.title = `${productsData["products"][0].name} | Buisiness Name`;
      colors(
        colorSelect.current.getAttribute("data-default-color"),
        document.getElementsByClassName("color-list"),
        document.getElementsByName("color")
      );
      sizes(
        document
          .getElementsByClassName("dimension-select")[0]
          .getAttribute("data-default-size"),
        document.getElementsByClassName("size"),
        document.getElementsByName("size")
      );
    }
  }, [productsData]);

  return (
    <>
      {productsData["products"] !== undefined &&
        productsData["products"][0] !== "" && (
          <>
            <div className="product-preview">
              <div className="preview">
                {productsData["productsInfoId"].map((productInfo, index) => (
                  <img
                    key={index}
                    data-info-id={`${productInfo}`}
                    src={`../../public/products photo/${productsData["images"][index]}`}
                  />
                ))}
                {productsData["images"].length > 1 && (
                  <>
                    <button onClick={() => prevImage()} className="prev">
                      &#10094;
                    </button>
                    <button onClick={() => nextImage()} className="next">
                      &#10095;
                    </button>
                  </>
                )}
              </div>
              <div className="product-info">
                <div className="product-title">
                  <p className="title">{productsData["products"][0].name}</p>
                </div>
                <div className="product-selection">
                  <ShowCategories
                    categoryNames={productsData["products"][0].categoryName}
                  />
                  <div className="row">
                    <div
                      className="dimension-select"
                      data-default-size={productsData["defSize"]}
                    >
                      <p>Select the size:</p>
                      <ul>
                        {productsData["sizes"].map((size, index) => (
                          <li key={index} className="size">
                            <input
                              key={index}
                              type="checkbox"
                              name="size"
                              value={size}
                            />
                            {size}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className="color-select"
                      ref={colorSelect}
                      data-default-color={productsData["defColor"]}
                    >
                      <p>Select the color:</p>
                      <ul>
                        {productsData["colors"].map((color, index) => (
                          <li
                            key={index}
                            className="color-list"
                            data-color-id={productsData["colorsCode"][index]}
                          >
                            <input
                              key={index}
                              type="checkbox"
                              name="color"
                              value={color}
                            />
                            {color}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="add-to-cart-product-info">
                  <p className="price">-- $</p>
                  <button
                    onClick={() => addItemToCart(id)}
                    id="add-to-cart-button"
                    className="add-to-cart-button"
                  >
                    <img src="../../public/icons/add-to-cart-icon.png" />
                  </button>
                </div>
              </div>
            </div>
            <ProductsDescription
              description={productsData["products"][0].description}
            />
          </>
        )}
    </>
  );
}
