import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import "./styles/Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const fullWidthClass = fullWidth ? "btn-full-width" : "";
  const disabledClass = disabled || loading ? "btn-disabled" : "";

  const buttonClass =
    `${baseClass} ${variantClass} ${sizeClass} ${fullWidthClass} ${disabledClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
          <span className="btn-text">{children}</span>
          {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
