import React from "react";
import { modalStyle, inputStyle, confirmButton, cancelButton } from "../styles/pageStyles";

interface UpdateBackpackModalProps {
  name: string;
  brand: string;
  material: string;
  weight: string;
  color: string;
  onNameChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onMaterialChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onUpdate: () => void;
  onClose: () => void;
}

export const UpdateBackpackModal: React.FC<UpdateBackpackModalProps> = ({
  name,
  brand,
  material,
  weight,
  color,
  onNameChange,
  onBrandChange,
  onMaterialChange,
  onWeightChange,
  onColorChange,
  onUpdate,
  onClose,
}) => {
  return (
    <div style={modalStyle}>
      <h3>Update Backpack</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Name"
        style={inputStyle}
      />
      <input
        type="text"
        value={brand}
        onChange={(e) => onBrandChange(e.target.value)}
        placeholder="Brand"
        style={inputStyle}
      />
      <input
        type="text"
        value={material}
        onChange={(e) => onMaterialChange(e.target.value)}
        placeholder="Material"
        style={inputStyle}
      />
      <input
        type="text"
        value={weight}
        onChange={(e) => onWeightChange(e.target.value)}
        placeholder="Weight"
        style={inputStyle}
      />
      <input
        type="text"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        placeholder="Color"
        style={inputStyle}
      />
      <button onClick={onUpdate} style={confirmButton}>
        Update
      </button>
      <button onClick={onClose} style={cancelButton}>
        Close
      </button>
    </div>
  );
};
