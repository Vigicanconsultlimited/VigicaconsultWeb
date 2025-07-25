import React from "react";
import "./styles/LoadingSpinner.css";

export default function LoadingSpinner({
  size = "md",
  color = "primary",
  className = "",
  text = "",
}) {
  const sizeClass = `spinner-${size}`;
  const colorClass = `spinner-${color}`;
  const spinnerClass =
    `loading-spinner ${sizeClass} ${colorClass} ${className}`.trim();

  if (text) {
    return (
      <div className="loading-container">
        <div className={spinnerClass}></div>
        <span className="loading-text">{text}</span>
      </div>
    );
  }

  return <div className={spinnerClass}></div>;
}
