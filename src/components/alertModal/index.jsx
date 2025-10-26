import React from "react";
import "./style.scss";

export default function AlertModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="alert-modal__overlay">
      <div className="confirm-modal">
        <div className="alert-modal__content">
          {title && <h2 className="alert-modal__title">{title}</h2>}
          <p className="alert-modal__message">{message}</p>
          <button className="button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
