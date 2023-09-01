fetch("http://192.168.1.17:8000/src/login/startup-login.php", {
  method: "post",
  body: JSON.stringify(getCookie("session_id"))
})
.then((response) => response.json())
.then(data => {
  if(data !== true) {
    window.location.href = data;
  }
});

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

const submitButton = document.getElementById("submit-button");
const loginForm = document.getElementById("login-form");

submitButton.addEventListener("click", () => {
  if(loginForm.checkValidity()) {
    const loginData = new FormData(loginForm);

    fetch("http://192.168.1.17:8000/src/login/login-system.php", {
        method: "post",
        body: loginData,
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(!data.success) {
            alert("Username or password invalid!");
        } else {
          setCookie('session_id', data.session, 30);
          window.location.href = data.url;
        }
    });
  }
});