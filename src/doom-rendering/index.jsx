import React from "react";
import ReactDOM from "react-dom/client";
import ProductsRendering from "../components/mainPage/ProductsRendering";
import Search from "../components/Search";
import OnlineTrigger from "../components/OnlineTrigger";

ReactDOM.createRoot(document.getElementsByClassName("categories")[0]).render(
  <ProductsRendering />
);

ReactDOM.createRoot(document.getElementById("search-loc")).render(
  <Search imagesPath="/products photo/"/>
);

ReactDOM.createRoot(document.getElementById("notification-center")).render(
  <OnlineTrigger />
);
