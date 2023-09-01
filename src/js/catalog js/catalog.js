import "../automaticDefProducts.js";

if (getCookie("cookieRequest") == null) {
  var cookiePopup = document.getElementsByClassName("cookie-request")[0];
  var overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.add("overlay-active");
  cookiePopup.classList.add("show-cookie-request");
  var cookiePopupButton = document.getElementsByClassName("cookie-button")[0];
  cookiePopupButton.addEventListener("click", function () {
    var cookiePopup = document.getElementsByClassName("cookie-request")[0];
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.classList.remove("overlay-active");
    cookiePopup.classList.remove("show-cookie-request");
    document.cookie =
      "cookieRequest=true; expires=Sunday, 26 March 2237 12:00:00 UTC; path=/";
  });
}

function autoPadding() {
  // Get the fixed element
  let alphabeticPanel = document.getElementsByClassName("alphabetic-panel")[0];

  let alphabeticPanelHeight = alphabeticPanel.offsetHeight;

  // Get the non-fixed element
  let categories = document.getElementsByClassName("categories")[0];

  categories.style.marginTop = alphabeticPanelHeight + "px";
}

// Helper functions to get and set the cookie
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

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function submitCheckout() {
  let productValues = getCookie("product_list");
  let sizeValues = getCookie("sizes_list");
  let quantityValues = getCookie("quantity_list");

  document.getElementById("checkout").elements.namedItem("product_list").value =
    productValues;
  document.getElementById("checkout").elements.namedItem("size_list").value =
    sizeValues;
  document
    .getElementById("checkout")
    .elements.namedItem("quantity_list").value = quantityValues;
  document.getElementById("checkout").elements.namedItem("back_link").value =
    window.location.href;

  document.getElementById("checkout").submit();
}

clearExpiredCache();

function clearExpiredCache() {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    if (value) {
      sessionStorage.removeItem(key);
    }
  }
}

async function getProductMaxQnt(productId, sizeId, colorId) {
  const response = await fetch(
    "http://192.168.1.17:8000/src/products%20php/getMaxQnt.php",
    {
      method: "post",
      body: new URLSearchParams({
        productId: productId,
        sizeId: sizeId,
        colorId: colorId,
      }),
    }
  );
  const data = await response.json();
  return data;
}

function cookiesDataErrorsBlocker() {
  let productValue = getCookie("product_list");
  let quantityValue = getCookie("quantity_list");
  let sizesValue = getCookie("sizes_list");
  let productList = productValue.split(",").map(Number);
  let quantityList = quantityValue.split(",").map(Number);
  let sizesList = sizesValue.split("|");

  if (
    productList.length != quantityList.length ||
    quantityList.length != sizesList.length ||
    productList.length != sizesList.length
  ) {
    deleteCookie("product_list");
    deleteCookie("quantity_list");
    deleteCookie("sizes_list");
  }
}

async function getPrice(sizeId, colorId, productId, value) {
  if (value === true) {
    var color = 0;
    var size = 0;
    const colors = document.getElementsByClassName("color-list");
    const sizes = document.getElementsByClassName("size");

    for (var i = 0; i < colors.length; i++) {
      const checkbox = colors[i].querySelector("input[type='checkbox']");
      if (checkbox.checked == true) {
        color = await getColorId(checkbox.value);
        break;
      }
    }

    for (var i = 0; i < sizes.length; i++) {
      const checkbox = sizes[i].querySelector("input[type='checkbox']");
      if (checkbox.checked === true) {
        size = await getSizeId(checkbox.value);
        break;
      }
    }
    const url = window.location.href;
    const productIdLink = url.split("=")[1];
    const response = await fetch(
      "http://192.168.1.17:8000/src/products%20php/getProductInfoPrice.php",
      {
        method: "post",
        body: new URLSearchParams({
          productId: productIdLink,
          size: size,
          color: color,
        }),
      }
    );
    const data = await response.json();
    const price = parseFloat(data);
    return price;
  } else {
    var color = colorId;
    var size = sizeId;

    const response = await fetch(
      "http://192.168.1.17:8000/src/products%20php/getProductInfoPrice.php",
      {
        method: "post",
        body: new URLSearchParams({
          productId: productId,
          size: size,
          color: color,
        }),
      }
    );
    const data = await response.json();
    const price = parseFloat(data);
    return price;
  }
}

async function getCurrentImage(selectedSize, selectedColor, productId) {
  const response = await fetch(
    "http://192.168.1.17:8000/src/products%20php/findImage.php",
    {
      method: "post",
      body: new URLSearchParams({
        productId: productId,
        size: selectedSize,
        color: selectedColor,
      }),
    }
  );
  const data = await response.json();
  const image = "../products photo/" + data;
  return image;
}

async function getColorIdCache(name) {
  const cacheKey = name;
  const cacheData = sessionStorage.getItem(cacheKey);
  if (cacheData) {
    const data = JSON.parse(cacheData);
    return data;
  } else {
    const response = await fetch(
      "http://192.168.1.17:8000/src/products%20php/getColorId.php",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(name),
      }
    );
    const data = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    setTimeout(() => sessionStorage.removeItem(cacheKey), cacheExpiration);
    return data;
  }
}

async function getColorId(name) {
  const response = await fetch(
    "http://192.168.1.17:8000/src/products%20php/getColorId.php",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name),
    }
  );
  const data = await response.json();
  return data;
}

async function getColorNameCache(id) {
  const cacheKey = id;
  const cacheData = sessionStorage.getItem(cacheKey);
  if (cacheData) {
    const data = JSON.parse(cacheData);
    return data;
  } else {
    const response = await fetch(
      "http://192.168.1.17:8000/src/products%20php/getColorName.php",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      }
    );
    const data = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    setTimeout(() => sessionStorage.removeItem(cacheKey), cacheExpiration);
    return data;
  }
}

async function getColorName(id) {
  const response = await fetch(
    "http://192.168.1.17:8000/src/products%20php/getColorName.php",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    }
  );
  const data = await response.json();
  return data;
}

async function getSizeIdCache(name) {
  const cacheKey = name;
  const cacheData = sessionStorage.getItem(cacheKey);
  if (cacheData) {
    const data = JSON.parse(cacheData);
    return data;
  } else {
    const response = await fetch(
      "http://192.168.1.17:8000/src/products%20php/getSizeId.php",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(name),
      }
    );
    const data = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    setTimeout(() => sessionStorage.removeItem(cacheKey), cacheExpiration);
    return data;
  }
}

async function getSizeId(name) {
  const response = await fetch(
    "http://192.168.1.17:8000/src/products%20php/getSizeId.php",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name),
    }
  );
  const data = await response.json();
  return data;
}

async function getSizeNameCache(id) {
  const cacheKey = id;
  const cacheData = sessionStorage.getItem(cacheKey);
  if (cacheData) {
    const data = JSON.parse(cacheData);
    return data;
  } else {
    const response = await fetch(
      "http://192.168.1.17:8000/src/products%20php/getSizeName.php",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      }
    );
    const data = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    setTimeout(() => sessionStorage.removeItem(cacheKey), cacheExpiration);
    return data;
  }
}

async function getSizeName(id) {
  const response = await fetch(
    "http://192.168.1.17:8000/src/products%20php/getSizeName.php",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    }
  );
  const data = await response.json();
  return data;
}

async function addSizeAndColorToCookie(sizeName, colorName, value) {
  if (value === true) {
    var color = 0;
    var size = 0;
    const colors = document.getElementsByClassName("color-list");
    const sizes = document.getElementsByClassName("size");

    for (var i = 0; i < colors.length; i++) {
      const checkbox = colors[i].querySelector("input[type='checkbox']");
      if (checkbox.checked == true) {
        color = await getColorId(checkbox.value);
        break;
      }
    }

    for (var i = 0; i < sizes.length; i++) {
      const checkbox = sizes[i].querySelector("input[type='checkbox']");
      if (checkbox.checked === true) {
        size = await getSizeId(checkbox.value);
        break;
      }
    }

    let sizeValue = getCookie("sizes_list");

    let sizeList = [];
    if (sizeValue) {
      sizeList = sizeValue.split("|");
    }

    if (Number(sizeList[0]) == 0) {
      sizeList.splice(0, 1);
    }

    var info = size + "," + color;

    sizeList.push(info);
    sizeValue = sizeList.join("|");

    setCookie("sizes_list", sizeValue, 365);
  } else {
    var color = await getColorId(colorName);
    var size = await getSizeId(sizeName);

    let sizeValue = getCookie("sizes_list");

    let sizeList = [];
    if (sizeValue) {
      sizeList = sizeValue.split("|");
    }

    if (Number(sizeList[0]) == 0) {
      sizeList.splice(0, 1);
    }

    var info = size + "," + color;

    sizeList.push(info);

    sizeValue = sizeList.join("|");

    setCookie("sizes_list", sizeValue, 365);
  }
}

function deleteAddedSizeAndColorFromCookie(loc) {
  // Get the current cookie value as a string
  let sizeValue = getCookie("sizes_list");

  // If the cookie doesn't exist yet, return
  if (!sizeValue) {
    return;
  }

  // Convert the string to an array of numbers
  let sizeList = sizeValue.split("|");

  // If the number is not in the list, return
  if (loc < 0 || loc >= sizeList.length) {
    return;
  }

  // Remove the number from the array
  sizeList.splice(loc, 1);

  // Convert the array back to a string and store it as the cookie value
  sizeValue = sizeList.join("|");
  setCookie("sizes_list", sizeValue, 365);
}

function retrieveAddedSizeFromCookie(loc) {
  let sizeValue = getCookie("sizes_list");

  // If the cookie doesn't exist yet, return
  if (!sizeValue) {
    return;
  }

  // Convert the string to an array of numbers
  let sizeList = sizeValue.split("|");

  // Check if the index is valid
  if (loc < 0 || loc >= sizeList.length) {
    return;
  }

  var info = sizeList[loc];
  return info;
}

// Function to add a number to the list in the cookie in a specific location
function deleteProductQuantityListLoc(loc) {
  // Get the current cookie value as a string
  let cookieValue = getCookie("quantity_list");

  // If the cookie doesn't exist yet, initialize the list
  if (!cookieValue) {
    cookieValue = "";
  }

  // Convert the string to an array of numbers
  let numberList = cookieValue.split(",").map(Number);

  // Add the new number to the end of the array
  numberList.splice(loc, 1);

  // Convert the array back to a string and store it as the cookie value
  cookieValue = numberList.join(",");
  setCookie("quantity_list", cookieValue, 365);
  deleteFromProductQuantityList(0);
}

// Function to add a number to the list in the cookie in a specific location
function addToProductQuantityListLoc(num, loc) {
  // Get the current cookie value as a string
  let cookieValue = getCookie("quantity_list");

  // If the cookie doesn't exist yet, initialize the list
  if (!cookieValue) {
    cookieValue = "";
  }

  // Convert the string to an array of numbers
  let numberList = cookieValue.split(",").map(Number);

  // Add the new number to the end of the array
  numberList.splice(loc, 0, num);

  // Convert the array back to a string and store it as the cookie value
  cookieValue = numberList.join(",");
  setCookie("quantity_list", cookieValue, 365);
  deleteFromProductQuantityList(0);
}

// Function to add a number to the list in the cookie
function addToProductQuantityList(num) {
  // Get the current cookie value as a string
  let cookieValue = getCookie("quantity_list");

  // If the cookie doesn't exist yet, initialize the list
  if (!cookieValue) {
    cookieValue = "";
  }

  // Convert the string to an array of numbers
  let numberList = cookieValue.split(",").map(Number);

  // Add the new number to the end of the array
  numberList.push(num);

  // Convert the array back to a string and store it as the cookie value
  cookieValue = numberList.join(",");
  setCookie("quantity_list", cookieValue, 365);
  deleteFromProductQuantityList(0);
}

// Function to add a number to the list in the cookie
function addToProductList(num) {
  // Get the current cookie value as a string
  let cookieValue = getCookie("product_list");

  // If the cookie doesn't exist yet, initialize the list
  if (!cookieValue) {
    cookieValue = "";
  }

  // Convert the string to an array of numbers
  let numberList = cookieValue.split(",").map(Number);

  // Add the new number to the end of the array
  numberList.push(num);

  // Convert the array back to a string and store it as the cookie value
  cookieValue = numberList.join(",");
  setCookie("product_list", cookieValue, 365);
  deleteFromProductList(0);
}

function deleteFromProductQuantityList(num) {
  // Get the current cookie value as a string
  let cookieValue = getCookie("quantity_list");

  // If the cookie doesn't exist yet, return
  if (!cookieValue) {
    return;
  }

  // Convert the string to an array of numbers
  let numberList = cookieValue.split(",").map(Number);

  // Find the index of the number to delete
  let index = numberList.indexOf(num);

  // If the number is not in the list, return
  if (index === -1) {
    return;
  }

  // Remove the number from the array
  numberList.splice(index, 1);

  // Convert the array back to a string and store it as the cookie value
  cookieValue = numberList.join(",");
  setCookie("quantity_list", cookieValue, 365);
}

// Function to delete a number from the list in the cookie
function deleteFromProductList(num) {
  // Get the current cookie value as a string
  let cookieValue = getCookie("product_list");

  // If the cookie doesn't exist yet, return
  if (!cookieValue) {
    return;
  }

  // Convert the string to an array of numbers
  let numberList = cookieValue.split(",").map(Number);

  // Find the index of the number to delete
  let index = numberList.indexOf(num);

  // If the number is not in the list, return
  if (index === -1) {
    return;
  }

  // Remove the number from the array
  numberList.splice(index, 1);

  // Convert the array back to a string and store it as the cookie value
  cookieValue = numberList.join(",");
  setCookie("product_list", cookieValue, 365);
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function autoScroll() {
  const cart = document.getElementsByClassName("cart-products")[0];
  const cartHeight = cart.scrollHeight;

  setTimeout(function () {
    cart.scrollTo({
      top: cartHeight,
      behavior: "smooth",
    });
  }, 500);
}

const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach((dropdown) => {
  const select = dropdown.querySelector(".select");
  const caret = dropdown.querySelector(".caret");
  const menu = dropdown.querySelector(".menu");
  const options = dropdown.querySelectorAll(".menu li");
  const selected = dropdown.querySelector(".selected");

  select.addEventListener("click", () => {
    select.classList.toggle("select-clicked");
    caret.classList.toggle("caret-rotate");
    menu.classList.toggle("menu-open");
  });
  options.forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerText = option.innerText;
      select.classList.remove("select-clicked");
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
      options.forEach((option) => {
        option.classList.add("active");
      });
    });
  });
  document.addEventListener("click", function (event) {
    if (!select.contains(event.target)) {
      select.classList.remove("select-clicked");
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
    }
  });
});

//cart commands

let cartHeaderIcon = document.querySelector(".cart-button-header");

cartHeaderIcon.addEventListener("click", function () {
  const cart = document.getElementById("cart");
  cart.classList.toggle("cart-active");
});

function openCart() {
  const cart = document.getElementById("cart");
  cartHeaderIcon.classList.toggle("cart-button-header-pressed");
  cart.classList.add("cart-active");
}

/* document.addEventListener("click", function(event) {
      if(!cart.contains(event.target) && !cartHeaderIcon.contains(event.target)) {
          cart.classList.remove("cart-active");
          cartHeaderIcon.classList.remove("cart-active-header");
      }
  }) */

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

async function ready() {
  setInterval(function () {
    // Get the current cookie value as a string
    let quantityValue = getCookie("quantity_list");

    // If the cookie doesn't exist yet, initialize the list
    if (!quantityValue) {
      quantityValue = "";
    }
    setCookie("quantity_list", quantityValue, 365);

    let cookieValue = getCookie("product_list");

    // If the cookie doesn't exist yet, initialize the list
    if (!cookieValue) {
      cookieValue = "";
    }
    setCookie("product_list", cookieValue, 365);

    let sizeValue = getCookie("sizes_list");

    if (!sizeValue) {
      sizeValue = "";
    }
    setCookie("sizes_list", sizeValue, 365);
  }, 1000);

  retrieveCartProducts();

  var removeCartItemsButtons = document.getElementsByClassName(
    "delete-cart-product-button"
  );
  for (var i = 0; i < removeCartItemsButtons.length; i++) {
    var button = removeCartItemsButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var organiseOptions = document.getElementsByClassName("organise")[0];
  organise();
  organiseOptions.addEventListener("change", organise);

  var quantityInputs = document.getElementsByClassName("qnt");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  cookiesDataErrorsBlocker();
  let highlight2 = false;
  let buyButton = document.getElementsByClassName("buy-button-cart")[0];
  buyButton.addEventListener("click", function () {
    let productValue = getCookie("product_list");
    let productList = productValue.split(",");
    if (productList == "") {
      buyButton.classList.add("buy-button-cart-clicked");
      highlight2 = true;
    } else if (!highlight2) {
      buyButton.classList.remove("buy-button-cart-clicked");
      submitCheckout();
    } else {
      submitCheckout();
      highlight2 = false;
      buyButton.classList.remove("buy-button-cart-clicked");
    }
  });
  buyButtonCheck();
}

function autoColapseProducts(products) {
  for (let i = 4; i < products.length; i++) {
    products[i].classList.add("hide");
  }
  const button = document.createElement("button");
  button.className = "show-more";
  button.innerText = "Show More";
  const category = products[0].parentElement.parentElement;
  category.getElementsByClassName("hide-show-buttons")[0].append(button);
  const showMoreButton = category.getElementsByClassName("show-more")[0];
  showMoreButton.addEventListener("click", showMore);
}

function showMore(event) {
  const button = event.target;
  const category = button.parentElement.parentElement;
  const categoryHeight = category.offsetHeight;

  category.style.transition = "none";
  category.style.maxHeight = categoryHeight - 15 + "px";

  let hiddenItems = category.querySelectorAll(".product-preview.hide");

  for (let i = 0; i < 4 && i < hiddenItems.length; i++) {
    hiddenItems[i].classList.add("unhide");
    hiddenItems[i].classList.remove("hide");
  }

  setTimeout(() => {
    category.style.transition =
      "max-width 3s ease-in-out, max-height 3s ease-in-out";
    category.style.maxHeight = 5000 + "px";

    const updatedHiddenItems = category.querySelectorAll(
      ".product-preview.hide"
    );
    if (updatedHiddenItems.length === 0) {
      button.remove();
      autoAddSpaceLine(category.getElementsByClassName("hide-show-buttons")[0]);
    }
    if (
      !category
        .getElementsByClassName("hide-show-buttons")[0]
        .getElementsByClassName("hide-more")[0]
    ) {
      const hideButton = document.createElement("button");
      hideButton.className = "hide-more";
      hideButton.innerText = "Hide";
      category
        .getElementsByClassName("hide-show-buttons")[0]
        .append(hideButton);
      autoAddSpaceLine(category.getElementsByClassName("hide-show-buttons")[0]);
      const hideMoreButton = category.getElementsByClassName("hide-more")[0];
      hideMoreButton.addEventListener("click", hideMore);
    }
  }, 10);
}

function hideMore(event) {
  const button = event.target;
  const category = button.parentElement.parentElement;
  const categoryHeight = category.offsetHeight;
  const categoryWidth = category.offsetWidth;

  category.style.transition = "none";
  category.style.minHeight = categoryHeight - 15 + "px";
  category.style.minWidth = categoryWidth + "px";

  let visibleItems = category.querySelectorAll(".product-preview.unhide");
  for (var i = 0; i < visibleItems.length; i++) {
    visibleItems[i].classList.add("hide");
    visibleItems[i].classList.remove("unhide");
  }

  setTimeout(() => {
    category.style.transition =
      "min-width 1s ease-in-out, min-height 1s ease-in-out";
    category.style.minHeight = 0 + "px";
    category.style.minWidth = 300 + "px";

    const updatedVisibleItems = category.querySelectorAll(
      ".product-preview.unhideAnim"
    );
    if (updatedVisibleItems.length === 0) {
      button.remove();
      autoAddSpaceLine(category.getElementsByClassName("hide-show-buttons")[0]);
    }
    if (
      !category
        .getElementsByClassName("hide-show-buttons")[0]
        .getElementsByClassName("show-more")[0]
    ) {
      const showButton = document.createElement("button");
      showButton.className = "show-more";
      showButton.innerText = "Show More";
      if (
        category.getElementsByClassName("hide-show-buttons")[0].hasChildNodes()
      ) {
        let firstChild =
          category.getElementsByClassName("hide-show-buttons")[0].firstChild;
        category
          .getElementsByClassName("hide-show-buttons")[0]
          .insertBefore(showButton, firstChild);
        autoAddSpaceLine(
          category.getElementsByClassName("hide-show-buttons")[0]
        );
      } else {
        category
          .getElementsByClassName("hide-show-buttons")[0]
          .append(showButton);
      }
      const showMoreButton = category.getElementsByClassName("show-more")[0];
      showMoreButton.addEventListener("click", showMore);
    }
  }, 10);
}

function autoAddSpaceLine(container) {
  const containerElement = container.getElementsByClassName("sep-line")[0];
  if (container.childElementCount === 2 && !containerElement) {
    const div = document.createElement("div");
    div.className = "sep-line";
    container.insertBefore(div, container.lastChild);
  } else if (container.childElementCount != 3 && containerElement) {
    containerElement.remove();
  }
}

function scrollToFunction(event) {
  var button = event.target;

  const buttonLetter = button.innerText;
  const category = document.getElementsByClassName("category");
  for (let i = 0; i < category.length; i++) {
    if (
      category[i].getElementsByClassName("new-products-text")[0].innerText ===
      buttonLetter
    ) {
      const scrollOffset =
        category[i].getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: scrollOffset, behavior: "smooth" });
      break;
    }
  }
}

function autoOrderSelectionCookie() {
  var organiseSelect = document.getElementsByClassName("organise")[0];
  let orderSelectionValue = getCookie("order_selection");

  if (!orderSelectionValue) {
    orderSelectionValue =
      organiseSelect.options[organiseSelect.selectedIndex].value;
    setCookie("order_selection", orderSelectionValue, 365);
    return;
  }
  for (let i = 0; i < organiseSelect.options.length; i++) {
    if (orderSelectionValue === organiseSelect.options[i].value) {
      organiseSelect.value = orderSelectionValue;
      setCookie("order_selection", orderSelectionValue, 365);
      return;
    }
  }
}

function orderSelectionCookie() {
  var organiseSelect = document.getElementsByClassName("organise")[0];
  let orderSelectionValue = getCookie("order_selection");

  if (!orderSelectionValue) {
    orderSelectionValue =
      organiseSelect.options[organiseSelect.selectedIndex].value;
    setCookie("order_selection", orderSelectionValue, 365);
    return;
  }
  for (let i = 0; i < organiseSelect.options.length; i++) {
    if (
      organiseSelect.options[organiseSelect.selectedIndex].value ===
      organiseSelect.options[i].value
    ) {
      orderSelectionValue =
        organiseSelect.options[organiseSelect.selectedIndex].value;
      setCookie("order_selection", orderSelectionValue, 365);
      return;
    }
  }
}

autoOrderSelectionCookie();

async function organise() {
  orderSelectionCookie();
  var organiseSelect = document.getElementsByClassName("organise")[0];
  var organiseSelection = organiseSelect.value;
  var alphabeticPanel = document.getElementsByClassName("alphabetic-panel")[0];

  var buttons = alphabeticPanel.getElementsByTagName("button");
  var categories = document.getElementsByClassName("category");
  while (buttons.length > 0) {
    alphabeticPanel.removeChild(buttons[0]);
  }

  for (var l = 0; l < categories.length; l++) {
    categories[l].parentNode.removeChild(categories[l]);
  }

  if (organiseSelection === "MostBought") {
    alphabeticPanel.classList.remove("alphabetic-panel-open");
    const categoryWithoutAutocolapse = document.getElementsByClassName(
      "category-without-autocolapse"
    )[0];
    if (categoryWithoutAutocolapse) {
      categoryWithoutAutocolapse.remove();
    }
    var categories = document.getElementsByClassName("category");
    for (var l = 0; l < categories.length; l++) {
      categories[l].parentNode.removeChild(categories[l]);
    }

    const response = await fetch(
      "http://192.168.1.17:8000/src/products%20php/mostBought.php",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    let productRow = document.createElement("div");
    let hideButtons = document.createElement("div");
    hideButtons.className = "hide-show-buttons";
    productRow.classList.add("video-grid");
    const categoriesDiv = document.getElementsByClassName("categories")[0];
    const newProductsParagaph = document.createElement("p");
    const smallDesc = document.createElement("p");
    const categoryDiv = document.createElement("div");
    const categoryTitle = document.createElement("div");
    categoryDiv.className = "category-without-autocolapse";
    newProductsParagaph.className = "new-products-text";
    smallDesc.className = "small-desc";
    categoryTitle.className = "category-titles";
    newProductsParagaph.innerText = "Most Bought Products";
    smallDesc.innerText =
      "Listed by purchase frequency, first products sold the most.";
    categoriesDiv.appendChild(categoryDiv);
    categoryDiv.appendChild(categoryTitle);
    categoryTitle.appendChild(newProductsParagaph);
    categoryTitle.appendChild(smallDesc);
    categoryDiv.appendChild(productRow);
    categoryDiv.appendChild(hideButtons);

    for (var j = 0; j < data.length; j++) {
      const product = `
        <div class="product-preview" data-link="http://localhost:5173/src/products/products.html?id=${
          data[j].product_id
        }">
          <div class="photo">
            <div class="def-info">
              <p>${await getSizeName(data[j].Size)}</p>
              <div></div>
              <p>${await getColorName(data[j].Color)}<p>
            </div>
            <img class="image" src="../../../products photo/${data[j].image}">
          </div>
        <div class="product-info">
            <div class="product-title">
                    <p class="title">${data[j].name}</p>
            </div>
            <div class="product-cart-area">
                <div class="price"><p class="price-text">${
                  data[j].price + " $"
                }</p></div>
                <button class="product-cart-button" data-product-id="${
                  data[j].product_id
                }"><img src="../../../icons/add-to-cart-icon.png"></button>
            </div>
        </div>`;

      var videoGrid = document.getElementsByClassName("video-grid")[0];
      videoGrid.insertAdjacentHTML("beforeend", product);
    }
    var alphabeticContainer =
      document.getElementsByClassName("alphabetic-panel")[0];
    var alphabeticButtons = alphabeticContainer.querySelectorAll("button");
    for (var i = 0; i < alphabeticButtons.length; i++) {
      alphabeticButtons[i].addEventListener("click", scrollToFunction);
    }

    document.querySelectorAll(".product-preview").forEach(function (product) {
      product.addEventListener("click", function (e) {
        if (e.target.closest(".product-cart-button")) {
          return;
        }

        const link = product.getAttribute("data-link");
        window.location.href = link;
      });
    });

    var categories = document.getElementsByClassName("category");
    for (var i = 0; i < categories.length; i++) {
      var productsList = categories[i].getElementsByClassName("video-grid")[0];
      var updatedProducts =
        productsList.getElementsByClassName("product-preview");
      if (updatedProducts.length > 4) {
        autoColapseProducts(updatedProducts);
      }
    }

    const productCartButtons = document.querySelectorAll(
      ".product-cart-button"
    );
    productCartButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var productId = button.dataset.productId;
        addItemToCart(productId);
      });
    });
  } else if (organiseSelection === "Category") {
    alphabeticPanel.classList.remove("alphabetic-panel-open");
    const categoryWithoutAutocolapse = document.getElementsByClassName(
      "category-without-autocolapse"
    )[0];
    if (categoryWithoutAutocolapse) {
      categoryWithoutAutocolapse.remove();
    }
    var categories = document.getElementsByClassName("category");
    for (var l = 0; l < categories.length; l++) {
      categories[l].parentNode.removeChild(categories[l]);
    }

    alphabeticPanel.classList.add("alphabetic-panel-open");
    const response = await fetch(
      "http://192.168.1.17:8000/src/products%20php/categoryProducts.php",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const categoriesName = data.categories;
    const products = data.products;

    for (var i = 0; i < categoriesName.length; i++) {
      const alphabeticPanel =
        document.getElementsByClassName("alphabetic-panel")[0];
      const categoriesDiv = document.getElementsByClassName("categories")[0];
      const button = document.createElement("button");
      const categoryDiv = document.createElement("div");
      let hideButtons = document.createElement("div");
      hideButtons.className = "hide-show-buttons";
      const newProductsParagaph = document.createElement("p");
      let productRow = document.createElement("div");
      productRow.classList.add("video-grid");

      button.innerText = categoriesName[i];
      categoryDiv.className = "category";
      newProductsParagaph.className = "new-products-text";
      newProductsParagaph.innerText = categoriesName[i];
      alphabeticPanel.appendChild(button);
      categoriesDiv.appendChild(categoryDiv);
      categoryDiv.appendChild(newProductsParagaph);
      categoryDiv.appendChild(productRow);
      categoryDiv.appendChild(hideButtons);
    }
    autoPadding();

    for (var j = 0; j < products.length; j++) {
      const product = `
        <div class="product-preview" data-link="http://localhost:5173/src/products/products.html?id=${
          products[j].product_id
        }">
          <div class="photo">
            <div class="def-info">
              <p>${await getSizeName(products[j].Size)}</p>
              <div></div>
              <p>${await getColorName(products[j].Color)}<p>
            </div>
            <img class="image" src="../../../products photo/${
              products[j].image
            }">
          </div>
          <div class="product-info">
            <div class="product-title">
              <p class="title">${products[j].name}</p>
            </div>
            <div class="product-cart-area">
              <div class="price"><p class="price-text">${
                products[j].price + " $"
              }</p></div>
              <button class="product-cart-button" data-product-id="${
                products[j].product_id
              }"><img src="../../../icons/add-to-cart-icon.png"></button>
            </div>
        </div>`;

      const category = document.getElementsByClassName("category");
      for (var k = 0; k < category.length; k++) {
        for (var l = 0; l < products[j].categoryName.length; l++) {
          if (
            category[k].getElementsByClassName("new-products-text")[0]
              .innerText === products[j].categoryName[l]
          ) {
            var grid = category[k].getElementsByClassName("video-grid")[0];
            grid.insertAdjacentHTML("beforeend", product);
          }
        }
      }
      var alphabeticContainer =
        document.getElementsByClassName("alphabetic-panel")[0];
      var alphabeticButtons = alphabeticContainer.querySelectorAll("button");
      for (var i = 0; i < alphabeticButtons.length; i++) {
        alphabeticButtons[i].addEventListener("click", scrollToFunction);
      }

      document.querySelectorAll(".product-preview").forEach(function (product) {
        product.addEventListener("click", function (e) {
          if (e.target.closest(".product-cart-button")) {
            return;
          }

          const link = product.getAttribute("data-link");
          window.location.href = link;
        });
      });
    }

    var categories = document.getElementsByClassName("category");
    for (var i = 0; i < categories.length; i++) {
      var productsList = categories[i].getElementsByClassName("video-grid")[0];
      var updatedProducts =
        productsList.getElementsByClassName("product-preview");
      if (updatedProducts.length > 4) {
        autoColapseProducts(updatedProducts);
      }
    }

    const productCartButtons = document.querySelectorAll(
      ".product-cart-button"
    );
    productCartButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var productId = button.dataset.productId;
        addItemToCart(productId);
      });
    });
  } else if (organiseSelection === "Alphabetic") {
    alphabeticPanel.classList.remove("alphabetic-panel-open");
    const categoryWithoutAutocolapse = document.getElementsByClassName(
      "category-without-autocolapse"
    )[0];
    if (categoryWithoutAutocolapse) {
      categoryWithoutAutocolapse.remove();
    }
    var categories = document.getElementsByClassName("category");
    for (var l = 0; l < categories.length; l++) {
      categories[l].parentNode.removeChild(categories[l]);
    }

    alphabeticPanel.classList.add("alphabetic-panel-open");
    const response = await fetch(
      "http://192.168.1.17:8000/src/products%20php/alphabeticProducts.php",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const letters = data.letters;
    const products = data.products;

    for (var i = 0; i < letters.length; i++) {
      const alphabeticPanel =
        document.getElementsByClassName("alphabetic-panel")[0];
      const categoriesDiv = document.getElementsByClassName("categories")[0];
      const button = document.createElement("button");
      const categoryDiv = document.createElement("div");
      const newProductsParagaph = document.createElement("p");
      let productRow = document.createElement("div");
      productRow.classList.add("video-grid");
      let hideButtons = document.createElement("div");
      hideButtons.className = "hide-show-buttons";

      button.innerText = letters[i];
      categoryDiv.className = "category";
      newProductsParagaph.className = "new-products-text";
      newProductsParagaph.innerText = letters[i];
      alphabeticPanel.appendChild(button);
      categoriesDiv.appendChild(categoryDiv);
      categoryDiv.appendChild(newProductsParagaph);
      categoryDiv.appendChild(productRow);
      categoryDiv.appendChild(hideButtons);
    }
    autoPadding();

    for (var j = 0; j < products.length; j++) {
      var productRow = document.createElement("div");
      productRow.classList.add("video-grid");
      const product = `
        <div class="product-preview" data-link="http://localhost:5173/src/products/products.html?id=${
          products[j].product_id
        }">
          <div class="photo">
            <div class="def-info">
              <p>${await getSizeName(products[j].Size)}</p>
              <div></div>
              <p>${await getColorName(products[j].Color)}<p>
            </div>
            <img class="image" src="../../../products photo/${
              products[j].image
            }">
          </div>
          <div class="product-info">
            <div class="product-title">
              <p class="title">${products[j].name}</p>
            </div>
            <div class="product-cart-area">
              <div class="price"><p class="price-text">${
                products[j].price + " $"
              }</p></div>
              <button class="product-cart-button" data-product-id="${
                products[j].product_id
              }"><img src="../../../icons/add-to-cart-icon.png"></button>
            </div>
        </div>`;

      const category = document.getElementsByClassName("category");
      for (var k = 0; k < category.length; k++) {
        if (
          category[k].getElementsByClassName("new-products-text")[0]
            .innerText === products[j].letter
        ) {
          var productRow = document.createElement("div");
          var grid = category[k].getElementsByClassName("video-grid")[0];
          grid.insertAdjacentHTML("beforeend", product);
        }
      }
      var alphabeticContainer =
        document.getElementsByClassName("alphabetic-panel")[0];
      var alphabeticButtons = alphabeticContainer.querySelectorAll("button");
      for (var i = 0; i < alphabeticButtons.length; i++) {
        alphabeticButtons[i].addEventListener("click", scrollToFunction);
      }

      document.querySelectorAll(".product-preview").forEach(function (product) {
        product.addEventListener("click", function (e) {
          if (e.target.closest(".product-cart-button")) {
            return;
          }

          const link = product.getAttribute("data-link");
          window.location.href = link;
        });
      });
    }

    var categories = document.getElementsByClassName("category");
    for (var i = 0; i < categories.length; i++) {
      var productsList = categories[i].getElementsByClassName("video-grid")[0];
      var updatedProducts =
        productsList.getElementsByClassName("product-preview");
      if (updatedProducts.length > 4) {
        autoColapseProducts(updatedProducts);
      }
    }

    const productCartButtons = document.querySelectorAll(
      ".product-cart-button"
    );
    productCartButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var productId = button.dataset.productId;
        addItemToCart(productId);
      });
    });
  }
}

async function buyButtonCheck() {
  let highlight2 = false;
  let buyButton = document.getElementsByClassName("buy-button-cart")[0];
  let productValue = getCookie("product_list");
  let productList = productValue.split(",");
  if (productList == "") {
    buyButton.classList.add("buy-button-cart-clicked");
    highlight2 = true;
  } else if (!highlight2) {
    buyButton.classList.remove("buy-button-cart-clicked");
  } else {
    highlight2 = false;
    buyButton.classList.remove("buy-button-cart-clicked");
  }
}

async function removeCartItem(event) {
  var buttonClicked = event.target;
  let cookieValue = getCookie("product_list");
  let numberList = cookieValue.split(",").map(Number);
  if (buttonClicked.nodeName == "IMG") {
    const productId = buttonClicked.parentElement.getAttribute("data-id");
    let sizesList = getCookie("sizes_list").split("|");
    for (var i = 0; i < numberList.length; i++) {
      const parentElement = buttonClicked.closest(".cart-product");
      const size = parentElement.querySelector(".size");
      const color = parentElement.querySelector(".color");

      let selectedSize = await getSizeId(size.innerText);
      let selectedColor = await getColorId(color.innerText);

      let sizeColor = selectedSize + "," + selectedColor;

      if (
        Number(numberList[i]) === Number(productId) &&
        sizesList[i] === sizeColor
      ) {
        deleteAddedSizeAndColorFromCookie(i);
        deleteFromProductList(eval(productId));
        deleteProductQuantityListLoc(i);
        buttonClicked.parentElement.parentElement.remove();
        updateCartTotal();
        await buyButtonCheck();
        break; // stop looping after updating the quantity
      }
    }
  } else if (buttonClicked.nodeName == "DIV") {
    var productId = buttonClicked.dataset.id;
    let sizesList = getCookie("sizes_list").split("|");
    for (var i = 0; i < numberList.length; i++) {
      let sizeId = sizesList[i].split(",").map(Number)[0];
      let colorId = sizesList[i].split(",").map(Number)[1];
      let sizeColor = sizeId + "," + colorId;
      if (
        Number(numberList[i]) == Number(productId) &&
        sizesList[i] === sizeColor
      ) {
        deleteAddedSizeAndColorFromCookie(i);
        deleteFromProductList(eval(productId));
        deleteProductQuantityListLoc(i);
        buttonClicked.parentElement.remove();
        updateCartTotal();
        await buyButtonCheck();
        break; // stop looping after updating the quantity
      }
    }
  }
}

async function quantityChanged(event) {
  var input = event.target;
  this.style.width = (this.value.length + 2) * 8 + "px";

  var id = input.parentElement.parentElement.parentElement.querySelector(
    ".delete-cart-product-button"
  ).dataset.id;
  let productList = getCookie("product_list").split(",").map(Number);
  let sizesList = getCookie("sizes_list").split("|");
  for (var i = 0; i < productList.length; i++) {
    const parentElement = input.closest(".cart-product");
    const size = parentElement.querySelector(".size");
    const color = parentElement.querySelector(".color");

    let selectedSize = await getSizeId(size.innerText);
    let selectedColor = await getColorId(color.innerText);

    let sizeColor = selectedSize + "," + selectedColor;

    if (Number(productList[i]) === Number(id) && sizesList[i] === sizeColor) {
      let maxQnt = await getProductMaxQnt(id, selectedSize, selectedColor);

      if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
        this.style.width = "2em";
      } else if (input.value > maxQnt) {
        input.value = maxQnt;
        this.style.width = "2.9em";
      }

      deleteProductQuantityListLoc(i);
      addToProductQuantityListLoc(input.value, i);
      updateCartTotal();
      break; // stop looping after updating the quantity
    }
  }
}

async function updateCartTotal() {
  var total = 0;
  let productValue = getCookie("product_list");
  let quantityValue = getCookie("quantity_list");
  let sizeValue = getCookie("sizes_list");
  let productList = productValue.split(",").map(Number);
  let quantityList = quantityValue.split(",").map(Number);
  let sizeList = sizeValue.split("|");

  if (productList != 0) {
    for (var i = 0; i < productList.length; i++) {
      let info = sizeList[i].split(",").map(Number);
      let product_price = await getPrice(
        info[0],
        info[1],
        productList[i],
        false
      );
      total = Number(total) + Number(product_price) * Number(quantityList[i]);
    }
    total = Math.round(total * 100) / 100;
  }
  document.getElementsByClassName("total-money ")[0].innerHTML =
    "Total: " + total + " $";
}

async function addItemToCart(productId) {
  fetch("http://192.168.1.17:8000/src/products%20php/getProductsById.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productId),
  })
    .then((response) => response.json())
    .then(async (data) => {
      let sizesValue = getCookie("sizes_list");
      let sizesList = sizesValue.split("|");

      const response = await fetch(
        "http://192.168.1.17:8000/src/products%20php/getDefSizeColor.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productId),
        }
      );
      const dataSizeColor = await response.json();

      let sizeColor = dataSizeColor;
      let selectedSize = dataSizeColor.split(",").map(Number)[0];
      let selectedColor = dataSizeColor.split(",").map(Number)[1];

      let sizeName = await getSizeName(selectedSize);
      let colorName = await getColorName(selectedColor);

      let maxQnt = await getProductMaxQnt(
        productId,
        selectedSize,
        selectedColor
      );

      let imageLink = await getCurrentImage(
        selectedSize,
        selectedColor,
        productId
      );
      let product_price = await getPrice(
        selectedSize,
        selectedColor,
        productId,
        false
      );
      var cartRow = document.createElement("div");
      cartRow.classList.add("cart-product");
      var cartProducts = document.getElementsByClassName("cart-products")[0];
      var cartProductsNames =
        cartProducts.getElementsByClassName("cart-product-title");
      for (var i = 0; i < cartProductsNames.length; i++) {
        if (
          cartProductsNames[i].innerText == data.name &&
          sizesList[i] == sizeColor
        ) {
          return;
        }
      }

      var cartRowContent = `
          <div class="cart-product-photo"><img src="../../${imageLink}"></div>
          <div class="cart-description">
              <div class="cart-product-title"><p>${data.name}</p></div>
              <div class="cart-product-info">
              <p class="size">${sizeName}</p>
              <p class="color">${colorName}</p>
              </div>
              <div class="cart-price">
                      <p>${product_price} $</p>
                      <input type="number" max=${maxQnt} value="1" class="qnt" id="qnt">
              </div>
          </div>
          <div class="delete-cart-product-button" data-id="${data.product_id}"><img src="../../../public/icons/delete-icon.png"></div>`;
      cartRow.innerHTML = cartRowContent;
      cartProducts.append(cartRow);
      cartRow
        .getElementsByClassName("delete-cart-product-button")[0]
        .addEventListener("click", removeCartItem);
      cartRow
        .getElementsByClassName("qnt")[0]
        .addEventListener("change", quantityChanged);
      addToProductList(productId);
      await addSizeAndColorToCookie(sizeName, colorName, false);
      await buyButtonCheck();
      addToProductQuantityList(1);
      await updateCartTotal();
      autoScroll();
    });
}

async function retrieveCartProducts() {
  cookiesDataErrorsBlocker();
  let productValue = getCookie("product_list");
  let quantityValue = getCookie("quantity_list");
  if (Number(productValue) !== 0) {
    let productList = productValue.split(",").map(Number);
    let quantityList = quantityValue.split(",").map(Number);
    for (let i = 0; i < productList.length; i++) {
      let sizesValue = getCookie("sizes_list");
      let sizesList = sizesValue.split("|");
      let sizeId = sizesList[i].split(",").map(Number)[0];
      let colorId = sizesList[i].split(",").map(Number)[1];
      let maxQnt = await getProductMaxQnt(productList[i], sizeId, colorId);

      let productData = {
        colorId: colorId,
        sizeId: sizeId,
        productId: productList[i],
      };

      fetch(
        "http://192.168.1.17:8000/src/products%20php/retrieveProductsById.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      )
        .then((response) => response.json())
        .then(async (data) => {
          if (data["missingData"].length != 0) {
            for (let i = 0; i < data["missingData"].length; i++) {
              let index = productList.indexOf(data["missingData"][i]);
              deleteAddedSizeAndColorFromCookie(index);
              deleteFromProductList(eval(data["missingData"][i]));
              deleteProductQuantityListLoc(index);
            }
            updateCartTotal();
            await buyButtonCheck();
          }

          let productValue = getCookie("product_list");
          if (Number(productValue) === 0) {
            return;
          }

          let imageLink = await getCurrentImage(
            sizeId,
            colorId,
            productList[i]
          );
          let color = await getColorName(colorId);
          let size = await getSizeName(sizeId);
          let product_price = await getPrice(
            sizeId,
            colorId,
            productList[i],
            false
          );
          let sizeColor = sizeId + "," + colorId;
          let cartRow = document.createElement("div");
          cartRow.classList.add("cart-product");
          let cartProducts =
            document.getElementsByClassName("cart-products")[0];
          let cartProductsNames =
            cartProducts.getElementsByClassName("cart-product-title");
          for (let j = 0; j < cartProductsNames.length; j++) {
            if (
              cartProductsNames[j].innerText === data["products"].name &&
              Number(sizesList[j]) === Number(sizeColor)
            ) {
              return;
            }
          }
          let cartRowContent = `
              <div class="cart-product-photo"><img src="../../${imageLink}"></div>
              <div class="cart-description">
                <div class="cart-product-title"><p>${data["products"].name}</p></div>
                <div class="cart-product-info">
                <p class="size">${size}</p>
                <p class="color">${color}</p>
                </div>
                <div class="cart-price">
                  <p>${product_price} $</p>
                  <input type="number" max=${maxQnt} value=${quantityList[i]} class="qnt" id="qnt" required>
                </div>
              </div>
              <div class="delete-cart-product-button" data-id="${data["products"].product_id}"><img src="../../../public/icons/delete-icon.png"></div>`;
          cartRow.innerHTML = cartRowContent;
          cartProducts.append(cartRow);
          cartRow
            .getElementsByClassName("delete-cart-product-button")[0]
            .addEventListener("click", removeCartItem);
          cartRow
            .getElementsByClassName("qnt")[0]
            .addEventListener("change", quantityChanged);
        });
    }
    updateCartTotal();
  }
}
