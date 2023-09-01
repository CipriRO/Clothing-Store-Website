import React, { useState, useEffect, useRef } from "react";
import "../components-css/Search.css";

export default function Search({ imagesPath }) {
  const inputRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 560);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  });

  function handleButtonClick() {
    setIsSearchBarVisible(!isSearchBarVisible);
    setSearchInput("");
    inputRef.current.value = "";
    isSearchBarVisible && inputRef.current.focus();
  }

  useEffect(() => {
    async function getProductsByTerm() {
      try {
        const response = await fetch(
          "http://192.168.1.17:8000/src/products%20php/searchFunction.php",
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchInput),
          }
        );
        const data = await response.json();
        setProducts(data);
        setLoaded(true);
      } catch (error) {
        setError(true);
      }
    }
    if (searchInput != "") {
      getProductsByTerm();
    }
  }, [searchInput]);

  function inputHandler(e) {
    const input = e.target;
    if (input.value == "") {
      setProducts([]);
    }
    setSearchInput(input.value);
  }

  function handleRedirectProduct(e) {
    const link = e.currentTarget.getAttribute("data-link");
    window.location.href = link;
  }

  return (
    <>
      <div onClick={handleButtonClick} className={`overlay ${isSearchBarVisible && "overlay-active"}`}></div>
      {isSmallScreen && (
        <button onClick={handleButtonClick} className="search-button"><img src="../../../icons/search-icon.png" /></button>
      )}
      <input
        ref={inputRef}
        style={{
          position: isSmallScreen ? 'absolute' : 'relative',
          display: isSmallScreen && !isSearchBarVisible ? "none" : "block",
          zIndex: isSmallScreen && isSearchBarVisible ? 122 : 1,
          left: isSmallScreen && isSearchBarVisible && '50%',
          transform: isSmallScreen && isSearchBarVisible && 'translateX(-50%)',
          border: isSmallScreen && !isSearchBarVisible ? "none" : "solid rgb(112, 112, 112) 1.5px",
        }}
        onInput={inputHandler}
        placeholder="Search..."
        className="search"
      ></input>
      {searchInput != "" && products.length > 0 ? (
        <div style={{
          left: isSmallScreen && isSearchBarVisible && '50%',
          transform: isSmallScreen && isSearchBarVisible && 'translateX(-50%)',
        }} className="search-results">
          {products.map((product) => {
            return (
              <div
                onClick={handleRedirectProduct}
                data-link={`http://192.168.1.17:8000/src/products/products.php?id=${product.product_id}`}
                key={product.product_id}
                className="found-product"
              >
                <div className="cart-product-photo">
                  <img src={`${imagesPath + product.image}`} />
                </div>
                <div className="cart-description">
                  <div className="cart-product-title">
                    <p>{product.name}</p>
                  </div>
                  <div className="cart-product-info">
                    <p className="size">{product.sizeName}</p>
                    <p className="color">{product.colorName}</p>
                  </div>
                  <div className="cart-price">
                    <p>{product.price} $</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : searchInput != "" && products.length == 0 && loaded == true && error == false ? (
        <div style={{
          left: isSmallScreen && isSearchBarVisible && '50%',
          transform: isSmallScreen && isSearchBarVisible && 'translateX(-50%)',
        }} className="search-results">
          <p className="noProductsFoundMessage">{"No Products Found ;("}</p>
        </div>
      ) : searchInput != "" && error == true ? (
        <div style={{
          left: isSmallScreen && isSearchBarVisible && '50%',
          transform: isSmallScreen && isSearchBarVisible && 'translateX(-50%)',
        }} className="search-results">
          <p className="noProductsFoundMessage">{"An error occurred while processing your request!"}</p>
        </div>
      ) : null}
    </>
  );
}
