import React from "react";

const ProgressBar = ({ percentage, color = "bg-blue-500" }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className={`${color} h-2 rounded-full transition-all duration-300`}
      style={{ width: `${percentage}%` }}
    />
  </div>
);

export default ProgressBar;
