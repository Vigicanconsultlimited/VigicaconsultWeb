import React from "react";

export function Badge({ children, color = "blue" }) {
  return (
    <span
      className={`inline-block bg-${color}-100 text-${color}-800 text-sm font-medium px-2.5 py-0.5 rounded`}
    >
      {children}
    </span>
  );
}
