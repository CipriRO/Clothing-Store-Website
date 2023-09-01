import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MessageComponent from "../MessageComponent";
import "../../components-css/mainPage/RenderProducts.css";

export default function ProductsRendering() {
  const [productsData, setProductsData] = useState([]);
  const [loaded, setLoaded] = useState([false]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function getProductsInfo() {
      const response = await fetch(
        "http://192.168.1.17:8000/src/products%20php/renderProducts.php",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setProductsData(data);
      setLoaded(true);
    }

    getProductsInfo();
  }, []);

  function handleAddItemToCart(event) {
    if (event.target.nodeName === "BUTTON") {
      event.preventDefault();
      const productId = event.target.getAttribute("data-product-id");
      addItemToCart(productId).then((result) => {
        if (result) {
          const message = {
            id: Date.now(),
            title: "Cart",
            message: "The product has been added to cart!",
            type: "success",
          };
          setMessages([...messages, message]);
        } else {
          const message = {
            id: Date.now(),
            title: "Cart",
            message: "This product is already in the cart!",
            type: "fail",
          };
          setMessages([...messages, message]);
        }
      });
    } else if (event.target.nodeName === "IMG") {
      event.preventDefault();
      const productId =
        event.target.parentElement.getAttribute("data-product-id");
      addItemToCart(productId).then((result) => {
        if (result) {
          const message = {
            id: Date.now(),
            title: "Cart",
            message: "The product has been added to cart!",
            type: "success",
          };
          setMessages([...messages, message]);
        } else {
          const message = {
            id: Date.now(),
            title: "Cart",
            message: "This product is already in the cart!",
            type: "fail",
          };
          setMessages([...messages, message]);
        }
      });
    }
  }

  function handleMessageHidden(id) {
    setMessages(messages.filter((m) => m.id !== id));
  }

  function handleRedirectProduct(e) {
    if (e.target.closest(".product-cart-button")) {
      return;
    }

    const link = e.currentTarget.getAttribute("data-link");
    window.location.href = link;
  }

  return (
    <>
      {productsData.length > 0 && loaded == true ? (
        productsData.filter((category) => category[0]).map((category, index) => (
              <div className="category" key={index}>
                {category[0].category === "Most Bought" ? (
                  <div className="category-titles">
                    <p className="new-products-text">{category[0].category}</p>
                    <p className="small-desc">
                      Listed by purchase frequency, first products sold the
                      most.
                    </p>
                  </div>
                ) : (
                  <p className="new-products-text">{category[0].category}</p>
                )}
                <div className="video-grid">
                  {category.map((product) => (
                    <div
                      key={product.product_id}
                      onClick={handleRedirectProduct}
                      className="product-preview"
                      data-link={`../../src/products/products.html?id=${product.product_id}`}
                    >
                      <div className="photo">
                        <div className="def-info">
                          <p>{product.sizeName}</p>
                          <div></div>
                          <p>{product.colorName}</p>
                        </div>
                        <img
                          className="image"
                          src={`/products photo/${product.image}`}
                        />
                      </div>
                      <div className="product-info">
                        <div className="product-title">
                          <p className="title">{product.name}</p>
                        </div>
                        <div className="product-cart-area">
                          <div className="price">
                            <p className="price-text">{product.price + " $"}</p>
                          </div>
                          <button
                            onClick={handleAddItemToCart}
                            className="product-cart-button"
                            data-product-id={`${product.product_id}`}
                          >
                            <img src="icons/add-to-cart-icon.png" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hide-show-buttons"></div>
              </div>
        ))
      ) : productsData.length == 0 && loaded == true ? (
        <p className="noProductsMessage">{"No products yet ;("}</p>
      ) : null}
      {createPortal(
        messages.map((message) => (
          <MessageComponent
            key={message.id}
            title={message.title}
            message={message.message}
            type={message.type}
            onMessageHidden={() => handleMessageHidden(message.id)}
          />
        )),
        document.getElementById("notification-center")
      )}
    </>
  );
}
