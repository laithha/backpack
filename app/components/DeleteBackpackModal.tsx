import React from "react";
import { Backpack } from "../models/backpack";
import { modalStyle, cancelButton } from "../styles/pageStyles";

interface DeleteBackpackModalProps {
  backpacks: Backpack[];
  onSelectBackpack: (id: string) => void;
  onClose: () => void;
}

export const DeleteBackpackModal: React.FC<DeleteBackpackModalProps> = ({
  backpacks,
  onSelectBackpack,
  onClose,
}) => {
  return (
    <div style={modalStyle}>
      <h3>Select Backpack to Delete</h3>
      {backpacks.length === 0 ? (
        <div
          style={{
            padding: "15px",
            textAlign: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            color: "black",
          }}
        >
          No backpacks available to delete.
        </div>
      ) : (
        <div style={{ maxHeight: "300px", overflowY: "auto", width: "100%" }}>
          {backpacks.map((backpack, index) => (
            <div
              key={index}
              onClick={() => onSelectBackpack(backpack.id)}
              style={{
                backgroundColor: "#f0f0f0",
                padding: "10px",
                marginBottom: "5px",
                borderRadius: "5px",
                cursor: "pointer",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
                color: "black",
              }}
            >
              {backpack.name}
            </div>
          ))}
        </div>
      )}
      <button onClick={onClose} style={cancelButton}>
        Cancel
      </button>
    </div>
  );
};
