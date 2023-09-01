import React, { useState, useEffect } from "react";

export default function ShowCategories({categoryNames}) {
  return (
    <div className="categories-list">
      <p>Categories this product is linked to:</p>
      <ul>
        {categoryNames.map((name, index) => (
          <li key={index}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
