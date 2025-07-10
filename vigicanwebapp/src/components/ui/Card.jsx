import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border-red rounded-xl shadow-md p-4 ${className}`}
    >
      {children}
    </div>
  );
}
