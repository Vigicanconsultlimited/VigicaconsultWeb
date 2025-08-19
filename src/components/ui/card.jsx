import React from "react";

export const Card = ({ className = "", ...props }) => {
  return (
    <div
      className={`rounded-lg border bg-white shadow-sm ${className}`}
      {...props}
    />
  );
};

export const CardContent = ({ className = "", ...props }) => {
  return <div className={`p-6 ${className}`} {...props} />;
};
