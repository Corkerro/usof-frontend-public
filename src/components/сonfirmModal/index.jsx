import React from "react";
import "./style.scss";

export default function ConfirmModal({ isOpen, title = "Are you sure?", message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal__overlay">
      <div className="confirm-modal">
        <h2 className="confirm-modal__title">{title}</h2>
        {message && <p className="confirm-modal__message">{message}</p>}
        <div className="confirm-modal__actions">
          <button className="button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="button stroke" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
