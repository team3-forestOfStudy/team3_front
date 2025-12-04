// src/components/HeaderButton.js
import React from "react";

export default function HeaderButton({ children, buttonClass = "", onClick }) {
  return (
    <button
      type="button"
      className={`header-button ${buttonClass} u-hover-style-01 u-active-press`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
