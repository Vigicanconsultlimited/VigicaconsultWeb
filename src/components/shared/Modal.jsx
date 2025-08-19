import React, { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";
import "./styles/Modal.css";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  footer,
  className = "",
}) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  const sizeClass = `modal-${size}`;
  const modalClass = `modal ${sizeClass} ${className}`.trim();

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={modalClass} role="dialog" aria-modal="true">
        {/* Modal Header */}
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </Button>
          )}
        </div>

        {/* Modal Body */}
        <div className="modal-body">{children}</div>

        {/* Modal Footer */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
