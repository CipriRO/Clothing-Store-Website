/*export function responsiveFont(product) {
  // Get the screen width
  var screenWidth = window.innerWidth;

  // Set a minimum and maximum font size
  var minFontSize = 4;
  var maxFontSize = 100;

  // Calculate a ratio based on screen width
  var ratio = screenWidth / (maxFontSize - minFontSize);

  // Set a new font size for html element
  if (screenWidth >= 767) {
    product.style.fontSize = minFontSize + ratio + "px";
  } else {
    product.style.fontSize = minFontSize + 6 + ratio + "px";
  }
}*/

import "./automaticDefProducts.js";

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
  document.cookie = name + "=" + value + expires + "; path=/";
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

let slideCount = null;
let currentIndex = 0;

function showSlide(index) {
  let slides = document.querySelectorAll(".preview img");
  slideCount = slides.length;
  slides[currentIndex].style.opacity = 0;
  slides[index].style.opacity = 1;
  currentIndex = index;
}

export function prevImage() {
  let slides = document.querySelectorAll(".preview img");
  slideCount = slides.length;
  let newIndex = (currentIndex - 1) % slideCount;
  if (newIndex < 0) {
    newIndex = slideCount - 1;
  }
  showSlide(newIndex);
}

export function nextImage() {
  let slides = document.querySelectorAll(".preview img");
  slideCount = slides.length;
  let newIndex = (currentIndex + 1) % slideCount;
  showSlide(newIndex);
}

const cacheExpiration = 120 * 1000;

sessionStorage.clear();

async function checkCart() {
  const addToCartButton =
    document.getElementsByClassName("add-to-cart-button")[0];
  const url = window.location.href;
  const productId = url.split("=")[1];

  const colorElement = document.getElementsByClassName("color-list");
  const checkboxes = document.getElementsByName("color");
  const sizeElement = document.getElementsByClassName("size");
  let productValue = getCookie("product_list");
  if (productValue != null) {
    let sizesValue = getCookie("sizes_list");
    let sizesList = sizesValue.split("|");
    let productList = productValue.split(",").map(Number);
    for (var i = 0; i < sizesList.length; i++) {
      let sizeName = 0;
      let colorName = 0;
      let selectedSize = 0;
      let selectedColor = 0;

      let noColorsSelected = 0;

      for (var j = 0; j < colorElement.length; j++) {
        const checkbox = colorElement[j].querySelector(
          "input[type='checkbox']"
        );
        if (checkbox.checked == false) {
          noColorsSelected++;
        }
        if (noColorsSelected == checkboxes.length) {
          addToCartButton.classList.add("add-to-cart-button-clicked");
          return;
        }
      }

      for (var j = 0; j < colorElement.length; j++) {
        const checkbox = colorElement[j].querySelector(
          "input[type='checkbox']"
        );
        if (checkbox.checked == true) {
          colorName = checkbox.value;
          selectedColor = await getColorId(colorName);
          break;
        }
      }

      for (var k = 0; k < sizeElement.length; k++) {
        const checkbox = sizeElement[k].querySelector("input[type='checkbox']");
        if (checkbox.checked === true) {
          sizeName = checkbox.value;
          selectedSize = await getSizeId(sizeName);
          break;
        }
      }

      let sizeColor = selectedSize + "," + selectedColor;
      if (
        productList.includes(Number(productId)) &&
        sizesList[i] === sizeColor
      ) {
        addToCartButton.classList.add("add-to-cart-button-clicked");
        //highlight = true;
        break;
      } /*if (!highlight) */ else {
        addToCartButton.classList.remove("add-to-cart-button-clicked");
        /*} else {
            highlight = false;
            checkCart();*/
      }
    }
  } else {
    addToCartButton.classList.remove("add-to-cart-button-clicked");
  }
}

let colorsArray = {};

export function colors(defaultColor, colors, checkboxes) {
  for (var i = 0; i < colors.length; i++) {
    colorsArray[i] = "deselected";
  }
  for (var i = 0; i < colors.length; i++) {
    const colorCode = colors[i].getAttribute("data-color-id");
    colors[i].style.color = colorCode;
    colors[i].style.borderColor = colorCode;
    const color = colors[i].innerText;
    const checkbox = colors[i].querySelector(
      '.color-list input[type="checkbox"]'
    );
    const validity = checkboxValidity(checkbox);
    if (color === defaultColor && validity == true) {
      selectColor(i);
      autoSlidePhoto();
      showPrice();
      checkCart();
    } else if (validity == false) {
      autoColorSelect();
      autoSlidePhoto();
      showPrice();
      checkCart();
    }
  }

  //autoColorSelect();
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("click", function () {
      const selectedColorElement = checkboxes[i].parentElement;
      let checkedCount = 0;
      const colorCode = selectedColorElement.getAttribute("data-color-id");
      selectedColorElement.style.color = "#ADADAD";
      selectedColorElement.style.backgroundColor = colorCode;
      selectedColorElement.style.boxShadow = "rgba(0, 0, 0, 0.35) 0 0.3em 1em";
      selectedColorElement.style.transform = "scale(1.1)";
      for (let j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].checked) {
          checkedCount++;
          const selectedColorElement = checkboxes[j].parentElement;
          const colorCode = selectedColorElement.getAttribute("data-color-id");
          selectedColorElement.style.color = "#ADADAD";
          selectedColorElement.style.backgroundColor = colorCode;
          selectedColorElement.style.boxShadow =
            "rgba(0, 0, 0, 0.35) 0 0.3em 1em";
          selectedColorElement.style.transform = "scale(1.1)";
        }
      }
      if (checkedCount === 0) {
        checkboxes[i].checked = true;
      } else {
        for (let j = 0; j < checkboxes.length; j++) {
          if (j !== i) {
            checkboxes[j].checked = false;
            const selectedColorElement = checkboxes[j].parentElement;
            const colorCode =
              selectedColorElement.getAttribute("data-color-id");
            selectedColorElement.style.color = colorCode;
            selectedColorElement.style.backgroundColor = "#ADADAD";
            selectedColorElement.style.boxShadow = "none";
            selectedColorElement.style.transform = "scale(1)";
          }
        }
      }
      autoSlidePhoto();
      showPrice();
      checkCart();
    });
  }
}

function getColor() {
  const selectedColorElement = document.querySelector(
    'input[name="color"]:checked'
  ).value;
  return selectedColorElement;
}

export function sizes(defaultSize, sizes, checkboxes) {
  for (var i = 0; i < sizes.length; i++) {
    const size = sizes[i].innerText;
    if (size === defaultSize) {
      const checkbox = sizes[i].querySelector('.size input[type="checkbox"]');
      checkbox.checked = true;
      sizes[i].style.backgroundColor = "rgb(29, 29, 29)";
      sizes[i].style.color = "#ADADAD";
      sizes[i].style.boxShadow = "rgba(0, 0, 0, 0.35) 0 0.3em 1em";
      sizes[i].style.transform = "scale(1.1)";
      findAvbColors(checkbox.value);
      autoSlidePhoto();
      showPrice();
      //checkCart();
    }

    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].addEventListener("click", function () {
        autoColorSelect();
        const selectedSize = checkboxes[i].value;
        findAvbColors(selectedSize);
        let checkedCount = 0;
        const selectedSizeElement = checkboxes[i].parentElement;
        selectedSizeElement.style.color = "#ADADAD";
        selectedSizeElement.style.backgroundColor = "rgb(29, 29, 29)";
        selectedSizeElement.style.boxShadow = "rgba(0, 0, 0, 0.35) 0 0.3em 1em";
        selectedSizeElement.style.transform = "scale(1.1)";
        for (let j = 0; j < checkboxes.length; j++) {
          if (checkboxes[j].checked) {
            checkedCount++;
            const selectedSizeElement = checkboxes[j].parentElement;
            selectedSizeElement.style.color = "#ADADAD";
            selectedSizeElement.style.backgroundColor = "rgb(29, 29, 29)";
            selectedSizeElement.style.boxShadow =
              "rgba(0, 0, 0, 0.35) 0 0.3em 1em";
            selectedSizeElement.style.transform = "scale(1.1)";
          }
        }
        if (checkedCount === 0) {
          checkboxes[i].checked = true;
        } else {
          for (let j = 0; j < checkboxes.length; j++) {
            if (j !== i) {
              checkboxes[j].checked = false;
              const selectedSizeElement = checkboxes[j].parentElement;
              selectedSizeElement.style.color = "rgb(29, 29, 29)";
              selectedSizeElement.style.backgroundColor = "#ADADAD";
              selectedSizeElement.style.boxShadow = "none";
              selectedSizeElement.style.transform = "scale(1)";
            }
          }
        }
        autoSlidePhoto();
      });
    }
  }
}

async function showPrice() {
  let price = await getPriceCache(0, 0, 0, true);
  const priceElement = document.getElementsByClassName("price")[0];

  priceElement.innerText = price + " $";
}

async function getPriceCache(sizeId, colorId, productId, value) {
  if (value === true) {
    var color = null;
    var size = null;
    const colors = document.getElementsByClassName("color-list");
    const sizes = document.getElementsByClassName("size");

    for (var i = 0; i < colors.length; i++) {
      const checkbox = colors[i].querySelector("input[type='checkbox']");
      if (checkbox.checked == true) {
        color = await getColorIdCache(checkbox.value);
        break;
      }
    }

    for (var i = 0; i < sizes.length; i++) {
      const checkbox = sizes[i].querySelector("input[type='checkbox']");
      if (checkbox.checked === true) {
        size = await getSizeIdCache(checkbox.value);
        break;
      }
    }

    if (size === null || color === null) {
      return "--";
    }

    const cacheKey = `price_${size}-${color}`;
    const cacheData = sessionStorage.getItem(cacheKey);

    if (!cacheData) {
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
      if (data != null) {
        const price = parseFloat(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(price));
        setTimeout(() => sessionStorage.removeItem(cacheKey), cacheExpiration);
        return price;
      } else {
        const price = "--";
        sessionStorage.setItem(cacheKey, JSON.stringify(price));
        setTimeout(() => sessionStorage.removeItem(cacheKey), cacheExpiration);
        return price;
      }
    } else {
      return cacheData;
    }
  } else {
    var color = colorId;
    var size = sizeId;

    if (size === null || color === null) {
      return "--";
    }

    const cacheKey = `price_${size}-${color}`;
    const cacheData = sessionStorage.getItem(cacheKey);

    if (!cacheData) {
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
      if (data != null) {
        const price = parseFloat(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(price));
        setTimeout(() => sessionStorage.removeItem(cacheKey), cacheExpiration);
        return price;
      } else {
        const price = "--";
        return price;
      }
    } else {
      return cacheData;
    }
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

async function autoSlidePhoto() {
  var color = null;
  var size = null;
  const colors = document.getElementsByClassName("color-list");
  const sizes = document.getElementsByClassName("size");

  for (var i = 0; i < colors.length; i++) {
    const checkbox = colors[i].querySelector("input[type='checkbox']");
    if (checkbox.checked == true) {
      color = await getColorIdCache(checkbox.value);
      break;
    }
  }

  for (var i = 0; i < sizes.length; i++) {
    const checkbox = sizes[i].querySelector("input[type='checkbox']");
    if (checkbox.checked === true) {
      size = await getSizeIdCache(checkbox.value);
      break;
    }
  }
  const cacheKey = `id_${size}-${color}`;
  const cacheData = sessionStorage.getItem(cacheKey);

  if (!cacheData) {
    const url = window.location.href;
    const productId = url.split("=")[1];

    const response = await fetch(
      "http://192.168.1.17:8000/src/products%20php/getProductInfoId.php",
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
    if (data !== null) {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      setTimeout(() => sessionStorage.removeItem(cacheKey), cacheExpiration);
    }

    const imgs = document.getElementsByClassName("preview")[0];
    const images = imgs.querySelectorAll("img");
    let slides = document.querySelectorAll(".preview img");
    slideCount = slides.length;

    for (var i = 0; i < images.length; i++) {
      const imageId = images[i].getAttribute("data-info-id");
      if (Number(imageId) === Number(data)) {
        let newIndex = i % slideCount;
        showSlide(newIndex);
        break;
      }
    }
  } else {
    const imgs = document.getElementsByClassName("preview")[0];
    const images = imgs.querySelectorAll("img");

    for (var i = 0; i < images.length; i++) {
      const imageId = images[i].getAttribute("data-info-id");
      if (Number(imageId) === Number(cacheData)) {
        let newIndex = i % slideCount;
        showSlide(newIndex);
        break;
      }
    }
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

function findAvbColors(selectedSize) {
  const cacheKeyAvbColors = `colors_${selectedSize}`;
  const cacheKeyColors = `colors`;

  // Check if the data is available in cache
  const cachedDataAvbColors = sessionStorage.getItem(cacheKeyAvbColors);
  const cachedDataColors = sessionStorage.getItem(cacheKeyColors);
  if (cachedDataAvbColors && cachedDataColors) {
    const colorsList = JSON.parse(cachedDataColors);
    const colors = JSON.parse(cachedDataAvbColors);
    updateSizeSelect(colors, colorsList);
  } else {
    const url = window.location.href;
    const productId = url.split("=")[1];
    // Fetch the data from the server
    fetch(
      `http://192.168.1.17:8000/src/products%20php/getAvailableColors.php`,
      {
        method: "post",
        body: new URLSearchParams({
          id: productId,
          size: selectedSize,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.colorId.length !== 0) {
          data.colorList = Array.from(new Set(data.colorList));
          data.colorId = Array.from(new Set(data.colorId));
          data.colorList.sort(function (a, b) {
            return a - b;
          });
          data.colorId.sort(function (a, b) {
            return a - b;
          });
          sessionStorage.setItem(
            cacheKeyColors,
            JSON.stringify(data.colorList)
          );
          sessionStorage.setItem(
            cacheKeyAvbColors,
            JSON.stringify(data.colorId)
          );
          setTimeout(
            () => sessionStorage.removeItem(cacheKeyColors),
            cacheExpiration
          );
          setTimeout(
            () => sessionStorage.removeItem(cacheKeyAvbColors),
            cacheExpiration
          );
        }

        updateSizeSelect(data.colorId, data.colorList);
      });
  }
}

async function updateSizeSelect(colorId, colorList) {
  const colors = document.getElementsByClassName("color-list");
  var removedNumbers = [];

  colorList = colorList.filter(function (color) {
    if (colorId.includes(color)) {
      removedNumbers.push(color);
      return false;
    }
    return true;
  });

  if (colorList != null) {
    for (var i = 0; i < colors.length; i++) {
      const name = colors[i].querySelector('input[type="checkbox"]').value;
      const colorId = await getColorIdCache(name);
      for (var j = 0; j < colorList.length; j++) {
        if (colorId == colorList[j]) {
          deactivateColor(i);
        }
      }
    }
  }
  if (removedNumbers != null) {
    for (var i = 0; i < colors.length; i++) {
      const name = colors[i].querySelector('input[type="checkbox"]').value;
      const colorId = await getColorIdCache(name);
      for (var j = 0; j < removedNumbers.length; j++) {
        if (colorId == removedNumbers[j]) {
          activateColor(i);
        }
      }
    }
  }
  showPrice();
  checkCart();
}

function checkboxValidity(checkbox) {
  if (checkbox.disabled) {
    return false;
  } else {
    return true;
  }
}

function autoColorSelect() {
  const colors = document.getElementsByClassName("color-list");
  for (var i = 0; i < colors.length; i++) {
    deselectColor(i);
    colorsArray[i] = "deselected";
  }
  for (var i = 0; i < colors.length; i++) {
    const checkbox = colors[i].querySelector("input[type='checkbox']");
    const validity = checkboxValidity(checkbox);
    if (validity == true) {
      selectColor(i);
      break;
    }
  }
}

function activateColor(num) {
  if (colorsArray[num] !== "selected") {
    const colors = document.getElementsByClassName("color-list");
    const colorCode = colors[num].getAttribute("data-color-id");
    const checkbox = colors[num].querySelector("input[type='checkbox']");
    checkbox.removeAttribute("disabled");
    checkbox.checked = false;
    colors[num].style.color = colorCode;
    colors[num].style.backgroundColor = "#adadad";
    colors[num].style.boxShadow = "none";
    colors[num].style.transform = "scale(1)";
    colors[num].style.opacity = "1";
    checkbox.style.cursor = "pointer";
    colorsArray[num] = "activated";
  }
}

function deselectColor(num) {
  const colors = document.getElementsByClassName("color-list");
  const colorCode = colors[num].getAttribute("data-color-id");
  const checkbox = colors[num].querySelector("input[type='checkbox']");
  checkbox.checked = false;
  colors[num].style.color = colorCode;
  colors[num].style.backgroundColor = "#adadad";
  colors[num].style.boxShadow = "none";
  colors[num].style.transform = "scale(1)";
  colors[num].style.opacity = "1";
  colorsArray[num] = "deselected";
}

function selectColor(num) {
  const colors = document.getElementsByClassName("color-list");
  const colorCode = colors[num].getAttribute("data-color-id");
  const checkbox = colors[num].querySelector("input[type='checkbox']");
  checkbox.checked = true;
  colors[num].style.color = "#ADADAD";
  colors[num].style.backgroundColor = colorCode;
  colors[num].style.boxShadow = "rgba(0, 0, 0, 0.35) 0 0.3em 1em";
  colors[num].style.transform = "scale(1.1)";
  colors[num].style.opacity = "1";
  colorsArray[num] = "selected";
}

function deactivateColor(num) {
  const colors = document.getElementsByClassName("color-list");
  const colorCode = colors[num].getAttribute("data-color-id");
  const checkbox = colors[num].querySelector("input[type='checkbox']");
  checkbox.setAttribute("disabled", true);
  checkbox.checked = false;
  colors[num].style.color = colorCode;
  colors[num].style.backgroundColor = "#ADADAD";
  colors[num].style.boxShadow = "none";
  colors[num].style.transform = "scale(1)";
  colors[num].style.opacity = "0.3";
  checkbox.style.cursor = "default";
  colorsArray[num] = "deactivated";
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

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
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

  var quantityInputs = document.getElementsByClassName("qnt");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  let highlight2 = false;
  let buyButton = document.getElementsByClassName("buy-button-cart")[0];
  buyButton.addEventListener("click", function (event) {
    event.preventDefault();
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

//cart commands

let cartHeaderIcon = document.querySelector(".cart-button-header");

cartHeaderIcon.addEventListener("click", function () {
  const cart = document.getElementById("cart");
  cart.classList.toggle("cart-active");
});

function openCart() {
  const cart = document.getElementById("cart");
  cart.classList.add("cart-active");
}

async function retrieveCartProducts() {
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
            <div class="cart-product-photo"><img src="../../public/public/${imageLink}"></div>
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
            <div class="delete-cart-product-button" data-id="${data["products"].product_id}"><img src="../../public/icons/delete-icon.png"></div>`;
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
        checkCart();
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
        checkCart();
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

export async function addItemToCart(productId) {
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
      const colors = document.getElementsByClassName("color-list");
      const sizes = document.getElementsByClassName("size");
      let sizeName = 0;
      let colorName = 0;

      for (var i = 0; i < colors.length; i++) {
        const checkbox = colors[i].querySelector("input[type='checkbox']");
        if (checkbox.checked == true) {
          colorName = checkbox.value;
          break;
        }
      }

      for (var i = 0; i < sizes.length; i++) {
        const checkbox = sizes[i].querySelector("input[type='checkbox']");
        if (checkbox.checked === true) {
          sizeName = checkbox.value;
          break;
        }
      }

      let selectedSize = await getSizeId(sizeName);
      let selectedColor = await getColorId(colorName);

      let maxQnt = await getProductMaxQnt(
        productId,
        selectedSize,
        selectedColor
      );

      if (selectedColor === null || selectedSize === null) {
        return;
      }

      let sizeColor = selectedSize + "," + selectedColor;
      let imageLink = await getCurrentImage(
        selectedSize,
        selectedColor,
        productId
      );
      let product_price = await getPrice(0, 0, 0, true);
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
        <div class="cart-product-photo"><img src="../../public/${imageLink}"></div>
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
        <div class="delete-cart-product-button" data-id="${data.product_id}"><img src="../../public/icons/delete-icon.png"></div>`;
      cartRow.innerHTML = cartRowContent;
      cartProducts.append(cartRow);
      cartRow
        .getElementsByClassName("delete-cart-product-button")[0]
        .addEventListener("click", removeCartItem);
      cartRow
        .getElementsByClassName("qnt")[0]
        .addEventListener("change", quantityChanged);
      addToProductList(productId);
      await addSizeAndColorToCookie(0, 0, true);
      await buyButtonCheck();
      addToProductQuantityList(1);
      checkCart();
      await updateCartTotal();
      openCart();
      autoScroll();
    });
}
