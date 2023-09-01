import React from "react";
import ReactDOM from "react-dom/client";
import Search from "../components/Search";
import Form from "../components/contactPage/form";
import OnlineTrigger from "../components/OnlineTrigger";

ReactDOM.createRoot(document.getElementsByClassName("form-handle")[0]).render(
  <Form />
);

ReactDOM.createRoot(document.getElementById("search-loc")).render(
  <Search imagesPath="/products photo/"/>
);

ReactDOM.createRoot(document.getElementById("notification-center")).render(
  <OnlineTrigger />
);