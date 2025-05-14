import React from "react";
import { modalStyle, confirmButton, cancelButton } from "../styles/pageStyles";

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div style={modalStyle}>
      <h3>Are you sure you want to delete this backpack?</h3>
      <button onClick={onConfirm} style={confirmButton}>
        Yes, Delete
      </button>
      <button onClick={onCancel} style={cancelButton}>
        Cancel
      </button>
    </div>
  );
};
