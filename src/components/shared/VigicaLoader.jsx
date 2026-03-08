import React from "react";
import vigicaLogo from "../../assets/images/vigica.png";

/**
 * VigicaLoader — Unified loading component with VIGICA logo + spinning ring.
 *
 * Variants:
 *   "overlay"  → full-screen dark overlay (app init, page transitions)
 *   "inline"   → inline within a section/card (data loading)
 *   "minimal"  → small spinner only, no text (buttons, inline)
 *
 * Sizes: "sm" | "md" | "lg" | "xl"
 */
export default function VigicaLoader({
  variant = "inline",
  size = "lg",
  text = "",
  className = "",
}) {
  const wrapperClass =
    variant === "overlay" ? "vigica-loader-overlay" : "vigica-loader-inline";

  if (variant === "minimal") {
    return (
      <div className={`vigica-spinner vigica-spinner--${size} ${className}`}>
        <div className="vigica-spinner__ring" />
        <img
          src={vigicaLogo}
          alt="Loading"
          className="vigica-spinner__logo"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className={`${wrapperClass} ${className}`}>
      <div className={`vigica-spinner vigica-spinner--${size}`}>
        {/* Outer counter-rotating ring — overlay only, large sizes */}
        {variant === "overlay" && (size === "lg" || size === "xl") && (
          <div className="vigica-spinner__ring vigica-spinner__ring--outer" />
        )}
        {/* Main spinning ring */}
        <div className="vigica-spinner__ring" />
        {/* Pulsing glow — overlay only */}
        {variant === "overlay" && <div className="vigica-spinner__glow" />}
        {/* Centered logo */}
        <img
          src={vigicaLogo}
          alt="VIGICA Consult"
          className="vigica-spinner__logo"
          draggable={false}
        />
      </div>

      {text && <p className="vigica-loader__text">{text}</p>}

      {/* Bouncing dots — overlay only */}
      {variant === "overlay" && (
        <div className="vigica-loader__dots">
          <span className="vigica-loader__dot" />
          <span className="vigica-loader__dot" />
          <span className="vigica-loader__dot" />
        </div>
      )}
    </div>
  );
}
