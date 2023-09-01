import React from 'react';
import ReactDOM from 'react-dom/client';
import ProductsDataRendering from "../components/productPage/ProductsDataRendering";
import Search from "../components/Search";
import OnlineTrigger from '../components/OnlineTrigger';

ReactDOM.createRoot(document.getElementsByClassName("product")[0]).render(
    <ProductsDataRendering />
);

ReactDOM.createRoot(document.getElementById("search-loc")).render(
    <Search imagesPath="/products photo/"/>
);

ReactDOM.createRoot(document.getElementById("notification-center")).render(
    <OnlineTrigger />
);