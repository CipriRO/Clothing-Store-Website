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